import React from 'react';
import { Location } from '@/types';
import { LocationCard } from './LocationCard';

interface LocationsTabProps {
  locations: Location[];
}

export function LocationsTab({ locations }: LocationsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {locations.map(location => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
}