import { useCallback, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, FileText, LogOut, Wand2,
} from 'lucide-react';
import { useAuth, ROLE_LABELS } from '../../context/AuthContext';
import { useHistorySessions } from '../../context/HistoryContext';
import { hasRouteAccess } from '../../lib/rbac';
import openEyesLogo from '../../assets/openeyes-logo.png';

const NAV_ITEMS = [
  { label: 'Question Generate', icon: Wand2, path: '/generate' },
];

const PDF_FILES = ['aws_documentaion.pdf', 'clinic_trail_v2.pdf', 'google_reserch_rag.pdf', 'us_research.pdf'];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([]);
  const { user, role, logout } = useAuth();
  const { historySessions, activeHistoryId, selectHistory } = useHistorySessions();
  const navigate = useNavigate();

  const visibleItems = useMemo(
    () => NAV_ITEMS.filter(item => hasRouteAccess(item.path, role)),
    [role]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/generate', { replace: true });
  }, [logout, navigate]);

  const handleLogoClick = useCallback(() => navigate('/generate'), [navigate]);

  const handleCollapseToggle = useCallback(() => setCollapsed(prev => !prev), []);

  const togglePdfSelection = useCallback((file: string) => {
    setSelectedPdfs(current => (
      current.includes(file)
        ? current.filter(selectedFile => selectedFile !== file)
        : [...current, file]
    ));
  }, []);

  const avatarDisplay = user?.avatar || (user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?');

  return (
    <aside
      aria-label="Main navigation"
      className={`flex flex-col bg-navy text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} min-h-screen flex-shrink-0`}
    >
      <button
        type="button"
        aria-label="Go to dashboard"
        onClick={handleLogoClick}
        className={`flex items-center gap-3 px-4 py-4 border-b border-white/10 transition-colors hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-inset ${collapsed ? 'justify-center' : ''}`}
      >
        <img
          src={openEyesLogo}
          alt="OpenEyes Technologies"
          className={`flex-shrink-0 object-contain ${collapsed ? 'h-10 w-10' : 'h-14 w-14'}`}
        />
        {!collapsed && (
          <div className="min-w-0 text-left">
            <span className="block text-sm font-bold leading-tight tracking-wide text-white">OpenEyes</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-teal">Technologies</span>
          </div>
        )}
      </button>

      <nav aria-label="Application menu" className="flex-1 py-4 overflow-y-auto">
        {visibleItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-inset ${
                  isActive
                    ? 'bg-teal/20 text-teal border-l-2 border-teal'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
            >
              <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
            </NavLink>
          );
        })}

        {!collapsed && (
          <div className="mx-2 mt-5 rounded-xl border border-white/10 bg-white/[0.06] p-3 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">PDF Library</span>
              <span className="rounded-full bg-teal/15 px-2 py-0.5 text-[10px] font-bold text-teal">4 files</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PDF_FILES.map(file => (
                <button
                  type="button"
                  key={file}
                  title={file}
                  aria-pressed={selectedPdfs.includes(file)}
                  onClick={() => togglePdfSelection(file)}
                  className={`group flex min-h-24 flex-col justify-between rounded-lg border p-2.5 text-left shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-teal ${
                    selectedPdfs.includes(file)
                      ? 'border-teal bg-teal/20 text-white shadow-[0_0_0_1px_rgba(0,180,216,0.35)]'
                      : 'border-white/10 bg-white/[0.08] text-white/80 hover:border-teal/35 hover:bg-teal/10'
                  }`}
                >
                  <div className={`relative h-10 w-8 rounded-sm border shadow-sm transition-colors ${
                    selectedPdfs.includes(file) ? 'border-white/70 bg-white' : 'border-teal/40 bg-white/95'
                  }`}>
                    <div className="absolute right-0 top-0 h-2.5 w-2.5 rounded-bl-sm bg-teal/20" />
                    <FileText size={15} className="absolute left-2 top-3 text-teal" aria-hidden="true" />
                  </div>
                  <span className="mt-2 line-clamp-2 break-words text-[11px] font-semibold leading-snug text-white/85 group-hover:text-white">
                    {file}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!collapsed && (
          <div className="mx-2 mt-3 rounded-xl border border-white/10 bg-white/[0.06] p-3 shadow-card">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Recent History</span>
              <span className="rounded-full bg-teal/15 px-2 py-0.5 text-[10px] font-bold text-teal">{historySessions.length}</span>
            </div>

            <div className="space-y-1.5">
              {historySessions.slice(0, 5).map(session => (
                <button
                  type="button"
                  key={session.id}
                  onClick={() => selectHistory(session.id)}
                  aria-pressed={activeHistoryId === session.id}
                  className={`w-full rounded-lg border px-2.5 py-2 text-left transition-all focus-visible:ring-2 focus-visible:ring-teal ${
                    activeHistoryId === session.id
                      ? 'border-teal bg-teal/18 text-white shadow-[0_0_0_1px_rgba(0,180,216,0.28)]'
                      : 'border-white/10 bg-white/[0.07] text-white/75 hover:border-teal/35 hover:bg-teal/10 hover:text-white'
                  }`}
                >
                  <span className="block truncate text-[11px] font-semibold leading-tight">{session.title}</span>
                  <span className="mt-1 block text-[10px] text-white/40">
                    {session.questions.length} generated questions
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className={`flex items-center gap-3 px-4 py-4 border-t border-white/10 ${collapsed ? 'justify-center flex-col' : ''}`}>
        <div
          className="w-8 h-8 rounded-full bg-teal/30 border border-teal/50 flex items-center justify-center text-xs font-bold text-teal flex-shrink-0"
          aria-hidden="true"
        >
          {avatarDisplay}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/50 truncate">{ROLE_LABELS[role]}</p>
              {user?.org && (
                <p className="text-[10px] text-white/30 truncate">{user.org}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Reset session"
              title="Reset session"
              className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-teal"
            >
              <LogOut size={15} aria-hidden="true" />
            </button>
          </>
        )}
        {collapsed && (
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Reset session"
            title="Reset session"
            className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-teal"
          >
            <LogOut size={15} aria-hidden="true" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleCollapseToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
        className="flex items-center justify-center py-2 border-t border-white/10 hover:bg-white/10 transition-colors text-white/50 hover:text-white focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-inset"
      >
        {collapsed ? <ChevronRight size={16} aria-hidden="true" /> : <ChevronLeft size={16} aria-hidden="true" />}
      </button>
    </aside>
  );
}
