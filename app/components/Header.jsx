"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
    { name: 'CATEGORY', href: '/category' },
    { name: 'ANIMAL', href: '/animal' },
    { name: 'GOD FIGURE', href: '/god-figure' },
    { name: 'UTILITY / DECOR', href: '/utility-decor' },
    { name: 'CUSTOM ORDERS', href: '/custom-orders' },
    { name: 'CONTACT US', href: '/contact-us' },
  ];

  return (
    <header className="w-full bg-[#FFF6EB] border-b border-[#A49C93]/30">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 h-20 md:h-20 flex items-center justify-between">
        
        {/* Left Side: Language & Currency (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-6 text-sm text-gray-700 flex-1">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src='/images/translate.svg' className='w-4' alt="translate" />
            <span className='font-mona'>English</span>
            <img src='/images/arrow-left.svg' className='w-3 ' alt="arrow" />
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3" />
            <span className='font-mona'>INR ₹</span>
            <img src='/images/arrow-left.svg' className='w-3 ' alt="arrow" />
          </div>
        </div>

        {/* Mobile Menu Icon (Mobile Only) */}
        <div className="lg:hidden flex-1">
          <button onClick={() => setIsMenuOpen(true)}>
            <Menu className="text-[#C08237]" size={28} />
          </button>
        </div>

        {/* Center: Logo (Centered in full width) */}
        <div className="flex flex-col items-center justify-center flex-1">
          <Link href="/">
            <img 
              src="/images/Group-56121.svg" 
              alt="Ratoomal's Logo" 
              className="h-10 md:h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right Side: Search, Wishlist, Login */}
        <div className="flex items-center justify-end gap-2 md:gap-4 flex-1">
          {/* Search (Desktop Only) */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="WHAT ARE YOU LOOKING FOR?"
              className="w-48 lg:w-64 font-mona pl-10 pr-4 py-2 bg-transparent text-gray-500 border border-[#A49C93] rounded-full text-[10px] focus:outline-none"
            />
            <img src='/images/search-normal.svg' className='w-4 absolute left-3 top-2.5' alt="search" />
          </div>

          {/* Wishlist Icon */}
          <button className="p-2 cursor-pointer rounded-full bg-[#C08237] border border-[#C08237] text-[#C08237] hover:bg-[#C08237] hover:text-white transition-colors">
           <img src='/images/heart.svg' className='w-5' />
           </button>
          {/* Login Button */}
          <Link href="/login">
          <button className="flex items-center gap-1 bg-[#C08237] text-white px-3 md:px-5 py-2 rounded-full">
            <img src='/images/profile.svg' className='w-4 brightness-0 invert' alt="login" />
            <span className='hidden sm:inline  text-xs '>LOGIN</span>
          </button>

          </Link>
        </div>
      </div>

      {/* Navigation Bar (Desktop Only) */}
      <nav className="hidden lg:block w-full ">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ul className="flex justify-center items-center gap-6 xl:gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className={`text-[11px] font-bold tracking-widest transition-all relative pb-1
                      ${isActive ? 'text-[#C08237] after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#C08237]' : 'text-gray-800 hover:text-[#C08237]'}
                    `}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          
          {/* Sidebar Content */}
          <div className="fixed top-0 left-0 w-[80%] h-full bg-[#FFF6EB] shadow-xl p-6 transition-transform">
            <div className="flex justify-between items-center mb-10">
              <img src="/images/Group-56121.svg" alt="logo" className="h-8" />
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={24} className="text-gray-700" />
              </button>
            </div>
            
            <ul className="space-y-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-xs font-bold tracking-widest ${pathname === link.href ? 'text-[#C08237]' : 'text-gray-800'}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;