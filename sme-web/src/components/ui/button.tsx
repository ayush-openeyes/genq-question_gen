import { type ComponentType, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ComponentType<{ size?: number; className?: string }>;
  rightIcon?: ComponentType<{ size?: number; className?: string }>;
  className?: string;
}

const VARIANTS = {
  primary:   'bg-teal text-white hover:bg-teal-700 active:bg-teal-800 shadow-sm',
  secondary: 'bg-white text-navy border border-lgray-200 hover:bg-lgray active:bg-lgray-100',
  ghost:     'bg-transparent text-gray-500 hover:bg-lgray hover:text-navy',
  danger:    'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm',
  outline:   'bg-transparent text-teal border border-teal hover:bg-teal-50',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-5 py-2.5 text-base rounded-xl',
};

const MIN_H = { sm: 'min-h-[32px]', md: 'min-h-[36px]', lg: 'min-h-[44px]' };

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium transition-all
        focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1
        disabled:opacity-50 disabled:pointer-events-none select-none
        ${VARIANTS[variant] ?? VARIANTS.primary}
        ${SIZES[size] ?? SIZES.md}
        ${MIN_H[size] ?? MIN_H.md}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} className="animate-spin flex-shrink-0" />
      ) : LeftIcon ? (
        <LeftIcon size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} className="flex-shrink-0" />
      ) : null}
      {children}
      {!loading && RightIcon && (
        <RightIcon size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} className="flex-shrink-0" />
      )}
    </button>
  );
}
