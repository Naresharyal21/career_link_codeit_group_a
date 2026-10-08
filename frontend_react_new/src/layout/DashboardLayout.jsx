import { useEffect, useState } from 'react';
import apiClient from '../api';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';

/* ─── Nav item definitions with icons ─── */
const navItems = [
  {
    name: 'Dashboard', path: '/dashboard',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  },
  {
    name: 'My Applications', path: '/dashboard/applications', roles: ['js'],
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
  {
    name: 'Saved Jobs', path: '/dashboard/saved-jobs', roles: ['js'],
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" /></svg>,
  },
  {
    name: 'CV / Resume', path: '/dashboard/cv', roles: ['js'],
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  {
    name: 'Manage Jobs', path: '/dashboard/manage-jobs', roles: ['ep'],
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  },
  {
    name: 'Post a Job', path: '/dashboard/post-job', roles: ['ep'],
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  },
  {
    name: 'Profile Settings', path: '/dashboard/profile', roles: ['js', 'ep'],
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

const DashboardLayout = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [userData, setUserData]     = useState({ username: 'User', role: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem('access_token');
      if (!token) return;
      try {
        const res = await apiClient.get('/accounts/me/', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setUserData({ username: res.data.username, role: res.data.role });
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    navigate('/');
  };

  const currentItem = navItems.find(i => i.path === location.pathname);
  const pageTitle   = currentItem?.name || 'Dashboard';

  const visible = navItems.filter(item =>
    !item.roles || !userData.role || item.roles.includes(userData.role)
  );

  /* ─── Sidebar JSX ─── */
  const Sidebar = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link to="/" onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#4338ca)' }}>
            <span className="text-white font-extrabold text-sm">C</span>
          </div>
          <div>
            <p className="text-base font-extrabold text-gray-900 leading-none">
              Career<span className="text-blue-600">Link</span>
            </p>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-0.5">Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Navigation
        </p>
        {visible.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.name} to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`nav-item ${active ? 'active' : ''}`}>
              <span className={`nav-icon ${active ? 'text-blue-600' : ''}`}>{item.icon}</span>
              {item.name}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#4338ca)' }}>
            {(userData.username || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900 truncate">{userData.username}</p>
            <p className="text-xs text-gray-500">{userData.role === 'ep' ? 'Employer' : 'Job Seeker'}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="btn-danger w-full mt-2 justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/50 z-30 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col h-screen transition-transform duration-200 ease-in-out"
        style={{ transform: sidebarOpen ? 'translateX(0)' : undefined,
          ...(typeof window !== 'undefined' && window.innerWidth < 1024 && !sidebarOpen
            ? { transform: 'translateX(-100%)' } : {}) }}
      >
        <Sidebar />
      </aside>

      {/* We hide the sidebar off-screen on mobile without sidebarOpen using CSS */}
      <style>{`
        @media (max-width: 1023px) {
          aside { transform: translateX(-100%); }
          aside.open { transform: translateX(0); }
        }
      `}</style>

      {/* We toggle the class directly via JS */}
      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                Welcome back, {userData.username} 👋
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#4338ca)' }}>
              {(userData.username || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
