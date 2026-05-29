import { useState } from 'react';
import { LIST_NAME_MAX_LENGTH, LIST_DESCRIPTION_MAX_LENGTH } from '../lib/constants';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, BookMarked, Pencil, Download, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/shared/Toast';
import Button from '../components/ui/Button';
import Modal from '../components/shared/Modal';
import EmptyState from '../components/ui/EmptyState';
import { PERSONAL_LISTS } from '../data/mockData';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString([], { dateStyle: 'medium' });
}

export default function PersonalListsPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const showToast = useToast();

  const [lists, setLists]         = useState(PERSONAL_LISTS.filter(l => l.userId === (user?.id ?? 'u3')).map(l => ({ ...l })));
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName]       = useState('');
  const [newDesc, setNewDesc]       = useState('');
  const [nameError, setNameError]   = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [menuOpen, setMenuOpen]     = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameName, setRenameName]     = useState('');

  function openCreate() { setNewName(''); setNewDesc(''); setNameError(''); setCreateOpen(true); }

  function handleCreate() {
    if (!newName.trim()) { setNameError('List name is required.'); return; }
    const list = {
      id: `list-${Date.now()}`,
      userId: user?.id ?? 'u3',
      name: newName.trim(),
      description: newDesc.trim(),
      itemIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    PERSONAL_LISTS.push(list);
    setLists(prev => [...prev, list]);
    setCreateOpen(false);
    showToast(`List "${list.name}" created.`, 'success');
  }

  function handleDelete() {
    const id = deleteTarget?.id;
    if (!id) return;
    const idx = PERSONAL_LISTS.findIndex(l => l.id === id);
    if (idx !== -1) PERSONAL_LISTS.splice(idx, 1);
    setLists(prev => prev.filter(l => l.id !== id));
    setDeleteTarget(null);
    showToast('List deleted.', 'success');
  }

  function handleRename() {
    if (!renameName.trim()) return;
    const src = PERSONAL_LISTS.find(l => l.id === renameTarget?.id);
    if (src) src.name = renameName.trim();
    setLists(prev => prev.map(l => l.id === renameTarget?.id ? { ...l, name: renameName.trim() } : l));
    setRenameTarget(null);
    showToast('List renamed.', 'success');
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">My Lists</h1>
          <p className="text-sm text-gray-500 mt-1">Personal curated collections of generated items.</p>
        </div>
        <Button leftIcon={Plus} onClick={openCreate}>Create New List</Button>
      </div>

      {lists.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="No lists yet"
          description="Create your first list and add items to it from any run."
          action={openCreate}
          actionLabel="Create a List"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map(list => (
            <div key={list.id} className="relative bg-white rounded-2xl border border-lgray-200 shadow-card p-4 flex flex-col gap-3 hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-navy leading-tight">{list.name}</h2>
                  {list.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{list.description}</p>
                  )}
                </div>
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setMenuOpen(menuOpen === list.id ? null : list.id)}
                    aria-label="List options"
                    className="p-1 rounded-lg hover:bg-lgray text-gray-400 hover:text-gray-600 transition-colors focus-visible:ring-2 focus-visible:ring-teal"
                  >
                    <MoreVertical size={15} aria-hidden="true" />
                  </button>
                  {menuOpen === list.id && (
                    <div
                      className="absolute right-0 top-7 z-20 bg-white rounded-xl border border-lgray-200 shadow-elevated py-1 w-36"
                      onMouseLeave={() => setMenuOpen(null)}
                    >
                      {[
                        { icon: Pencil, label: 'Rename', action: () => { setRenameTarget(list); setRenameName(list.name); setMenuOpen(null); } },
                        { icon: Download, label: 'Export List', action: () => { navigate(`/lists/${list.id}`); setMenuOpen(null); } },
                        { icon: Trash2, label: 'Delete', action: () => { setDeleteTarget(list); setMenuOpen(null); }, danger: true },
                      ].map(({ icon: Icon, label, action, danger }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={action}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${danger ? 'text-red-500 hover:bg-red-50' : 'text-navy hover:bg-lgray'}`}
                        >
                          <Icon size={13} aria-hidden="true" /> {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{list.itemIds.length} item{list.itemIds.length !== 1 ? 's' : ''}</span>
                <span>Updated {formatDate(list.updatedAt)}</span>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/lists/${list.id}`)}
                className="flex items-center gap-1 text-sm font-medium text-teal hover:text-teal-700 transition-colors focus-visible:ring-2 focus-visible:ring-teal rounded"
              >
                View List <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New List" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">List name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={newName}
              onChange={e => { setNewName(e.target.value.slice(0, LIST_NAME_MAX_LENGTH)); setNameError(''); }}
              maxLength={LIST_NAME_MAX_LENGTH}
              placeholder="e.g. Unit 3 Review Items"
              className={`w-full rounded-xl border px-3 py-2 text-sm text-navy focus:outline-none focus:border-teal focus-visible:ring-2 focus-visible:ring-teal ${nameError ? 'border-red-400' : 'border-lgray-200'}`}
            />
            {nameError && <p className="text-xs text-red-600 mt-1">{nameError}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">Description <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              value={newDesc}
              onChange={e => setNewDesc(e.target.value.slice(0, LIST_DESCRIPTION_MAX_LENGTH))}
              rows={2}
              maxLength={LIST_DESCRIPTION_MAX_LENGTH}
              placeholder="Brief description of this list…"
              className="w-full rounded-xl border border-lgray-200 px-3 py-2 text-sm text-navy resize-none focus:outline-none focus:border-teal focus-visible:ring-2 focus-visible:ring-teal"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create List</Button>
          </div>
        </div>
      </Modal>

      {/* Rename modal */}
      <Modal open={!!renameTarget} onClose={() => setRenameTarget(null)} title="Rename List" size="sm">
        <div className="space-y-4">
          <input
            type="text"
            value={renameName}
            onChange={e => setRenameName(e.target.value.slice(0, LIST_NAME_MAX_LENGTH))}
            maxLength={LIST_NAME_MAX_LENGTH}
            className="w-full rounded-xl border border-lgray-200 px-3 py-2 text-sm text-navy focus:outline-none focus:border-teal focus-visible:ring-2 focus-visible:ring-teal"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setRenameTarget(null)}>Cancel</Button>
            <Button onClick={handleRename}>Rename</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete List" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Delete <strong>"{deleteTarget?.name}"</strong>? This will not delete the original items from their runs.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
