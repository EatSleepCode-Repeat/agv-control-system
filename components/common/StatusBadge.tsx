import React from 'react';
import { STATUS_COLORS, ORDER_STATUS_COLORS } from '@/lib/constants';

interface StatusBadgeProps {
  variant: 'vehicle' | 'order';
  status: string;
}

export function StatusBadge({ variant, status }: StatusBadgeProps) {
  const colors = variant === 'vehicle' ? STATUS_COLORS : ORDER_STATUS_COLORS;
  const color = colors[status as keyof typeof colors] || 'bg-gray-500';

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}