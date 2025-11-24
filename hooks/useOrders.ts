import { useState } from 'react';
import { Order } from '@/types';
import { INITIAL_ORDERS } from '@/lib/constants';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const createOrder = (from: string, to: string, vehicle?: number) => {
    if (!from || !to) return false;
    
    const newOrder: Order = {
      id: Math.max(...orders.map(o => o.id), 0) + 1,
      from,
      to,
      vehicle: vehicle ? `AGV-${String(vehicle).padStart(3, '0')}` : null,
      status: vehicle ? 'pending' : 'unassigned',
    };
    
    setOrders([...orders, newOrder]);
    return true;
  };

  const assignOrder = (orderId: number, vehicleName: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, vehicle: vehicleName, status: 'assigned' } : o
    ));
  };

  const deleteOrder = (id: number) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const updateOrderStatus = (id: number, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  return {
    orders,
    createOrder,
    assignOrder,
    deleteOrder,
    updateOrderStatus,
  };
}