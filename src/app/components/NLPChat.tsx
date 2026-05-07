import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, Order, QualityNote } from '../types';
import { parseUserInput } from '../utils/nlpParser';
import { apiClient } from '../utils/apiClient';
import { getCurrentUser } from '../utils/storage';

interface NLPChatProps {
  onOrdersChange: () => void;
}

export function NLPChat({ onOrdersChange }: NLPChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi! I'm your order management assistant. You can ask me to:\n\n• Create a new order\n• Update order status\n• Add quality notes\n• View order information\n\nTry saying something like 'Create an order for 50 Bolts made of Steel'",
      sender: 'assistant',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      text,
      sender,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleCreateOrder = async (entities: any): Promise<string> => {
    const currentUser = getCurrentUser();
    if (!currentUser) return '❌ Error: User not authenticated';

    const { partName, material, quantity, deadline } = entities;

    if (!partName || !material || !quantity || !deadline) {
      return 'I need more information to create an order. Please provide: part name, material, quantity, and deadline.\n\nExample: "Create an order for 50 Gear Wheels made of Steel, deadline 2026-06-15"';
    }

    try {
      const result = await apiClient.createOrder({
        partName,
        material,
        quantity: parseInt(quantity),
        deadline,
      });

      if (!result.success) {
        return `❌ ${result.error || 'Failed to create order'}`;
      }

      onOrdersChange();
      const orderId = result.data?.id || result.data?.orderId || 'Generated';

      return `✅ Order created successfully!\n\nOrder ID: ${orderId}\nPart: ${partName}\nMaterial: ${material}\nQuantity: ${quantity} units\nDeadline: ${deadline}\nStatus: Received\n\nThe order has been saved to the system.`;
    } catch (error) {
      console.error('Error creating order:', error);
      return '❌ Error creating order. Please try again.';
    }
  };

  const handleUpdateStatus = async (entities: any): Promise<string> => {
    const { orderId, status } = entities;

    if (!orderId) {
      return 'Please specify the order ID you want to update.\n\nExample: "Update order ORD-0001 to In Review"';
    }

    if (!status) {
      return 'Please specify the new status: Received, In Review, or Accepted.\n\nExample: "Mark order ORD-0001 as Accepted"';
    }

    try {
      // Get current order to show the change
      const getResult = await apiClient.getOrder(orderId);
      if (!getResult.success) {
        return `❌ ${getResult.error || 'Order not found'}`;
      }

      const oldStatus = getResult.data?.status || 'Unknown';

      const result = await apiClient.updateOrderStatus(orderId, status);

      if (!result.success) {
        return `❌ ${result.error || 'Failed to update order status'}`;
      }

      onOrdersChange();
      return `✅ Status updated successfully!\n\nOrder ${orderId} status changed from "${oldStatus}" to "${status}".`;
    } catch (error) {
      console.error('Error updating status:', error);
      return '❌ Error updating order status. Please try again.';
    }
  };

  const handleAddQualityNote = async (entities: any): Promise<string> => {
    const currentUser = getCurrentUser();
    if (!currentUser) return '❌ Error: User not authenticated';

    const { orderId, qualityNote } = entities;

    if (!orderId) {
      return 'Please specify the order ID for the quality note.\n\nExample: "Add quality note to ORD-0001: All parts passed inspection"';
    }

    if (!qualityNote) {
      return 'Please provide the quality note text.\n\nExample: "Quality note for ORD-0001: Minor surface scratches detected"';
    }

    try {
      // Verify order exists
      const getResult = await apiClient.getOrder(orderId);
      if (!getResult.success) {
        return `❌ ${getResult.error || 'Order not found'}`;
      }

      const result = await apiClient.addQualityNote(orderId, qualityNote);

      if (!result.success) {
        return `❌ ${result.error || 'Failed to add quality note'}`;
      }

      onOrdersChange();
      return `✅ Quality note added successfully!\n\nOrder: ${orderId}\nNote: "${qualityNote}"\nAdded by: ${currentUser.name}\n\nThe note has been attached to the order.`;
    } catch (error) {
      console.error('Error adding quality note:', error);
      return '❌ Error adding quality note. Please try again.';
    }
  };

  const handleQuery = (): string => {
    return 'Please check the dashboard on the left to view all orders. You can also ask me to:\n\n• Create new orders\n• Update order status\n• Add quality notes to existing orders';
  };

  const processUserInput = async (input: string) => {
    setIsProcessing(true);

    try {
      // Parse the input
      const parsed = parseUserInput(input);

      let response = '';

      switch (parsed.action) {
        case 'create_order':
          response = await handleCreateOrder(parsed.entities);
          break;
        case 'update_status':
          response = await handleUpdateStatus(parsed.entities);
          break;
        case 'add_quality_note':
          response = await handleAddQualityNote(parsed.entities);
          break;
        case 'query':
          response = handleQuery();
          break;
        default:
          response = "I'm not sure I understood that. I can help you:\n\n• Create orders - \"Create an order for 50 Gear Wheels...\"\n• Update status - \"Mark order ORD-0001 as Accepted\"\n• Add quality notes - \"Add note to ORD-0001: All parts OK\"";
      }

      setTimeout(() => {
        addMessage(response, 'assistant');
        setIsProcessing(false);
      }, 500);
    } catch (error) {
      console.error('Error processing input:', error);
      addMessage('❌ An error occurred while processing your request. Please try again.', 'assistant');
      setIsProcessing(false);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim() || isProcessing) return;

    addMessage(inputValue, 'user');
    const userInput = inputValue;
    setInputValue('');

    processUserInput(userInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickCommands = [
    "Create order for 100 Bolts",
    "Update ORD-0001 to Accepted",
    "Add quality note",
  ];

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-cyan-500/50 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-28 right-6 z-50 w-[450px] h-[650px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-5 flex items-center gap-3">
              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">NLP Order Assistant</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-white/90 text-sm">Online</p>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-white/80" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user'
                      ? 'bg-cyan-500'
                      : 'bg-gradient-to-br from-purple-500 to-blue-600'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-600">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-800 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Commands */}
            {messages.length <= 2 && (
              <div className="px-4 pb-3">
                <p className="text-xs text-gray-400 mb-2">Try these:</p>
                <div className="flex flex-wrap gap-2">
                  {quickCommands.map((cmd) => (
                    <button
                      key={cmd}
                      onClick={() => setInputValue(cmd)}
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg transition-colors"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-700 bg-gray-900">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isProcessing}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isProcessing}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
