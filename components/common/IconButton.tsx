import React, { ReactNode } from 'react';

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  className?: string;
  variant?: 'default' | 'danger' | 'success';
}

const variantStyles = {
  default: 'hover:bg-slate-700',
  danger: 'hover:bg-red-900/30 text-red-400',
  success: 'text-green-400 hover:bg-green-900/30',
};

export function IconButton({ icon, onClick, className = '', variant = 'default' }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded transition-colors ${variantStyles[variant]} ${className}`}
    >
      {icon}
    </button>
  );
}