import React from 'react';
import { Location } from '@/types';

interface LocationCardProps {
  location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-2">{location.name}</h3>
      <div className="space-y-2 text-sm">
        <div>
          <p className="text-slate-400">Type</p>
          <p className="text-white capitalize">{location.type}</p>
        </div>
        <div>
          <p className="text-slate-400">Coordinates</p>
          <p className="text-white font-mono">{location.x}, {location.y}</p>
        </div>
      </div>
    </div>
  );
}