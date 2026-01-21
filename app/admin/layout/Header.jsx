'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  Bars3Icon,
  ChevronDownIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { Popover, Transition } from '@headlessui/react';
import axios from 'axios';

export default function Header({ sidebarOpen, toggleSidebar }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log('🔐 Attempting logout...');

      // Call logout API
      await axios.post('/api/admin/auth/logout');

      // Clear localStorage
      localStorage.removeItem('adminToken');

      console.log('✅ Logged out successfully');

      // Redirect to login
      router.push('/login/admin');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still redirect on error
      localStorage.removeItem('adminToken');
      router.push('/login/admin');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center flex-1">
          {/* Mobile Menu Button - Always visible on mobile */}
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          {/* Search - Hidden on small mobile, visible on larger */}
          <div className="relative ml-4 max-w-md flex-1 hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, products, customers..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#C08237] focus:border-transparent text-sm"
            />
          </div>

          {/* Mobile Search Icon */}
          <button className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 sm:hidden ml-auto">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <button className="relative p-2 text-gray-600 rounded-lg hover:bg-gray-100">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* User Profile Dropdown */}
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 focus:outline-none">
                  <div className="flex items-center">
                    <img
                      className="w-8 h-8 rounded-full border-2 border-white"
                      src="https://ui-avatars.com/api/?name=Admin+User&background=C08237&color=fff"
                      alt="Admin"
                    />
                    <ChevronDownIcon className={`w-4 h-4 ml-1 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </div>
                </Popover.Button>

                <Transition
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500 truncate">admin@ratoomals.com</p>
                    </div>
                    
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                      {isLoggingOut ? 'Logging out...' : 'Sign Out'}
                    </button>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      </div>

      {/* Mobile Search Bar - Appears when needed */}
      {searchQuery && (
        <div className="px-4 py-2 border-t border-gray-100 sm:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="block w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#C08237]"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}