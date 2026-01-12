'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ShoppingCartIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  CreditCardIcon,
  ArchiveBoxIcon,
  XMarkIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Products', href: '/admin/products', icon: ArchiveBoxIcon },
  // { name: 'Orders', href: '/admin/orders', icon: ShoppingCartIcon },
  { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
  { name: 'Category', href: '/admin/categories', icon: ChartBarIcon },
  { name: 'Subcategory', href: '/admin/subcategories', icon: CreditCardIcon },
  // { name: 'Notifications', href: '/admin/notifications', icon: BellIcon },
  // { name: 'Settings', href: '/admin/settings', icon: CogIcon },
];


export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop with close functionality */}
      {isOpen && (
        <div 
          className="  z-40 bg-black bg-opacity-50 "
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed overflow-y-scroll hide-scrollbar inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:w-64`}
      >
        {/* Logo with close button for mobile */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <img 
              src='/images/logo.svg' 
              alt="Ratoomal's Logo" 
              className="h-8 w-auto"
            />
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-gray-500 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#FFF8F0] text-[#C08237]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-[#C08237]' : 'text-gray-400'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          {/* User Info */}
          <div className="flex items-center mb-4">
            <img
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              src="https://ui-avatars.com/api/?name=Admin+User&background=C08237&color=fff"
              alt="Admin"
            />
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@ratoomals.com</p>
            </div>
          </div>

        

          {/* Logout Button */}
          <button className="w-full mt-4 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center">
            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}