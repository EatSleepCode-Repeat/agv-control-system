import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Vehicle, Location } from '@/types';
import { STATUS_COLORS } from '@/lib/constants';

interface PlantOverviewProps {
  vehicles: Vehicle[];
  locations: Location[];
  onVehicleSelect?: (vehicle: Vehicle) => void;
}

export function PlantOverview({ vehicles, locations, onVehicleSelect }: PlantOverviewProps) {
  const [hoveredVehicle, setHoveredVehicle] = useState<number | null>(null);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (400 / rect.width);
    const clickY = (e.clientY - rect.top) * (300 / rect.height);

    // Check if click is near a vehicle
    for (const v of vehicles) {
      const dist = Math.sqrt((clickX - v.x) ** 2 + (clickY - v.y) ** 2);
      if (dist < 20) {
        onVehicleSelect?.(v);
        return;
      }
    }
  };

  const handleVehicleMouseEnter = (vehicleId: number) => {
    setHoveredVehicle(vehicleId);
  };

  const handleVehicleMouseLeave = () => {
    setHoveredVehicle(null);
  };

  return (
    <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-400" />
        Plant Overview - Live Fleet Map
      </h2>
      <div className="relative bg-slate-900 rounded border border-slate-600 aspect-video overflow-hidden">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 400 300"
          onClick={handleSvgClick}
          style={{ cursor: 'crosshair' }}
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#grid)" />

          {/* Locations */}
          {locations.map(loc => (
            <g key={`location-${loc.id}`}>
              {/* Glow */}
              <circle cx={loc.x} cy={loc.y} r="18" fill="rgba(59,130,246,0.15)" />
              {/* Square */}
              <rect 
                x={loc.x - 12} 
                y={loc.y - 12} 
                width="24" 
                height="24" 
                fill="rgba(59,130,246,0.4)" 
                stroke="#3b82f6" 
                strokeWidth="2"
                rx="2"
              />
              {/* Label */}
              <text 
                x={loc.x} 
                y={loc.y + 22} 
                fontSize="10" 
                fill="#94a3b8" 
                textAnchor="middle"
                fontWeight="bold"
              >
                {loc.name}
              </text>
            </g>
          ))}

          {/* Vehicles */}
          {vehicles.map(v => {
            const isHovered = v.id === hoveredVehicle;
            const circleRadius = isHovered ? 8 : 6;
            
            return (
              <g 
                key={`vehicle-${v.id}`}
                onMouseEnter={() => handleVehicleMouseEnter(v.id)}
                onMouseLeave={handleVehicleMouseLeave}
                onClick={() => onVehicleSelect?.(v)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow effect on hover */}
                {isHovered && (
                  <circle 
                    cx={v.x} 
                    cy={v.y} 
                    r="16" 
                    fill={STATUS_COLORS[v.status]} 
                    opacity="0.2"
                  />
                )}

                {/* Main vehicle circle */}
                <circle 
                  cx={v.x} 
                  cy={v.y} 
                  r={circleRadius} 
                  fill={STATUS_COLORS[v.status]}
                  stroke="white"
                  strokeWidth={isHovered ? "1.5" : "1"}
                  style={{ transition: 'all 0.2s ease' }}
                />

                {/* Battery indicator bar */}
                <rect 
                  x={v.x - 10} 
                  y={v.y - 18} 
                  width="20" 
                  height="3" 
                  fill="rgba(30,41,59,0.8)" 
                  stroke="#64748b" 
                  strokeWidth="0.5"
                  rx="1"
                />
                <rect 
                  x={v.x - 10} 
                  y={v.y - 18} 
                  width={Math.max(1, (20 * v.battery) / 100)} 
                  height="3" 
                  fill={v.battery > 50 ? '#22c55e' : v.battery > 30 ? '#eab308' : '#ef4444'}
                  rx="1"
                />

                {/* Label */}
                <text 
                  x={v.x} 
                  y={v.y - 26} 
                  fontSize={isHovered ? "11" : "9"} 
                  fill="#e2e8f0" 
                  textAnchor="middle"
                  fontWeight="bold"
                  style={{ transition: 'all 0.2s ease' }}
                >
                  {v.name}
                </text>

                {/* Status indicator dot */}
                <circle 
                  cx={v.x + 10} 
                  cy={v.y - 10} 
                  r="2" 
                  fill={STATUS_COLORS[v.status]}
                  opacity="0.8"
                />
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur border border-slate-700 rounded p-3 text-xs space-y-1">
          <div className="font-semibold text-slate-300 mb-2">Status</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-slate-400">Idle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-slate-400">Moving</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-slate-400">Charging</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-400">Maintenance</span>
          </div>
        </div>
      </div>
    </div>
  );
}