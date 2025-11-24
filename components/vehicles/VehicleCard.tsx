import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Vehicle } from '@/types';
import { STATUS_COLORS } from '@/lib/constants';
import { IconButton } from '@/components/common/IconButton';

interface VehicleCardProps {
  vehicle: Vehicle;
  onToggleStatus: (id: number) => void;
}

export function VehicleCard({ vehicle, onToggleStatus }: VehicleCardProps) {
  const batteryColor = vehicle.battery > 30 ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{vehicle.name}</h3>
          <p className="text-sm text-slate-400 capitalize flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[vehicle.status]}`} />
            {vehicle.status}
          </p>
        </div>
        <IconButton
          icon={vehicle.status === 'idle' ? <Play className="w-5 h-5 text-green-400" /> : <Pause className="w-5 h-5 text-yellow-400" />}
          onClick={() => onToggleStatus(vehicle.id)}
        />
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-slate-400">Position</p>
          <p className="text-white font-mono">{Math.round(vehicle.x)}, {Math.round(vehicle.y)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Battery</p>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${batteryColor}`}
              style={{ width: `${vehicle.battery}%` }}
            />
          </div>
          <p className="text-xs text-slate-300 mt-1">{vehicle.battery}%</p>
        </div>
      </div>
    </div>
  );
}