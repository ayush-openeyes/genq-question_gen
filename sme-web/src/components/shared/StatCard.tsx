import React, { type ComponentType } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ComponentType<{ size?: number; className?: string }>;
  trend?: number;
  trendLabel?: string;
  onClick?: () => void;
  color?: 'teal' | 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

export default function StatCard({ label, value, icon: Icon, trend, trendLabel, onClick, color = 'teal' }: StatCardProps) {
  const accentMap = {
    teal:   'bg-teal-50 text-teal-600',
    blue:   'bg-blue-50 text-blue-600',
    green:  'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    red:    'bg-red-50 text-red-600',
  };
  const accent = accentMap[color] || accentMap.teal;

  const Tag = onClick ? 'button' : 'div';
  const interactiveProps = onClick ? {
    type: 'button',
    onClick,
    role: 'button',
    'aria-label': `${label}: ${value}`,
    onKeyDown: (event: React.KeyboardEvent) => (event.key === 'Enter' || event.key === ' ') && onClick(),
  } : {};

  return (
    <Tag
      {...interactiveProps}
      className={`bg-white rounded-xl p-5 shadow-sm border border-lgray-100 flex items-start justify-between gap-4 w-full text-left ${onClick ? 'cursor-pointer hover:shadow-elevated hover:border-teal-200 transition-all focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1 rounded-xl' : ''}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-navy mt-1">{value}</p>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`} aria-label={`${Math.abs(trend)}% ${trendLabel || 'vs last week'}`}>
            {trend >= 0 ? <TrendingUp size={12} aria-hidden="true" /> : <TrendingDown size={12} aria-hidden="true" />}
            <span>{Math.abs(trend)}% {trendLabel || (trend >= 0 ? 'vs last week' : 'vs last week')}</span>
          </div>
        )}
      </div>
      {Icon && (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`} aria-hidden="true">
          <Icon size={20} />
        </div>
      )}
    </Tag>
  );
}
