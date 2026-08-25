import { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({ username: 'User', role: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      try {
        const response = await axios.get('http://localhost:8000/api/v1/accounts/me/', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setUserData({ username: response.data.username, role: response.data.role });
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Applications', path: '/dashboard/applications', roles: ['js'] },
    { name: 'Saved Jobs', path: '/dashboard/saved-jobs', roles: ['js'] },
    { name: 'CV / Resume', path: '/dashboard/cv', roles: ['js'] },
    { name: 'Manage Jobs', path: '/dashboard/manage-jobs', roles: ['ep'] },
    { name: 'Profile Settings', path: '/dashboard/profile', roles: ['js', 'ep'] },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-screen sticky top-0">
        <Link to="/" className="text-2xl font-bold text-blue-800 mb-10 block">Career Link</Link>
        <nav className="space-y-2 flex-grow">
          {navLinks.map(function(link) {
            if (link.roles && userData.role && !link.roles.includes(userData.role)) return null;

            const isActive = location.pathname === link.path;
            const activeClasses = 'bg-blue-50 text-blue-800';
            const inactiveClasses = 'text-gray-600 hover:bg-gray-100';
            
            return (
                <Link 
                    key={link.name}
                    to={link.path} 
                    className={'block py-3 px-4 rounded-xl font-medium transition ' + (isActive ? activeClasses : inactiveClasses)}
                >
                    {link.name}
                </Link>
            )
          })}
        </nav>
        <div className="mt-auto border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Profile</p>
          <p className="font-semibold text-gray-900">{userData.username}</p>
          <p className="text-sm text-gray-500">{userData.role === 'ep' ? 'Employer' : 'Job Seeker'}</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-600 font-medium"
          >
            Logout
          </button>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
