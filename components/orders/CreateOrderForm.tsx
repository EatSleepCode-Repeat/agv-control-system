import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Location, Vehicle } from '@/types';

interface CreateOrderFormProps {
  locations: Location[];
  vehicles: Vehicle[];
  onCreateOrder: (from: string, to: string, vehicleId?: number) => void;
}

export function CreateOrderForm({ locations, vehicles, onCreateOrder }: CreateOrderFormProps) {
  const [form, setForm] = useState({ from: '', to: '', vehicle: '' });

  const handleSubmit = () => {
    const vehicleId = form.vehicle ? parseInt(form.vehicle) : undefined;
    onCreateOrder(form.from, form.to, vehicleId);
    setForm({ from: '', to: '', vehicle: '' });
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Create Transport Order</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={form.from}
          onChange={(e) => setForm({ ...form, from: e.target.value })}
          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
        >
          <option value="">From Location</option>
          {locations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
        </select>
        <select
          value={form.to}
          onChange={(e) => setForm({ ...form, to: e.target.value })}
          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
        >
          <option value="">To Location</option>
          {locations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
        </select>
        <select
          value={form.vehicle}
          onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
        >
          <option value="">Auto-Assign</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create
        </button>
      </div>
    </div>
  );
}