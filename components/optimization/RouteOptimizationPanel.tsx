import React, { useState } from 'react';
import { Zap, Navigation, Clock, Battery } from 'lucide-react';
import { Vehicle, Order, Location } from '@/types';
import { useRouteOptimization, RouteInfo } from '@/hooks/useRouteOptimization';

interface RouteOptimizationPanelProps {
  vehicles: Vehicle[];
  orders: Order[];
  locations: Location[];
}

export function RouteOptimizationPanel({
  vehicles,
  orders,
  locations,
}: RouteOptimizationPanelProps) {
  const { optimizeAssignments, optimizeVehicleRoutes, routeInfo, isOptimizing } = useRouteOptimization();
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

  const handleOptimizeAssignments = () => {
    optimizeAssignments(orders, vehicles, locations);
  };

  const handleOptimizeRoutes = () => {
    optimizeVehicleRoutes(vehicles, orders, locations);
  };

  const selectedRoute = selectedVehicle ? routeInfo.get(selectedVehicle) : null;

  return (
    <div className="space-y-4">
      {/* Optimization Controls */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Route Optimization</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleOptimizeAssignments}
            disabled={isOptimizing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-medium transition-colors"
          >
            {isOptimizing ? 'Optimizing...' : 'Optimize Assignments'}
          </button>
          <button
            onClick={handleOptimizeRoutes}
            disabled={isOptimizing}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded font-medium transition-colors"
          >
            {isOptimizing ? 'Optimizing...' : 'Optimize Routes'}
          </button>
        </div>
      </div>

      {/* Vehicle Route Details */}
      {routeInfo.size > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Vehicle Routes</h3>
          
          <div className="mb-4 space-y-2">
            {Array.from(routeInfo.entries()).map(([vehicleId, route]) => (
              <button
                key={vehicleId}
                onClick={() => setSelectedVehicle(vehicleId)}
                className={`w-full text-left p-3 rounded border transition-colors ${
                  selectedVehicle === vehicleId
                    ? 'bg-blue-600/20 border-blue-500'
                    : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">
                    Vehicle {vehicleId}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    route.canComplete
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {route.canComplete ? 'Can Complete' : 'Low Battery'}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {selectedRoute && (
            <div className="space-y-3 pt-4 border-t border-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Navigation className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-slate-400">Distance</span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {Math.round(selectedRoute.distance)} units
                  </p>
                </div>

                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-slate-400">Est. Time</span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {selectedRoute.estimatedTime}s
                  </p>
                </div>

                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Battery className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-slate-400">Battery Use</span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {selectedRoute.batteryConsumption}%
                  </p>
                </div>

                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-400">Waypoints</span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {selectedRoute.route.length}
                  </p>
                </div>
              </div>

              {/* Route Waypoints */}
              <div className="bg-slate-700/50 p-3 rounded">
                <h4 className="text-sm font-semibold text-white mb-2">Route Waypoints</h4>
                <div className="space-y-1">
                  {selectedRoute.route.map((wp, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-600">
                        {idx + 1}
                      </span>
                      <span>{wp.name}</span>
                      <span className="text-slate-500">({Math.round(wp.x)}, {Math.round(wp.y)})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}