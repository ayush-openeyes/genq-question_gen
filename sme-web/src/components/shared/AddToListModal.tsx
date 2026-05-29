import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, ListPlus } from 'lucide-react';
import Modal from './Modal';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { LIST_NAME_MAX_LENGTH, LIST_DESCRIPTION_MAX_LENGTH } from '../../lib/constants';

export default function AddToListModal({ item, lists = [], open, onClose, onSave }) {
  const [checkedIds, setCheckedIds] = useState(item?.addedToLists ? [...item.addedToLists] : []);
  const [createOpen, setCreateOpen] = useState(lists.length === 0);
  const [newName, setNewName]       = useState('');
  const [newDesc, setNewDesc]       = useState('');
  const [descOpen, setDescOpen]     = useState(false);

  function toggle(id) {
    setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleSave() {
    onSave?.(checkedIds, null);
    onClose?.();
  }

  function handleCreateAndAdd() {
    if (!newName.trim()) return;
    onSave?.(checkedIds, newName.trim(), newDesc.trim());
    onClose?.();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add to List" size="md">
      <div className="space-y-4">
        {lists.length === 0 ? (
          <EmptyState
            icon={ListPlus}
            title="No lists yet"
            description="Create your first personal list below."
          />
        ) : (
          <div className="space-y-2">
            {lists.map(list => {
              const isChecked = checkedIds.includes(list.id);
              const count = list.itemIds?.length ?? 0;
              return (
                <label
                  key={list.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    isChecked ? 'border-teal bg-teal/5' : 'border-lgray-200 hover:border-teal/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(list.id)}
                    className="rounded border-gray-300 text-teal focus:ring-teal"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy">{list.name}</p>
                    {list.description && <p className="text-xs text-gray-400 truncate">{list.description}</p>}
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{count} item{count !== 1 ? 's' : ''}</span>
                </label>
              );
            })}
          </div>
        )}

        {/* Create new list */}
        <div className="border border-lgray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setCreateOpen(o => !o)}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-navy hover:bg-lgray transition-colors"
          >
            <Plus size={14} aria-hidden="true" />
            Create new list
            {createOpen ? <ChevronUp size={13} className="ml-auto text-gray-400" /> : <ChevronDown size={13} className="ml-auto text-gray-400" />}
          </button>
          {createOpen && (
            <div className="px-3 pb-3 border-t border-lgray-100 pt-3 space-y-2.5">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">List name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value.slice(0, LIST_NAME_MAX_LENGTH))}
                  maxLength={LIST_NAME_MAX_LENGTH}
                  placeholder="e.g. Unit 3 Review Items"
                  className="w-full rounded-lg border border-lgray-200 px-2.5 py-1.5 text-sm text-navy focus:outline-none focus:border-teal focus-visible:ring-2 focus-visible:ring-teal"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setDescOpen(o => !o)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {descOpen ? '− Hide description' : '+ Add description (optional)'}
                </button>
                {descOpen && (
                  <textarea
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value.slice(0, LIST_DESCRIPTION_MAX_LENGTH))}
                    rows={2}
                    maxLength={LIST_DESCRIPTION_MAX_LENGTH}
                    placeholder="Brief description…"
                    className="mt-1.5 w-full rounded-lg border border-lgray-200 px-2.5 py-1.5 text-sm text-navy resize-none focus:outline-none focus:border-teal focus-visible:ring-2 focus-visible:ring-teal"
                  />
                )}
              </div>
              <Button size="sm" onClick={handleCreateAndAdd} disabled={!newName.trim()}>
                Create & Add
              </Button>
            </div>
          )}
        </div>

        {lists.length > 0 && (
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
