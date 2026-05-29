import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import Modal from './Modal';
import Button from '../ui/Button';

const STEM_MAX = 800;

export default function ItemCustomizeModal({ item, open, onClose, onSave }) {
  const [stem, setStem]       = useState(item?.stem || '');
  const [options, setOptions] = useState(item?.options ? [...item.options] : ['A. ', 'B. ', 'C. ', 'D. ']);
  const [correct, setCorrect] = useState(item?.correctAnswer || '');
  const [explain, setExplain] = useState(item?.explanation || '');

  const hasMCQ = item && (item.type === 'mcq' || item.type === 'scenario');
  const hasTF  = item && item.type === 'true-false';
  const hasFill = item && (item.type === 'fill-blank' || item.type === 'open-ended');
  const isCustomized = item?.customized;

  function reset() {
    setStem(item?.originalStem || item?.stem || '');
    setOptions(item?.originalOptions ? [...item.originalOptions] : item?.options ? [...item.options] : []);
    setCorrect(item?.originalCorrectAnswer || item?.correctAnswer || '');
    setExplain(item?.explanation || '');
  }

  function handleSave() {
    const updated = {
      ...item,
      stem,
      explanation: explain,
      customized: true,
      originalStem: isCustomized ? item.originalStem : item.stem,
      originalOptions: isCustomized ? item.originalOptions : item.options,
      originalCorrectAnswer: isCustomized ? item.originalCorrectAnswer : item.correctAnswer,
    };
    if (hasMCQ) {
      updated.options = options;
      updated.correctAnswer = correct;
    } else {
      updated.correctAnswer = correct;
    }
    onSave?.(updated);
    onClose?.();
  }

  function updateOption(i, val) {
    const next = [...options];
    next[i] = val;
    setOptions(next);
  }

  if (!item) return null;

  return (
    <Modal open={open} onClose={onClose} title="Customize Item" size="lg">
      <div className="space-y-4">

        {isCustomized && (
          <div className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
            <p className="text-xs text-amber-700">This item has been edited from the original.</p>
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1 text-xs text-amber-700 font-medium hover:text-amber-900 focus-visible:ring-2 focus-visible:ring-teal rounded"
            >
              <RotateCcw size={12} aria-hidden="true" /> Reset to original
            </button>
          </div>
        )}

        {/* Stem */}
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5">
            Stem <span className="text-red-500">*</span>
          </label>
          <textarea
            value={stem}
            onChange={e => setStem(e.target.value.slice(0, STEM_MAX))}
            rows={4}
            maxLength={STEM_MAX}
            className="w-full rounded-xl border border-lgray-200 px-3 py-2 text-sm text-navy resize-none focus:outline-none focus:border-teal focus-visible:ring-2 focus-visible:ring-teal"
          />
          <p className="text-right text-xs text-gray-400 mt-0.5">{stem.length}/{STEM_MAX}</p>
        </div>

        {/* MCQ / Scenario options */}
        {hasMCQ && (
          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">Answer Options</label>
            <div className="space-y-2">
              {options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct-answer"
                      checked={correct === letter}
                      onChange={() => setCorrect(letter)}
                      className="text-teal focus:ring-teal flex-shrink-0"
                      aria-label={`Mark option ${letter} as correct`}
                    />
                    <span className="text-xs font-bold text-gray-500 w-5 flex-shrink-0">{letter}.</span>
                    <input
                      type="text"
                      value={opt.replace(/^[A-D]\.\s?/, '')}
                      onChange={e => updateOption(i, `${letter}. ${e.target.value}`)}
                      className="flex-1 rounded-lg border border-lgray-200 px-2.5 py-1.5 text-sm text-navy focus:outline-none focus:border-teal focus-visible:ring-2 focus-visible:ring-teal"
                      placeholder={`Option ${letter}`}
                    />
                  </div>
                );
              })}
              <p className="text-xs text-gray-400 pl-7">Select the radio button next to the correct answer.</p>
            </div>
          </div>
        )}

        {/* True/False */}
        {hasTF && (
          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">Correct Answer</label>
            <div className="flex gap-3">
              {['True', 'False'].map(val => (
                <label key={val} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${correct === val ? 'border-teal bg-teal/5' : 'border-lgray-200 hover:border-teal/40'}`}>
                  <input
                    type="radio"
                    name="tf-answer"
                    checked={correct === val}
                    onChange={() => setCorrect(val)}
                    className="text-teal focus:ring-teal"
                  />
                  <span className="text-sm font-medium text-navy">{val}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Fill in blank / Open-Ended */}
        {hasFill && (
          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">
              {item.type === 'fill-blank' ? 'Correct Answer' : 'Model Answer'}
            </label>
            <input
              type="text"
              value={correct}
              onChange={e => setCorrect(e.target.value)}
              className="w-full rounded-xl border border-lgray-200 px-3 py-2 text-sm text-navy focus:outline-none focus:border-teal focus-visible:ring-2 focus-visible:ring-teal"
            />
          </div>
        )}

        {/* Explanation */}
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5">Explanation <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea
            value={explain}
            onChange={e => setExplain(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-lgray-200 px-3 py-2 text-sm text-navy resize-none focus:outline-none focus:border-teal focus-visible:ring-2 focus-visible:ring-teal"
            placeholder="Explain why this answer is correct…"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Discard Changes</Button>
          <Button onClick={handleSave} disabled={!stem.trim()}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}
