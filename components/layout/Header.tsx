import React from 'react';
import { Box } from 'lucide-react';
import { Vehicle, Order } from '@/types';

interface HeaderProps {
  vehicleCount: number;
  orderCount: number;
}

export function Header({ vehicleCount, orderCount }: HeaderProps) {
  return (
    <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Fleet Control System</h1>
              <p className="text-slate-400">AGV Management & Dispatch Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className="px-3 py-1 bg-slate-700 rounded-full">
              {vehicleCount} Active Vehicles
            </span>
            <span className="px-3 py-1 bg-slate-700 rounded-full">
              {orderCount} Orders
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}