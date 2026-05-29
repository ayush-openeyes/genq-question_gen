import { useState } from 'react';
import { Search, Eye, Pause, Trash2 } from 'lucide-react';
import Badge from '../components/shared/Badge';
import { useToast } from '../components/shared/Toast';
import { useAuth } from '../context/AuthContext';
import { ORGANIZATIONS } from '../data/mockData';

function OATabs() {
  const toast = useToast();
  const [tab, setTab] = useState('profile');
  const TABS = [['profile','Org Profile'],['defaults','Defaults & Preferences'],['integrations','Integrations'],['subscription','Subscription']];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-white rounded-2xl border border-lgray-100 shadow-sm p-1.5">
        {TABS.map(([k,l]) => (
          <button type="button" key={k} onClick={() => setTab(k)}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all ${tab === k ? 'bg-teal text-white shadow-sm' : 'text-gray-500 hover:text-navy hover:bg-lgray'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5 space-y-4">
        {tab === 'profile' && (
          <>
            <h4 className="font-semibold text-navy">Organization Profile</h4>
            <div className="grid grid-cols-2 gap-4">
              {[['Organization Name','Acme Corp'],['Primary Contact','Morgan Lee'],['Contact Email','morgan@acme.com']].map(([l,v]) => (
                <div key={l}><label className="block text-xs text-gray-500 mb-1">{l}</label><input defaultValue={v} className="w-full border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal" /></div>
              ))}
              <div><label className="block text-xs text-gray-500 mb-1">Organization Type</label>
                <select className="w-full border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
                  {['Education','Government','Enterprise','Nonprofit','Credentialing Body'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="block text-xs text-gray-500 mb-1">Country</label><select className="w-full border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal"><option>United States</option><option>Canada</option><option>United Kingdom</option></select></div>
              <div><label className="block text-xs text-gray-500 mb-1">Timezone</label><select className="w-full border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal"><option>America/New_York</option><option>America/Los_Angeles</option><option>Europe/London</option></select></div>
            </div>
            <button type="button" onClick={() => toast('Saved!', 'success')} className="px-4 py-2 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700">Save Changes</button>
          </>
        )}

        {tab === 'defaults' && (
          <>
            <h4 className="font-semibold text-navy">Defaults & Preferences</h4>
            <div className="space-y-4">
              <div><label className="block text-xs text-gray-500 mb-1">Default Question Language</label><select className="w-48 border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal"><option>English</option><option>French</option><option>Spanish</option></select></div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">Default Question Formats</label>
                <div className="flex flex-wrap gap-2">
                  {['MCQ','True/False','Open-Ended','Rating Scale','Fill in Blank'].map(f => (
                    <label key={f} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer"><input type="checkbox" defaultChecked className="accent-teal" />{f}</label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">Default Difficulty Distribution</label>
                <div className="space-y-2">
                  {[['Easy',30],['Medium',50],['Hard',20]].map(([l,v]) => (
                    <div key={l} className="flex items-center gap-3 text-sm">
                      <span className="w-14 text-gray-600">{l}</span>
                      <input type="range" min={0} max={100} defaultValue={v} className="flex-1 accent-teal" />
                      <span className="w-8 text-gray-500 text-xs">{v}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <label className="flex items-center justify-between text-sm text-gray-600 max-w-sm">
                Require 2-Factor Authentication
                <input type="checkbox" className="accent-teal" />
              </label>
            </div>
            <button type="button" onClick={() => toast('Saved!', 'success')} className="px-4 py-2 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700">Save Changes</button>
          </>
        )}

        {tab === 'integrations' && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Manage integrations on the <a href="/settings/integrations" className="text-teal hover:underline">Integrations page</a>.</p>
          </div>
        )}

        {tab === 'subscription' && (
          <>
            <h4 className="font-semibold text-navy">Subscription & Usage</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[['Current Plan','Enterprise'],['Questions This Month','182 / 1000'],['Users','24 / 50'],['Storage','1.2 GB / 10 GB']].map(([l,v]) => (
                <div key={l} className="border border-lgray-100 rounded-xl p-3"><p className="text-xs text-gray-400">{l}</p><p className="font-semibold text-navy mt-1">{v}</p></div>
              ))}
            </div>
            <button type="button" onClick={() => toast('Request sent to sales team.', 'info')} className="text-sm text-teal font-medium hover:text-teal-700">Request Upgrade →</button>
          </>
        )}
      </div>
    </div>
  );
}

function SAOrgList() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const filtered = ORGANIZATIONS.filter(o => !search || o.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 border border-lgray-200 bg-white rounded-xl px-3 py-2 flex-1 max-w-sm">
          <Search size={15} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search organizations…" className="text-sm outline-none flex-1" />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-lgray border-b border-lgray-100">
            {['Org Name','Admin Contact','Plan','Users','Questions','Storage','Status','Actions'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-b border-lgray-100 hover:bg-lgray/50 transition-colors">
                <td className="px-4 py-3 font-medium text-navy">{o.name}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{o.admin}</td>
                <td className="px-4 py-3"><span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">{o.plan}</span></td>
                <td className="px-4 py-3 text-gray-600">{o.users}</td>
                <td className="px-4 py-3 text-gray-600">{o.questions.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{o.storage}</td>
                <td className="px-4 py-3"><Badge text={o.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => toast('View org detail', 'info')} className="p-1.5 rounded hover:bg-lgray text-gray-400 hover:text-teal" title="View"><Eye size={13} /></button>
                    <button type="button" onClick={() => toast('Impersonate OA (audited)', 'warning')} className="p-1.5 rounded hover:bg-lgray text-gray-400 hover:text-orange-500" title="Impersonate"><span className="text-xs">👤</span></button>
                    <button type="button" onClick={() => toast('Suspend org?', 'warning')} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500" title="Suspend"><Pause size={13} /></button>
                    <button type="button" onClick={() => toast('Delete with cascade warning!', 'error')} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500" title="Delete"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OrganizationManagement() {
  const { role } = useAuth();
  return role === 'SA' ? <SAOrgList /> : <OATabs />;
}
