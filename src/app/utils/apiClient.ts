/**
 * API Client for Order Management System
 * Handles all API calls with Google API authentication
 */

const API_KEY = 'AIzaSyBVQMeIxOdWuJ8QvzfcM1c2orR_C-QMsUw';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'X-API-Key': API_KEY,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error [${response.status}]:`, data);
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`,
      };
    }

    console.log(`API Success [${response.status}]:`, endpoint, data);
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API Fetch Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * API Client object with all order operations
 */
export const apiClient = {
  /**
   * Create a new order
   */
  createOrder: async (orderData: {
    partName: string;
    material: string;
    quantity: number;
    deadline: string;
  }): Promise<ApiResponse<any>> => {
    return fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (
    orderId: string,
    status: string
  ): Promise<ApiResponse<any>> => {
    return fetchAPI(`/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Get order by ID
   */
  getOrder: async (orderId: string): Promise<ApiResponse<any>> => {
    return fetchAPI(`/orders/${orderId}`, {
      method: 'GET',
    });
  },

  /**
   * Add quality note to an order
   */
  addQualityNote: async (
    orderId: string,
    note: string
  ): Promise<ApiResponse<any>> => {
    return fetchAPI(`/orders/${orderId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  },

  /**
   * Get all orders
   */
  getAllOrders: async (): Promise<ApiResponse<any[]>> => {
    return fetchAPI('/orders', {
      method: 'GET',
    });
  },

  /**
   * Delete an order
   */
  deleteOrder: async (orderId: string): Promise<ApiResponse<any>> => {
    return fetchAPI(`/orders/${orderId}`, {
      method: 'DELETE',
    });
  },
};
