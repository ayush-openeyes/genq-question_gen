import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, CheckSquare, Square, Loader, Search } from 'lucide-react';
import Badge from '../components/shared/Badge';
import ItemCard from '../components/shared/ItemCard';
import ItemCustomizeModal from '../components/shared/ItemCustomizeModal';
import AddToListModal from '../components/shared/AddToListModal';
import ExportOptionsModal from '../components/shared/ExportOptionsModal';
import RunNotesPanel from '../components/shared/RunNotesPanel';
import Button from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../components/shared/Toast';
import { RUNS, RUN_ITEMS, PERSONAL_LISTS, ITEM_TYPES } from '../data/mockData';
import { FileText, Music, Video } from 'lucide-react';

const SOURCE_LABEL = { document: 'Document', audio: 'Audio', video: 'Video' };
const SOURCE_ICON  = { document: FileText, audio: Music, video: Video };

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

const TYPE_FILTER_OPTIONS = ['all', 'liked', 'disliked', 'uncategorized'];

export default function RunResultsPage() {
  const { runId }  = useParams();
  const navigate   = useNavigate();
  const showToast  = useToast();

  const [run, setRun]               = useState(null);
  const [items, setItems]           = useState([]);
  const [lists, setLists]           = useState([]);
  const [filter, setFilter]         = useState('all');
  const [typeFilter, setTypeFilter] = useState(null);
  const [sort, setSort]             = useState('index');
  const [selectedIds, setSelectedIds] = useState([]);
  const [exportOpen, setExportOpen] = useState(false);
  const [customizeItem, setCustomizeItem] = useState(null);
  const [addToListItem, setAddToListItem] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const found = RUNS.find(r => r.id === runId);
    if (!found) { navigate('/runs'); return; }
    setRun(found);
    setProcessing(found.status === 'processing');
    const runItems = RUN_ITEMS.filter(i => i.runId === runId);
    setItems(runItems.map(i => ({ ...i })));
    setLists(PERSONAL_LISTS.map(l => ({ ...l })));
  }, [runId, navigate]);

  // Simulate processing → completed after 3 s
  useEffect(() => {
    if (!processing) return;
    const timer = setTimeout(() => {
      setProcessing(false);
      setRun(prev => prev ? { ...prev, status: 'completed' } : prev);
    }, 3000);
    return () => clearTimeout(timer);
  }, [processing]);

  function handleReact(itemId, reaction) {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, userReaction: reaction } : i));
    const item = RUN_ITEMS.find(i => i.id === itemId);
    if (item) item.userReaction = reaction;
  }

  function handleNotesChange(itemId, notes) {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, notes } : i));
    const item = RUN_ITEMS.find(i => i.id === itemId);
    if (item) item.notes = notes;
    showToast('Notes saved.', 'success');
  }

  function handleCustomizeSave(updated) {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
    const idx = RUN_ITEMS.findIndex(i => i.id === updated.id);
    if (idx !== -1) Object.assign(RUN_ITEMS[idx], updated);
    showToast('Item updated.', 'success');
  }

  function handleAddToList(listIds, newListName, newListDesc) {
    const item = addToListItem;
    if (!item) return;

    let targetLists = [...listIds];

    if (newListName) {
      const newList = {
        id: `list-${Date.now()}`,
        userId: 'u4',
        name: newListName,
        description: newListDesc || '',
        itemIds: [item.id],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      PERSONAL_LISTS.push(newList);
      setLists(prev => [...prev, { ...newList }]);
      targetLists = [...listIds, newList.id];
      showToast(`List "${newListName}" created.`, 'success');
    }

    setItems(prev => prev.map(i => i.id === item.id ? { ...i, addedToLists: targetLists } : i));
    const src = RUN_ITEMS.find(i => i.id === item.id);
    if (src) src.addedToLists = targetLists;

    targetLists.forEach(lid => {
      const list = PERSONAL_LISTS.find(l => l.id === lid);
      if (list && !list.itemIds.includes(item.id)) list.itemIds.push(item.id);
    });

    if (!newListName) showToast('Lists updated.', 'success');
  }

  function handleRunNotesSave(notes) {
    setRun(prev => prev ? { ...prev, notes } : prev);
    const src = RUNS.find(r => r.id === runId);
    if (src) src.notes = notes;
  }

  function toggleSelect(id) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function toggleSelectAll() {
    if (selectedIds.length === filteredItems.length) setSelectedIds([]);
    else setSelectedIds(filteredItems.map(i => i.id));
  }

  const itemTypes = run ? [...new Set(run.itemTypes)] : [];

  let filteredItems = items;
  if (filter === 'liked')         filteredItems = items.filter(i => i.userReaction === 'liked');
  else if (filter === 'disliked') filteredItems = items.filter(i => i.userReaction === 'disliked');
  else if (filter === 'uncategorized') filteredItems = items.filter(i => !i.userReaction);
  if (typeFilter) filteredItems = filteredItems.filter(i => i.type === typeFilter);

  if (sort === 'type')  filteredItems = [...filteredItems].sort((a, b) => a.type.localeCompare(b.type));
  if (sort === 'liked') filteredItems = [...filteredItems].sort((a, b) => (b.userReaction === 'liked' ? 1 : 0) - (a.userReaction === 'liked' ? 1 : 0));

  const allSelected = filteredItems.length > 0 && selectedIds.length === filteredItems.length;

  if (!run) return null;

  const SrcIcon = SOURCE_ICON[run.sourceType] || FileText;

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Top bar */}
      <div className="flex items-start gap-4 flex-wrap">
        <button
          type="button"
          onClick={() => navigate('/runs')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy transition-colors focus-visible:ring-2 focus-visible:ring-teal rounded mt-1"
        >
          <ArrowLeft size={14} aria-hidden="true" /> All Runs
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <SrcIcon size={16} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
            <h1 className="text-lg font-bold text-navy truncate">{run.sourceFileName}</h1>
            <Badge text={SOURCE_LABEL[run.sourceType] || 'File'} type="status" size="xs" />
            {processing && (
              <span className="inline-flex items-center gap-1 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-0.5">
                <Loader size={11} className="animate-spin" aria-hidden="true" /> Processing…
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{formatDate(run.createdAt)} · {run.itemCount} items generated</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {itemTypes.map(id => {
              const label = ITEM_TYPES.find(t => t.id === id)?.label ?? id;
              return <span key={id} className="text-xs bg-lgray border border-lgray-200 text-gray-600 rounded-full px-2 py-0.5">{label}</span>;
            })}
          </div>
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
          <Button
            size="sm"
            variant="secondary"
            leftIcon={Download}
            onClick={() => setExportOpen(true)}
            disabled={items.length === 0}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Run notes */}
      <RunNotesPanel
        notes={run.notes}
        onSave={handleRunNotesSave}
      />

      {/* Filter bar */}
      {!processing && items.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {/* Reaction filters */}
          {[
            { id: 'all',           label: `All (${items.length})` },
            { id: 'liked',         label: `Liked (${items.filter(i => i.userReaction === 'liked').length})` },
            { id: 'disliked',      label: `Disliked (${items.filter(i => i.userReaction === 'disliked').length})` },
            { id: 'uncategorized', label: `Uncategorized (${items.filter(i => !i.userReaction).length})` },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all focus-visible:ring-2 focus-visible:ring-teal ${
                filter === f.id
                  ? 'bg-teal text-white border-teal'
                  : 'bg-white text-gray-500 border-lgray-200 hover:border-teal/40 hover:text-teal'
              }`}
            >
              {f.label}
            </button>
          ))}

          {/* Type filters */}
          {itemTypes.map(id => {
            const label = ITEM_TYPES.find(t => t.id === id)?.label ?? id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTypeFilter(typeFilter === id ? null : id)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all focus-visible:ring-2 focus-visible:ring-teal ${
                  typeFilter === id
                    ? 'bg-navy text-white border-navy'
                    : 'bg-white text-gray-500 border-lgray-200 hover:border-navy/40'
                }`}
              >
                {label}
              </button>
            );
          })}

          <div className="ml-auto">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="text-xs border border-lgray-200 rounded-lg px-2.5 py-1.5 bg-white text-navy focus:outline-none focus:border-teal"
              aria-label="Sort items"
            >
              <option value="index">By Index</option>
              <option value="type">By Type</option>
              <option value="liked">Liked First</option>
            </select>
          </div>
        </div>
      )}

      {/* Items list */}
      {processing ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
            <Loader size={16} className="animate-spin text-yellow-600" aria-hidden="true" />
            <p className="text-sm text-yellow-800">Your items are being generated. This may take a few minutes…</p>
          </div>
          {[1, 2, 3].map(n => <SkeletonCard key={n} rows={4} />)}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No items match your filter"
          description="Try a different filter or reaction."
          action={() => { setFilter('all'); setTypeFilter(null); }}
          actionLabel="Clear Filters"
        />
      ) : (
        <div className="space-y-4">
          {filteredItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              sourceType={run.sourceType}
              onReact={handleReact}
              onNotesChange={handleNotesChange}
              onCustomize={setCustomizeItem}
              onAddToList={setAddToListItem}
              selected={selectedIds.includes(item.id)}
              onSelectToggle={toggleSelect}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ItemCustomizeModal
        item={customizeItem}
        open={!!customizeItem}
        onClose={() => setCustomizeItem(null)}
        onSave={handleCustomizeSave}
      />

      <AddToListModal
        item={addToListItem}
        lists={lists}
        open={!!addToListItem}
        onClose={() => setAddToListItem(null)}
        onSave={handleAddToList}
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
