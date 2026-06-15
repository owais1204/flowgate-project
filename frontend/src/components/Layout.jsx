// src/components/Layout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, GitPullRequest, Search, PlusCircle,
  LogOut, Zap, ChevronRight, Bell
} from 'lucide-react';

const NAV = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/workflows',     icon: GitPullRequest,   label: 'Workflows' },
  { to: '/workflows/new', icon: PlusCircle,       label: 'New Request' },
  { to: '/search',        icon: Search,           label: 'Smart Search' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen overflow-hidden bg-ink-900">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-ink-700 bg-ink-900">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-ink-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-ink-900" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-lg text-ink-50 tracking-tight">
              FlowGate
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium group
                 ${isActive
                   ? 'bg-amber-500/15 text-amber-400'
                   : 'text-ink-300 hover:text-ink-100 hover:bg-ink-800'
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : ''}`} />
                  <span className="flex-1 font-body">{label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 text-amber-400/60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-ink-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-ink-900 text-xs font-bold font-display flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-ink-100 truncate">{user?.name}</p>
              <p className="text-xs text-ink-400 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-ink-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150 text-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
