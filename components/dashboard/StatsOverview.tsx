import React from 'react';
import { Zap, Play, Pause } from 'lucide-react';
import { Vehicle, Order } from '@/types';
import { STATUS_COLORS } from '@/lib/constants';
import { IconButton } from '@/components/common/IconButton';

interface StatsOverviewProps {
  vehicles: Vehicle[];
  orders: Order[];
  onToggleVehicle: (id: number) => void;
}

export function StatsOverview({ vehicles, orders, onToggleVehicle }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Vehicle Status */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Active Vehicles</h3>
        <div className="space-y-3">
          {vehicles.map(v => (
            <div key={v.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded border border-slate-600 hover:border-slate-500 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${STATUS_COLORS[v.status]}`} />
                <div className="flex-1">
                  <p className="font-medium text-white">{v.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{v.status}</p>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span className="text-slate-300">{v.battery}%</span>
                </div>
              </div>
              <IconButton
                icon={v.status === 'idle' ? <Play className="w-4 h-4 text-green-400" /> : <Pause className="w-4 h-4 text-yellow-400" />}
                onClick={() => onToggleVehicle(v.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Orders Overview */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Transport Orders</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {orders.map(o => (
            <div key={o.id} className="p-3 bg-slate-700/50 rounded border border-slate-600 text-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="text-slate-300"><span className="text-slate-400">From:</span> {o.from}</p>
                  <p className="text-slate-300"><span className="text-slate-400">To:</span> {o.to}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  o.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                  o.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                  o.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {o.status}
                </span>
              </div>
              {o.vehicle && <p className="text-xs text-blue-400">Assigned: {o.vehicle}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}