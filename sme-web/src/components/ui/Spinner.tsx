interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'teal' | 'navy' | 'white' | 'gray';
  className?: string;
}

export default function Spinner({ size = 'md', color = 'teal', className = '' }: SpinnerProps) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-8 h-8 border-[3px]', xl: 'w-12 h-12 border-4' };
  const colors = { teal: 'border-teal border-t-transparent', navy: 'border-navy border-t-transparent', white: 'border-white border-t-transparent', gray: 'border-gray-300 border-t-transparent' };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`rounded-full animate-spin ${sizes[size] ?? sizes.md} ${colors[color] ?? colors.teal} ${className}`}
    />
  );
}
