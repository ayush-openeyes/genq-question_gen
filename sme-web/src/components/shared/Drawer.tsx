import { type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useEffect, useId } from 'react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export default function Drawer({ open, onClose, title, children, width = 'w-96' }: DrawerProps) {
  const labelId = useId();

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />
      <div
        role="complementary"
        aria-label={title}
        aria-labelledby={labelId}
        className={`relative bg-white ${width} h-full flex flex-col shadow-overlay slide-in`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-lgray-100">
          <h3 id={labelId} className="text-base font-semibold text-navy">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="p-1.5 rounded-lg hover:bg-lgray text-gray-400 hover:text-gray-600 transition-colors focus-visible:ring-2 focus-visible:ring-teal"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
