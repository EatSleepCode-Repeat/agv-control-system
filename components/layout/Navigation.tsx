import React from 'react';

type TabName = 'dashboard' | 'vehicles' | 'orders' | 'locations';

interface NavigationProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

const tabs: { id: TabName; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'vehicles', label: 'Vehicles' },
  { id: 'orders', label: 'Orders' },
  { id: 'locations', label: 'Locations' },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="border-b border-slate-700 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-2 font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}