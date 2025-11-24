import { Vehicle, Location, Order } from '@/types';

export interface RoutePoint {
  x: number;
  y: number;
  locationId: number;
  locationName: string;
}

export interface OptimizedRoute {
  orderId: number;
  vehicleId: number;
  waypoints: RoutePoint[];
  distance: number;
  estimatedTime: number;
  priority: number;
}

// Calculate Euclidean distance between two points
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Find nearest unvisited location (Nearest Neighbor algorithm)
function nearestNeighbor(current: RoutePoint, unvisited: RoutePoint[]): RoutePoint | null {
  if (unvisited.length === 0) return null;
  
  let nearest = unvisited[0];
  let minDistance = calculateDistance(current.x, current.y, nearest.x, nearest.y);
  
  for (let i = 1; i < unvisited.length; i++) {
    const dist = calculateDistance(current.x, current.y, unvisited[i].x, unvisited[i].y);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = unvisited[i];
    }
  }
  
  return nearest;
}

// Simple TSP solver using Nearest Neighbor heuristic
export function solveTSP(waypoints: RoutePoint[]): RoutePoint[] {
  if (waypoints.length <= 2) return waypoints;
  
  const visited: RoutePoint[] = [waypoints[0]];
  const unvisited = waypoints.slice(1);
  
  while (unvisited.length > 0) {
    const nearest = nearestNeighbor(visited[visited.length - 1], unvisited);
    if (!nearest) break;
    
    visited.push(nearest);
    const index = unvisited.indexOf(nearest);
    unvisited.splice(index, 1);
  }
  
  return visited;
}

// Calculate total route distance
export function calculateTotalDistance(route: RoutePoint[]): number {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    total += calculateDistance(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y);
  }
  return total;
}

// Estimate travel time (distance / speed, assuming average speed of 5 units/sec)
export function estimateTravelTime(distance: number, speed: number = 5): number {
  return Math.round(distance / speed);
}

// Optimize order assignment to vehicles using cost analysis
export function optimizeOrderAssignment(
  orders: Order[],
  vehicles: Vehicle[],
  locations: Location[]
): OptimizedRoute[] {
  const unassignedOrders = orders.filter(o => o.status === 'unassigned');
  const optimizedRoutes: OptimizedRoute[] = [];

  for (const order of unassignedOrders) {
    const fromLocation = locations.find(l => l.name === order.from);
    const toLocation = locations.find(l => l.name === order.to);

    if (!fromLocation || !toLocation) continue;

    let bestAssignment: OptimizedRoute | null = null;
    let lowestCost = Infinity;

    // Evaluate each available vehicle
    for (const vehicle of vehicles) {
      if (vehicle.battery < 20) continue; // Skip vehicles with low battery

      // Calculate distance from vehicle to pickup location
      const toPickup = calculateDistance(vehicle.x, vehicle.y, fromLocation.x, fromLocation.y);
      
      // Calculate distance from pickup to delivery
      const pickupToDelivery = calculateDistance(fromLocation.x, fromLocation.y, toLocation.x, toLocation.y);
      
      const totalDistance = toPickup + pickupToDelivery;
      const totalTime = estimateTravelTime(totalDistance);
      
      // Cost = time + (battery usage factor) + (current workload factor)
      const batteryUsageCost = (totalDistance / 100) * 10;
      const workloadCost = vehicle.status === 'moving' ? 20 : 0;
      const totalCost = totalTime + batteryUsageCost + workloadCost;

      if (totalCost < lowestCost) {
        lowestCost = totalCost;
        bestAssignment = {
          orderId: order.id,
          vehicleId: vehicle.id,
          waypoints: [
            { x: vehicle.x, y: vehicle.y, locationId: 0, locationName: 'Current Position' },
            { x: fromLocation.x, y: fromLocation.y, locationId: fromLocation.id, locationName: fromLocation.name },
            { x: toLocation.x, y: toLocation.y, locationId: toLocation.id, locationName: toLocation.name },
          ],
          distance: totalDistance,
          estimatedTime: totalTime,
          priority: order.id,
        };
      }
    }

    if (bestAssignment) {
      optimizedRoutes.push(bestAssignment);
    }
  }

  return optimizedRoutes;
}

// Multi-order route optimization for a single vehicle (Vehicle Routing Problem)
export function optimizeVehicleRoute(
  vehicleId: number,
  assignedOrders: Order[],
  locations: Location[],
  currentX: number,
  currentY: number
): RoutePoint[] {
  const waypoints: RoutePoint[] = [
    { x: currentX, y: currentY, locationId: 0, locationName: 'Current Position' }
  ];

  // Add all order locations
  for (const order of assignedOrders) {
    const fromLoc = locations.find(l => l.name === order.from);
    const toLoc = locations.find(l => l.name === order.to);

    if (fromLoc) {
      waypoints.push({
        x: fromLoc.x,
        y: fromLoc.y,
        locationId: fromLoc.id,
        locationName: fromLoc.name,
      });
    }
    if (toLoc) {
      waypoints.push({
        x: toLoc.x,
        y: toLoc.y,
        locationId: toLoc.id,
        locationName: toLoc.name,
      });
    }
  }

  // Solve TSP to find optimal route
  return solveTSP(waypoints);
}

// Estimate battery consumption based on distance
export function estimateBatteryConsumption(distance: number, batteryEfficiency: number = 1): number {
  return Math.round((distance / 100) * 5 * batteryEfficiency);
}

// Check if vehicle can complete route with current battery
export function canCompleteRoute(currentBattery: number, distance: number, minReserve: number = 10): boolean {
  const consumption = estimateBatteryConsumption(distance);
  return (currentBattery - consumption) >= minReserve;
}

// Heuristic A* pathfinding for smoother vehicle movement (simplified version)
export function calculateSmoothPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  stepSize: number = 2
): Array<{ x: number; y: number }> {
  const path: Array<{ x: number; y: number }> = [];
  let currentX = startX;
  let currentY = startY;

  while (Math.abs(currentX - endX) > stepSize || Math.abs(currentY - endY) > stepSize) {
    const dx = endX - currentX;
    const dy = endY - currentY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) break;

    currentX += (dx / distance) * stepSize;
    currentY += (dy / distance) * stepSize;

    path.push({ x: Math.round(currentX), y: Math.round(currentY) });
  }

  path.push({ x: endX, y: endY });
  return path;
}