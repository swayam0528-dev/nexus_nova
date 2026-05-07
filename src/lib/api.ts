// API configuration
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Order {
  id: string;
  partName: string;
  material: string;
  quantity: number;
  deadline: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  qualityNotes: Array<{
    id: string;
    note: string;
    timestamp: string;
    addedBy: string;
  }>;
}

export interface CreateOrderPayload {
  partName: string;
  material: string;
  quantity: number;
  deadline: string;
}

export const orderAPI = {
  // Get all orders
  getAllOrders: async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE}/api/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  // Get single order
  getOrder: async (id: string): Promise<Order> => {
    const response = await fetch(`${API_BASE}/api/orders/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch order ${id}`);
    return response.json();
  },

  // Create new order
  createOrder: async (order: CreateOrderPayload): Promise<Order> => {
    const response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  // Update order status
  updateOrder: async (
    id: string,
    status: string
  ): Promise<Order> => {
    const response = await fetch(`${API_BASE}/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
  },

  // Add quality note
  addQualityNote: async (orderId: string, note: string) => {
    const response = await fetch(`${API_BASE}/api/orders/${orderId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
    if (!response.ok) throw new Error('Failed to add note');
    return response.json();
  },

  // Delete order
  deleteOrder: async (id: string) => {
    const response = await fetch(`${API_BASE}/api/orders/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete order');
    return response.json();
  },

  // Health check
  checkHealth: async () => {
    const response = await fetch(`${API_BASE}/api/health`);
    return response.ok;
  },
};
