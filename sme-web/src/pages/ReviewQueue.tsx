import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, RotateCcw, AlertCircle, Clock } from 'lucide-react';
import Badge from '../components/shared/Badge';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../components/shared/Toast';
import { QUESTIONS } from '../data/mockData';

const PENDING = QUESTIONS.filter(q => q.status === 'Pending Review' || q.status === 'In Review');

const CHECKLIST = [
  'Question is grammatically correct',
  'Question aligns to stated difficulty',
  'Answer options are unambiguous (for MCQ)',
  'Correct answer is marked accurately',
  'Question aligns to project scope',
];

export default function ReviewQueue() {
  const toast = useToast();
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);
  const [decision, setDecision] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [checklist, setChecklist] = useState({});
  const [queue, setQueue] = useState(PENDING);

  const current = queue[active];

  const stats = [
    { label: 'Total In Queue', value: queue.length },
    { label: 'Reviewed Today', value: 4 },
    { label: 'Approved This Week', value: 14 },
    { label: 'Avg Review Time', value: '1.4 hrs' },
  ];

  const submitDecision = () => {
    if (!decision) { toast('Please select a decision.', 'warning'); return; }
    if ((decision === 'revise' || decision === 'reject') && feedback.trim().length < 20) {
      toast('Feedback must be at least 20 characters.', 'warning'); return;
    }
    const labels = { approve: 'Approved', revise: 'Revision Required', reject: 'Rejected' };
    toast(`Question ${labels[decision]}!`, decision === 'approve' ? 'success' : 'info');
    setQueue(prev => prev.filter((_, i) => i !== active));
    setActive(prev => Math.max(0, Math.min(prev, queue.length - 2)));
    setDecision(null);
    setFeedback('');
    setChecklist({});
  };

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading review queue">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-lgray-100 shadow-sm px-5 py-4 space-y-2">
              <Skeleton variant="text" className="w-2/3 h-3" />
              <Skeleton variant="text" className="w-1/2 h-8" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1 space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="bg-white rounded-xl border border-lgray-100 p-4 space-y-2">
                <Skeleton variant="text" className="w-full h-4" />
                <Skeleton variant="text" className="w-2/3 h-3" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl border border-lgray-100 p-6 space-y-4">
            <Skeleton variant="text" className="w-full h-5" />
            <Skeleton variant="text" className="w-3/4 h-4" />
            <Skeleton variant="rect" className="w-full h-32 rounded-xl" />
            <Skeleton variant="rect" className="w-full h-24 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-lgray-100 shadow-sm px-5 py-4 stagger-in" style={{ animationDelay: `${i * 55}ms` }}>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <span className="section-idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              {s.label}
            </p>
            <p className="text-2xl font-bold text-navy mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm px-4 py-3 flex items-center gap-3 flex-wrap text-sm">
        {['Project', 'Format', 'Difficulty', 'Submitted By'].map(f => (
          <select key={f} className="border border-lgray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
            <option>{f}: All</option>
          </select>
        ))}
        <select className="border border-lgray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal ml-auto">
          <option>Sort: Oldest First</option>
          <option>Newest First</option>
          <option>Priority</option>
        </select>
      </div>

      {queue.length === 0 ? (
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-16 text-center text-gray-400">
          <CheckCircle2 size={40} className="mx-auto mb-3 text-green-400" />
          <p className="font-semibold text-navy">Review queue is empty!</p>
          <p className="text-sm mt-1">All questions have been reviewed.</p>
        </div>
      ) : (
        <div className="flex gap-5 min-h-[500px] flex-1">
          {/* Left: Queue list */}
          <div className="w-72 flex-shrink-0 bg-white rounded-2xl border border-lgray-100 border-t-[3px] border-t-teal shadow-sm overflow-y-auto">
            <div className="px-4 py-3 border-b border-lgray-100 flex items-center gap-2">
              <span className="section-idx" aria-hidden="true">01</span>
              <p className="text-sm font-semibold text-navy">{queue.length} in Queue</p>
            </div>
            <div className="divide-y divide-lgray-100">
              {queue.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setActive(i)}
                  className={`w-full text-left px-4 py-3 hover:bg-lgray/50 transition-colors ${i === active ? 'bg-teal-50 border-l-2 border-teal' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-mono text-gray-400">{q.id}</p>
                    <Badge text={q.difficulty} type="difficulty" size="xs" />
                  </div>
                  <p className="text-xs text-navy font-medium mt-1 line-clamp-2">{q.stem}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge text={q.format} type="format" size="xs" />
                    <span className="text-[11px] text-gray-400 flex items-center gap-1"><Clock size={9} /> 2 days</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Review panel */}
          <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-y-auto">
            {/* Question display */}
            <div className="bg-white rounded-2xl border border-lgray-100 border-t-[3px] border-t-blue-400 shadow-sm p-5 flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge text={current.format} type="format" />
                  <Badge text={current.difficulty} type="difficulty" />
                  <Badge text={current.status} />
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <button type="button" onClick={() => setActive(a => Math.max(0, a - 1))} disabled={active === 0} className="flex items-center gap-1 hover:text-navy disabled:opacity-30"><ChevronLeft size={14} /> Prev</button>
                  <span className="text-xs">Reviewing {active + 1} of {queue.length}</span>
                  <button type="button" onClick={() => setActive(a => Math.min(queue.length - 1, a + 1))} disabled={active === queue.length - 1} className="flex items-center gap-1 hover:text-navy disabled:opacity-30">Next <ChevronRight size={14} /></button>
                </div>
              </div>

              <p className="text-base font-semibold text-navy mb-4">{current.stem}</p>

              {current.options && (
                <ul className="space-y-2 mb-4">
                  {current.options.map((opt, i) => (
                    <li key={i} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border ${i === current.correct ? 'border-green-200 bg-green-50 text-green-700' : 'border-lgray-100 text-gray-600'}`}>
                      <span className="font-bold text-xs w-5">{String.fromCharCode(65 + i)}.</span> {opt}
                    </li>
                  ))}
                </ul>
              )}

              {current.rubric && <div className="bg-lgray rounded-xl p-3 text-xs text-gray-600 mb-4"><span className="font-semibold">Rubric:</span> {current.rubric}</div>}
              {current.explanation && <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700 mb-4"><span className="font-semibold">Explanation:</span> {current.explanation}</div>}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-gray-500 border-t border-lgray-100 pt-4">
                <div><span className="font-semibold">Project:</span> {current.project}</div>
                <div><span className="font-semibold">Bloom's:</span> {current.bloomsLevel}</div>
                <div><span className="font-semibold">Created by:</span> {current.createdBy}</div>
                <div><span className="font-semibold">Modified:</span> {current.lastModified}</div>
              </div>
            </div>

            {/* Decision panel */}
            <div className="bg-white rounded-2xl border border-lgray-100 border-t-[3px] border-t-purple-400 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="section-idx" aria-hidden="true">02</span>
                <h4 className="font-semibold text-navy text-sm">Decision</h4>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'approve', label: 'Approve', icon: CheckCircle2, color: decision === 'approve' ? 'bg-green-500 text-white border-green-500' : 'border-lgray-200 text-green-600 hover:border-green-300 hover:bg-green-50' },
                  { key: 'revise', label: 'Request Revision', icon: RotateCcw, color: decision === 'revise' ? 'bg-orange-500 text-white border-orange-500' : 'border-lgray-200 text-orange-600 hover:border-orange-300 hover:bg-orange-50' },
                  { key: 'reject', label: 'Reject', icon: XCircle, color: decision === 'reject' ? 'bg-red-500 text-white border-red-500' : 'border-lgray-200 text-red-600 hover:border-red-300 hover:bg-red-50' },
                ].map(({ key, label, icon: Icon, color }) => (
                  <button type="button" key={key} onClick={() => setDecision(key)} className={`flex flex-col items-center gap-1.5 border-2 rounded-xl py-3 px-2 text-xs font-semibold transition-all ${color}`}>
                    <Icon size={18} /> {label}
                  </button>
                ))}
              </div>

              {(decision === 'revise' || decision === 'reject') && (
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">
                    Feedback to SME <span className="text-red-400">*</span>
                    <span className="font-normal text-gray-400 ml-1">(min 20 chars)</span>
                  </label>
                  <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={3}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal/30 ${feedback.length > 0 && feedback.length < 20 ? 'border-red-300' : 'border-lgray-200 focus:border-teal'}`} />
                  {feedback.length > 0 && feedback.length < 20 && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} /> At least 20 characters required ({20 - feedback.length} more)</p>
                  )}
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-navy mb-2">Quality Checklist</p>
                <div className="space-y-1.5">
                  {CHECKLIST.map((item, i) => (
                    <label key={i} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-navy">
                      <input type="checkbox" checked={!!checklist[i]} onChange={event => setChecklist(prev => ({ ...prev, [i]: event.target.checked }))} className="accent-teal" />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <button type="button" onClick={submitDecision} className="w-full bg-teal text-white font-semibold py-2.5 rounded-xl hover:bg-teal-700 transition-colors text-sm">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
