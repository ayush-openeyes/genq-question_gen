import { useState } from 'react';
import { Plus, Pencil, Copy, Trash2, AlertCircle } from 'lucide-react';
import Badge from '../components/shared/Badge';
import { useToast } from '../components/shared/Toast';
import { ROLES, PERMISSION_AREAS, PERMISSION_TYPES, DEFAULT_PERMISSIONS } from '../data/mockData';

export default function RolePermissions() {
  const toast = useToast();
  const [selectedRole, setSelectedRole] = useState(ROLES[2]);
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);

  const toggle = (area, perm) => {
    setPermissions(prev => {
      const updated = { ...prev, [area]: { ...prev[area], [perm]: !prev[area][perm] } };
      if (perm === 'View' && updated[area]['View'] === false) {
        const allOff = {};
        PERMISSION_TYPES.forEach(pt => { allOff[pt] = false; });
        updated[area] = allOff;
      }
      if (perm === 'Edit All' && updated[area]['Edit All'] === true) {
        updated[area]['View'] = true;
      }
      return updated;
    });
  };

  return (
    <div className="flex gap-5">
      {/* Role list */}
      <div className="w-64 flex-shrink-0 bg-white rounded-2xl border border-lgray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-lgray-100">
          <h3 className="font-semibold text-sm text-navy">Roles</h3>
        </div>
        <div className="divide-y divide-lgray-100">
          {ROLES.map(r => (
            <button type="button" key={r.id} onClick={() => setSelectedRole(r)}
              className={`w-full text-left px-4 py-3 hover:bg-lgray/50 transition-colors ${selectedRole.id === r.id ? 'bg-teal-50 border-l-2 border-teal' : ''}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-navy">{r.name}</span>
                <div className="flex gap-1 flex-shrink-0">
                  <button type="button" onClick={e => { e.stopPropagation(); toast('Clone role…', 'info'); }} className="p-1 rounded hover:bg-lgray text-gray-400 hover:text-gray-500"><Copy size={11} /></button>
                  <button type="button" onClick={e => { e.stopPropagation(); toast('Edit role name…', 'info'); }} className="p-1 rounded hover:bg-lgray text-gray-400 hover:text-gray-500"><Pencil size={11} /></button>
                  {r.type === 'Custom' && <button type="button" onClick={e => { e.stopPropagation(); toast('Delete role', 'info'); }} className="p-1 rounded hover:bg-lgray text-gray-400 hover:text-red-400"><Trash2 size={11} /></button>}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-1.5 py-0.5 rounded ${r.type === 'System' ? 'bg-gray-100 text-gray-500' : 'bg-purple-100 text-purple-700'}`}>{r.type}</span>
                <span className="text-xs text-gray-400">{r.users} users</span>
              </div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-lgray-100">
          <button type="button" onClick={() => toast('Create custom role…', 'info')} className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-lgray-200 rounded-xl text-xs text-gray-500 hover:border-teal/40 hover:text-teal transition-colors">
            <Plus size={13} /> Create Custom Role
          </button>
        </div>
      </div>

      {/* Permissions matrix */}
      <div className="flex-1 bg-white rounded-2xl border border-lgray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-lgray-100">
          <div>
            <h3 className="font-semibold text-navy">{selectedRole.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{selectedRole.users} users with this role</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <AlertCircle size={12} />
            <span>Disabling "View" removes all permissions for that area</span>
          </div>
        </div>

        {/* Legend */}
        <div className="px-5 py-2 bg-lgray/50 border-b border-lgray-100 flex flex-wrap gap-3 text-xs text-gray-500">
          {PERMISSION_TYPES.map(pt => (
            <span key={pt}><strong>{pt}:</strong> {
              pt === 'View' ? 'Can see the page' :
              pt === 'Create' ? 'Can create new items' :
              pt === 'Edit Own' ? 'Edit items they created' :
              pt === 'Edit All' ? 'Edit all items in scope' :
              pt === 'Delete' ? 'Can delete items' :
              pt === 'Approve' ? 'Can approve/reject items' :
              pt === 'Export' ? 'Can export data' : 'Can assign items/users'
            }</span>
          ))}
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-lgray-100 bg-lgray sticky top-0">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-48">Feature Area</th>
                {PERMISSION_TYPES.map(pt => (
                  <th key={pt} className="px-2 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{pt}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_AREAS.map(area => (
                <tr key={area} className="border-b border-lgray-100 hover:bg-lgray/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-navy">{area}</td>
                  {PERMISSION_TYPES.map(pt => {
                    const enabled = permissions[area]?.[pt] ?? false;
                    const viewDisabled = pt !== 'View' && !(permissions[area]?.['View']);
                    return (
                      <td key={pt} className="px-2 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={enabled}
                          disabled={viewDisabled}
                          onChange={() => toggle(area, pt)}
                          className="w-4 h-4 accent-teal cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-lgray-100">
          <button type="button" onClick={() => { setPermissions(DEFAULT_PERMISSIONS); toast('Reset to defaults.', 'info'); }} className="text-sm text-gray-500 hover:text-red-500 border border-lgray-200 px-3 py-1.5 rounded-xl hover:border-red-200">Reset to Default</button>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-lgray-200 rounded-xl text-sm hover:bg-lgray">Discard</button>
            <button type="button" onClick={() => toast('Permissions saved!', 'success')} className="px-4 py-2 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
