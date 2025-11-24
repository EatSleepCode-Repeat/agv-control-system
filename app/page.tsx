'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { VehiclesTab } from '@/components/vehicles/VehiclesTab';
import { OrdersTab } from '@/components/orders/OrdersTab';
import { LocationsTab } from '@/components/locations/LocationsTab';
import { useVehicles } from '@/hooks/useVehicles';
import { useOrders } from '@/hooks/useOrders';
import { useLocations } from '@/hooks/useLocations';

type TabName = 'dashboard' | 'vehicles' | 'orders' | 'locations';

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabName>('dashboard');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const { vehicles, toggleStatus } = useVehicles();
  const { orders, createOrder, assignOrder, deleteOrder } = useOrders();
  const { locations } = useLocations();

  const handleCreateOrder = (from: string, to: string, vehicleId?: number) => {
    createOrder(from, to, vehicleId);
  };

  const handleAssignOrder = (orderId: number, vehicleId: number) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      assignOrder(orderId, vehicle.name);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header vehicleCount={vehicles.length} orderCount={orders.length} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            vehicles={vehicles}
            orders={orders}
            locations={locations}
            onToggleVehicle={toggleStatus}
            onSelectVehicle={setSelectedVehicle}
          />
        )}

        {activeTab === 'vehicles' && (
          <VehiclesTab vehicles={vehicles} onToggleStatus={toggleStatus} />
        )}

        {activeTab === 'orders' && (
          <OrdersTab
            orders={orders}
            locations={locations}
            vehicles={vehicles}
            onCreateOrder={handleCreateOrder}
            onAssignOrder={handleAssignOrder}
            onDeleteOrder={deleteOrder}
          />
        )}

        {activeTab === 'locations' && (
          <LocationsTab locations={locations} />
        )}
      </div>
    </div>
  );
}