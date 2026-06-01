import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HiMenu, HiX, HiSun, HiMoon, HiLogout, HiUser, HiAcademicCap } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = user
    ? [
        { to: '/', label: 'Home' },
        { to: '/vote', label: 'Vote' },
        { to: '/results', label: 'Results' },
        { to: '/readme', label: 'About' },
        ...(user.role === 'admin' || user.role === 'superadmin'
          ? [{ to: '/admin/dashboard', label: 'Admin' }]
          : []),
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/results', label: 'Results' },
        { to: '/readme', label: 'About' },
      ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-nacos-600/30 group-hover:scale-105 transition-transform">
              <HiAcademicCap className="text-white text-xl" />
            </div>
            <span className="font-bold text-lg hidden sm:block">
              <span className="gradient-text">GroupF1</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-nacos-50 dark:bg-nacos-900/30 text-nacos-600 dark:text-nacos-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              {dark ? <HiSun className="text-xl" /> : <HiMoon className="text-xl" />}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                >
                  <div className="w-7 h-7 gradient-bg rounded-full flex items-center justify-center">
                    <HiUser className="text-white text-sm" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.fullName?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <HiLogout className="text-xl" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? 'bg-nacos-50 dark:bg-nacos-900/30 text-nacos-600 dark:text-nacos-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-gray-100 dark:border-gray-700 my-2" />
            {user ? (
              <>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-sm">
                  <HiUser /> Profile
                </Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm w-full">
                  <HiLogout /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-4 py-3">
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1 btn-secondary text-center text-sm py-2">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1 btn-primary text-center text-sm py-2">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
