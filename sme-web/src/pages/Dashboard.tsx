import { useState, useEffect } from 'react';
import { ANIMATION_STAGGER_MS, ANIMATION_BASE_DELAY_MS, LOADING_SIMULATION_MS } from '../lib/constants';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/shared/StatCard';
import Badge from '../components/shared/Badge';
import Skeleton from '../components/ui/Skeleton';
import NetworkCanvas from '../components/shared/NetworkCanvas';
import { PROJECTS, ACTIVITY_FEED } from '../data/mockData';
import { ROLE_STATS, QUICK_ACTIONS, ACTIVITY_ICONS } from './dashboard/data';

const ACTION_COLOR_MAP: Record<string, string> = {
  teal: 'bg-teal-50 text-teal border-teal-100',
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  orange: 'bg-orange-50 text-orange-600 border-orange-100',
  green: 'bg-green-50 text-green-600 border-green-100',
  red: 'bg-red-50 text-red-600 border-red-100',
};

export default function Dashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [projectView, setProjectView] = useState('table');
  const [projectFilter, setProjectFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), LOADING_SIMULATION_MS);
    return () => clearTimeout(t);
  }, []);

  const stats = ROLE_STATS[role] || ROLE_STATS.PM;
  const actions = QUICK_ACTIONS[role] || [];

  const filteredProjects = PROJECTS.filter(p =>
    projectFilter === 'All' || p.status === projectFilter
  );

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="relative bg-gradient-to-r from-navy to-navy-50 rounded-2xl p-6 text-white overflow-hidden">
        <NetworkCanvas className="absolute inset-0 w-full h-full opacity-60" />
        <div className="relative z-10">
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/40 mb-1">GenQue Platform</p>
          <p className="text-sm text-white/60">{today}</p>
          <h2 className="text-2xl font-bold mt-1">Welcome back, {user?.name?.split(' ')[0]}</h2>
          <p className="text-white/60 text-sm mt-1">{user?.org} · {user?.role === 'SA' ? 'Super Admin' : role}</p>
        </div>
        <svg viewBox="0 0 28 28" fill="none" className="absolute top-4 right-4 w-6 h-6 opacity-25" aria-hidden="true">
          <path d="M2,8 L2,2 L8,2"     stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
          <path d="M20,2 L26,2 L26,8"  stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
          <path d="M26,20 L26,26 L20,26" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
          <path d="M8,26 L2,26 L2,20"  stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-lgray-100 space-y-3" aria-hidden="true">
                <Skeleton variant="text" className="w-2/3 h-3" />
                <Skeleton variant="text" className="w-1/2 h-7" />
                <Skeleton variant="text" className="w-1/3 h-3" />
              </div>
            ))
          : stats.map((stat, i) => (
              <div key={stat.label} className="stagger-in" style={{ animationDelay: `${i * ANIMATION_STAGGER_MS}ms` }}>
                <StatCard {...stat} onClick={() => navigate(stat.path || '/question-bank')} />
              </div>
            ))
        }
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-lgray-100 border-t-[3px] border-t-teal stagger-in" style={{ animationDelay: `${ANIMATION_BASE_DELAY_MS}ms` }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-lgray-100">
            <div className="flex items-center gap-2">
              <span className="section-idx" aria-hidden="true">01</span>
              <h3 className="font-semibold text-navy">My Projects</h3>
            </div>
            <div className="flex items-center gap-2">
              <select value={projectFilter} onChange={event => setProjectFilter(event.target.value)} className="text-xs border border-lgray-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal">
                {['All','Active','In Review','Completed','Draft'].map(f => <option key={f}>{f}</option>)}
              </select>
              <div className="flex border border-lgray-100 rounded-lg overflow-hidden">
                <button type="button" onClick={() => setProjectView('table')} className={`px-2.5 py-1.5 text-xs ${projectView === 'table' ? 'bg-teal text-white' : 'text-gray-500 hover:bg-lgray'}`}>Table</button>
                <button type="button" onClick={() => setProjectView('card')} className={`px-2.5 py-1.5 text-xs ${projectView === 'card' ? 'bg-teal text-white' : 'text-gray-500 hover:bg-lgray'}`}>Card</button>
              </div>
            </div>
          </div>

          {projectView === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-lgray-100 bg-lgray text-xs text-gray-400 uppercase">
                  {['Project','Status','Progress','Due Date','Last Activity'].map(h => <th key={h} className="px-4 py-2.5 text-left font-semibold">{h}</th>)}
                </tr></thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 5 }, (_, i) => (
                        <tr key={i} aria-hidden="true" className="border-b border-lgray-100">
                          <td className="px-4 py-3"><Skeleton variant="text" className="w-40 h-4" /></td>
                          <td className="px-4 py-3"><Skeleton variant="text" className="w-20 h-5 rounded-full" /></td>
                          <td className="px-4 py-3"><Skeleton variant="text" className="w-28 h-3" /></td>
                          <td className="px-4 py-3"><Skeleton variant="text" className="w-20 h-3" /></td>
                          <td className="px-4 py-3"><Skeleton variant="text" className="w-24 h-3" /></td>
                        </tr>
                      ))
                    : filteredProjects.map(p => (
                    <tr key={p.id} className="border-b border-lgray-100 hover:bg-lgray/50 cursor-pointer" onClick={() => navigate(`/projects/${p.id}`)}>
                      <td className="px-4 py-3 font-medium text-navy hover:text-teal">{p.name}</td>
                      <td className="px-4 py-3"><Badge text={p.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-lgray-100 rounded-full h-1.5 w-20"><div className="bg-teal h-1.5 rounded-full" style={{ width: `${p.progress}%` }} /></div>
                          <span className="text-xs text-gray-400">{p.progress}%</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-xs ${new Date(p.dueDate) < new Date() ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>{p.dueDate}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{p.lastActivity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
              {filteredProjects.map(p => (
                <div key={p.id} className="border border-lgray-100 rounded-xl p-4 hover:border-teal-200 cursor-pointer transition-all" onClick={() => navigate(`/projects/${p.id}`)}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-navy text-sm">{p.name}</p>
                    <Badge text={p.status} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progress</span><span>{p.approved}/{p.target}</span></div>
                    <div className="bg-lgray-100 rounded-full h-1.5"><div className="bg-teal h-1.5 rounded-full" style={{ width: `${p.progress}%` }} /></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{p.lastActivity}</p>
                </div>
              ))}
            </div>
          )}

          <div className="px-5 py-3 border-t border-lgray-100">
            <button type="button" onClick={() => navigate('/projects')} className="text-xs text-teal font-medium hover:text-teal-700 flex items-center gap-1">
              View All Projects <ArrowRight size={12} />
            </button>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-lgray-100 border-t-[3px] border-t-blue-400 stagger-in" style={{ animationDelay: `${ANIMATION_BASE_DELAY_MS + ANIMATION_STAGGER_MS}ms` }}>
          <div className="px-5 py-4 border-b border-lgray-100">
            <div className="flex items-center gap-2">
              <span className="section-idx" aria-hidden="true">02</span>
              <h3 className="font-semibold text-navy">Recent Activity</h3>
            </div>
          </div>
          <div className="divide-y divide-lgray-100">
            {ACTIVITY_FEED.map(item => {
              const { icon: Icon, color } = ACTIVITY_ICONS[item.icon] || ACTIVITY_ICONS.generate;
              return (
                <button type="button" key={item.id} onClick={() => navigate(item.link)} className="w-full text-left flex items-start gap-3 px-5 py-3.5 hover:bg-lgray/50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 line-clamp-2">{item.text}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.timestamp}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {actions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-lgray-100 border-t-[3px] border-t-purple-400 p-5 stagger-in" style={{ animationDelay: `${ANIMATION_BASE_DELAY_MS + ANIMATION_STAGGER_MS * 2}ms` }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="section-idx" aria-hidden="true">03</span>
            <h3 className="font-semibold text-navy">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {actions.map(action => {
              const Icon = action.icon;
              return (
                <button type="button" key={action.label} onClick={() => navigate(action.path)} className="flex items-center gap-3 p-4 border border-lgray-100 rounded-xl hover:border-teal-200 hover:shadow-sm transition-all text-left group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${ACTION_COLOR_MAP[action.color] || ACTION_COLOR_MAP.teal}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy group-hover:text-teal">{action.label}</p>
                    <p className="text-xs text-gray-400">{action.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between pt-1 board-footer-strip" aria-hidden="true">
        <span>GenQue Platform</span>
        <span>Last Updated · {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
      </div>
    </div>
  );
}
