export type VehicleStatus = 'idle' | 'moving' | 'charging' | 'maintenance';
export type OrderStatus = 'pending' | 'assigned' | 'unassigned' | 'completed';
export type LocationType = 'loading' | 'processing' | 'unloading';

export interface Vehicle {
  id: number;
  name: string;
  status: VehicleStatus;
  x: number;
  y: number;
  battery: number;
}

export interface Order {
  id: number;
  from: string;
  to: string;
  vehicle: string | null;
  status: OrderStatus;
}

export interface Location {
  id: number;
  name: string;
  x: number;
  y: number;
  type: LocationType;
}

export interface AppState {
  vehicles: Vehicle[];
  orders: Order[];
  locations: Location[];
  selectedVehicle: Vehicle | null;
}