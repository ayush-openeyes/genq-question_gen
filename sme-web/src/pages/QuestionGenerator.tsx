import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle, Bookmark, CheckCircle2, ChevronDown, ChevronUp, Copy,
  Loader2, Pencil, Trash2, Wand2, X,
} from 'lucide-react';
import Badge from '../components/shared/Badge';
import { useToast } from '../components/shared/Toast';
import { PROJECTS } from '../data/mockData';
import { GeneratedQuestion, useHistorySessions } from '../context/HistoryContext';

const FORMATS = [
  'Multiple Choice (Single Answer)', 'Multiple Choice (Multiple Answer)', 'True / False',
  'Open-Ended / Short Answer', 'Rating Scale', 'Likert Scale', 'Fill in the Blank', 'Scenario-Based / Case Study',
];

const BLOOMS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
const TONES = ['Formal Academic', 'Professional', 'Plain Language', 'Technical'];

type ValidationErrors = {
  project?: string;
  topic?: string;
  formats?: string;
};

const SESSION_HISTORY = [
  { id: 's1', timestamp: 'May 25, 10:42 AM', project: 'Nursing Certification Exam 2025', count: 10 },
  { id: 's2', timestamp: 'May 24, 3:15 PM', project: 'HR Onboarding Assessment', count: 12 },
  { id: 's3', timestamp: 'May 23, 9:00 AM', project: 'Technical Interview Bank', count: 8 },
];

function topicLabel(topic: string) {
  return topic.trim() || 'the selected subject';
}

function buildGeneratedQuestion(format: string, index: number, difficulty: string, topic: string): GeneratedQuestion {
  const sequence = index + 1;
  const subject = topicLabel(topic);
  const base = {
    id: `${format}-${sequence}`.replace(/\W+/g, '-').toLowerCase(),
    format,
    difficulty,
  };

  if (format === 'Multiple Choice (Single Answer)') {
    return {
      ...base,
      stem: `In ${subject}, which response best demonstrates accurate understanding of the core concept in item ${sequence}?`,
      options: [
        `Identify the relevant principle before applying it`,
        `Choose the most familiar answer without checking context`,
        `Ignore the stated conditions and use a general rule`,
        `Rely only on memorized wording from a previous example`,
      ],
      correct: sequence % 4,
    };
  }

  if (format === 'Multiple Choice (Multiple Answer)') {
    return {
      ...base,
      stem: `In ${subject}, which TWO actions would best support a complete and defensible answer for item ${sequence}?`,
      options: [
        `Connect the answer to evidence from the prompt`,
        `Check whether exceptions or constraints apply`,
        `Select every answer that uses technical vocabulary`,
        `Skip reasoning when the answer appears obvious`,
      ],
      correct: [0, 1],
    };
  }

  if (format === 'True / False') {
    return {
      ...base,
      stem: `In ${subject}, a correct answer should account for the conditions stated in the question, not only the keyword that appears most familiar.`,
      correct: sequence % 2 === 0 ? 'True' : 'False',
    };
  }

  if (format === 'Fill in the Blank') {
    return {
      ...base,
      stem: `In ${subject}, the missing term in this applied statement is _____.`,
      correct: sequence % 2 === 0 ? 'context' : 'principle',
    };
  }

  return {
    ...base,
    stem: `For ${subject}, respond to item ${sequence} using the requested format and include the key reasoning behind the answer.`,
    rubric: 'Award credit for accuracy, relevance, and clear reasoning.',
  };
}

function toHistoryTitle(topic: string, formats: string[]) {
  const normalizedTopic = topic.toLowerCase();
  const hasMcq = formats.some(format => format.includes('Multiple Choice'));
  const hasFillBlank = formats.includes('Fill in the Blank');
  const hasTrueFalse = formats.includes('True / False');

  if (normalizedTopic.includes('usa') || normalizedTopic.includes('law')) return 'usa_law_mock.history';
  if (normalizedTopic.includes('nursing') && hasMcq) return 'nursing_mcq_practice.history';
  if (normalizedTopic.includes('cardiac') && hasFillBlank) return 'cardiac_fill_blanks.history';

  const topicSlug = topic
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join('_') || 'generated';

  const formatSlug = hasMcq
    ? 'mcq'
    : hasFillBlank
      ? 'fill_blanks'
      : hasTrueFalse
        ? 'true_false'
        : 'questions';

  return `${topicSlug}_${formatSlug}.history`;
}

