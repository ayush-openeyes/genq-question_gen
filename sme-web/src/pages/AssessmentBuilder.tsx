import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, X, GripVertical, Eye, ChevronDown, ChevronUp, Search } from 'lucide-react';
import Badge from '../components/shared/Badge';
import { useToast } from '../components/shared/Toast';
import { QUESTIONS, PROJECTS } from '../data/mockData';

const APPROVED_QS = QUESTIONS.filter(q => q.status === 'Approved');

const initSections = [{ id: 'sec1', title: 'Section 1', questions: [], shuffle: false, timeLimit: null, instructions: '' }];

export default function AssessmentBuilder() {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState(initSections);
  const [sourceSearch, setSourceSearch] = useState('');
  const [assessmentType, setAssessmentType] = useState('Exam');
  const [totalTime, setTotalTime] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [randomize, setRandomize] = useState(false);
  const [showAnswers, setShowAnswers] = useState('immediately');
  const [allowRetakes, setAllowRetakes] = useState(false);
  const [pointsPerQ, setPointsPerQ] = useState(1);
  const [associatedProject, setAssociatedProject] = useState('');
  const [expandedSections, setExpandedSections] = useState({ sec1: true });

  const filteredSource = APPROVED_QS.filter(q =>
    !sourceSearch || q.stem.toLowerCase().includes(sourceSearch.toLowerCase())
  );

  const allCanvasQIds = sections.flatMap(s => s.questions.map(q => q.id));

  const addToSection = (q, secId) => {
    if (allCanvasQIds.includes(q.id)) return;
    setSections(prev => prev.map(s => s.id === secId ? { ...s, questions: [...s.questions, q] } : s));
  };

  const removeFromSection = (qId, secId) => {
    setSections(prev => prev.map(s => s.id === secId ? { ...s, questions: s.questions.filter(q => q.id !== qId) } : s));
  };

  const addSection = () => {
    const id = `sec${Date.now()}`;
    setSections(prev => [...prev, { id, title: `Section ${prev.length + 1}`, questions: [], shuffle: false, timeLimit: null, instructions: '' }]);
    setExpandedSections(prev => ({ ...prev, [id]: true }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) {
      setSections(prev => prev.map(s => {
        if (s.id !== source.droppableId) return s;
        const qs = [...s.questions];
        const [moved] = qs.splice(source.index, 1);
        qs.splice(destination.index, 0, moved);
        return { ...s, questions: qs };
      }));
    }
  };

  const [titleError, setTitleError] = useState('');

  const handlePublish = () => {
    if (!title.trim()) { setTitleError('Assessment title is required before publishing.'); return; }
    setTitleError('');
    toast('Published!', 'success');
  };

  const totalQs = sections.reduce((a, s) => a + s.questions.length, 0);
  const totalPoints = totalQs * pointsPerQ;
  const diffCounts = sections.flatMap(s => s.questions).reduce((acc, q) => ({ ...acc, [q.difficulty]: (acc[q.difficulty] || 0) + 1 }), {});

  return (
    <div className="flex gap-5 min-h-[600px] flex-1" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Left: Source panel */}
      <div className="w-64 flex-shrink-0 bg-white rounded-2xl border border-lgray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-lgray-100">
          <h3 className="font-semibold text-sm text-navy mb-2">Add Questions</h3>
          <div className="flex items-center gap-2 border border-lgray-200 rounded-xl px-3 py-2">
            <Search size={13} className="text-gray-400 flex-shrink-0" />
            <input value={sourceSearch} onChange={e => setSourceSearch(e.target.value)} placeholder="Search approved…" className="flex-1 text-xs outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-lgray-100">
          {filteredSource.map(q => {
            const added = allCanvasQIds.includes(q.id);
            return (
              <div key={q.id} className={`px-4 py-3 ${added ? 'opacity-40' : 'hover:bg-lgray/50'}`}>
                <div className="flex items-start justify-between gap-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-navy line-clamp-2">{q.stem}</p>
                    <div className="flex gap-1 mt-1.5"><Badge text={q.format} type="format" size="xs" /><Badge text={q.difficulty} type="difficulty" size="xs" /></div>
                  </div>
                  {!added ? (
                    <button type="button" onClick={() => addToSection(q, sections[0].id)} className="ml-1 flex-shrink-0 w-6 h-6 bg-teal text-white rounded-full flex items-center justify-center hover:bg-teal-700 text-sm font-bold">+</button>
                  ) : (
                    <div className="ml-1 flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center: Canvas */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto min-w-0">
        {/* Title */}
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
          <input
            value={title}
            onChange={e => { setTitle(e.target.value); if (e.target.value.trim()) setTitleError(''); }}
            placeholder="Assessment Title *"
            aria-label="Assessment title"
            aria-invalid={!!titleError}
            aria-describedby={titleError ? 'err-title' : undefined}
            className={`w-full text-xl font-bold text-navy outline-none border-b pb-2 mb-1 placeholder-gray-300 focus-visible:ring-0 ${titleError ? 'border-red-400 bg-red-50 rounded' : 'border-lgray-100'}`}
          />
          {titleError && <p id="err-title" role="alert" className="text-xs text-red-500 mb-2">{titleError}</p>}
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description (optional)" className="w-full text-sm text-gray-500 outline-none placeholder-gray-300" />
          <div className="flex gap-4 mt-3 text-xs text-gray-400">
            <span>{totalQs} questions</span>
            <span>{totalPoints} total points</span>
            {totalTime && <span>{totalTime} min time limit</span>}
            <span>
              {Object.entries(diffCounts).map(([d, c]) => `${d}: ${c}`).join(' · ')}
            </span>
          </div>
        </div>

        {/* Sections */}
        <DragDropContext onDragEnd={onDragEnd}>
          {sections.map((section, si) => (
            <div key={section.id} className="bg-white rounded-2xl border border-lgray-100 shadow-sm">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-lgray-100">
                <GripVertical size={16} className="text-gray-400 cursor-grab" />
                <input value={section.title} onChange={event => setSections(prev => prev.map(s => s.id === section.id ? { ...s, title: event.target.value } : s))}
                  className="flex-1 text-sm font-semibold text-navy outline-none" />
                <span className="text-xs text-gray-400">{section.questions.length} questions</span>
                <button type="button" onClick={() => setExpandedSections(prev => ({ ...prev, [section.id]: !prev[section.id] }))}>
                  {expandedSections[section.id] ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                </button>
                {sections.length > 1 && (
                  <button type="button" onClick={() => setSections(prev => prev.filter(s => s.id !== section.id))} className="text-gray-400 hover:text-red-400"><X size={14} /></button>
                )}
              </div>
              {expandedSections[section.id] && (
                <Droppable droppableId={section.id}>
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}
                      className={`p-4 min-h-[80px] transition-colors ${snapshot.isDraggingOver ? 'bg-teal-50/30' : ''}`}>
                      {section.questions.length === 0 ? (
                        <div className="flex items-center justify-center h-16 border-2 border-dashed border-lgray-200 rounded-xl text-xs text-gray-400">
                          Drag questions here or click + in the left panel
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {section.questions.map((q, qi) => (
                            <Draggable key={q.id} draggableId={`${section.id}-${q.id}`} index={qi}>
                              {(prov, snap) => (
                                <div ref={prov.innerRef} {...prov.draggableProps}
                                  className={`flex items-center gap-3 border border-lgray-100 rounded-xl px-4 py-3 bg-white ${snap.isDragging ? 'shadow-lg' : ''}`}>
                                  <div {...prov.dragHandleProps}><GripVertical size={14} className="text-gray-400 cursor-grab" /></div>
                                  <span className="text-xs text-gray-400 font-bold w-6">Q{si > 0 ? sections.slice(0, si).reduce((a, s) => a + s.questions.length, 0) + qi + 1 : qi + 1}</span>
                                  <p className="flex-1 text-xs text-navy line-clamp-1">{q.stem}</p>
                                  <div className="flex gap-1.5"><Badge text={q.format} type="format" size="xs" /><Badge text={q.difficulty} type="difficulty" size="xs" /></div>
                                  <button type="button" onClick={() => removeFromSection(q.id, section.id)} className="text-gray-400 hover:text-red-400 flex-shrink-0"><X size={13} /></button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          ))}
        </DragDropContext>

        <button type="button" onClick={addSection} className="flex items-center gap-2 text-sm text-teal font-medium hover:text-teal-700 py-2">
          <Plus size={15} /> Add Section
        </button>
      </div>

      {/* Right: Settings */}
      <div className="w-64 flex-shrink-0 bg-white rounded-2xl border border-lgray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-lgray-100">
          <h3 className="font-semibold text-sm text-navy">Settings</h3>
          <div className="flex gap-1.5">
            <button type="button" onClick={() => toast('Saved!', 'success')} className="px-2.5 py-1 border border-lgray-200 rounded-lg text-xs hover:bg-lgray">Save</button>
            <button type="button" onClick={handlePublish} className="px-2.5 py-1 bg-teal text-white rounded-lg text-xs hover:bg-teal-700 focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1">Publish</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">General</h4>
            <div className="space-y-2.5">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Assessment Type</label>
                <select value={assessmentType} onChange={e => setAssessmentType(e.target.value)} className="w-full border border-lgray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
                  {['Exam','Survey','Certification','Practice Test','Questionnaire'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Total Time Limit (min)</label>
                <input type="number" value={totalTime} onChange={e => setTotalTime(e.target.value)} placeholder="No limit" className="w-full border border-lgray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal" />
              </div>
              {['Exam','Certification'].includes(assessmentType) && (
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Passing Score (%)</label>
                  <input type="number" value={passingScore} onChange={e => setPassingScore(e.target.value)} className="w-full border border-lgray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal" />
                </div>
              )}
              <label className="flex items-center justify-between text-xs text-gray-600 cursor-pointer">
                Randomize Question Order
                <input type="checkbox" checked={randomize} onChange={e => setRandomize(e.target.checked)} className="accent-teal" />
              </label>
              <label className="flex items-center justify-between text-xs text-gray-600 cursor-pointer">
                Allow Retakes
                <input type="checkbox" checked={allowRetakes} onChange={e => setAllowRetakes(e.target.checked)} className="accent-teal" />
              </label>
            </div>
          </div>

          {['Exam','Certification'].includes(assessmentType) && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Scoring</h4>
              <div className="space-y-2.5">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Points Per Question</label>
                  <input type="number" value={pointsPerQ} onChange={e => setPointsPerQ(+e.target.value)} className="w-full border border-lgray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal" />
                </div>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Metadata</h4>
            <div className="space-y-2.5">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Associated Project</label>
                <select value={associatedProject} onChange={e => setAssociatedProject(e.target.value)} className="w-full border border-lgray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
                  <option value="">Select project…</option>
                  {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-lgray rounded-xl p-3 space-y-1.5">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Summary</h4>
            {[
              ['Total Questions', totalQs],
              ['Total Points', totalPoints],
              ['Sections', sections.length],
              ['Easy / Medium / Hard', `${diffCounts.Easy||0} / ${diffCounts.Medium||0} / ${diffCounts.Hard||0}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs"><span className="text-gray-500">{k}</span><span className="font-semibold text-navy">{v}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
