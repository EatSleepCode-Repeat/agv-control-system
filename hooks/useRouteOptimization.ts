import { useState, useCallback } from 'react';
import { Vehicle, Order, Location } from '@/types';
import {
  optimizeOrderAssignment,
  optimizeVehicleRoute,
  calculateTotalDistance,
  estimateTravelTime,
  canCompleteRoute,
  estimateBatteryConsumption,
  OptimizedRoute,
  RoutePoint,
} from '@/lib/routeOptimization';

export interface RouteInfo {
  vehicleId: number;
  route: RoutePoint[];
  distance: number;
  estimatedTime: number;
  batteryConsumption: number;
  canComplete: boolean;
}

export function useRouteOptimization() {
  const [optimizedRoutes, setOptimizedRoutes] = useState<OptimizedRoute[]>([]);
  const [routeInfo, setRouteInfo] = useState<Map<number, RouteInfo>>(new Map());
  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimizeAssignments = useCallback((
    orders: Order[],
    vehicles: Vehicle[],
    locations: Location[]
  ) => {
    setIsOptimizing(true);
    try {
      const routes = optimizeOrderAssignment(orders, vehicles, locations);
      setOptimizedRoutes(routes);
      return routes;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  const optimizeVehicleRoutes = useCallback((
    vehicles: Vehicle[],
    orders: Order[],
    locations: Location[]
  ) => {
    setIsOptimizing(true);
    try {
      const info = new Map<number, RouteInfo>();

      for (const vehicle of vehicles) {
        const vehicleOrders = orders.filter(o => o.vehicle === vehicle.name);
        if (vehicleOrders.length === 0) continue;

        const route = optimizeVehicleRoute(
          vehicle.id,
          vehicleOrders,
          locations,
          vehicle.x,
          vehicle.y
        );

        const distance = calculateTotalDistance(route);
        const batteryConsumption = estimateBatteryConsumption(distance);
        const canComplete = canCompleteRoute(vehicle.battery, distance);

        info.set(vehicle.id, {
          vehicleId: vehicle.id,
          route,
          distance,
          estimatedTime: estimateTravelTime(distance),
          batteryConsumption,
          canComplete,
        });
      }

      setRouteInfo(info);
      return info;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  const getRouteForVehicle = useCallback((vehicleId: number): RouteInfo | undefined => {
    return routeInfo.get(vehicleId);
  }, [routeInfo]);

  const clearOptimizations = useCallback(() => {
    setOptimizedRoutes([]);
    setRouteInfo(new Map());
  }, []);

  return {
    optimizedRoutes,
    routeInfo,
    isOptimizing,
    optimizeAssignments,
    optimizeVehicleRoutes,
    getRouteForVehicle,
    clearOptimizations,
  };
}