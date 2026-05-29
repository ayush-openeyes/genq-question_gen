import { useState, useEffect } from 'react';
import { LOADING_SIMULATION_MS } from '../lib/constants';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Tooltip,
  XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
} from 'recharts';
import StatCard from '../components/shared/StatCard';
import Skeleton from '../components/ui/Skeleton';
import { FileQuestion, CheckCircle2, Clock, XCircle, RotateCcw, Users } from 'lucide-react';
import {
  ANALYTICS_OVER_TIME, FORMAT_DISTRIBUTION, DIFFICULTY_DATA,
  REVIEWER_PERFORMANCE, AI_VS_MANUAL, QUESTIONS,
} from '../data/mockData';

const PIE_COLORS = ['#00B4D8','#0085a0','#4dd2ea','#b3ecf6','#80dff0','#26c7e3','#009fbe'];

const KEY_METRICS = [
  { id: 'generated',    label: 'Questions Generated', value: '482', icon: FileQuestion, trend: 8 },
  { id: 'approval',     label: 'Approval Rate', value: '74%', icon: CheckCircle2, color: 'green', trend: 5 },
  { id: 'time',         label: 'Avg Time to Approval', value: '18.4 hrs', icon: Clock },
  { id: 'rejection',    label: 'Rejection Rate', value: '8%', icon: XCircle, color: 'red', trend: -2 },
  { id: 'revision',     label: 'Revision Request Rate', value: '18%', icon: RotateCcw, color: 'orange' },
  { id: 'active-smes',  label: 'Active SMEs', value: '7', icon: Users, color: 'purple' },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [detailTab, setDetailTab] = useState('quality');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), LOADING_SIMULATION_MS);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading analytics">
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm px-5 py-3 h-14 flex items-center gap-3">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} variant="rect" className="w-24 h-7 rounded-lg" />)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-lgray-100 space-y-3">
              <Skeleton variant="text" className="w-2/3 h-3" />
              <Skeleton variant="text" className="w-1/2 h-7" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5 space-y-3">
              <Skeleton variant="text" className="w-1/3 h-4" />
              <Skeleton variant="rect" className="w-full h-[220px] rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm px-5 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {['Last 7 Days','Last 30 Days','Last Quarter','Custom Range'].map(r => (
            <button type="button" key={r} onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium ${dateRange === r ? 'bg-teal text-white' : 'border border-lgray-200 text-gray-500 hover:bg-lgray'}`}>
              {r}
            </button>
          ))}
        </div>
        <select className="border border-lgray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal ml-auto">
          <option>All My Projects</option>
          <option>Nursing Certification Exam 2025</option>
          <option>HR Onboarding Assessment</option>
        </select>
        <button className="px-3 py-1.5 text-xs border border-lgray-200 rounded-xl hover:bg-lgray">Export Report</button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {KEY_METRICS.map(m => <StatCard key={m.id} {...m} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Questions Over Time */}
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
          <h4 className="font-semibold text-navy text-sm mb-4">Questions by Status Over Time</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ANALYTICS_OVER_TIME}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F6F8" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Generated" stroke="#00B4D8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Approved" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Rejected" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Revision" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Format Distribution */}
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
          <h4 className="font-semibold text-navy text-sm mb-4">Question Format Distribution</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={FORMAT_DISTRIBUTION} cx="40%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" nameKey="name">
                {FORMAT_DISTRIBUTION.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v} questions`, n]} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
          <h4 className="font-semibold text-navy text-sm mb-4">Difficulty Distribution (Target vs Actual)</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DIFFICULTY_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F6F8" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="project" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="actualEasy" stackId="a" fill="#22c55e" name="Easy" />
              <Bar dataKey="actualMedium" stackId="a" fill="#eab308" name="Medium" />
              <Bar dataKey="actualHard" stackId="a" fill="#ef4444" name="Hard" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reviewer Performance */}
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
          <h4 className="font-semibold text-navy text-sm mb-4">Reviewer Performance</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVIEWER_PERFORMANCE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F6F8" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Approved" fill="#22c55e" />
              <Bar dataKey="Revision" fill="#eab308" />
              <Bar dataKey="Rejected" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI vs Manual */}
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
          <h4 className="font-semibold text-navy text-sm mb-4">AI Generation vs Manual Edit Rate</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={AI_VS_MANUAL}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F6F8" />
              <XAxis dataKey="project" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="asIs" name="Used As-Is" fill="#00B4D8" />
              <Bar dataKey="edited" name="Edited Before Submit" fill="#80dff0" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Generation Heatmap (simulated) */}
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
          <h4 className="font-semibold text-navy text-sm mb-4">Generation Activity (May 2025)</h4>
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: 30 }, (_, i) => {
              const count = Math.floor(Math.random() * 22);
              const opacity = count === 0 ? 0.1 : count < 5 ? 0.3 : count < 10 ? 0.5 : count < 15 ? 0.75 : 1;
              return (
                <div key={i} title={`May ${i+1}: ${count} questions`}
                  className="w-full aspect-square rounded-sm bg-teal transition-all hover:ring-1 hover:ring-teal cursor-pointer"
                  style={{ opacity }} />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
            <span>Less</span>
            {[0.1,0.3,0.5,0.75,1].map(o => <div key={o} className="w-3 h-3 rounded-sm bg-teal" style={{ opacity: o }} />)}
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm">
        <div className="flex border-b border-lgray-100">
          {[['quality','Question Quality'],['sme','SME Productivity'],['projects','Project Progress']].map(([k, l]) => (
            <button type="button" key={k} onClick={() => setDetailTab(k)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${detailTab === k ? 'border-teal text-teal' : 'border-transparent text-gray-500 hover:text-navy'}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          {detailTab === 'quality' && (
            <table className="w-full text-sm">
              <thead><tr className="bg-lgray border-b border-lgray-100">
                {['ID','Question Stem','Format','Difficulty','Status','Bloom\'s','Review Rounds','Time to Approve','Reviewer'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {QUESTIONS.slice(0, 6).map(q => (
                  <tr key={q.id} className="border-b border-lgray-100 hover:bg-lgray/50">
                    <td className="px-4 py-3 text-xs font-mono text-gray-400">{q.id}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate text-navy text-xs">{q.stem}</td>
                    <td className="px-4 py-3"><span className="text-xs text-gray-600">{q.format}</span></td>
                    <td className="px-4 py-3"><span className="text-xs text-gray-600">{q.difficulty}</span></td>
                    <td className="px-4 py-3"><span className="text-xs text-gray-600">{q.status}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{q.bloomsLevel}</td>
                    <td className="px-4 py-3 text-xs text-center text-gray-500">{Math.floor(Math.random()*3)+1}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{Math.floor(Math.random()*24)+2}h</td>
                    <td className="px-4 py-3 text-xs text-gray-500">Casey Wilson</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {detailTab === 'sme' && (
            <table className="w-full text-sm">
              <thead><tr className="bg-lgray border-b border-lgray-100">
                {['SME Name','Generated','Submitted','Approved','Approval Rate','Rejected','Avg Edits'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[['Taylor Brown',64,58,42,'72%',8,1.4],['Sam Parker',12,10,6,'60%',2,2.1]].map(([name,...vals]) => (
                  <tr key={name} className="border-b border-lgray-100 hover:bg-lgray/50">
                    <td className="px-4 py-3 font-medium text-navy">{name}</td>
                    {vals.map((v, i) => <td key={i} className="px-4 py-3 text-sm text-gray-600">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {detailTab === 'projects' && (
            <table className="w-full text-sm">
              <thead><tr className="bg-lgray border-b border-lgray-100">
                {['Project Name','Target','Generated','Approved','In Review','Remaining','% Complete','Days to Due','Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[['Nursing Cert Exam',200,182,144,18,38,'72%',82,'Active'],['HR Onboarding',80,68,36,22,22,'45%',37,'In Review'],['Grade 10 Sci',150,60,15,2,90,'10%',128,'Draft']].map(([name,...vals]) => (
                  <tr key={name} className="border-b border-lgray-100 hover:bg-lgray/50">
                    <td className="px-4 py-3 font-medium text-navy">{name}</td>
                    {vals.map((v, i) => <td key={i} className="px-4 py-3 text-xs text-gray-600">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