export default function QuestionGenerator() {
  const toast = useToast();
  const { activeHistory, resetVersion, addHistorySession } = useHistorySessions();
  const [project, setProject] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [questionDistribution, setQuestionDistribution] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(10);
  const [difficulty, setDifficulty] = useState(1);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedQuestion[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedBlooms, setSelectedBlooms] = useState<string[]>([]);
  const [avoidTopics, setAvoidTopics] = useState('');
  const [tone, setTone] = useState('Professional');
  const [answerKey, setAnswerKey] = useState(true);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const difficultyLabels = ['Easy', 'Medium', 'Hard', 'Mixed'];
  const distributionTotal = selectedFormats.reduce((total, format) => total + (questionDistribution[format] ?? 0), 0);
  const distributionDiff = quantity - distributionTotal;
  const isDistributionComplete = selectedFormats.length > 0 && distributionDiff === 0;
  const distributionState = distributionDiff === 0 ? 'complete' : distributionDiff > 0 ? 'incomplete' : 'exceeded';
  const distributionMessage = distributionDiff === 0
    ? 'Distribution complete'
    : distributionDiff > 0
      ? `Add ${distributionDiff} more question${distributionDiff === 1 ? '' : 's'}`
      : `Remove ${Math.abs(distributionDiff)} question${Math.abs(distributionDiff) === 1 ? '' : 's'}`;

  const groupedGenerated = useMemo(() => {
    return generated.reduce<Record<string, GeneratedQuestion[]>>((groups, question) => {
      groups[question.format] = [...(groups[question.format] ?? []), question];
      return groups;
    }, {});
  }, [generated]);

  const resetGeneratorForm = useCallback(() => {
    setProject('');
    setTopic('');
    setSelectedFormats([]);
    setQuestionDistribution({});
    setQuantity(10);
    setDifficulty(1);
    setAdvancedOpen(false);
    setGenerating(false);
    setGenerated([]);
    setHistoryOpen(false);
    setSelectedBlooms([]);
    setAvoidTopics('');
    setTone('Professional');
    setAnswerKey(true);
    setErrors({});
  }, []);

  useEffect(() => {
    resetGeneratorForm();
  }, [resetGeneratorForm, resetVersion]);

  useEffect(() => {
    if (!activeHistory) {
      resetGeneratorForm();
      return;
    }

    const settings = activeHistory.settings;
    if (settings) {
      setProject(settings.project);
      setTopic(settings.topic);
      setSelectedFormats(settings.formats);
      setQuestionDistribution(settings.distribution);
      setQuantity(settings.quantity);
      setDifficulty(settings.difficulty);
    }

    setErrors({});
    setGenerated([]);
    setGenerating(true);

    const timer = window.setTimeout(() => {
      setGenerated(activeHistory.questions);
      setGenerating(false);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [activeHistory, resetGeneratorForm]);

  const toggleFormat = (format: string) => {
    setSelectedFormats(prev => {
      if (prev.includes(format)) {
        setQuestionDistribution(current => {
          const next = { ...current };
          delete next[format];
          return next;
        });
        return prev.filter(x => x !== format);
      }

      setQuestionDistribution(current => {
        const used = prev.reduce((total, selectedFormat) => total + (current[selectedFormat] ?? 0), 0);
        return { ...current, [format]: Math.max(0, quantity - used) };
      });
      return [...prev, format];
    });
  };

  const removeFormat = (format: string) => {
    setSelectedFormats(prev => prev.filter(x => x !== format));
    setQuestionDistribution(current => {
      const next = { ...current };
      delete next[format];
      return next;
    });
  };

  const updateDistributionCount = (format: string, value: string) => {
    const sanitized = value.replace(/\D/g, '');
    setQuestionDistribution(current => ({
      ...current,
      [format]: sanitized === '' ? 0 : Number(sanitized),
    }));
  };

  const validate = () => {
    const nextErrors: ValidationErrors = {};
    if (!project) nextErrors.project = 'Please select a project.';
    if (!topic.trim()) nextErrors.topic = 'Topic is required.';
    if (selectedFormats.length === 0) nextErrors.formats = 'Select at least one question format.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const canGenerate = Boolean(project && topic.trim().length > 0 && selectedFormats.length > 0 && isDistributionComplete);

  const handleGenerate = () => {
    if (!validate() || !isDistributionComplete) return;

    setGenerating(true);
    setGenerated([]);

    const nextQuestions = selectedFormats.flatMap(format => {
      const count = questionDistribution[format] ?? 0;
      return Array.from({ length: count }, (_, index) => buildGeneratedQuestion(format, index, difficultyLabels[difficulty], topic));
    });

    window.setTimeout(() => {
      setGenerated(nextQuestions);
      setGenerating(false);
      addHistorySession(toHistoryTitle(topic, selectedFormats), nextQuestions, {
        project,
        topic,
        formats: selectedFormats,
        distribution: questionDistribution,
        quantity,
        difficulty,
      });
      toast(`${nextQuestions.length} questions generated successfully.`, 'success');
    }, 700);
  };

  const discard = (id: string) => {
    setGenerated(prev => prev.filter(q => q.id !== id));
    toast('Question removed.', 'info');
  };

  const saveAll = () => {
    toast(`${generated.length} questions saved to Question Bank as Draft.`, 'success');
  };

  return (
    <div className="flex flex-col gap-0 h-full">
      <div className="flex gap-5 flex-1 min-h-0">
        <div className="w-2/5 flex flex-col gap-4 overflow-y-auto pr-1">
          <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">1. Associate with Project <span className="text-red-400">*</span></label>
              <select value={project} onChange={event => { setProject(event.target.value); setErrors(prev => ({ ...prev, project: undefined })); }}
                aria-invalid={!!errors.project} aria-describedby={errors.project ? 'err-project' : undefined}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal ${errors.project ? 'border-red-400 bg-red-50' : 'border-lgray-200'}`}>
                <option value="">Select a project...</option>
                {PROJECTS.filter(p => p.status === 'Active' || p.status === 'In Review').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.project && <p id="err-project" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.project}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">2. Topic / Subject Area <span className="text-red-400">*</span></label>
              <textarea
                value={topic}
                onChange={event => { setTopic(event.target.value.slice(0, 500)); setErrors(prev => ({ ...prev, topic: undefined })); }}
                placeholder="e.g. Cardiac physiology for a Level 2 nursing certification exam"
                rows={3}
                aria-invalid={!!errors.topic} aria-describedby={errors.topic ? 'err-topic' : undefined}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal ${errors.topic ? 'border-red-400 bg-red-50' : 'border-lgray-200'}`}
              />
              <p className="text-xs text-gray-400 text-right mt-1">{topic.length}/500</p>
              {errors.topic && <p id="err-topic" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.topic}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">3. Question Format(s) <span className="text-red-400">*</span></label>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Question formats">
                {FORMATS.map(format => (
                  <button type="button" key={format} onClick={() => { toggleFormat(format); setErrors(prev => ({ ...prev, formats: undefined })); }}
                    aria-pressed={selectedFormats.includes(format)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${selectedFormats.includes(format) ? 'bg-teal text-white border-teal shadow-sm' : errors.formats ? 'bg-red-50 border-red-300 text-gray-600 hover:border-red-400' : 'bg-white border-lgray-200 text-gray-600 hover:border-teal/50 hover:text-teal'}`}>
                    {format}
                  </button>
                ))}
              </div>
              {errors.formats && <p role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.formats}</p>}
            </div>

            <div className={`rounded-xl border p-3 transition-all duration-300 ${
              distributionState === 'complete'
                ? 'border-green-200 bg-green-50/60'
                : distributionState === 'exceeded'
                  ? 'border-red-200 bg-red-50/60'
                  : 'border-cyan-200 bg-cyan-50/60'
            }`}>
              <div className="flex items-center justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-navy">Question Distribution</h3>
                  <p className="text-[11px] text-gray-500">Assign counts for each selected format.</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">Assigned</p>
                  <p className="text-sm font-bold text-navy">{distributionTotal}/{quantity}</p>
                </div>
              </div>

              {selectedFormats.length > 0 ? (
                <div className="space-y-2">
                  {selectedFormats.map(format => (
                    <div
                      key={format}
                      className="fade-in flex items-center gap-2 rounded-lg border border-white/80 bg-white px-3 py-2 shadow-sm transition-all duration-200 hover:border-cyan-200"
                    >
                      <span className="min-w-0 flex-1 truncate text-xs font-medium text-navy">{format}</span>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        inputMode="numeric"
                        value={questionDistribution[format] ?? 0}
                        onChange={event => updateDistributionCount(format, event.target.value)}
                        onKeyDown={event => {
                          if (['-', '+', '.', 'e', 'E'].includes(event.key)) event.preventDefault();
                        }}
                        onPaste={event => {
                          if (!/^\d+$/.test(event.clipboardData.getData('text'))) event.preventDefault();
                        }}
                        aria-label={`${format} question count`}
                        className="h-8 w-16 rounded-lg border border-cyan-200 bg-cyan-50/40 px-2 text-center text-sm font-semibold text-navy outline-none transition-all focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/20"
                      />
                      <button
                        type="button"
                        onClick={() => removeFormat(format)}
                        aria-label={`Remove ${format}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:ring-2 focus-visible:ring-teal"
                      >
                        <X size={14} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-cyan-200 bg-white/60 px-3 py-3 text-xs text-gray-500">
                  Select one or more question formats to assign counts.
                </div>
              )}

              <div className={`mt-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-300 ${
                distributionState === 'complete'
                  ? 'bg-green-100 text-green-700'
                  : distributionState === 'exceeded'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-orange-100 text-orange-700'
              }`}>
                {distributionMessage}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">4. Quantity</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setQuantity(current => Math.max(1, current - 1))} className="w-8 h-8 border border-lgray-200 rounded-lg text-gray-600 hover:bg-lgray flex items-center justify-center font-bold">-</button>
                <span className="text-2xl font-bold text-navy w-10 text-center tabular-nums">{quantity}</span>
                <button type="button" onClick={() => setQuantity(current => Math.min(50, current + 1))} className="w-8 h-8 border border-lgray-200 rounded-lg text-gray-600 hover:bg-lgray flex items-center justify-center font-bold">+</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy mb-2">5. Difficulty Level</label>
              <input type="range" min={0} max={3} value={difficulty} onChange={event => setDifficulty(Number(event.target.value))} className="w-full accent-teal" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                {difficultyLabels.map((label, index) => (
                  <span key={label} className={index === difficulty ? 'text-teal font-semibold' : ''}>{label}</span>
                ))}
              </div>
            </div>

            <div>
              <button type="button" onClick={() => setAdvancedOpen(open => !open)} className="flex items-center justify-between w-full text-sm font-semibold text-navy py-1">
                <span>6. Advanced Options</span>
                {advancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {advancedOpen && (
                <div className="mt-3 space-y-3 border-t border-lgray-100 pt-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Cognitive Level (Bloom's)</label>
                    <div className="flex flex-wrap gap-1.5">
                      {BLOOMS.map(bloom => (
                        <button type="button" key={bloom} onClick={() => setSelectedBlooms(prev => prev.includes(bloom) ? prev.filter(x => x !== bloom) : [...prev, bloom])}
                          className={`px-2.5 py-1 rounded-full text-xs border ${selectedBlooms.includes(bloom) ? 'bg-navy text-white border-navy' : 'border-lgray-200 text-gray-500 hover:border-navy/30'}`}>{bloom}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Language/Tone</label>
                    <select value={tone} onChange={event => setTone(event.target.value)} className="w-full border border-lgray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
                      {TONES.map(toneOption => <option key={toneOption}>{toneOption}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Avoid Topics</label>
                    <input value={avoidTopics} onChange={event => setAvoidTopics(event.target.value)} placeholder="e.g. surgery, pediatrics" className="w-full border border-lgray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal" />
                  </div>
                  <label className="flex items-center justify-between text-xs font-semibold text-gray-500">
                    Answer Key Generation
                    <input type="checkbox" checked={answerKey} onChange={event => setAnswerKey(event.target.checked)} className="accent-teal" />
                  </label>
                </div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!canGenerate || generating}
              title={!canGenerate ? 'Complete the required fields and match the distribution total to Quantity before generating.' : ''}
              className="w-full bg-teal hover:bg-teal-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl py-3 transition-all flex items-center justify-center gap-2 text-sm shadow-sm disabled:shadow-none"
            >
              {generating ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><Wand2 size={16} /> Generate Questions</>}
            </button>
            {!canGenerate && <p className="text-xs text-gray-400 text-center -mt-2">Select a project, topic, format, and complete the question distribution.</p>}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-lgray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-lgray-100">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-navy">Generated Questions</h3>
              {generated.length > 0 && <span className="bg-teal/10 text-teal text-xs font-bold px-2.5 py-1 rounded-full">{generated.length} questions</span>}
            </div>
            {generated.length > 0 && (
              <div className="flex items-center gap-2">
                <button type="button" onClick={saveAll} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors">
                  <Bookmark size={13} /> Save All to Bank
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-lgray-200 rounded-lg text-xs font-medium hover:bg-lgray transition-colors">
                  Export
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {generated.length === 0 && !generating ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-16">
                <Wand2 size={40} className="mb-3 opacity-20" />
                <p className="text-sm">Configure your parameters on the left and click Generate to create questions.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {Object.entries(groupedGenerated).map(([format, questions]) => (
                  <section key={format} className="fade-in rounded-xl border border-lgray-100 bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between gap-3 border-b border-lgray-100 bg-cyan-50/60 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <Badge text={format} type="format" />
                        <h4 className="truncate text-sm font-semibold text-navy">{format}</h4>
                      </div>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-teal shadow-sm">{questions.length} questions</span>
                    </div>

                    <div className="divide-y divide-lgray-100">
                      {questions.map((question, index) => (
                        <div key={question.id} className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-gray-400">Q{index + 1}</span>
                              <Badge text={question.difficulty} type="difficulty" />
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button type="button" onClick={() => { void navigator.clipboard.writeText(question.stem); toast('Copied!', 'success'); }} className="p-1.5 rounded hover:bg-lgray text-gray-400 hover:text-navy"><Copy size={13} /></button>
                              <button type="button" onClick={() => toast('Saved to bank!', 'success')} className="p-1.5 rounded hover:bg-lgray text-gray-400 hover:text-navy"><Bookmark size={13} /></button>
                              <button type="button" onClick={() => toast('Edit mode not wired to mock data', 'info')} className="p-1.5 rounded hover:bg-lgray text-gray-400 hover:text-navy"><Pencil size={13} /></button>
                              <button type="button" onClick={() => discard(question.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                            </div>
                          </div>
                          <p className="text-sm text-navy mt-2 font-medium">{question.stem}</p>
                          {question.options && (
                            <ul className="mt-2 space-y-1">
                              {question.options.map((option, optionIndex) => (
                                <li key={option} className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${answerKey && (Array.isArray(question.correct) ? question.correct.includes(optionIndex) : optionIndex === question.correct) ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600'}`}>
                                  <span className="font-bold text-xs w-5">{String.fromCharCode(65 + optionIndex)}.</span>
                                  {option}
                                  {answerKey && (Array.isArray(question.correct) ? question.correct.includes(optionIndex) : optionIndex === question.correct) && <CheckCircle2 size={13} className="ml-auto text-green-600" />}
                                </li>
                              ))}
                            </ul>
                          )}
                          {question.rubric && <div className="mt-2 bg-lgray rounded-lg p-3 text-xs text-gray-600"><span className="font-semibold">Rubric:</span> {question.rubric}</div>}
                          {(question.format === 'True / False' || question.format === 'Fill in the Blank') && (
                            <div className={`mt-2 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${answerKey ? 'bg-green-50 text-green-700' : 'bg-lgray text-gray-500'}`}>
                              {answerKey && <CheckCircle2 size={12} />} Correct: {answerKey ? question.correct : 'Hidden'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
                {generating && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
                    <Loader2 size={16} className="animate-spin text-teal" /> Generating questions...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-xl border border-lgray-100 shadow-sm">
        <button type="button" onClick={() => setHistoryOpen(open => !open)} className="flex items-center justify-between w-full px-5 py-3 text-sm font-medium text-gray-500 hover:text-navy">
          <span>Recent Sessions</span>
          {historyOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {historyOpen && (
          <div className="flex gap-4 px-5 pb-4 overflow-x-auto">
            {SESSION_HISTORY.map(session => (
              <button key={session.id} className="flex-shrink-0 border border-lgray-100 rounded-xl px-4 py-3 text-left hover:border-teal/40 transition-all">
                <p className="text-xs font-semibold text-navy">{session.project}</p>
                <p className="text-xs text-gray-400 mt-0.5">{session.timestamp} - {session.count} questions</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
