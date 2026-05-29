import { useState } from 'react';
import { StickyNote, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../ui/Button';

const MAX = 1000;

export default function RunNotesPanel({ notes = '', onSave, readOnly = false }) {
  const [expanded, setExpanded]     = useState(!!notes);
  const [draft, setDraft]           = useState(notes);
  const [savedAt, setSavedAt]       = useState(notes ? 'Previously saved' : null);

  const isDirty = draft !== notes;

  function handleSave() {
    onSave?.(draft);
    setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }

  return (
    <div className="rounded-xl border border-lgray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-lgray transition-colors focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-inset"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <StickyNote size={15} className="text-amber-500" aria-hidden="true" />
          <span className="text-sm font-semibold text-navy">Run Notes</span>
          {notes && !expanded && (
            <span className="text-xs text-gray-400 truncate max-w-xs">{notes.substring(0, 60)}{notes.length > 60 ? '…' : ''}</span>
          )}
        </div>
        {expanded ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-lgray-100">
          <p className="text-xs text-gray-400 mt-3 mb-2">Notes are internal — visible only to you.</p>
          {readOnly ? (
            <blockquote className="text-sm text-gray-600 border-l-2 border-amber-300 pl-3 py-1">
              {notes || <span className="italic">No notes added.</span>}
            </blockquote>
          ) : (
            <>
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value.slice(0, MAX))}
                rows={4}
                maxLength={MAX}
                placeholder="Add internal notes for this run…"
                className="w-full rounded-xl border border-lgray-200 px-3 py-2 text-sm text-navy placeholder-gray-400 resize-none focus:outline-none focus:border-teal focus-visible:ring-2 focus-visible:ring-teal"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                  <Button size="sm" onClick={handleSave} disabled={!isDirty}>Save Notes</Button>
                  {savedAt && !isDirty && <span className="text-xs text-gray-400">Saved {savedAt}</span>}
                </div>
                <span className="text-xs text-gray-400">{draft.length}/{MAX}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
