import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Search, LayoutGrid, AlignJustify, MoreVertical, Users, Calendar, CheckCircle2, Wand2, ArrowLeft } from 'lucide-react';
import Badge from '../components/shared/Badge';
import Modal from '../components/shared/Modal';
import { useToast } from '../components/shared/Toast';
import { PROJECTS, USERS, QUESTIONS, ASSESSMENTS } from '../data/mockData';

// ─── Project List ────────────────────────────────────────────────────────────
function ProjectList() {
  const navigate = useNavigate();
  const toast = useToast();
  const [view, setView] = useState('card');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);

  const filtered = PROJECTS.filter(p =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'All' || p.status === statusFilter)
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-lgray-200 bg-white rounded-xl px-3 py-2">
            <Search size={15} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects…" className="text-sm outline-none w-48" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-lgray-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
            {['All','Draft','Active','In Review','Completed','Archived'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-lgray-200 bg-white rounded-xl overflow-hidden">
            <button type="button" onClick={() => setView('card')} className={`px-2.5 py-2 ${view === 'card' ? 'bg-teal text-white' : 'text-gray-400 hover:bg-lgray'}`}><LayoutGrid size={15} /></button>
            <button type="button" onClick={() => setView('table')} className={`px-2.5 py-2 ${view === 'table' ? 'bg-teal text-white' : 'text-gray-400 hover:bg-lgray'}`}><AlignJustify size={15} /></button>
          </div>
          <button type="button" onClick={() => setCreateOpen(true)} className="flex items-center gap-1.5 px-4 py-2 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors">
            <Plus size={15} /> New Project
          </button>
        </div>
      </div>

      {/* Projects */}
      {view === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5 hover:border-teal-200 transition-all cursor-pointer relative" onClick={() => navigate(`/projects/${p.id}`)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-8">
                  <h3 className="font-semibold text-navy truncate">{p.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{p.description}</p>
                </div>
                <div className="absolute top-5 right-5">
                  <button type="button" onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === p.id ? null : p.id); }} className="p-1 rounded-lg hover:bg-lgray text-gray-400">
                    <MoreVertical size={15} />
                  </button>
                  {menuOpen === p.id && (
                    <div className="absolute right-0 top-7 bg-white border border-lgray-100 rounded-xl shadow-lg z-10 w-36 py-1">
                      {['Edit','Archive','Duplicate','View Audit','Delete'].map(a => (
                        <button type="button" key={a} onClick={e => { e.stopPropagation(); toast(`${a} clicked`, 'info'); setMenuOpen(null); }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-lgray ${a === 'Delete' ? 'text-red-500' : 'text-gray-600'}`}>{a}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge text={p.status} />
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progress</span><span>{p.approved}/{p.target} approved</span></div>
                <div className="bg-lgray-100 rounded-full h-1.5"><div className="bg-teal h-1.5 rounded-full" style={{ width: `${p.progress}%` }} /></div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1"><Users size={11} /> PM: {p.pm}</span>
                <span className={`flex items-center gap-1 ${new Date(p.dueDate) < new Date() ? 'text-red-500' : ''}`}>
                  <Calendar size={11} /> {p.dueDate}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">{p.lastActivity}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-lgray-100 bg-lgray">
              {['Project Name','Status','Progress','PM','Team','Due Date','Last Updated','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-lgray-100 hover:bg-lgray/50 cursor-pointer" onClick={() => navigate(`/projects/${p.id}`)}>
                  <td className="px-4 py-3 font-medium text-navy hover:text-teal">{p.name}</td>
                  <td className="px-4 py-3"><Badge text={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-lgray-100 rounded-full h-1.5 w-16"><div className="bg-teal h-1.5 rounded-full" style={{ width: `${p.progress}%` }} /></div>
                      <span className="text-xs text-gray-400">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.pm}</td>
                  <td className="px-4 py-3 text-gray-600">{p.teamSize}</td>
                  <td className={`px-4 py-3 text-xs ${new Date(p.dueDate) < new Date() ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>{p.dueDate}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{p.lastActivity}</td>
                  <td className="px-4 py-3"><button type="button" onClick={e => { e.stopPropagation(); setMenuOpen(p.id); }} className="p-1 rounded-lg hover:bg-lgray text-gray-400"><MoreVertical size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Project">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Project Name <span className="text-red-400">*</span></label>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Q3 Certification Exam 2025" className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Description</label>
            <textarea rows={3} value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Start Date</label>
              <input type="date" className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Due Date</label>
              <input type="date" className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setCreateOpen(false)} className="flex-1 py-2.5 border border-lgray-200 rounded-xl text-sm font-medium hover:bg-lgray">Cancel</button>
            <button type="button" onClick={() => { toast('Project created!', 'success'); setCreateOpen(false); }} className="flex-1 py-2.5 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700">Create Project</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Project Detail ───────────────────────────────────────────────────────────
function ProjectDetail({ projectId }) {
  const navigate = useNavigate();
  const toast = useToast();
  const project = PROJECTS.find(p => p.id === projectId) || PROJECTS[0];
  const [tab, setTab] = useState('overview');
  const [inviteOpen, setInviteOpen] = useState(false);

  const teamMembers = USERS.slice(0, 5);
  const projectQuestions = QUESTIONS.filter(q => q.project === project.name);
  const projectAssessments = ASSESSMENTS.filter(a => a.project === project.name);

  const TABS = ['overview', 'team', 'questions', 'review-progress', 'assessments', 'settings'];
  const TAB_LABELS = { overview: 'Overview', team: 'Team', questions: 'Questions', 'review-progress': 'Review Progress', assessments: 'Assessments', settings: 'Settings' };

  return (
    <div className="space-y-4">
      {/* Back */}
      <button type="button" onClick={() => navigate('/projects')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy">
        <ArrowLeft size={15} /> Back to Projects
      </button>

      {/* Project header */}
      <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-navy">{project.name}</h2>
              <Badge text={project.status} />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 max-w-xs">
                <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progress</span><span>{project.approved}/{project.target} approved</span></div>
                <div className="bg-lgray-100 rounded-full h-2"><div className="bg-teal h-2 rounded-full" style={{ width: `${project.progress}%` }} /></div>
              </div>
            </div>
          </div>
          <button type="button" onClick={() => toast('Settings opened', 'info')} className="px-3 py-2 border border-lgray-200 rounded-xl text-sm hover:bg-lgray flex-shrink-0">Edit Settings</button>
        </div>
        <div className="flex gap-6 mt-4 text-sm">
          {[['Total', project.target], ['Approved', project.approved], ['In Review', project.inReview], ['Drafts', project.drafts], ['Overdue', project.overdue]].map(([l, v]) => (
            <div key={l}><p className="text-xs text-gray-400">{l}</p><p className="font-semibold text-navy">{v}</p></div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl border border-lgray-100 shadow-sm p-1.5">
        {TABS.map(t => (
          <button type="button" key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all ${tab === t ? 'bg-teal text-white shadow-sm' : 'text-gray-500 hover:text-navy hover:bg-lgray'}`}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
        {tab === 'overview' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-navy mb-2">Description</h4>
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-xs text-gray-400">Start Date</p><p className="font-medium text-navy">2025-04-01</p></div>
              <div><p className="text-xs text-gray-400">Due Date</p><p className={`font-medium ${new Date(project.dueDate) < new Date() ? 'text-red-500' : 'text-navy'}`}>{project.dueDate}</p></div>
              <div><p className="text-xs text-gray-400">Team Size</p><p className="font-medium text-navy">{project.teamSize}</p></div>
            </div>
            <div>
              <h4 className="font-semibold text-navy mb-2">Recent Activity</h4>
              {['Taylor Brown generated 5 questions · 2h ago', 'Casey Wilson approved Q-00142 · 3h ago', 'Jordan Smith updated settings · 1d ago'].map((a, i) => (
                <div key={i} className="py-2 border-b border-lgray-100 text-xs text-gray-500">{a}</div>
              ))}
            </div>
          </div>
        )}

        {tab === 'team' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-navy">Team Members</h4>
              <button type="button" onClick={() => setInviteOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white rounded-xl text-xs font-medium hover:bg-teal-700">
                <Plus size={13} /> Add Member
              </button>
            </div>
            <div className="space-y-2">
              {teamMembers.map(u => (
                <div key={u.id} className="flex items-center gap-3 py-3 border-b border-lgray-100">
                  <div className="w-9 h-9 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center">{u.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <Badge text={u.role} type="role" />
                  <button type="button" onClick={() => toast('Removed!', 'info')} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'questions' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-navy">Questions ({projectQuestions.length})</h4>
              <button type="button" onClick={() => navigate('/generate')} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white rounded-xl text-xs font-medium hover:bg-teal-700">
                <Wand2 size={13} /> Generate More
              </button>
            </div>
            {projectQuestions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No questions found for this project.</p>
            ) : (
              <div className="space-y-2">
                {projectQuestions.map(q => (
                  <div key={q.id} className="flex items-center gap-3 py-3 border-b border-lgray-100">
                    <p className="text-xs font-mono text-gray-400">{q.id}</p>
                    <p className="flex-1 text-sm text-navy truncate">{q.stem.slice(0, 60)}…</p>
                    <Badge text={q.format} type="format" size="xs" />
                    <Badge text={q.status} size="xs" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'review-progress' && (
          <div>
            <h4 className="font-semibold text-navy mb-4">Review Progress</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[['Draft', project.drafts,'gray'], ['Pending', project.inReview,'yellow'], ['In Review', project.inReview,'blue'], ['Approved', project.approved,'green'], ['Rejected', 3,'red'], ['Revision', 2,'orange']].map(([s, c, col]) => (
                <div key={s} className="text-center border border-lgray-100 rounded-xl p-3">
                  <p className="text-2xl font-bold text-navy">{c}</p>
                  <p className="text-xs text-gray-400 mt-1">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'assessments' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-navy">Assessments</h4>
              <button type="button" onClick={() => navigate('/assessments/new')} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white rounded-xl text-xs font-medium hover:bg-teal-700"><Plus size={13} /> Build New</button>
            </div>
            {projectAssessments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No assessments built yet.</p>
            ) : (
              <div className="space-y-2">
                {projectAssessments.map(a => (
                  <div key={a.id} className="flex items-center gap-3 py-3 border-b border-lgray-100">
                    <p className="flex-1 text-sm text-navy font-medium">{a.name}</p>
                    <Badge text={a.status} />
                    <p className="text-xs text-gray-400">{a.questionCount} questions</p>
                    <p className="text-xs text-gray-400">{a.createdDate}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-navy">Project Settings</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><label className="block text-xs text-gray-500 mb-1">Project Name</label><input defaultValue={project.name} className="w-full border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Target Question Count</label><input type="number" defaultValue={project.target} className="w-full border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Due Date</label><input type="date" defaultValue={project.dueDate} className="w-full border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Review Assignment Mode</label><select className="w-full border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal"><option>Manual</option><option>Auto-Round Robin</option></select></div>
            </div>
            <button type="button" onClick={() => toast('Settings saved!', 'success')} className="px-4 py-2 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700">Save Settings</button>
          </div>
        )}
      </div>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Add Team Member">
        <div className="space-y-3">
          <div><label className="block text-sm font-semibold text-navy mb-1.5">User</label>
            <select className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
              {USERS.map(u => <option key={u.id}>{u.name} ({u.role})</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-semibold text-navy mb-1.5">Role in Project</label>
            <select className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
              {['SME','Reviewer','Viewer','PM'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setInviteOpen(false)} className="flex-1 py-2.5 border border-lgray-200 rounded-xl text-sm">Cancel</button>
            <button type="button" onClick={() => { toast('Member added!', 'success'); setInviteOpen(false); }} className="flex-1 py-2.5 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700">Add Member</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Router wrapper ────────────────────────────────────────────────────────────
export default function ProjectManagement() {
  const { projectId } = useParams();
  return projectId ? <ProjectDetail projectId={projectId} /> : <ProjectList />;
}
