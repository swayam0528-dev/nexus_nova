import React, { useState, useEffect } from 'react';
import { LogOut, Package, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { OrderCard } from '../components/OrderCard';
import { NLPChat } from '../components/NLPChat';
import { getCurrentUser, clearCurrentUser, getOrders } from '../utils/storage';
import { Order } from '../types';
import { motion } from 'motion/react';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const currentUser = getCurrentUser();

  const loadOrders = () => {
    setOrders(getOrders());
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleLogout = () => {
    clearCurrentUser();
    onLogout();
  };

  const stats = {
    total: orders.length,
    received: orders.filter(o => o.status === 'Received').length,
    inReview: orders.filter(o => o.status === 'In Review').length,
    accepted: orders.filter(o => o.status === 'Accepted').length,
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Order Manager</h1>
              <p className="text-sm text-gray-400">NLP-Powered</p>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Logged in as</p>
            <p className="text-white font-semibold">{currentUser?.name}</p>
            <p className="text-sm text-gray-400">{currentUser?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase mb-4">Statistics</h2>

          <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Orders</p>
            </div>
            <Package className="w-8 h-8 text-cyan-400" />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">{stats.received}</span>
            </div>
            <p className="text-sm text-gray-300">Received</p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">{stats.inReview}</span>
            </div>
            <p className="text-sm text-gray-300">In Review</p>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold text-green-400">{stats.accepted}</span>
            </div>
            <p className="text-sm text-gray-300">Accepted</p>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-auto p-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Orders Dashboard</h2>
            <p className="text-gray-400">View and manage all orders. Use the chat assistant to create or update orders.</p>
          </div>

          {/* Orders Grid */}
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-xl p-12 text-center"
            >
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Orders Yet</h3>
              <p className="text-gray-400 mb-6">
                Get started by creating your first order using the NLP chat assistant.
              </p>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-cyan-400">
                  💡 Try saying: "Create an order for 100 Gear Wheels made of Steel, deadline 2026-06-15"
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* NLP Chat */}
      <NLPChat onOrdersChange={loadOrders} />
    </div>
  );
}
