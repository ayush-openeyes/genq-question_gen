import { type ComponentType } from 'react';

interface EmptyStateProps {
  icon?: ComponentType<{ size?: number; className?: string }>;
  title: string;
  description?: string;
  action?: () => void;
  actionLabel?: string;
}

export default function EmptyState({ icon: Icon, title, description, action, actionLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-lgray flex items-center justify-center mb-4">
          <Icon size={24} className="text-gray-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-navy mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-xs mb-5">{description}</p>}
      {action && actionLabel && (
        <button
          type="button"
          onClick={action}
          className="px-4 py-2 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
