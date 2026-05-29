import { useState } from 'react';
import { ThumbsUp, ThumbsDown, StickyNote, Pencil, ListPlus, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import Badge from './Badge';
import SourceReferenceTag from './SourceReferenceTag';
import Button from '../ui/Button';

const TYPE_LABEL = {
  'mcq':        'Multiple Choice',
  'true-false': 'True / False',
  'fill-blank': 'Fill in Blank',
  'open-ended': 'Open-Ended',
  'scenario':   'Scenario-Based',
  'likert':     'Likert Scale',
  'rating':     'Rating Scale',
};

const FORMAT_TYPE_MAP = {
  'mcq':        'MCQ',
  'true-false': 'True/False',
  'fill-blank': 'Fill in Blank',
  'open-ended': 'Open-Ended',
  'scenario':   'Scenario-Based',
  'likert':     'Likert Scale',
  'rating':     'Rating Scale',
};

function OptionsDisplay({ item }) {
  if (item.type === 'mcq' || item.type === 'scenario') {
    return (
      <ul className="mt-3 space-y-1.5" role="list">
        {(item.options || []).map((opt, i) => {
          const letter = opt.charAt(0);
          const isCorrect = item.correctAnswer === letter;
          return (
            <li
              key={i}
              className={`flex items-start gap-2 text-sm px-3 py-2 rounded-lg ${
                isCorrect ? 'bg-green-50 border border-green-200 text-green-800 font-medium' : 'bg-lgray text-gray-700'
              }`}
            >
              {isCorrect && <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />}
              <span>{opt}</span>
            </li>
          );
        })}
      </ul>
    );
  }
  if (item.type === 'true-false') {
    return (
      <div className="mt-3 flex gap-2">
        {['True', 'False'].map(val => (
          <span
            key={val}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              item.correctAnswer === val ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-lgray text-gray-500'
            }`}
          >
            {item.correctAnswer === val && <CheckCircle size={12} className="inline mr-1 text-green-600" aria-hidden="true" />}
            {val}
          </span>
        ))}
      </div>
    );
  }
  if (item.type === 'fill-blank' || item.type === 'open-ended') {
    return (
      <div className="mt-3 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
        <p className="text-xs font-semibold text-green-700 mb-0.5 flex items-center gap-1">
          <CheckCircle size={12} aria-hidden="true" /> Correct Answer
        </p>
        <p className="text-sm text-green-800">{item.correctAnswer}</p>
      </div>
    );
  }
  return null;
}

const NOTES_MAX = 500;

export default function ItemCard({
  item,
  sourceType,
  onReact,
  onNotesChange,
  onCustomize,
  onAddToList,
  selected = false,
  onSelectToggle,
  readOnly = false,
}) {
  const [notesOpen, setNotesOpen]       = useState(false);
  const [notesDraft, setNotesDraft]     = useState(item.notes || '');
  const [explainOpen, setExplainOpen]   = useState(false);

  function saveNotes() {
    onNotesChange?.(item.id, notesDraft);
    setNotesOpen(false);
  }

  function handleReact(reaction) {
    const next = item.userReaction === reaction ? null : reaction;
    onReact?.(item.id, next);
  }

  const badgeText = FORMAT_TYPE_MAP[item.type] || item.type;

  return (
    <article className={`rounded-2xl border bg-white shadow-card transition-shadow hover:shadow-elevated ${selected ? 'ring-2 ring-teal' : ''}`}>
      {/* Header row */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-0">
        {onSelectToggle && (
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelectToggle(item.id)}
            className="rounded border-gray-300 text-teal focus:ring-teal focus:ring-offset-0 flex-shrink-0"
            aria-label="Select item"
          />
        )}
        <Badge text={badgeText} type="format" size="xs" />
        <SourceReferenceTag sourceRef={item.sourceRef} sourceType={sourceType} />
        {item.customized && <Badge text="Edited" type="status" size="xs" />}
        <div className="flex-1" />
        {item.userReaction === 'liked' && (
          <span className="text-xs text-teal font-medium flex items-center gap-1">
            <ThumbsUp size={12} aria-hidden="true" /> Liked
          </span>
        )}
        {item.userReaction === 'disliked' && (
          <span className="text-xs text-red-500 font-medium flex items-center gap-1">
            <ThumbsDown size={12} aria-hidden="true" /> Disliked
          </span>
        )}
      </div>

      {/* Stem */}
      <div className="px-4 pt-3">
        <p className="text-sm text-navy font-medium leading-relaxed">{item.stem}</p>
        <OptionsDisplay item={item} />
      </div>

      {/* Explanation toggle */}
      {item.explanation && (
        <div className="px-4 mt-3">
          <button
            type="button"
            onClick={() => setExplainOpen(e => !e)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors focus-visible:ring-2 focus-visible:ring-teal rounded"
          >
            {explainOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {explainOpen ? 'Hide' : 'Show'} explanation
          </button>
          {explainOpen && (
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed pl-4 border-l-2 border-lgray-200">
              {item.explanation}
            </p>
          )}
        </div>
      )}

      {/* Inline notes area */}
      {notesOpen && (
        <div className="px-4 mt-3 pb-2">
          <textarea
            value={notesDraft}
            onChange={e => setNotesDraft(e.target.value.slice(0, NOTES_MAX))}
            rows={3}
            maxLength={NOTES_MAX}
            placeholder="Add internal notes for this item…"
            className="w-full rounded-xl border border-lgray-200 px-3 py-2 text-sm text-navy placeholder-gray-400 resize-none focus:outline-none focus:border-teal focus-visible:ring-2 focus-visible:ring-teal"
            autoFocus
          />
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex gap-2">
              <Button size="sm" onClick={saveNotes}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => { setNotesDraft(item.notes || ''); setNotesOpen(false); }}>Cancel</Button>
            </div>
            <span className="text-xs text-gray-400">{notesDraft.length}/{NOTES_MAX}</span>
          </div>
        </div>
      )}

      {/* Saved notes preview */}
      {!notesOpen && item.notes && (
        <div className="px-4 mt-2">
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 leading-snug">
            📝 {item.notes}
          </p>
        </div>
      )}

      {/* Action bar */}
      {!readOnly && (
        <div className="flex items-center gap-1 px-4 pt-3 pb-4 flex-wrap">
          <button
            type="button"
            onClick={() => handleReact('liked')}
            aria-pressed={item.userReaction === 'liked'}
            aria-label="Like"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-teal ${
              item.userReaction === 'liked'
                ? 'bg-teal/10 text-teal border border-teal/30'
                : 'text-gray-500 hover:bg-lgray hover:text-teal border border-transparent'
            }`}
          >
            <ThumbsUp size={13} aria-hidden="true" /> Like
          </button>
          <button
            type="button"
            onClick={() => handleReact('disliked')}
            aria-pressed={item.userReaction === 'disliked'}
            aria-label="Dislike"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-teal ${
              item.userReaction === 'disliked'
                ? 'bg-red-50 text-red-500 border border-red-200'
                : 'text-gray-500 hover:bg-lgray hover:text-red-400 border border-transparent'
            }`}
          >
            <ThumbsDown size={13} aria-hidden="true" /> Dislike
          </button>
          <button
            type="button"
            onClick={() => setNotesOpen(o => !o)}
            aria-label="Add notes"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-teal ${
              item.notes
                ? 'text-amber-600 bg-amber-50 border border-amber-200'
                : 'text-gray-500 hover:bg-lgray border border-transparent'
            }`}
          >
            <StickyNote size={13} aria-hidden="true" /> {item.notes ? 'Edit Notes' : 'Add Notes'}
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => onCustomize?.(item)}
            aria-label="Customize item"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-lgray hover:text-navy border border-transparent transition-all focus-visible:ring-2 focus-visible:ring-teal"
          >
            <Pencil size={13} aria-hidden="true" /> Customize
          </button>
          <button
            type="button"
            onClick={() => onAddToList?.(item)}
            aria-label="Add to list"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-teal/10 hover:text-teal border border-transparent transition-all focus-visible:ring-2 focus-visible:ring-teal"
          >
            <ListPlus size={13} aria-hidden="true" />
            {item.addedToLists?.length ? `In ${item.addedToLists.length} list${item.addedToLists.length > 1 ? 's' : ''}` : 'Add to List'}
          </button>
        </div>
      )}
    </article>
  );
}
