import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Send, Save, X, MessageSquare, History, CheckCircle2 } from 'lucide-react';
import Badge from '../components/shared/Badge';
import { useToast } from '../components/shared/Toast';
import { QUESTIONS } from '../data/mockData';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const BLOOMS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
const LANGUAGES = ['English', 'French', 'Spanish', 'German'];
const STATUS_STEPS = ['Draft', 'Pending Review', 'In Review', 'Approved'];

const VERSIONS = [
  { version: 2, date: 'May 25, 09:14', by: 'Taylor Brown', summary: 'Edited question stem' },
  { version: 1, date: 'May 24, 15:30', by: 'Taylor Brown', summary: 'Initial creation' },
];

const COMMENTS = [
  { id: 'c1', author: 'Casey Wilson', role: 'RE', avatar: 'CW', time: '2 hours ago', text: 'Please ensure the answer options are more clearly differentiated.', resolved: false },
  { id: 'c2', author: 'Jordan Smith', role: 'PM', avatar: 'JS', time: '1 day ago', text: 'Good question overall. Just update the explanation.', resolved: true },
];

export default function QuestionEditor() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const q = QUESTIONS.find(x => x.id === questionId) || QUESTIONS[0];

  const [stem, setStem] = useState(q.stem || '');
  const [options, setOptions] = useState(q.options?.map((o, i) => ({ text: o, correct: i === q.correct })) || [
    { text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false },
  ]);
  const [difficulty, setDifficulty] = useState(q.difficulty || 'Medium');
  const [bloomsLevel, setBloomsLevel] = useState(q.bloomsLevel || 'Remember');
  const [tags, setTags] = useState(q.tags || ['nursing', 'cardiac']);
  const [tagInput, setTagInput] = useState('');
  const [explanation, setExplanation] = useState(q.explanation || '');
  const [status] = useState(q.status || 'Draft');
  const [versionOpen, setVersionOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(COMMENTS);
  const [audience, setAudience] = useState('Level 2 nursing students');
  const [timeEstimate, setTimeEstimate] = useState(90);

  const [formErrors, setFormErrors] = useState({});

  const validateForReview = () => {
    const e = {};
    if (stem.trim().length < 10) e.stem = 'Question stem must be at least 10 characters.';
    const isMCQCheck = ['MCQ', 'Multiple Choice (Single Answer)', 'Multiple Choice (Multiple Answer)'].includes(q.format);
    if (isMCQCheck && !options.some(o => o.correct)) e.options = 'Mark at least one option as correct.';
    if (isMCQCheck && options.some(o => !o.text.trim())) e.options = (e.options || '') + ' All options must have text.';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const isMCQ = ['MCQ', 'Multiple Choice (Single Answer)', 'Multiple Choice (Multiple Answer)'].includes(q.format);
  const isTF = q.format === 'True/False';
  const isOpen = q.format === 'Open-Ended';

  const addOption = () => {
    if (options.length < 8) setOptions([...options, { text: '', correct: false }]);
  };
  const removeOption = (index: number) => setOptions(options.filter((_, idx) => idx !== index));
  const setCorrect = (index: number) => setOptions(options.map((o, idx) => ({ ...o, correct: idx === index })));
  const updateOption = (index: number, text: string) => setOptions(options.map((o, idx) => idx === index ? { ...o, text } : o));

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const postComment = () => {
    if (!newComment.trim()) return;
    setComments([{ id: `c${Date.now()}`, author: 'Jordan Smith', role: 'PM', avatar: 'JS', time: 'just now', text: newComment, resolved: false }, ...comments]);
    setNewComment('');
    toast('Comment posted.', 'success');
  };

  const currentStep = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex flex-col h-full gap-0">
      <div className="flex gap-5 flex-1 min-h-0">
        {/* Left: Edit form */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
          <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-6 space-y-5">
            {/* Format indicator */}
            <div className="flex items-center gap-3">
              <Badge text={q.format} type="format" size="sm" />
              <button className="text-xs text-teal hover:text-teal-700 font-medium">Change Format</button>
            </div>

            {/* Question Stem */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Question Stem <span className="text-red-400">*</span></label>
              <textarea
                value={stem}
                onChange={e => { setStem(e.target.value.slice(0, 800)); setFormErrors(prev => ({ ...prev, stem: undefined })); }}
                rows={4}
                aria-invalid={!!formErrors.stem} aria-describedby={formErrors.stem ? 'err-stem' : undefined}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal ${formErrors.stem ? 'border-red-400 bg-red-50' : 'border-lgray-200'}`}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-400">{stem.length}/800</p>
                <button type="button" className="text-xs text-teal font-medium hover:text-teal-700">✨ Improve with AI</button>
              </div>
              {formErrors.stem && <p id="err-stem" role="alert" className="text-xs text-red-500 mt-1">{formErrors.stem}</p>}
            </div>

            {/* MCQ options */}
            {isMCQ && (
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Answer Options</label>
                <div className="space-y-2">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2 group">
                      <GripVertical size={14} className="text-gray-400 cursor-grab" />
                      <span className="text-xs font-bold text-gray-400 w-5">{String.fromCharCode(65 + i)}.</span>
                      <input
                        value={opt.text}
                        onChange={e => updateOption(i, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal ${opt.correct ? 'border-green-300 bg-green-50' : 'border-lgray-200'}`}
                      />
                      <input type="radio" name="correct" checked={opt.correct} onChange={() => setCorrect(i)} className="accent-green-500" title="Mark as correct" />
                      <button onClick={() => removeOption(i)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  ))}
                </div>
                {options.length < 8 && (
                  <button onClick={addOption} className="mt-2 flex items-center gap-1.5 text-xs text-teal hover:text-teal-700 font-medium">
                    <Plus size={13} /> Add Option
                  </button>
                )}
              </div>
            )}

            {/* True/False */}
            {isTF && (
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Correct Answer</label>
                <div className="flex gap-4">
                  {['True', 'False'].map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="tf" value={v} className="accent-teal" />
                      <span className="text-sm">{v}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Open-ended rubric */}
            {isOpen && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">Model Answer / Marking Rubric</label>
                  <textarea rows={3} defaultValue={q.rubric} className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">Acceptable Variations</label>
                  <textarea rows={2} className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
                </div>
              </div>
            )}

            {/* Explanation */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Answer Explanation <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea value={explanation} onChange={e => setExplanation(e.target.value)} rows={2} className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
            </div>
          </div>
        </div>

        {/* Right: Metadata + history + comments */}
        <div className="w-72 flex flex-col gap-4 overflow-y-auto">
          {/* Review status */}
          <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-navy">Review Status</span>
              <Badge text={status} />
            </div>
            <div className="flex items-center gap-0">
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 ${i <= currentStep ? 'bg-teal text-white' : 'bg-lgray-200 text-gray-400'}`}>
                    {i < currentStep ? <CheckCircle2 size={12} /> : i + 1}
                  </div>
                  {i < STATUS_STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < currentStep ? 'bg-teal' : 'bg-lgray-200'}`} />}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {STATUS_STEPS.map((s, i) => <span key={s} className={`text-[9px] ${i === currentStep ? 'text-teal font-semibold' : 'text-gray-400'}`}>{s}</span>)}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-4 space-y-3">
            <h4 className="text-sm font-semibold text-navy">Metadata</h4>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full border border-lgray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Bloom's Taxonomy Level</label>
              <select value={bloomsLevel} onChange={e => setBloomsLevel(e.target.value)} className="w-full border border-lgray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
                {BLOOMS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Topic / Subject Tags</label>
              <div className="flex flex-wrap gap-1 mb-1.5">
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 bg-teal-50 text-teal text-xs px-2 py-0.5 rounded-full">
                    {t}
                    <button onClick={() => setTags(tags.filter(x => x !== t))}><X size={10} /></button>
                  </span>
                ))}
              </div>
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Type and press Enter" className="w-full border border-lgray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Target Audience</label>
              <input value={audience} onChange={e => setAudience(e.target.value)} className="w-full border border-lgray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Est. Time to Answer (sec)</label>
              <input type="number" value={timeEstimate} onChange={e => setTimeEstimate(e.target.value)} className="w-full border border-lgray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Language</label>
              <select className="w-full border border-lgray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Version History */}
          <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm">
            <button onClick={() => setVersionOpen(o => !o)} className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-navy">
              <span className="flex items-center gap-2"><History size={14} /> Version History</span>
              {versionOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {versionOpen && (
              <div className="px-4 pb-4 space-y-2">
                {VERSIONS.map(v => (
                  <div key={v.version} className="border border-lgray-100 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-navy">v{v.version}</span>
                      <span className="text-[11px] text-gray-400">{v.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{v.summary}</p>
                    <p className="text-[11px] text-gray-400">by {v.by}</p>
                    <button className="text-[11px] text-teal font-medium mt-1 hover:text-teal-700">Restore</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm">
            <button onClick={() => setCommentsOpen(o => !o)} className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-navy">
              <span className="flex items-center gap-2"><MessageSquare size={14} /> Comments ({comments.filter(c => !c.resolved).length})</span>
              {commentsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {commentsOpen && (
              <div className="px-4 pb-4 space-y-3">
                {comments.map(c => (
                  <div key={c.id} className={`border rounded-xl p-3 ${c.resolved ? 'opacity-50 border-lgray-100' : 'border-lgray-200'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-navy text-white text-[10px] font-bold flex items-center justify-center">{c.avatar}</div>
                      <span className="text-xs font-semibold text-navy">{c.author}</span>
                      <Badge text={c.role} type="role" size="xs" />
                      <span className="text-[11px] text-gray-400 ml-auto">{c.time}</span>
                    </div>
                    <p className="text-xs text-gray-600">{c.text}</p>
                    {!c.resolved && (
                      <button onClick={() => setComments(prev => prev.map(x => x.id === c.id ? { ...x, resolved: true } : x))} className="text-[11px] text-teal font-medium mt-1 hover:text-teal-700">Resolve</button>
                    )}
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input value={newComment} onChange={event => setNewComment(event.target.value)} placeholder="Add a comment…" className="flex-1 border border-lgray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal" onKeyDown={event => event.key === 'Enter' && postComment()} />
                  <button onClick={postComment} className="p-1.5 bg-teal text-white rounded-lg hover:bg-teal-700"><Send size={13} /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="flex items-center justify-between bg-white border-t border-lgray-100 px-6 py-4 mt-4 rounded-2xl shadow-sm">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-navy flex items-center gap-1.5"><X size={15} /> Cancel</button>
        <div className="flex items-center gap-3">
          <button onClick={() => toast('Draft saved!', 'success')} className="flex items-center gap-1.5 px-4 py-2 border border-lgray-200 rounded-xl text-sm font-medium hover:bg-lgray transition-colors">
            <Save size={15} /> Save Draft
          </button>
          {['Draft', 'Revision Required'].includes(status) && (
            <button
              type="button"
              onClick={() => { if (validateForReview()) toast('Submitted for review!', 'success'); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1"
            >
              <Send size={15} aria-hidden="true" /> Submit for Review
            </button>
          )}
          {Object.keys(formErrors).length > 0 && (
            <p role="alert" className="text-xs text-red-500">{Object.values(formErrors)[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
}
