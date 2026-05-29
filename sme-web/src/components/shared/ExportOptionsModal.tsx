import { useState } from 'react';
import { Download } from 'lucide-react';
import Modal from './Modal';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { FIELD_DEFS, exportItems } from '../../lib/exportUtils';

const SCOPE_OPTIONS = [
  { id: 'all',      label: 'All items' },
  { id: 'selected', label: 'Selected items' },
  { id: 'liked',    label: 'Liked items only' },
];

const FORMAT_OPTIONS = [
  { id: 'csv',  label: 'CSV',  available: true },
  { id: 'docx', label: 'DOCX', available: true },
  { id: 'pdf',  label: 'PDF',  available: false, comingSoon: true },
];

export default function ExportOptionsModal({ items = [], selectedItemIds = [], open, onClose }) {
  const [scope, setScope]         = useState('all');
  const [format, setFormat]       = useState('csv');
  const [fieldIds, setFieldIds]   = useState(FIELD_DEFS.map(f => f.id));
  const [exporting, setExporting] = useState(false);

  const likedCount    = items.filter(i => i.userReaction === 'liked').length;
  const selectedCount = selectedItemIds.length;

  function toggleField(id) {
    setFieldIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  async function handleExport() {
    setExporting(true);
    await new Promise(r => setTimeout(r, 400));
    exportItems(items, { scope, format, fieldIds, selectedIds: selectedItemIds });
    setExporting(false);
    onClose?.();
  }

  function scopeLabel(s) {
    if (s.id === 'all')      return `All items (${items.length})`;
    if (s.id === 'selected') return `Selected items (${selectedCount})`;
    if (s.id === 'liked')    return `Liked items only (${likedCount})`;
    return s.label;
  }

  function scopeDisabled(s) {
    if (s.id === 'selected') return selectedCount === 0;
    if (s.id === 'liked')    return likedCount === 0;
    return false;
  }

  return (
    <Modal open={open} onClose={onClose} title="Export Items" size="md">
      <div className="space-y-5">

        {/* Scope */}
        <section>
          <h4 className="text-xs font-semibold text-navy uppercase tracking-wider mb-2">Scope</h4>
          <div className="space-y-2">
            {SCOPE_OPTIONS.map(s => (
              <label
                key={s.id}
                className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                  scopeDisabled(s) ? 'opacity-40 cursor-not-allowed border-lgray-100 bg-lgray' :
                  scope === s.id ? 'border-teal bg-teal/5' : 'border-lgray-200 hover:border-teal/40'
                }`}
              >
                <input
                  type="radio"
                  name="export-scope"
                  value={s.id}
                  checked={scope === s.id}
                  onChange={() => !scopeDisabled(s) && setScope(s.id)}
                  disabled={scopeDisabled(s)}
                  className="text-teal focus:ring-teal"
                />
                <span className="text-sm text-navy">{scopeLabel(s)}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Format */}
        <section>
          <h4 className="text-xs font-semibold text-navy uppercase tracking-wider mb-2">Format</h4>
          <div className="flex gap-2">
            {FORMAT_OPTIONS.map(f => (
              <label
                key={f.id}
                className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                  !f.available ? 'opacity-40 cursor-not-allowed border-lgray-100' :
                  format === f.id ? 'border-teal bg-teal/5 cursor-pointer' : 'border-lgray-200 hover:border-teal/40 cursor-pointer'
                }`}
              >
                <input
                  type="radio"
                  name="export-format"
                  value={f.id}
                  checked={format === f.id}
                  onChange={() => f.available && setFormat(f.id)}
                  disabled={!f.available}
                  className="sr-only"
                />
                <span className="text-sm font-semibold text-navy">{f.label}</span>
                {f.comingSoon && <span className="text-xs text-gray-400">Coming Soon</span>}
              </label>
            ))}
          </div>
        </section>

        {/* Fields */}
        <section>
          <h4 className="text-xs font-semibold text-navy uppercase tracking-wider mb-2">Fields to include</h4>
          <div className="grid grid-cols-2 gap-1.5">
            {FIELD_DEFS.map(f => (
              <label key={f.id} className="flex items-center gap-2 text-sm text-navy cursor-pointer">
                <input
                  type="checkbox"
                  checked={fieldIds.includes(f.id)}
                  onChange={() => toggleField(f.id)}
                  className="rounded border-gray-300 text-teal focus:ring-teal"
                />
                {f.label}
              </label>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-2 pt-2 border-t border-lgray-100">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleExport}
            loading={exporting}
            disabled={fieldIds.length === 0}
            leftIcon={!exporting ? Download : undefined}
          >
            {exporting ? 'Exporting…' : 'Export'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
