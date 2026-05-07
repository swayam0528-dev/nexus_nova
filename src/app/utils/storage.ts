import { User, Order } from '../types';

const USERS_KEY = 'order_management_users';
const ORDERS_KEY = 'order_management_orders';
const CURRENT_USER_KEY = 'order_management_current_user';

// User Management
export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email === email);
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Order Management
export function getOrders(): Order[] {
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function updateOrder(orderId: string, updates: Partial<Order>): Order | null {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId);

  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return orders[index];
}

export function getOrderById(orderId: string): Order | undefined {
  return getOrders().find(o => o.id === orderId);
}

export function generateOrderId(): string {
  const orders = getOrders();
  const maxId = orders.length > 0
    ? Math.max(...orders.map(o => parseInt(o.id.replace('ORD-', ''))))
    : 0;
  return `ORD-${String(maxId + 1).padStart(4, '0')}`;
}
