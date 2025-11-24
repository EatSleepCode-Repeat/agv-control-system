import React from 'react';
import { Vehicle } from '@/types';
import { VehicleCard } from './VehicleCard';

interface VehiclesTabProps {
  vehicles: Vehicle[];
  onToggleStatus: (id: number) => void;
}

export function VehiclesTab({ vehicles, onToggleStatus }: VehiclesTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map(vehicle => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
}