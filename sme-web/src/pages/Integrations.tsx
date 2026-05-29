import { useState } from 'react';
import { RefreshCw, Settings, Unlink, Key, Plus, Eye, EyeOff, Trash2, Copy } from 'lucide-react';
import Badge from '../components/shared/Badge';
import Modal from '../components/shared/Modal';
import { useToast } from '../components/shared/Toast';
import { INTEGRATIONS, API_KEYS } from '../data/mockData';

export default function Integrations() {
  const toast = useToast();
  const [tab, setTab] = useState('available');
  const [connectOpen, setConnectOpen] = useState(false);
  const [selectedInt, setSelectedInt] = useState(null);
  const [newKeyOpen, setNewKeyOpen] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState({});
  const [step, setStep] = useState(1);
  const [keyName, setKeyName] = useState('');

  const STATUS_MAP = {
    'Connected': 'text-green-600 bg-green-50 border-green-100',
    'Not Connected': 'text-gray-500 bg-gray-50 border-gray-100',
    'Configuration Error': 'text-red-600 bg-red-50 border-red-100',
  };

  const SYNC_MAP = {
    'Success': 'text-green-600',
    'Failed': 'text-red-500',
    'In Progress': 'text-blue-500',
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-white rounded-2xl border border-lgray-100 shadow-sm p-1.5">
        {[['available','Available Integrations'],['connected','Connected'],['apikeys','API Keys']].map(([k,l]) => (
          <button type="button" key={k} onClick={() => setTab(k)}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${tab === k ? 'bg-teal text-white shadow-sm' : 'text-gray-500 hover:text-navy hover:bg-lgray'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Available Integrations */}
      {tab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {INTEGRATIONS.map(int => (
            <div key={int.id} className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{int.icon}</span>
                  <div>
                    <h4 className="font-semibold text-navy text-sm">{int.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{int.description}</p>
                  </div>
                </div>
              </div>
              <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium mb-3 ${STATUS_MAP[int.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${int.status === 'Connected' ? 'bg-green-500' : int.status === 'Configuration Error' ? 'bg-red-500' : 'bg-gray-400'}`} />
                {int.status}
              </div>
              <button type="button" onClick={() => { setSelectedInt(int); setConnectOpen(true); setStep(1); }}
                className={`w-full py-2 rounded-xl text-sm font-medium transition-colors ${int.status === 'Connected' ? 'border border-lgray-200 hover:bg-lgray' : 'bg-teal text-white hover:bg-teal-700'}`}>
                {int.status === 'Connected' ? 'Configure' : int.status === 'Configuration Error' ? 'Fix Connection' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Connected */}
      {tab === 'connected' && (
        <div className="space-y-3">
          {INTEGRATIONS.filter(i => i.status !== 'Not Connected').map(int => (
            <div key={int.id} className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{int.icon}</span>
                  <div>
                    <h4 className="font-semibold text-navy">{int.name}</h4>
                    <p className="text-xs text-gray-400">Connected since {int.connectedSince}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {int.lastSync && (
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Last sync: {int.lastSync}</p>
                      <p className={`text-xs font-medium ${SYNC_MAP[int.syncStatus] || 'text-gray-400'}`}>{int.syncStatus}</p>
                    </div>
                  )}
                  <button type="button" onClick={() => toast('Sync started!', 'info')} className="flex items-center gap-1.5 px-3 py-1.5 border border-lgray-200 rounded-xl text-xs hover:bg-lgray"><RefreshCw size={12} /> Sync Now</button>
                  <button type="button" onClick={() => { setSelectedInt(int); setConnectOpen(true); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-lgray-200 rounded-xl text-xs hover:bg-lgray"><Settings size={12} /> Edit</button>
                  <button type="button" onClick={() => toast('Disconnected!', 'info')} className="flex items-center gap-1.5 px-3 py-1.5 border border-red-100 text-red-500 rounded-xl text-xs hover:bg-red-50"><Unlink size={12} /> Disconnect</button>
                </div>
              </div>
            </div>
          ))}
          {INTEGRATIONS.filter(i => i.status !== 'Not Connected').length === 0 && (
            <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-12 text-center text-gray-400">
              No connected integrations. Go to "Available Integrations" to connect one.
            </div>
          )}
        </div>
      )}

      {/* API Keys */}
      {tab === 'apikeys' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button type="button" onClick={() => setNewKeyOpen(true)} className="flex items-center gap-1.5 px-4 py-2 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700">
              <Plus size={14} /> Generate New Key
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-lgray border-b border-lgray-100">
                {['Key Name','Key','Created','Last Used','Scope','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {API_KEYS.map(k => (
                  <tr key={k.id} className="border-b border-lgray-100 hover:bg-lgray/50">
                    <td className="px-4 py-3 font-medium text-navy">{k.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 font-mono text-xs text-gray-500">
                        {revealedKeys[k.id] ? '••••••••••••••••abc123' : k.key}
                        <button type="button" onClick={() => setRevealedKeys(prev => ({ ...prev, [k.id]: !prev[k.id] }))} className="text-gray-400 hover:text-navy">
                          {revealedKeys[k.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                        <button type="button" onClick={() => toast('Key copied!', 'success')} className="text-gray-400 hover:text-teal"><Copy size={12} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{k.created}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{k.lastUsed}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {k.scope.map(s => <span key={s} className="text-[10px] bg-lgray text-gray-600 px-1.5 py-0.5 rounded font-mono">{s}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge text={k.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {k.status === 'Active' && <button type="button" onClick={() => toast('Key revoked!', 'warning')} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Connect wizard modal */}
      <Modal open={connectOpen} onClose={() => setConnectOpen(false)} title={`${selectedInt?.status === 'Connected' ? 'Configure' : 'Connect'} ${selectedInt?.name}`}>
        <div className="space-y-4">
          <div className="flex gap-1 mb-4">
            {['Credentials','Test','Sync Settings','Confirm'].map((s, i) => (
              <div key={s} className={`flex-1 text-center py-1.5 text-xs rounded ${step > i + 1 ? 'bg-green-100 text-green-700' : step === i + 1 ? 'bg-teal text-white' : 'bg-lgray text-gray-400'}`}>{i + 1}. {s}</div>
            ))}
          </div>
          {step === 1 && <>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1">API Endpoint URL</label><input placeholder="https://your-lms.example.com/api" className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1">API Key</label><input type="password" placeholder="Enter API key" className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal" /></div>
          </>}
          {step === 2 && <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 flex items-center gap-2"><span>✅</span> Connection test successful!</div>}
          {step === 3 && <div><label className="block text-xs font-semibold text-gray-500 mb-1">Sync Frequency</label><select className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal"><option>Every 6 hours</option><option>Daily</option><option>Weekly</option><option>Manual Only</option></select></div>}
          {step === 4 && <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-sm text-teal-700">Integration configured! Click Activate to go live.</div>}
          <div className="flex gap-3">
            {step > 1 && <button type="button" onClick={() => setStep(s => s - 1)} className="px-4 py-2 border border-lgray-200 rounded-xl text-sm hover:bg-lgray">Back</button>}
            <button type="button" onClick={() => { if (step < 4) setStep(s => s + 1); else { toast('Integration activated!', 'success'); setConnectOpen(false); setStep(1); } }}
              className="flex-1 py-2 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700">
              {step < 4 ? 'Next' : 'Activate'}
            </button>
          </div>
        </div>
      </Modal>

      {/* New key modal */}
      <Modal open={newKeyOpen} onClose={() => setNewKeyOpen(false)} title="Generate New API Key">
        <div className="space-y-4">
          <div><label className="block text-sm font-semibold text-navy mb-1.5">Key Name <span className="text-red-400">*</span></label><input value={keyName} onChange={e => setKeyName(e.target.value)} placeholder="e.g. LMS Integration Key" className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal" /></div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Permissions Scope</label>
            <div className="space-y-1.5">
              {['read:questions','write:questions','read:projects','write:projects','read:users'].map(s => (
                <label key={s} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"><input type="checkbox" className="accent-teal" /><code className="text-xs">{s}</code></label>
              ))}
            </div>
          </div>
          <div><label className="block text-sm font-semibold text-navy mb-1.5">IP Allowlist (optional)</label><input placeholder="192.168.1.1, 10.0.0.0/24" className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal" /></div>
          <div><label className="block text-sm font-semibold text-navy mb-1.5">Expiry Date (optional)</label><input type="date" className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal" /></div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700 flex items-start gap-2">
            <Key size={13} className="mt-0.5 flex-shrink-0" />
            <span>The key will only be shown once after generation. Make sure to copy it immediately.</span>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setNewKeyOpen(false)} className="flex-1 py-2.5 border border-lgray-200 rounded-xl text-sm">Cancel</button>
            <button type="button" onClick={() => { toast('API Key generated! (not shown in demo)', 'success'); setNewKeyOpen(false); }} className="flex-1 py-2.5 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700">Generate</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
