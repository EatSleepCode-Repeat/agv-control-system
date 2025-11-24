import { useState, useEffect } from 'react';
import { Vehicle } from '@/types';
import { INITIAL_VEHICLES } from '@/lib/constants';

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);

  // Simulate vehicle movement
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status === 'moving') {
          return {
            ...v,
            x: Math.min(v.x + Math.random() * 5, 350),
            y: Math.min(v.y + Math.random() * 5, 250),
          };
        }
        return v;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleStatus = (id: number) => {
    setVehicles(vehicles.map(v => 
      v.id === id ? { ...v, status: v.status === 'idle' ? 'moving' : 'idle' } : v
    ));
  };

  const updateVehicleStatus = (id: number, status: Vehicle['status']) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, status } : v));
  };

  return {
    vehicles,
    setVehicles,
    toggleStatus,
    updateVehicleStatus,
  };
}