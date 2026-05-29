import { useState } from 'react';
import { Activity, Users, Building2, Flag, Settings, ScrollText, RefreshCw } from 'lucide-react';
import Badge from '../components/shared/Badge';
import { useToast } from '../components/shared/Toast';
import { ORGANIZATIONS, USERS, FEATURE_FLAGS, AUDIT_LOG } from '../data/mockData';

const TABS = [
  { key: 'overview', label: 'Platform Overview', icon: Activity },
  { key: 'orgs', label: 'Organizations', icon: Building2 },
  { key: 'users', label: 'All Users', icon: Users },
  { key: 'flags', label: 'Feature Flags', icon: Flag },
  { key: 'system', label: 'System Config', icon: Settings },
  { key: 'audit', label: 'Platform Audit Log', icon: ScrollText },
];

const HEALTH = [
  { label: 'API Response Time', value: '42 ms', status: 'green' },
  { label: 'AI Generation Engine', value: 'Operational', status: 'green' },
  { label: 'Database Status', value: 'Operational', status: 'green' },
  { label: 'Active Sessions', value: '142', status: 'gray' },
];

const KPI = [
  { label: 'Total Organizations', value: '24' },
  { label: 'Total Users', value: '1,284' },
  { label: 'Questions (All Time)', value: '48,920' },
  { label: 'Questions (This Month)', value: '3,241' },
  { label: 'Assessments Created', value: '512' },
  { label: 'API Calls (This Month)', value: '18,430' },
];

