import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, LayoutGrid, List, AlignJustify, Plus, Eye, Pencil, Copy, Archive, X, ChevronDown, ChevronUp } from 'lucide-react';
import Badge from '../components/shared/Badge';
import Drawer from '../components/shared/Drawer';
import { SkeletonRow } from '../components/ui/Skeleton';
import { QUESTIONS, PROJECTS } from '../data/mockData';
import { useToast } from '../components/shared/Toast';

const FILTER_GROUPS = [
  { label: 'Status', key: 'status', options: ['Draft', 'Pending Review', 'In Review', 'Approved', 'Rejected', 'Revision Required', 'Archived'] },
  { label: 'Format', key: 'format', options: ['MCQ', 'True/False', 'Open-Ended', 'Rating Scale', 'Likert Scale', 'Fill in Blank', 'Scenario-Based'] },
  { label: 'Difficulty', key: 'difficulty', options: ['Easy', 'Medium', 'Hard'] },
  { label: "Bloom's Level", key: 'bloomsLevel', options: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'] },
];

export default function QuestionBank() {
  const navigate = useNavigate();
  const toast = useToast();
  const [view, setView] = useState('table');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Newest');
  const [filters, setFilters] = useState({});
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({ Status: true, Format: true, Difficulty: true });
  const [selected, setSelected] = useState([]);
  const [previewQ, setPreviewQ] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const toggleFilter = (key: string, val: string) => {
    setFilters(prev => {
      const cur = prev[key] || [];
      return { ...prev, [key]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] };
    });
    setPage(1);
  };

  const clearFilters = () => { setFilters({}); setSearch(''); };
  const activeFilterCount = Object.values(filters).flat().length;

  const filtered = useMemo(() => {
    let data = [...QUESTIONS];
    if (search) data = data.filter(q => q.stem.toLowerCase().includes(search.toLowerCase()));
    Object.entries(filters).forEach(([key, vals]) => {
      if (vals.length) data = data.filter(q => vals.includes(q[key]));
    });
    return data;
  }, [search, filters]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    setFilterLoading(true);
    const t = setTimeout(() => setFilterLoading(false), 300);
    return () => clearTimeout(t);
  }, [search, filters]);

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selectAll = () => setSelected(selected.length === paged.length ? [] : paged.map(q => q.id));

  return (
    <div className="flex gap-5 h-full">
      {/* Filter panel */}
      {filterPanelOpen && (
        <div className="w-64 flex-shrink-0 bg-white rounded-2xl border border-lgray-100 shadow-sm p-4 overflow-y-auto self-start sticky top-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-navy flex items-center gap-2">
              <Filter size={14} /> Filters
              {activeFilterCount > 0 && <span className="bg-teal text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
            </h3>
            {activeFilterCount > 0 && <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-600">Clear All</button>}
          </div>
          {FILTER_GROUPS.map(group => (
            <div key={group.key} className="mb-4">
              <button onClick={() => setExpandedGroups(prev => ({ ...prev, [group.label]: !prev[group.label] }))}
                className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {group.label}
                {expandedGroups[group.label] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              {expandedGroups[group.label] && (
                <div className="space-y-1">
                  {group.options.map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer hover:text-navy text-sm text-gray-600 py-0.5">
                      <input type="checkbox" checked={(filters[group.key] || []).includes(opt)} onChange={() => toggleFilter(group.key, opt)} className="accent-teal rounded" />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Project</p>
            <select className="w-full border border-lgray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
              <option>All Projects</option>
              {PROJECTS.map(p => <option key={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm px-4 py-3 flex items-center gap-3 flex-wrap">
          <button onClick={() => setFilterPanelOpen(o => !o)} className={`p-2 rounded-lg border transition-colors ${filterPanelOpen ? 'border-teal bg-teal-50 text-teal' : 'border-lgray-200 text-gray-400 hover:bg-lgray'}`}>
            <Filter size={16} />
          </button>
          <div className="flex items-center gap-2 flex-1 border border-lgray-200 rounded-xl px-3 py-2">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions…" className="flex-1 text-sm outline-none" />
            {search && <button onClick={() => setSearch('')}><X size={13} className="text-gray-400" /></button>}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} className="border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
            {['Newest', 'Oldest', 'Last Modified', 'Alphabetical'].map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="flex border border-lgray-200 rounded-xl overflow-hidden">
            {[['table', <AlignJustify size={15} />], ['card', <LayoutGrid size={15} />], ['compact', <List size={15} />]].map(([v, icon]) => (
              <button key={v} onClick={() => setView(v)} className={`px-2.5 py-2 ${view === v ? 'bg-teal text-white' : 'text-gray-400 hover:bg-lgray'}`}>{icon}</button>
            ))}
          </div>
          <button onClick={() => navigate('/questions/new/edit')} className="flex items-center gap-1.5 px-3 py-2 bg-teal text-white rounded-xl text-sm font-medium hover:bg-teal-700 whitespace-nowrap">
            <Plus size={14} /> Add Question
          </button>
        </div>

        {/* Bulk action bar */}
        {selected.length > 0 && (
          <div className="bg-navy text-white rounded-xl px-4 py-2.5 flex items-center gap-4 text-sm">
            <span>{selected.length} selected</span>
            <button onClick={() => toast('Status changed!', 'success')} className="hover:text-teal">Change Status</button>
            <button onClick={() => toast('Exported!', 'success')} className="hover:text-teal">Export</button>
            <button onClick={() => toast('Archived!', 'success')} className="hover:text-teal">Archive</button>
            <button onClick={() => setSelected([])} className="ml-auto hover:text-red-300"><X size={14} /></button>
          </div>
        )}

        {/* Question list */}
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm flex-1">
          {view === 'table' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-lgray-100 bg-lgray">
                  <th className="px-4 py-3 w-8"><input type="checkbox" checked={selected.length === paged.length && paged.length > 0} onChange={selectAll} className="accent-teal" /></th>
                  {['ID', 'Question Stem', 'Format', 'Difficulty', 'Status', 'Project', 'Last Modified', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filterLoading ? (
                    Array.from({ length: 8 }, (_, i) => <SkeletonRow key={i} cols={9} />)
                  ) : paged.length === 0 ? (
                    <tr><td colSpan={9} className="text-center py-16 text-gray-400">No questions match your filters. Try adjusting or clearing your filters.</td></tr>
                  ) : paged.map(q => (
                    <tr key={q.id} className="border-b border-lgray-100 hover:bg-lgray/50 transition-colors">
                      <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(q.id)} onChange={() => toggleSelect(q.id)} className="accent-teal" /></td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-500">{q.id}</td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="truncate text-navy font-medium" title={q.stem}>{q.stem.slice(0, 80)}{q.stem.length > 80 ? '…' : ''}</p>
                      </td>
                      <td className="px-4 py-3"><Badge text={q.format} type="format" /></td>
                      <td className="px-4 py-3"><Badge text={q.difficulty} type="difficulty" /></td>
                      <td className="px-4 py-3"><Badge text={q.status} /></td>
                      <td className="px-4 py-3 text-xs text-gray-400 truncate max-w-[120px]">{q.project}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{q.lastModified}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setPreviewQ(q)} className="p-1.5 rounded hover:bg-lgray text-gray-400 hover:text-teal" title="View"><Eye size={14} /></button>
                          <button onClick={() => navigate(`/questions/${q.id}/edit`)} className="p-1.5 rounded hover:bg-lgray text-gray-400 hover:text-navy" title="Edit"><Pencil size={14} /></button>
                          <button onClick={() => toast('Copied!', 'success')} className="p-1.5 rounded hover:bg-lgray text-gray-400 hover:text-navy" title="Copy"><Copy size={14} /></button>
                          <button onClick={() => toast('Archived!', 'success')} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-400" title="Archive"><Archive size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {view === 'card' && (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {paged.map(q => (
                <div key={q.id} className="border border-lgray-100 rounded-xl p-4 hover:border-teal-200 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex gap-1.5 flex-wrap"><Badge text={q.format} type="format" /><Badge text={q.difficulty} type="difficulty" /><Badge text={q.status} /></div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => setPreviewQ(q)} className="p-1.5 rounded hover:bg-lgray text-gray-400 hover:text-teal"><Eye size={13} /></button>
                      <button onClick={() => navigate(`/questions/${q.id}/edit`)} className="p-1.5 rounded hover:bg-lgray text-gray-400 hover:text-navy"><Pencil size={13} /></button>
                    </div>
                  </div>
                  <p className="text-sm text-navy font-medium line-clamp-3">{q.stem}</p>
                  <p className="text-xs text-gray-400 mt-2">{q.project} · {q.lastModified}</p>
                </div>
              ))}
            </div>
          )}

          {view === 'compact' && (
            <table className="w-full text-xs">
              <thead><tr className="border-b border-lgray-100 bg-lgray">
                {['ID', 'Stem', 'Format', 'Status', 'Last Modified'].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-400 uppercase tracking-wide">{h}</th>)}
              </tr></thead>
              <tbody>
                {paged.map(q => (
                  <tr key={q.id} className="border-b border-lgray-100 hover:bg-lgray/50 cursor-pointer" onClick={() => navigate(`/questions/${q.id}/edit`)}>
                    <td className="px-3 py-2 font-mono text-gray-500">{q.id}</td>
                    <td className="px-3 py-2 truncate max-w-xs text-navy">{q.stem.slice(0, 60)}…</td>
                    <td className="px-3 py-2"><Badge text={q.format} type="format" size="xs" /></td>
                    <td className="px-3 py-2"><Badge text={q.status} size="xs" /></td>
                    <td className="px-3 py-2 text-gray-400">{q.lastModified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-lgray-100 text-sm text-gray-500">
              <span>Showing {(page-1)*pageSize+1}–{Math.min(page*pageSize, filtered.length)} of {filtered.length} questions</span>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded text-xs ${p === page ? 'bg-teal text-white' : 'hover:bg-lgray'}`}>{p}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Drawer */}
      <Drawer open={!!previewQ} onClose={() => setPreviewQ(null)} title="Question Preview" width="w-[480px]">
        {previewQ && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap"><Badge text={previewQ.format} type="format" /><Badge text={previewQ.difficulty} type="difficulty" /><Badge text={previewQ.status} /></div>
            <p className="text-sm font-semibold text-navy">{previewQ.stem}</p>
            {previewQ.options && (
              <ul className="space-y-2">
                {previewQ.options.map((opt, i) => (
                  <li key={i} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border ${i === previewQ.correct ? 'border-green-200 bg-green-50 text-green-700' : 'border-lgray-100 text-gray-600'}`}>
                    <span className="font-bold text-xs w-5">{String.fromCharCode(65+i)}.</span>{opt}
                  </li>
                ))}
              </ul>
            )}
            {previewQ.rubric && <div className="bg-lgray rounded-xl p-3 text-xs text-gray-600"><span className="font-semibold">Rubric:</span> {previewQ.rubric}</div>}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div><span className="font-semibold">Project:</span> {previewQ.project}</div>
              <div><span className="font-semibold">Created by:</span> {previewQ.createdBy}</div>
              <div><span className="font-semibold">Bloom's:</span> {previewQ.bloomsLevel}</div>
              <div><span className="font-semibold">Modified:</span> {previewQ.lastModified}</div>
            </div>
            <button onClick={() => { navigate(`/questions/${previewQ.id}/edit`); setPreviewQ(null); }} className="w-full bg-teal text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-teal-700 transition-colors">
              Edit Question
            </button>
          </div>
        )}
      </Drawer>
    </div>
  );
}
