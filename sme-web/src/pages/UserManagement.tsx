import { useState } from 'react';
import { Search, Plus, Upload, Pencil, UserX, UserCheck, Mail, X } from 'lucide-react';
import Badge from '../components/shared/Badge';
import Modal from '../components/shared/Modal';
import Drawer from '../components/shared/Drawer';
import { useToast } from '../components/shared/Toast';
import { USERS, PROJECTS } from '../data/mockData';

const ROLES = ['SME', 'RE', 'PM', 'VI', 'OA'];

export default function UserManagement() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [users, setUsers] = useState(USERS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('SME');

  const stats = [
    { label: 'Total Active Users', value: users.filter(u => u.status === 'Active').length },
    { label: 'Pending Invitations', value: users.filter(u => u.status === 'Pending').length },
    { label: 'Deactivated Users', value: users.filter(u => u.status === 'Deactivated').length },
    { label: 'Added This Month', value: 2 },
  ];

  const filtered = users.filter(u =>
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter.length === 0 || roleFilter.includes(u.role)) &&
    (statusFilter === 'All' || u.status === statusFilter)
  );

  const toggleRole = (role: string) => setRoleFilter(prev => prev.includes(role) ? prev.filter(x => x !== role) : [...prev, role]);

  const deactivate = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Deactivated' : 'Active' } : u));
    toast('User status updated.', 'success');
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-lgray-100 shadow-sm px-5 py-4">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className="text-2xl font-bold text-navy mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Actions + filters */}
      <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 border border-lgray-200 rounded-xl px-3 py-2 flex-1 min-w-0">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="flex-1 text-sm outline-none min-w-0" />
          {search && <button type="button" onClick={() => setSearch('')}><X size={13} className="text-gray-400" /></button>}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {ROLES.map(r => (
            <button type="button" key={r} onClick={() => toggleRole(r)}
              className={`px-2.5 py-1 rounded-full text-xs border ${roleFilter.includes(r) ? 'bg-navy text-white border-navy' : 'border-lgray-200 text-gray-500 hover:border-navy/40'}`}>{r}</button>
          ))}
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
          {['All','Active','Pending','Deactivated'].map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex gap-2 ml-auto">
          <button type="button" onClick={() => toast('CSV import not implemented in demo.', 'info')} className="flex items-center gap-1.5 px-3 py-2 border border-lgray-200 rounded-xl text-sm hover:bg-lgray">
            <Upload size={14} /> Import
          </button>
          <button type="button" onClick={() => setInviteOpen(true)} className="flex items-center gap-1.5 px-3 py-2 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700">
            <Plus size={14} /> Invite User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-lgray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-lgray-100 bg-lgray">
            {['User','Email','Role','Status','Projects','Last Login','Date Joined','Actions'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-lgray-100 hover:bg-lgray/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{u.avatar}</div>
                    <span className="font-medium text-navy">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                <td className="px-4 py-3"><Badge text={u.role} type="role" /></td>
                <td className="px-4 py-3"><Badge text={u.status} /></td>
                <td className="px-4 py-3 text-center text-xs text-gray-500">{u.projects}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{u.lastLogin}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{u.dateJoined}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setEditUser(u)} className="p-1.5 rounded hover:bg-lgray text-gray-400 hover:text-navy" title="Edit"><Pencil size={13} /></button>
                    <button type="button" onClick={() => deactivate(u.id)} className="p-1.5 rounded hover:bg-lgray text-gray-400 hover:text-orange-500" title={u.status === 'Active' ? 'Deactivate' : 'Reactivate'}>
                      {u.status === 'Active' ? <UserX size={13} /> : <UserCheck size={13} />}
                    </button>
                    {u.status === 'Pending' && (
                      <button type="button" onClick={() => toast('Invitation resent!', 'success')} className="p-1.5 rounded hover:bg-lgray text-gray-400 hover:text-teal" title="Resend invite"><Mail size={13} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">No users match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite User">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Email Address <span className="text-red-400">*</span></label>
            <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="user@company.com" className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Full Name <span className="text-red-400">*</span></label>
            <input value={inviteName} onChange={e => setInviteName(e.target.value)} className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Role <span className="text-red-400">*</span></label>
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal">
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Project Assignment (optional)</label>
            <select className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal">
              <option value="">None</option>
              {PROJECTS.map(p => <option key={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Personal Message (optional)</label>
            <textarea rows={2} className="w-full border border-lgray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setInviteOpen(false)} className="flex-1 py-2.5 border border-lgray-200 rounded-xl text-sm font-medium hover:bg-lgray">Cancel</button>
            <button type="button" onClick={() => { toast('Invitation sent!', 'success'); setInviteOpen(false); }} className="flex-1 py-2.5 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700">Send Invitation</button>
          </div>
        </div>
      </Modal>

      {/* Edit Drawer */}
      <Drawer open={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        {editUser && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-navy text-white text-lg font-bold flex items-center justify-center">{editUser.avatar}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
              <input defaultValue={editUser.name} className="w-full border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Email (read-only)</label>
              <input readOnly value={editUser.email} className="w-full border border-lgray-100 rounded-xl px-3 py-2 text-sm bg-lgray text-gray-400" />
              <p className="text-xs text-gray-400 mt-1">Contact support to change email</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Role</label>
              <select defaultValue={editUser.role} className="w-full border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Account Status</label>
              <select defaultValue={editUser.status} className="w-full border border-lgray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal">
                <option>Active</option><option>Deactivated</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditUser(null)} className="flex-1 py-2.5 border border-lgray-200 rounded-xl text-sm">Cancel</button>
              <button type="button" onClick={() => { toast('Changes saved!', 'success'); setEditUser(null); }} className="flex-1 py-2.5 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700">Save</button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