export default function SuperAdmin() {
  const toast = useToast();
  const [tab, setTab] = useState('overview');
  const [flags, setFlags] = useState(FEATURE_FLAGS);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const toggleFlag = (id: string) => setFlags(prev => prev.map(flag => flag.id === id ? { ...flag, globalEnabled: !flag.globalEnabled } : flag));

  return (
    <div className="space-y-4">
      {/* Tab nav */}
      <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-1.5 flex gap-1 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button type="button" key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${tab === key ? 'bg-navy text-white shadow-sm' : 'text-gray-500 hover:text-navy hover:bg-lgray'}`}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-5">
          {/* Health */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {HEALTH.map(h => (
              <div key={h.label} className="bg-white rounded-2xl border border-lgray-100 shadow-sm px-5 py-4">
                <p className="text-xs text-gray-400">{h.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${h.status === 'green' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <p className="font-bold text-navy">{h.value}</p>
                </div>
              </div>
            ))}
          </div>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {KPI.map(k => (
              <div key={k.label} className="bg-white rounded-2xl border border-lgray-100 shadow-sm px-5 py-4">
                <p className="text-xs text-gray-400">{k.label}</p>
                <p className="text-xl font-bold text-navy mt-1">{k.value}</p>
              </div>
            ))}
          </div>
          {/* Recent platform activity */}
          <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
            <h4 className="font-semibold text-navy mb-3">Recent Platform Activity</h4>
            <div className="space-y-2">
              {[
                'New org signup: TechScreen Inc. (May 25, 2025)',
                'Bulk import executed: Credex Board — 240 questions imported',
                'Integration failure: AWS S3 Item Bank (Acme Corp) — auth token expired',
                'Feature flag changed: "Enable Scenario-Based Questions" disabled globally',
                'Super Admin logged in from IP 10.0.0.1',
              ].map((e, i) => (
                <div key={i} className="text-xs text-gray-600 py-2 border-b border-lgray-100 flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal mt-1 flex-shrink-0" />
                  {e}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Organizations */}
      {tab === 'orgs' && (
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-lgray border-b border-lgray-100">
              {['Org Name','Plan Tier','Users','Questions','Storage','Status','Created','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {ORGANIZATIONS.map(o => (
                <tr key={o.id} className="border-b border-lgray-100 hover:bg-lgray/50">
                  <td className="px-4 py-3 font-medium text-navy">{o.name}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">{o.plan}</span></td>
                  <td className="px-4 py-3 text-gray-600">{o.users}</td>
                  <td className="px-4 py-3 text-gray-600">{o.questions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{o.storage}</td>
                  <td className="px-4 py-3"><Badge text={o.status} /></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{o.created}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => toast('View org detail', 'info')} className="text-xs text-teal hover:text-teal-700 font-medium">View</button>
                      <span className="text-gray-200">|</span>
                      <button type="button" onClick={() => toast('Impersonation logged in audit.', 'warning')} className="text-xs text-orange-500 hover:text-orange-700 font-medium">Impersonate</button>
                      <span className="text-gray-200">|</span>
                      <button type="button" onClick={() => toast('Suspend org?', 'warning')} className="text-xs text-red-500 hover:text-red-700 font-medium">Suspend</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All Users */}
      {tab === 'users' && (
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-lgray border-b border-lgray-100">
              {['User','Email','Organization','Role','Status','Last Login','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.id} className="border-b border-lgray-100 hover:bg-lgray/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center">{u.avatar}</div>
                      <span className="font-medium text-navy">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{u.org}</td>
                  <td className="px-4 py-3"><Badge text={u.role} type="role" /></td>
                  <td className="px-4 py-3"><Badge text={u.status} /></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{u.lastLogin}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => toast('User deactivated', 'warning')} className="text-xs text-red-500 hover:text-red-700 font-medium">Deactivate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Feature Flags */}
      {tab === 'flags' && (
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-lgray-100">
            <h4 className="font-semibold text-navy">Feature Flags</h4>
            <p className="text-xs text-gray-400 mt-0.5">Changes are audited and reversible.</p>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="bg-lgray border-b border-lgray-100">
              {['Feature','Description','Globally Enabled','Last Changed By','Date Changed'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {flags.map(f => (
                <tr key={f.id} className="border-b border-lgray-100 hover:bg-lgray/50">
                  <td className="px-4 py-3 font-medium text-navy">{f.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-xs">{f.description}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => toggleFlag(f.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${f.globalEnabled ? 'bg-teal' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${f.globalEnabled ? 'translate-x-4' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{f.lastChangedBy}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{f.dateChanged}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* System Config */}
      {tab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
            <h4 className="font-semibold text-navy mb-3">AI Engine Settings</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between"><span>Current Model</span><span className="font-mono text-xs text-gray-500">claude-sonnet-4-6</span></div>
              <div className="flex justify-between"><span>Avg Latency</span><span>1.8s</span></div>
              <div className="flex justify-between"><span>Daily Token Usage</span><span>2.4M / 10M</span></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
            <h4 className="font-semibold text-navy mb-3">Maintenance Mode</h4>
            <div className="flex items-center gap-3 mb-3">
              <button type="button" onClick={() => setMaintenanceMode(m => !m)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className="text-sm text-gray-600">{maintenanceMode ? 'Maintenance mode ON — all non-SA users see maintenance page' : 'Maintenance mode OFF'}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
            <h4 className="font-semibold text-navy mb-3">Session Timeout</h4>
            <div className="flex items-center gap-3">
              <input type="number" defaultValue={30} className="w-20 border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal" />
              <span className="text-sm text-gray-500">minutes idle</span>
              <button type="button" onClick={() => toast('Timeout updated!', 'success')} className="px-3 py-1.5 bg-teal text-white rounded-xl text-xs font-medium hover:bg-teal-700">Save</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
            <h4 className="font-semibold text-navy mb-3">Email Templates</h4>
            <div className="space-y-2">
              {['Invitation Email','Approval Notification','Rejection Email','Revision Request','Deadline Reminder'].map(t => (
                <div key={t} className="flex items-center justify-between py-2 border-b border-lgray-100 text-sm">
                  <span className="text-gray-600">{t}</span>
                  <button type="button" onClick={() => toast('Template editor opened (demo)', 'info')} className="text-xs text-teal font-medium hover:text-teal-700">Edit</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Platform Audit Log */}
      {tab === 'audit' && (
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-lgray-100">
            <p className="text-sm text-gray-500">Platform-wide audit log (all organizations)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-lgray border-b border-lgray-100">
                {['Timestamp','Actor','Action','Entity','IP','Outcome'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {AUDIT_LOG.map(e => (
                  <tr key={e.id} className="border-b border-lgray-100 hover:bg-lgray/50">
                    <td className="px-4 py-3 text-xs font-mono text-gray-500 whitespace-nowrap">{e.timestamp}</td>
                    <td className="px-4 py-3 text-xs font-medium text-navy">{e.actor}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{e.action}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{e.entity} / {e.entityId || '—'}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-400">{e.ip}</td>
                    <td className="px-4 py-3"><Badge text={e.outcome} type="outcome" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
