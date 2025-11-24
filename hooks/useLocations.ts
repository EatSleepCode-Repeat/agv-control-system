import { useState } from 'react';
import { Location } from '@/types';
import { INITIAL_LOCATIONS } from '@/lib/constants';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);

  const addLocation = (name: string, x: number, y: number, type: Location['type']) => {
    const newLocation: Location = {
      id: Math.max(...locations.map(l => l.id), 0) + 1,
      name,
      x,
      y,
      type,
    };
    setLocations([...locations, newLocation]);
    return newLocation;
  };

  const deleteLocation = (id: number) => {
    setLocations(locations.filter(l => l.id !== id));
  };

  const updateLocation = (id: number, updates: Partial<Location>) => {
    setLocations(locations.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  return {
    locations,
    addLocation,
    deleteLocation,
    updateLocation,
  };
}