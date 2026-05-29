import { type ElementType } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  as?: ElementType;
  className?: string;
}

export default function Input({
  label,
  helper,
  error,
  required,
  as: Tag = 'input',
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const baseClass = error
    ? 'w-full border border-red-400 rounded-xl px-3 py-2.5 text-sm text-navy placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-shadow'
    : 'w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm text-navy placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent disabled:opacity-50 disabled:bg-lgray disabled:cursor-not-allowed transition-shadow';

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-gray-500">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <Tag
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
        className={`${baseClass} ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-red-500">{error}</p>
      )}
      {!error && helper && (
        <p id={`${inputId}-helper`} className="text-xs text-gray-400">{helper}</p>
      )}
    </div>
  );
}
