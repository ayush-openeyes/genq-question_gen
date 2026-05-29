import { useState, useEffect } from 'react';
import { LIST_NAME_MAX_LENGTH, LIST_DESCRIPTION_MAX_LENGTH } from '../lib/constants';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Pencil, Check, X, Trash2, CheckSquare, Square } from 'lucide-react';
import ItemCard from '../components/shared/ItemCard';
import ItemCustomizeModal from '../components/shared/ItemCustomizeModal';
import ExportOptionsModal from '../components/shared/ExportOptionsModal';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../components/shared/Toast';
import { PERSONAL_LISTS, RUN_ITEMS, RUNS } from '../data/mockData';
import { BookMarked } from 'lucide-react';

export default function ListDetailPage() {
  const { listId }  = useParams();
  const navigate    = useNavigate();
  const showToast   = useToast();

  const [list, setList]             = useState(null);
  const [items, setItems]           = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [exportOpen, setExportOpen] = useState(false);
  const [customizeItem, setCustomizeItem] = useState(null);
  const [editName, setEditName]     = useState(false);
  const [nameDraft, setNameDraft]   = useState('');
  const [editDesc, setEditDesc]     = useState(false);
  const [descDraft, setDescDraft]   = useState('');

  useEffect(() => {
    const found = PERSONAL_LISTS.find(l => l.id === listId);
    if (!found) { navigate('/lists'); return; }
    setList({ ...found });
    setNameDraft(found.name);
    setDescDraft(found.description || '');

    const listItems = found.itemIds
      .map(id => RUN_ITEMS.find(i => i.id === id))
      .filter(Boolean)
      .map(i => ({ ...i }));
    setItems(listItems);
  }, [listId, navigate]);

  function saveItemToMock(updated) {
    const idx = RUN_ITEMS.findIndex(i => i.id === updated.id);
    if (idx !== -1) Object.assign(RUN_ITEMS[idx], updated);
  }

  function handleReact(itemId, reaction) {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, userReaction: reaction } : i));
    const src = RUN_ITEMS.find(i => i.id === itemId);
    if (src) src.userReaction = reaction;
  }

  function handleNotesChange(itemId, notes) {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, notes } : i));
    const src = RUN_ITEMS.find(i => i.id === itemId);
    if (src) src.notes = notes;
    showToast('Notes saved.', 'success');
  }

  function handleCustomizeSave(updated) {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
    saveItemToMock(updated);
    showToast('Item updated.', 'success');
  }

  function handleRemoveFromList(itemId) {
    const src = PERSONAL_LISTS.find(l => l.id === listId);
    if (src) src.itemIds = src.itemIds.filter(id => id !== itemId);
    const itemSrc = RUN_ITEMS.find(i => i.id === itemId);
    if (itemSrc) itemSrc.addedToLists = (itemSrc.addedToLists || []).filter(id => id !== listId);
    setList(prev => prev ? { ...prev, itemIds: prev.itemIds.filter(id => id !== itemId) } : prev);
    setItems(prev => prev.filter(i => i.id !== itemId));
    showToast('Item removed from list.', 'success');
  }

  function saveName() {
    if (!nameDraft.trim()) return;
    const src = PERSONAL_LISTS.find(l => l.id === listId);
    if (src) src.name = nameDraft.trim();
    setList(prev => prev ? { ...prev, name: nameDraft.trim() } : prev);
    setEditName(false);
  }

  function saveDesc() {
    const src = PERSONAL_LISTS.find(l => l.id === listId);
    if (src) src.description = descDraft.trim();
    setList(prev => prev ? { ...prev, description: descDraft.trim() } : prev);
    setEditDesc(false);
  }

  function toggleSelect(id) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function toggleSelectAll() {
    if (selectedIds.length === items.length) setSelectedIds([]);
    else setSelectedIds(items.map(i => i.id));
  }

  const allSelected = items.length > 0 && selectedIds.length === items.length;

  // Determine sourceType per item from its run
  function getSourceType(item) {
    const run = RUNS.find(r => r.id === item.runId);
    return run?.sourceType ?? 'document';
  }

  if (!list) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        <button
          type="button"
          onClick={() => navigate('/lists')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy transition-colors focus-visible:ring-2 focus-visible:ring-teal rounded mt-1.5"
        >
          <ArrowLeft size={14} aria-hidden="true" /> My Lists
        </button>
        <div className="flex-1 min-w-0">
          {/* Editable list name */}
          {editName ? (
            <div className="flex items-center gap-2 mb-1">
              <input
                type="text"
                value={nameDraft}
                onChange={e => setNameDraft(e.target.value.slice(0, LIST_NAME_MAX_LENGTH))}
                autoFocus
                className="text-xl font-bold text-navy border-b-2 border-teal bg-transparent focus:outline-none flex-1"
              />
              <button type="button" onClick={saveName} aria-label="Save name" className="p-1 text-teal hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal rounded"><Check size={16} /></button>
              <button type="button" onClick={() => { setEditName(false); setNameDraft(list.name); }} aria-label="Cancel" className="p-1 text-gray-400 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-teal rounded"><X size={16} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-navy">{list.name}</h1>
              <button type="button" onClick={() => setEditName(true)} aria-label="Edit name" className="p-1 text-gray-300 hover:text-gray-500 focus-visible:ring-2 focus-visible:ring-teal rounded transition-colors">
                <Pencil size={13} aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Editable description */}
          {editDesc ? (
            <div className="flex items-start gap-2">
              <textarea
                value={descDraft}
                onChange={e => setDescDraft(e.target.value.slice(0, LIST_DESCRIPTION_MAX_LENGTH))}
                rows={2}
                autoFocus
                className="text-sm text-gray-500 border border-lgray-200 rounded-lg px-2 py-1 resize-none flex-1 focus:outline-none focus:border-teal"
              />
              <button type="button" onClick={saveDesc} aria-label="Save description" className="p-1 text-teal hover:text-teal-700 mt-1 focus-visible:ring-2 focus-visible:ring-teal rounded"><Check size={14} /></button>
              <button type="button" onClick={() => { setEditDesc(false); setDescDraft(list.description || ''); }} aria-label="Cancel" className="p-1 text-gray-400 hover:text-gray-600 mt-1 focus-visible:ring-2 focus-visible:ring-teal rounded"><X size={14} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <p className="text-xs text-gray-400">{list.description || <span className="italic">No description</span>}</p>
              <button type="button" onClick={() => setEditDesc(true)} aria-label="Edit description" className="p-0.5 text-gray-300 hover:text-gray-500 transition-colors focus-visible:ring-2 focus-visible:ring-teal rounded">
                <Pencil size={11} aria-hidden="true" />
              </button>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSelectAll}
            aria-label={allSelected ? 'Deselect all' : 'Select all'}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-navy transition-colors focus-visible:ring-2 focus-visible:ring-teal rounded px-2 py-1"
          >
            {allSelected ? <CheckSquare size={14} className="text-teal" /> : <Square size={14} />}
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
          <Button size="sm" variant="secondary" leftIcon={Download} onClick={() => setExportOpen(true)} disabled={items.length === 0}>
            Export List
          </Button>
        </div>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="No items in this list"
          description="Add items from any run using the 'Add to List' button on each item card."
          action={() => navigate('/runs')}
          actionLabel="Browse Runs"
        />
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="relative">
              <ItemCard
                item={item}
                sourceType={getSourceType(item)}
                onReact={handleReact}
                onNotesChange={handleNotesChange}
                onCustomize={setCustomizeItem}
                selected={selectedIds.includes(item.id)}
                onSelectToggle={toggleSelect}
              />
              <button
                type="button"
                onClick={() => handleRemoveFromList(item.id)}
                aria-label="Remove from list"
                className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors focus-visible:ring-2 focus-visible:ring-teal"
              >
                <Trash2 size={13} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ItemCustomizeModal
        item={customizeItem}
        open={!!customizeItem}
        onClose={() => setCustomizeItem(null)}
        onSave={handleCustomizeSave}
      />

      <ExportOptionsModal
        items={items}
        selectedItemIds={selectedIds}
        open={exportOpen}
        onClose={() => setExportOpen(false)}
      />
    </div>
  );
}
