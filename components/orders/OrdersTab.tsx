import React from 'react';
import { Order, Location, Vehicle } from '@/types';
import { CreateOrderForm } from './CreateOrderForm';
import { OrderCard } from './OrderCard';

interface OrdersTabProps {
  orders: Order[];
  locations: Location[];
  vehicles: Vehicle[];
  onCreateOrder: (from: string, to: string, vehicleId?: number) => void;
  onAssignOrder: (orderId: number, vehicleId: number) => void;
  onDeleteOrder: (orderId: number) => void;
}

export function OrdersTab({
  orders,
  locations,
  vehicles,
  onCreateOrder,
  onAssignOrder,
  onDeleteOrder,
}: OrdersTabProps) {
  return (
    <div className="space-y-6">
      <CreateOrderForm locations={locations} vehicles={vehicles} onCreateOrder={onCreateOrder} />

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">All Orders</h2>
        <div className="space-y-3">
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              vehicles={vehicles}
              onAssign={onAssignOrder}
              onDelete={onDeleteOrder}
            />
          ))}
        </div>
      </div>
    </div>
  );
}