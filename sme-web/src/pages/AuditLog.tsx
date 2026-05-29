import { useState } from 'react';
import { Search, Download, ChevronDown, ChevronUp } from 'lucide-react';
import Badge from '../components/shared/Badge';
import { useToast } from '../components/shared/Toast';
import { AUDIT_LOG } from '../data/mockData';

const EVENT_TYPES = ['Question Approved','Question Created','Question Rejected','User Invited','Project Created','Role Permission Changed','Login Failed','Account Deactivated'];
const ENTITY_TYPES = ['Question','Project','User','Role','Assessment','Organization','Login'];

export default function AuditLog() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [actionType, setActionType] = useState('');
  const [entityType, setEntityType] = useState('');
  const [outcome, setOutcome] = useState('All');
  const [dateRange, setDateRange] = useState('');
  const [expanded, setExpanded] = useState({});

  const filtered = AUDIT_LOG.filter(e =>
    (!search || e.actor.toLowerCase().includes(search.toLowerCase()) || e.action.toLowerCase().includes(search.toLowerCase())) &&
    (!actionType || e.action === actionType) &&
    (!entityType || e.entity === entityType) &&
    (outcome === 'All' || e.outcome === outcome)
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 border border-lgray-200 rounded-xl px-3 py-2 flex-1 min-w-0">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by actor or action…" className="text-sm outline-none flex-1 min-w-0" />
        </div>
        <input type="date" value={dateRange} onChange={e => setDateRange(e.target.value)} className="border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal" />
        <select value={actionType} onChange={e => setActionType(e.target.value)} className="border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
          <option value="">Action Type: All</option>
          {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={entityType} onChange={e => setEntityType(e.target.value)} className="border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
          <option value="">Entity: All</option>
          {ENTITY_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={outcome} onChange={e => setOutcome(e.target.value)} className="border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
          {['All','Success','Failed'].map(o => <option key={o}>{o}</option>)}
        </select>
        <button type="button" onClick={() => toast('Audit log exported!', 'success')} className="flex items-center gap-1.5 px-3 py-2 border border-lgray-200 rounded-xl text-sm hover:bg-lgray ml-auto">
          <Download size={14} /> Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-lgray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">{filtered.length} log entries</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-lgray border-b border-lgray-100">
              {['Timestamp','Actor','Action','Entity','Outcome','Details'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(e => (
                <>
                  <tr key={e.id} className="border-b border-lgray-100 hover:bg-lgray/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-gray-500 whitespace-nowrap">{e.timestamp}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-navy text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{e.actorAvatar}</div>
                        <div>
                          <p className="text-xs font-medium text-navy">{e.actor}</p>
                          {e.actorRole && <Badge text={e.actorRole} type="role" size="xs" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-700">{e.action}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-600">{e.entity}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{e.entityId}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[120px]" title={e.entityName}>{e.entityName}</p>
                    </td>
                    <td className="px-4 py-3"><Badge text={e.outcome} type="outcome" /></td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => setExpanded(prev => ({ ...prev, [e.id]: !prev[e.id] }))} className="text-xs text-teal hover:text-teal-700 flex items-center gap-1">
                        {expanded[e.id] ? <><ChevronUp size={11} /> Hide</> : <><ChevronDown size={11} /> Show</>}
                      </button>
                    </td>
                  </tr>
                  {expanded[e.id] && (
                    <tr key={`${e.id}-exp`} className="bg-lgray/50">
                      <td colSpan={6} className="px-8 py-3">
                        <div className="font-mono text-xs text-gray-500 bg-white rounded-lg p-3 border border-lgray-100">
                          <pre>{JSON.stringify({ actor: e.actor, action: e.action, entity: `${e.entity}/${e.entityId}`, timestamp: e.timestamp, ip: e.ip, outcome: e.outcome }, null, 2)}</pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No audit entries match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
