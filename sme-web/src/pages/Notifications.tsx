import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X, Bell, AtSign, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NOTIFICATIONS } from '../data/mockData';
import { useToast } from '../components/shared/Toast';

const TYPE_ICONS = { success: CheckCircle2, error: XCircle, warning: AlertCircle, info: Info };
const TYPE_COLORS = {
  success: 'text-green-500 bg-green-50',
  error: 'text-red-500 bg-red-50',
  warning: 'text-yellow-500 bg-yellow-50',
  info: 'text-blue-500 bg-blue-50',
};

const PREF_EVENTS = [
  'My question was approved',
  'My question was rejected',
  'My question requires revision',
  'A question was submitted for my review',
  'My review queue is exceeding 20 items',
  'I was assigned to a new project',
  'A project I\'m in changed status',
  'A new team member was added to my project',
  'An assessment I\'m associated with was published',
  'A deadline is approaching (within 3 days)',
  'An @mention in a comment',
  'A user I manage was deactivated',
  'System maintenance / downtime notice',
];

function groupByDate(notifs) {
  const today = [], yesterday = [], thisWeek = [], older = [];
  notifs.forEach(n => {
    if (n.timestamp.includes('hour') || n.timestamp.includes('min')) today.push(n);
    else if (n.timestamp.includes('1 day')) yesterday.push(n);
    else if (n.timestamp.includes('days')) thisWeek.push(n);
    else older.push(n);
  });
  return [['Today', today], ['Yesterday', yesterday], ['This Week', thisWeek], ['Older', older]];
}

export default function Notifications() {
  const navigate = useNavigate();
  const toast = useToast();
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState('All');
  const [prefs, setPrefs] = useState(() => Object.fromEntries(PREF_EVENTS.map(e => [e, { inApp: true, email: e.includes('deadline') || e.includes('review') }])));

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const filtered = notifs.filter(n =>
    filter === 'All' ? true :
    filter === 'Unread' ? !n.read :
    filter === 'System' ? n.type === 'info' :
    false
  );

  const groups = groupByDate(filtered);

  return (
    <div className="flex gap-5">
      {/* Left: Feed */}
      <div className="flex-1 min-w-0 space-y-4">
        <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-4 flex items-center justify-between">
          <div className="flex gap-1">
            {['All','Unread','Mentions','System'].map(f => (
              <button type="button" key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg ${filter === f ? 'bg-teal text-white' : 'text-gray-500 hover:bg-lgray'}`}>
                {f}
              </button>
            ))}
          </div>
          <button type="button" onClick={markAllRead} className="text-xs text-teal font-medium hover:text-teal-700">Mark all as read</button>
        </div>

        {groups.map(([label, items]) => items.length === 0 ? null : (
          <div key={label}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-2">{label}</p>
            <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm divide-y divide-lgray-100">
              {items.map(n => {
                const Icon = TYPE_ICONS[n.type] || Info;
                return (
                  <div key={n.id} className={`flex gap-3 px-5 py-4 ${!n.read ? 'border-l-2 border-teal bg-teal-50/20' : ''}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[n.type] || TYPE_COLORS.info}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.read ? 'font-semibold text-navy' : 'font-medium text-gray-700'}`}>{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">{n.timestamp}</span>
                        <button type="button" onClick={() => navigate(n.link)} className="text-xs text-teal font-medium hover:text-teal-700">View →</button>
                      </div>
                    </div>
                    <button type="button" onClick={() => dismiss(n.id)} className="p-1.5 rounded-lg hover:bg-lgray text-gray-400 hover:text-gray-500 flex-shrink-0 self-start">
                      <X size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-16 text-center text-gray-400">
            <Bell size={32} className="mx-auto mb-3 opacity-20" />
            <p>No notifications to show.</p>
          </div>
        )}
      </div>

      {/* Right: Preferences */}
      <div className="w-72 flex-shrink-0 bg-white rounded-2xl border border-lgray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-lgray-100 flex items-center gap-2">
          <Settings size={14} className="text-gray-400" />
          <h3 className="font-semibold text-sm text-navy">Notification Preferences</h3>
        </div>
        <div className="overflow-y-auto max-h-[600px]">
          <div className="flex px-4 py-2 border-b border-lgray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <span className="flex-1">Event</span>
            <span className="w-14 text-center">In-App</span>
            <span className="w-14 text-center">Email</span>
          </div>
          {PREF_EVENTS.map(event => (
            <div key={event} className="flex items-center px-4 py-2.5 border-b border-lgray-100/50 hover:bg-lgray/30">
              <span className="flex-1 text-xs text-gray-600 pr-2">{event}</span>
              <div className="w-14 flex justify-center">
                <input type="checkbox" checked={prefs[event]?.inApp ?? true}
                  onChange={e => setPrefs(p => ({ ...p, [event]: { ...p[event], inApp: e.target.checked } }))}
                  className="accent-teal cursor-pointer" />
              </div>
              <div className="w-14 flex justify-center">
                <input type="checkbox" checked={prefs[event]?.email ?? false}
                  onChange={e => setPrefs(p => ({ ...p, [event]: { ...p[event], email: e.target.checked } }))}
                  className="accent-teal cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-lgray-100">
          <button type="button" onClick={() => toast('Preferences saved!', 'success')} className="w-full py-2.5 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700">Save Preferences</button>
        </div>
      </div>
    </div>
  );
}
