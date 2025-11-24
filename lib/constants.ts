export const STATUS_COLORS = {
  idle: 'bg-green-500',
  moving: 'bg-blue-500',
  charging: 'bg-yellow-500',
  maintenance: 'bg-red-500',
} as const;

export const ORDER_STATUS_COLORS = {
  pending: 'bg-orange-100 text-orange-800',
  assigned: 'bg-blue-100 text-blue-800',
  unassigned: 'bg-gray-100 text-gray-800',
  completed: 'bg-green-100 text-green-800',
} as const;

export const INITIAL_VEHICLES = [
  { id: 1, name: 'AGV-001', status: 'idle' as const, x: 50, y: 50, battery: 95 },
  { id: 2, name: 'AGV-002', status: 'idle' as const, x: 150, y: 100, battery: 88 },
  { id: 3, name: 'AGV-003', status: 'idle' as const, x: 250, y: 200, battery: 92 },
];

export const INITIAL_LOCATIONS = [
  { id: 1, name: 'Warehouse A', x: 50, y: 50, type: 'loading' as const },
  { id: 2, name: 'Station B', x: 150, y: 200, type: 'processing' as const },
  { id: 3, name: 'Warehouse C', x: 300, y: 100, type: 'unloading' as const },
];

export const INITIAL_ORDERS = [
  { id: 1, from: 'Warehouse A', to: 'Station B', vehicle: 'AGV-001', status: 'pending' as const },
  { id: 2, from: 'Station B', to: 'Warehouse C', vehicle: null, status: 'unassigned' as const },
];