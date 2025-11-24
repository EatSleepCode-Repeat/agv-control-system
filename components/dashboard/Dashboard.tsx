import React from 'react';
import { Vehicle, Order, Location } from '@/types';
import { PlantOverview } from './PlantOverview';
import { StatsOverview } from './StatsOverview';

interface DashboardProps {
  vehicles: Vehicle[];
  orders: Order[];
  locations: Location[];
  onToggleVehicle: (id: number) => void;
  onSelectVehicle?: (vehicle: Vehicle) => void;
}

export function Dashboard({
  vehicles,
  orders,
  locations,
  onToggleVehicle,
  onSelectVehicle,
}: DashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlantOverview vehicles={vehicles} locations={locations} onVehicleSelect={onSelectVehicle} />
        <StatsOverview vehicles={vehicles} orders={orders} onToggleVehicle={onToggleVehicle} />
      </div>
    </div>
  );
}