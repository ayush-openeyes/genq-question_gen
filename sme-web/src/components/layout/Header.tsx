import { useState, useRef, useEffect } from 'react';
import { SEARCH_FOCUS_DELAY_MS } from '../../lib/constants';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, LogOut, X } from 'lucide-react';
import { useAuth, ROLE_LABELS } from '../../context/AuthContext';
import { NOTIFICATIONS } from '../../data/mockData';
import MarqueeTicker from '../shared/MarqueeTicker';

export default function Header({ pageTitle }: { pageTitle: string }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const notifBtnRef = useRef(null);
  const avatarBtnRef = useRef(null);
  const searchInputRef = useRef(null);

  const unread = notifs.filter(n => !n.read).length;
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const handleLogout = async () => {
    await logout();
    setAvatarOpen(false);
    navigate('/generate', { replace: true });
  };

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!(event.target as Element).closest('[data-dropdown]')) {
        setNotifOpen(false);
        setAvatarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Close dropdowns on Escape */
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (searchOpen) { setSearchOpen(false); return; }
        if (notifOpen) { setNotifOpen(false); notifBtnRef.current?.focus(); }
        if (avatarOpen) { setAvatarOpen(false); avatarBtnRef.current?.focus(); }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [searchOpen, notifOpen, avatarOpen]);

  /* Auto-focus search input */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), SEARCH_FOCUS_DELAY_MS);
  }, [searchOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-lgray-100">
        <h1 className="text-lg font-semibold text-navy">{pageTitle}</h1>

        <div className="flex items-center gap-2">
          {/* Skip to content */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-teal focus:text-white focus:rounded-lg focus:text-sm"
          >
            Skip to main content
          </a>

          {/* Search */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
            className="p-2 rounded-lg hover:bg-lgray text-gray-400 hover:text-navy transition-colors focus-visible:ring-2 focus-visible:ring-teal"
          >
            <Search size={18} aria-hidden="true" />
          </button>

          {/* Notification bell */}
          <div className="relative" data-dropdown>
            <button
              ref={notifBtnRef}
              type="button"
              onClick={() => { setNotifOpen(o => !o); setAvatarOpen(false); }}
              aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
              aria-expanded={notifOpen}
              aria-haspopup="true"
              className="relative p-2 rounded-lg hover:bg-lgray text-gray-400 hover:text-navy transition-colors focus-visible:ring-2 focus-visible:ring-teal"
            >
              <Bell size={18} aria-hidden="true" />
              {unread > 0 && (
                <span aria-hidden="true" className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                role="menu"
                aria-label="Notifications menu"
                className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-overlay border border-lgray-100 z-50 scale-in"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-lgray-100">
                  <span className="font-semibold text-sm text-navy">Notifications</span>
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs text-teal hover:text-teal-700 font-medium focus-visible:ring-2 focus-visible:ring-teal rounded"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifs.slice(0, 5).map(n => (
                    <button
                      key={n.id}
                      type="button"
                      role="menuitem"
                      className={`w-full text-left px-4 py-3 hover:bg-lgray transition-colors border-b border-lgray-100/50 focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-inset ${!n.read ? 'bg-teal-50/40' : ''}`}
                      onClick={() => { navigate(n.link); setNotifOpen(false); }}
                    >
                      <div className="flex gap-3 items-start">
                        <div aria-hidden="true" className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${!n.read ? 'bg-teal' : 'bg-transparent'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${!n.read ? 'font-semibold text-navy' : 'font-medium text-gray-600'} truncate`}>{n.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[11px] text-gray-400 mt-1">{n.timestamp}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { navigate('/notifications'); setNotifOpen(false); }}
                  className="w-full py-2.5 text-xs text-teal font-medium text-center hover:bg-lgray transition-colors rounded-b-xl focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-inset"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>

          {/* Avatar dropdown */}
          <div className="relative" data-dropdown>
            <button
              ref={avatarBtnRef}
              type="button"
              onClick={() => { setAvatarOpen(o => !o); setNotifOpen(false); }}
              aria-label={`User menu for ${user?.name}`}
              aria-expanded={avatarOpen}
              aria-haspopup="true"
              className="flex items-center gap-2 pl-2 pr-1 py-1.5 rounded-lg hover:bg-lgray transition-colors focus-visible:ring-2 focus-visible:ring-teal"
            >
              <div aria-hidden="true" className="w-7 h-7 rounded-full bg-navy flex items-center justify-center text-xs font-bold text-white">{user?.avatar}</div>
              <span className="text-sm font-medium text-navy hidden sm:block">{user?.name}</span>
              <ChevronDown size={14} className="text-gray-400" aria-hidden="true" />
            </button>

            {avatarOpen && (
              <div
                role="menu"
                aria-label="User menu"
                className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-overlay border border-lgray-100 z-50 scale-in"
              >
                <div className="px-4 py-3 border-b border-lgray-100">
                  <p className="text-sm font-semibold text-navy">{user?.name}</p>
                  <p className="text-xs text-gray-400">{ROLE_LABELS[role]}</p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-lgray transition-colors text-gray-600 focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-inset"
                >
                  <User size={14} aria-hidden="true" /> Profile
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-lgray transition-colors text-red-500 rounded-b-xl focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-inset"
                >
                  <LogOut size={14} aria-hidden="true" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
        </div>
        <MarqueeTicker />
      </header>

      {/* Global search overlay */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20"
          onClick={(event) => event.target === event.currentTarget && setSearchOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-overlay w-full max-w-2xl mx-4 scale-in">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-lgray-100">
              <Search size={18} className="text-gray-400" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search questions, projects, users…"
                aria-label="Search"
                className="flex-1 outline-none text-navy text-sm"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="focus-visible:ring-2 focus-visible:ring-teal rounded"
              >
                <X size={18} className="text-gray-400" aria-hidden="true" />
              </button>
            </div>
            <div className="px-5 py-4 text-sm text-gray-400">Start typing to search…</div>
          </div>
        </div>
      )}
    </>
  );
}
