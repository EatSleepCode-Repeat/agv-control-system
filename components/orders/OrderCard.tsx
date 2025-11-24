import React from 'react';
import { Trash2 } from 'lucide-react';
import { Order, Vehicle } from '@/types';
import { ORDER_STATUS_COLORS } from '@/lib/constants';
import { IconButton } from '@/components/common/IconButton';

interface OrderCardProps {
  order: Order;
  vehicles: Vehicle[];
  onAssign: (orderId: number, vehicleId: number) => void;
  onDelete: (orderId: number) => void;
}

export function OrderCard({ order, vehicles, onAssign, onDelete }: OrderCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded border border-slate-600">
      <div className="flex-1">
        <p className="font-medium text-white">{order.from} → {order.to}</p>
        <div className="flex gap-4 mt-2 text-sm">
          <span className={`px-2 py-1 rounded ${ORDER_STATUS_COLORS[order.status]}`}>
            {order.status}
          </span>
          {order.vehicle && <span className="text-blue-400">Vehicle: {order.vehicle}</span>}
        </div>
      </div>
      {order.status === 'unassigned' && (
        <select
          onChange={(e) => e.target.value && onAssign(order.id, parseInt(e.target.value))}
          className="mx-4 px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
        >
          <option value="">Assign Vehicle</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      )}
      <IconButton
        icon={<Trash2 className="w-4 h-4" />}
        onClick={() => onDelete(order.id)}
        variant="danger"
      />
    </div>
  );
}