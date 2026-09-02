import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'purple' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    secondary: 'bg-stone-100 text-stone-700 border border-stone-200',
    success: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
    warning: 'bg-orange-500/10 text-orange-600 border border-orange-500/20',
    danger: 'bg-rose-500/10 text-rose-600 border border-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
    outline: 'border border-stone-300 text-stone-600',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium rounded',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-md',
    lg: 'px-3 py-1.5 text-sm font-semibold rounded-lg',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
