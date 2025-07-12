import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { name: 'Todos', path: '/todos' },
  { name: 'Pomodoro', path: '/pomodoro' },
  { name: 'Kanban', path: '/kanban' },
  { name: 'Eisenhover Matrix', path: '/eisenhover-matrix' },
  { name: 'Settings', path: '/settings' },
  { name: 'Profile', path: '/profile' },
];

const Layout: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <div className="text-2xl font-bold mb-8">PomoKan</div>
        <nav className="flex-1">
          <ul className="space-y-4">
            {navItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2 rounded hover:bg-gray-700 transition-colors ${location.pathname.startsWith(item.path) ? 'bg-gray-800' : ''}`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={logout}
          className="mt-8 w-full text-red-400 hover:text-red-600 font-semibold text-left px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 