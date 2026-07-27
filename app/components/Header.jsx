"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Menu, X, ChevronRight, Heart, ShoppingBag, Globe } from 'lucide-react';
import Cookies from 'js-cookie';
import { useTranslation } from '@/hooks/useTranslation';
import { useWishlistStore } from '@/store/wishlistStore';
import { useInquiryCartStore } from '@/store/inquiryCartStore';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [mobileSubDropdown, setMobileSubDropdown] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Get auth state from custom hook
  const { isLoggedIn, isLoading: authLoading, isClient, logout } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState('INR ₹');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  // Hide on scroll down, show on scroll up
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Always show when near top
      if (currentY < 80) {
        setIsHeaderVisible(true);
      } else if (currentY > lastScrollY.current + 8) {
        // Scrolling down — hide
        setIsHeaderVisible(false);
        setActiveDropdown(null);
      } else if (currentY < lastScrollY.current - 4) {
        // Scrolling up — show
        setIsHeaderVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchRef = useRef(null);
  const langRef = useRef(null);
  const currencyRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Delay timer for desktop dropdown hover close (so it stays open briefly)
  const dropdownTimeoutRef = useRef(null);

  const handleDropdownEnter = (name) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 350);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  // Currently selected category / subcategory (from URL) so the matching card
  // keeps its "hover" styling even after the dropdown closes / page loads
  const activeCategoryId = searchParams.get('id');
  const activeSubCategoryId = searchParams.get('subid');

  // Get translation hook
  const { currentLanguage, languages, changeLanguage, getCurrentLanguageInfo, isLoading: translationLoading } = useTranslation();

  // Get wishlist from Zustand store
  const { wishlist, initialize } = useWishlistStore();

  // Get inquiry cart from Zustand store
  const { getCartCount, initialize: initializeCart } = useInquiryCartStore();

  // Manual individual category links - HIDDEN as requested
  const manualCategoryLinks = [];

  // Language options - now from translation hook
  const languageOptions = languages;

  // Currency options
  const currencyOptions = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: 'https://flagcdn.com/w20/in.png' },
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: 'https://flagcdn.com/w20/us.png' },
    // { code: 'EUR', symbol: '€', name: 'Euro', flag: 'https://flagcdn.com/w20/eu.png' },
    // { code: 'GBP', symbol: '£', name: 'British Pound', flag: 'https://flagcdn.com/w20/gb.png' },
    // { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: 'https://flagcdn.com/w20/jp.png' },
    // { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: 'https://flagcdn.com/w20/au.png' }
  ];

  // Additional effect to check auth state when pathname changes
  useEffect(() => {
    // This is now handled by the useAuth hook
  }, [pathname]);

  // Fetch categories, subcategories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 1. Initialize wishlist and cart from store
        initialize();
        initializeCart();

        // 2. Fetch categories (using public API)
        try {
          const categoriesResponse = await axios.get('/api/categories');
          if (categoriesResponse.data.success) {
            setCategories(categoriesResponse.data.data || []);
          }
        } catch (categoryError) {
          console.warn('Failed to fetch categories:', categoryError.message);
          setCategories([]); // Set empty array as fallback
        }

        // 3. Fetch subcategories (using public API)
        try {
          const subCategoriesResponse = await axios.get('/api/subcategories');
          if (subCategoriesResponse.data.success) {
            setSubCategories(subCategoriesResponse.data.data || []);
          }
        } catch (subCategoryError) {
          console.warn('Failed to fetch subcategories:', subCategoryError.message);
          setSubCategories([]); // Set empty array as fallback
        }

        // 4. Fetch products for search (using public API with limit)
        try {
          const productsResponse = await axios.get('/api/products?limit=500');
          if (productsResponse.data.success) {
            const transformed = productsResponse.data.data.map(product => ({
              id: product._id,
              name: product.name || "Unnamed Product",
              code: product.code || "",
              img: product.thumbnail || (product.images && product.images[0]) || '/images/placeholder.png',
              categoryName: product.category?.name || "Uncategorized",
              categoryId: product.category?._id || ""
            }));
            setAllProducts(transformed);
          }
        } catch (productError) {
          console.warn('Failed to fetch products:', productError.message);
          setAllProducts([]); // Set empty array as fallback
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        // Set fallback data
        setCategories([]);
        setSubCategories([]);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Log wishlist changes for debugging
  useEffect(() => {

  }, [wishlist]);

  // Search filter logic — by name and product code
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.trim().toLowerCase();
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(q) ||
      product.code.toLowerCase().includes(q)
    );

    setSearchResults(filtered.slice(0, 8));
  }, [searchQuery, allProducts]);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangDropdown(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target)) {
        setShowCurrencyDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get subcategories for a specific category
  const getSubCategoriesForCategory = (categoryId) => {
    if (!categoryId || !subCategories || !Array.isArray(subCategories)) {
      return [];
    }

    return subCategories.filter(subCat => {
      if (subCat.category && subCat.category._id) {
        return subCat.category._id === categoryId;
      }
      if (subCat.category && typeof subCat.category === 'string') {
        return subCat.category === categoryId;
      }
      return false;
    });
  };

  // Function to handle category navigation (for main CATEGORY dropdown)
  const handleCategoryNavigation = (categoryName, categoryId) => {
    // Check if user is logged in before allowing navigation
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Navigate to category page with query parameter
    router.push(`/category?category=${encodeURIComponent(categoryName)}&id=${categoryId}`);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  // Function to handle subcategory navigation with auto-select
  const handleSubCategoryNavigation = (categoryName, categoryId, subCategoryName, subCategoryId) => {
    // Check if user is logged in before allowing navigation
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Always navigate to the main category page with subcategory filter
    const baseUrl = '/category';

    // Navigate with query parameters for filtering
    router.push(`${baseUrl}?category=${encodeURIComponent(categoryName)}&id=${categoryId}&subcategory=${encodeURIComponent(subCategoryName)}&subid=${subCategoryId}`);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  // Function to handle ALL category link navigation
  const handleAllCategoryNavigation = (link) => {
    // Check if user is logged in before allowing navigation (except for basic category page)
    if (!isLoggedIn && link.href !== '/category') {
      router.push('/login');
      return;
    }

    // Navigate to the category page without any subcategory filter
    router.push(link.href);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  // Handle language change - now uses auto translation
  const handleLanguageChange = (language) => {
    setShowLangDropdown(false);
    changeLanguage(language.code); // This will automatically translate the entire website

  };

  // Handle currency change
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(`${currency.code} ${currency.symbol}`);
    setShowCurrencyDropdown(false);
    // Here you can implement currency change logic
    Cookies.set('currency', currency.code, { expires: 365 });
    // You might want to update prices or refresh data based on currency

  };

  // Handle logout - now using the hook
  const handleLogout = logout;

  // Get current currency from cookie (language is handled by translation hook)
  useEffect(() => {
    const savedCurrency = Cookies.get('currency');

    if (savedCurrency) {
      const currency = currencyOptions.find(c => c.code === savedCurrency);
      if (currency) setSelectedCurrency(`${currency.code} ${currency.symbol}`);
    }
  }, []);

  // Base navigation links
  const navLinks = [
    { name: 'HOME', href: '/' },
    {
      name: 'ABOUT',
      href: '/about',
      hasDropdown: true,
      subItems: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Values', href: '/about#values' },
        { label: 'Our Vision & Philosophy', href: '/about#vision' },
        { label: 'Our History', href: '/about#history' },
        { label: 'CEO Message', href: '/about#ceo-message' }
      ]
    },
  ];

  // Get navigation links - combine with dynamic CATEGORY dropdown (removed manual category links)
  const getNavLinks = () => {
    if (isLoading) {
      return [...navLinks,
        { name: 'PRODUCT CATEGORY', href: '/category' },
        { name: 'CUSTOM ORDERS', href: '/custom-orders' },
        { name: 'BLOG', href: '/blog' },

        { name: 'EXHIBITIONS', href: '/exhibitions' },
        { name: 'CONTACT US', href: '/contact-us' },
      ];
    }

    // Create navigation structure with nested category dropdown
    return [
      ...navLinks,
      {
        name: 'PRODUCT CATEGORY',
        href: '/category',
        hasDropdown: true,
        isMainCategory: true,
        items: categories.map(cat => ({
          label: cat.name,
          href: '#',
          categoryId: cat._id,
          hasSubItems: true,
          subcategories: getSubCategoriesForCategory(cat._id)
        }))
      },
      { name: 'CUSTOM ORDERS', href: '/custom-orders' },
      { name: 'BLOG', href: '/blog' },

      { name: 'EXHIBITIONS', href: '/exhibitions' },
      { name: 'CONTACT US', href: '/contact-us' },
    ];
  };

  const navigationLinks = getNavLinks();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

        .hdr-header, .hdr-header input, .hdr-header select, .hdr-header button, .hdr-header a, .hdr-header span, .hdr-header p, .hdr-header div {
          font-family: 'Playfair Display', serif;
        }

        /* Underline + hover colour for main nav links */
        .hdr-nav-link {
          position: relative;
          display: inline-flex;
font-family: "Mona Sans", sans-serif !important;
          align-items: center;
          line-height: 1;
          padding-bottom: 0;
          color: #454040;
        }
        .hdr-nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 100%;
          height: 2px;
          background-color: #C08237;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .hdr-nav-link:hover {
          color: #C08237;
        }
        .hdr-nav-link:hover::after {
          transform: scaleX(1);
        }
        .hdr-nav-link.hdr-active {
          color: #C08237;
        }
        .hdr-nav-link.hdr-active::after {
          transform: scaleX(1);
        }

        /* Desktop category / sub-category cards */
        .hdr-cat-btn {
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .hdr-cat-btn.hdr-cat-active {
          background-color: #C08237;
          color: #ffffff;
        }

        /* Mobile category / sub-category cards */
        .hdr-mobile-cat.hdr-cat-active {
          background-color: #C08237 !important;
        }
        .hdr-mobile-cat.hdr-cat-active span {
          color: #ffffff !important;
        }
        .hdr-mobile-subcat.hdr-cat-active {
          background-color: #C08237;
          color: #ffffff;
        }

        /* Mega menu (PRODUCT CATEGORY) */
        .hdr-mega-heading {
          letter-spacing: 0.08em;
        }
     .hdr-mega-sub{
  display: block;
  margin: 0 !important;
  padding: 0 !important;
  line-height: 25px !important;
  letter-spacing: 0 !important;
  min-height: auto !important;
  font-family: "Mona Sans", sans-serif !important;
}
        .hdr-mega-sub:hover {
          color: #C08237 !important;
          padding-left: 4px;
        }
          .hdr-mega-about{
  line-height: 25px !important;
  letter-spacing: 0 !important;

  font-family: "Mona Sans", sans-serif !important;
}
        .hdr-mega-about:hover {
          color: #C08237 !important;
      
        }

        /* Single-line desktop top bar — never wraps to a second row */
        .hdr-toprow {
           flex-wrap: nowrap;
    overflow: visible;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hdr-toprow::-webkit-scrollbar {
          display: none;
        }
        .hdr-icon-btn {
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
      `}</style>
      <header className={`hdr-header notranslate w-full fixed top-0 left-0 right-0 bg-[#FFF6EB] border-b border-[#A49C93]/30 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-[1500px] mx-auto px-4 lg:px-6 xl:px-8 h-20 flex items-center justify-between gap-3 hdr-toprow">

        {/* Mobile Menu Icon & Search */}
        <div className="lg:hidden flex items-center gap-3">
          <button onClick={() => setIsMenuOpen(true)}>
            <Menu className="text-[#C08237]" size={28} />
          </button>

          {/* Mobile Search Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hdr-icon-btn p-2  rounded-full  bg-transparent hover:bg-[#C08237] transition-all group"
            >
              <img src='/images/search-normal.svg' className='w-6 h-5 group-hover:brightness-0 group-hover:invert' alt="search" />
            </button>
          </div>
        </div>

        {/* Mobile Center Logo */}
        <div className="flex justify-center flex-1 lg:hidden">
          <Link href="/">
            <img src="/images/Group-56121.svg" alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Mobile Right Icons */}
        <div className="lg:hidden flex items-center gap-2">
          <Link href="/wishlist" className="relative">
            <div className="hdr-icon-btn p-2 flex items-center justify-center w-9 h-9 border rounded-full border-[#C08237] bg-transparent hover:bg-[#C08237] group cursor-pointer">
              <Heart size={16} className="text-[#C08237] group-hover:text-white transition-colors" />
            </div>
            {isClient && wishlist && wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center min-w-[16px]">
                {wishlist.length > 99 ? '99+' : wishlist.length}
              </span>
            )}
          </Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="bg-[#C08237] text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase hover:bg-[#a66f2e] transition-colors">
              Logout
            </button>
          ) : (
            <Link href="/login">
              <button className="bg-[#C08237] text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase hover:bg-[#a66f2e] transition-colors">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* ================= Desktop — single line ================= */}

        {/* Currency Selector */}
        {/* <div className="hidden lg:flex items-center relative shrink-0" ref={currencyRef}>
          <div
            className="flex items-center gap-1.5 cursor-pointer hover:text-[#C08237] transition-colors text-[11px] font-bold tracking-widest text-gray-800"
            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
          >
            <img src="https://flagcdn.com/w20/in.png" alt="Currency" className="w-5 h-3 object-cover rounded-sm" loading="lazy" />
            <span>{selectedCurrency}</span>
            <ChevronRight size={13} className={`rotate-90 transition-transform duration-200 ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
          </div>
          {showCurrencyDropdown && (
            <div className="absolute top-full left-0 mt-2 w-44 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-[999] rounded-sm shadow-xl">
              <div className="py-1">
                {currencyOptions.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => handleCurrencyChange(currency)}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-[#C08237] hover:text-white transition-all text-xs font-semibold ${
                      selectedCurrency.includes(currency.code) ? 'text-[#C08237] font-bold' : 'text-gray-700'
                    }`}
                  >
                    <img src={currency.flag} alt={currency.name} className="w-4 h-3 object-cover rounded-sm shadow-sm" />
                    <span className="uppercase tracking-wider">{currency.code} {currency.symbol}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div> */}

        {/* Logo */}
       <Link href="/" className="hidden lg:flex items-center shrink-0 mr-3">
          <img src="/images/Group-56121.svg" alt="Logo" className="h-12 w-auto" />
        </Link>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center">
         <ul className="flex items-center gap-3 xl:gap-5 whitespace-nowrap">
            {navigationLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li
                  key={link.name}
                  className="relative flex items-center"
                  onMouseEnter={() => handleDropdownEnter(link.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  {link.isMainCategory ? (
                    <button
                      onClick={() => router.push('/category')}
                      className={`hdr-nav-link text-[11px] font-bold tracking-widest transition-colors cursor-pointer ${isActive ? 'hdr-active' : ''}`}
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`hdr-nav-link font-mono text-[11px] font-bold tracking-widest transition-colors ${isActive ? 'hdr-active' : ''}`}
                    >
                      {link.name}
                    </Link>
                  )}

                  {/* Static Dropdowns (ABOUT) */}
                  {link.hasDropdown && !link.isMainCategory && activeDropdown === link.name && (
                   <div className="absolute left-0 top-[calc(135%+1px)] w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-[9999] rounded-sm shadow-xl">
                      {link.subItems.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setActiveDropdown(null)}
                          className=" hdr-mega-about flex items-center justify-between px-5 py-3 text-[12px] font-medium text-black transition-all border-b border-gray-100 last:border-0"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center relative shrink-0" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="WHAT ARE YOU LOOKING FOR?"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-32 xl:w-40 2xl:w-48 pl-10 pr-4 py-2 bg-transparent text-gray-500 border border-[#A49C93] rounded-full text-[10px] focus:border-[#C08237] outline-none transition-all"
            />
            <img src='/images/search-normal.svg' className='w-4 absolute left-3 top-2.5' alt="search" />
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && searchQuery && (
            <div className="absolute top-full mt-2 w-74 right-0 bg-white shadow-2xl rounded-lg border border-gray-100 overflow-hidden z-[9999]">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-[#FFF6EB] border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <img src={product.img} alt={product.name} className="w-12 h-12 object-cover rounded border border-gray-100" />
                    <div>
                      <p className="text-[11px] font-bold text-gray-800 uppercase line-clamp-1">{product.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {product.code && (
                          <span className="text-[9px] font-bold text-white bg-[#C08237] px-1.5 py-0.5 rounded uppercase">
                            {product.code}
                          </span>
                        )}
                        <p className="text-[9px] text-gray-400 font-medium uppercase">{product.categoryName}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-[11px] text-gray-500">No results for "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>

        {/* Wishlist */}
        <Link href="/wishlist" className="hidden lg:flex items-center relative shrink-0">
          <div className="hdr-icon-btn p-2 flex items-center justify-center w-10 h-10 border rounded-full border-[#C08237] bg-transparent hover:bg-[#C08237] group cursor-pointer">
            <Heart size={18} className="text-[#C08237] group-hover:text-white transition-colors" />
          </div>
          {isClient && wishlist && wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
              {wishlist.length > 99 ? '99+' : wishlist.length}
            </span>
          )}
        </Link>

        {/* Login / Logout */}
        <div className="hidden lg:flex items-center shrink-0">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1 bg-[#C08237] text-white px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          ) : (
            <Link href="/login">
              <button className="flex items-center justify-center gap-1 bg-[#C08237] text-white px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors whitespace-nowrap">
                <img src='/images/profile.svg' className='w-4 h-4 brightness-0 invert' alt="login" />
                LOGIN
              </button>
            </Link>
          )}
        </div>

        {/* Language Selector */}
        <div
          className="hidden lg:flex items-center relative shrink-0"
          ref={langRef}
          onMouseEnter={() => setShowLangDropdown(true)}
          onMouseLeave={() => setShowLangDropdown(false)}
        >
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-[#C08237] transition-colors py-2 text-[11px] font-bold tracking-widest text-gray-800"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
          >
            <img
              src={getCurrentLanguageInfo().flag}
              alt=""
              className="w-4.5 h-3 object-cover rounded-sm shadow-sm"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span>{getCurrentLanguageInfo().name.toUpperCase()}</span>
            <ChevronRight size={14} className={`rotate-90 transition-transform duration-200 ${showLangDropdown ? 'rotate-180' : ''}`} />
          </div>

          {showLangDropdown && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-[999] rounded-sm shadow-xl animate-fade-in max-h-80 overflow-y-auto">
              <div className="py-1">
                {languageOptions.map((lang) => {
                  const isActive = currentLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang)}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-[#C08237] hover:text-white transition-all text-xs font-semibold ${
                        isActive ? 'text-[#C08237] bg-[#C08237]/5 font-bold' : 'text-gray-700'
                      }`}
                    >
                      <img
                        src={lang.flag}
                        alt={lang.name}
                        className="w-4 h-3 object-cover rounded-sm shadow-sm"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span className="uppercase tracking-wider">{lang.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {isSearchOpen && (
        <div className="md:hidden lg:hidden bg-white border-t border-gray-200 p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="WHAT ARE YOU LOOKING FOR?"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-3 bg-transparent text-gray-500 border border-[#A49C93] rounded-full text-sm focus:border-[#C08237] outline-none transition-all"
            />
            <img src='/images/search-normal.svg' className='w-4 absolute left-3 top-3.5' alt="search" />
          </div>

          {/* Mobile Search Results */}
          {searchQuery && (
            <div className="mt-0 bg-white rounded-lg border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-[#FFF6EB] border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <img src={product.img} alt={product.name} className="w-10 h-10 object-cover rounded border border-gray-100" />
                    <div>
                      <p className="text-xs font-bold text-gray-800 uppercase line-clamp-1">{product.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {product.code && (
                          <span className="text-[9px] font-bold text-white bg-[#C08237] px-1.5 py-0.5 rounded uppercase">
                            {product.code}
                          </span>
                        )}
                        <p className="text-[9px] text-gray-400 font-medium uppercase">{product.categoryName}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">No results for "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- PRODUCT CATEGORY mega menu --- */}
      {activeDropdown === 'PRODUCT CATEGORY' && (
        <div
          className="hidden lg:block fixed left-0 top-20 w-full bg-[#FFFCF5] border-t border-b border-[#D7CEC2] shadow-xl z-[999]"
          onMouseEnter={() => handleDropdownEnter('PRODUCT CATEGORY')}
          onMouseLeave={handleDropdownLeave}
        >
          <div className="max-w-[1500px] mx-auto px-10 py-10">
            {isLoading ? (
              <div className="text-center text-sm text-gray-500 py-6">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-6">No categories available</div>
            ) : (
            <div className="grid grid-cols-3 gap-x-12 gap-y-10">
                {categories.map((category) => {
                  const categorySubCats = getSubCategoriesForCategory(category._id);
                  const isCategoryActive = category._id === activeCategoryId;
                  const colCount = categorySubCats.length > 10 ? 3 : categorySubCats.length > 5 ? 2 : 1;
                  return (
                 <div
  key={category._id}
  className="w-full min-h-[190px]"
>
                      <button
                        onClick={() => handleCategoryNavigation(category.name, category._id)}
                    className={`hdr-mega-heading block w-full text-left text-[16px] font-semibold uppercase pb-2 mb-3 border-b ${
                          isCategoryActive ? 'text-[#C08237] border-[#C08237]' : 'text-[#C08237] border-[#C08237]/40'
                        }`}
                        title={!isLoggedIn ? "Login required to access this category" : ""}
                      >
                        {category.name}
                      </button>
                      {categorySubCats.length > 0 ? (
                    <div
  className="grid gap-y-[2px]"
  style={{
    gridTemplateColumns: `repeat(${colCount}, minmax(0,1fr))`,
    columnGap: "20px",
  }}
>
                          {categorySubCats.map((subCat) => {
                            const isSubActive = subCat._id === activeSubCategoryId;
                            return (
                              <button
                                key={subCat._id}
                                onClick={() => handleSubCategoryNavigation(category.name, category._id, subCat.name, subCat._id)}
                         className={`hdr-mega-sub block w-full text-left text-[12px] font-medium  py-0 leading-[16px] mb-0 ${
                                  isSubActive ? 'text-[#C08237]' : isLoggedIn ? 'text-[#453314]' : 'text-black'
                                }`}
                                style={{ breakInside: 'avoid' }}
                                title={!isLoggedIn ? "Login required to access this subcategory" : ""}
                              >
                                {subCat.name}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">No sub-categories</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
           <div className="mt-8 pt-6 border-t border-[#D7CEC2]">
  <Link
    href="/custom-orders"
    onClick={() => setActiveDropdown(null)}
    className="hdr-nav-link text-xs font-bold uppercase tracking-widest text-gray-700"
    style={{ fontFamily: "Mona Sans, sans-serif" }}
  >
    Custom Orders
  </Link>
</div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[1000] lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Sidebar panel */}
          <div className="fixed top-0 left-0 w-[85%] max-w-sm h-[100dvh] bg-gradient-to-b from-[#FFF6EB] to-[#FFF9F0] shadow-2xl flex flex-col animate-slide-in z-[1001]">
            {/* Sidebar Header — logo + close */}
            <div className="shrink-0 bg-[#FFF6EB] px-6 py-4 border-b border-[#D4C4B0]/30 shadow-sm">
              <div className="flex justify-between items-center">
                <img src="/images/Group-56121.svg" alt="logo" className="h-9" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-[#C08237]/10 rounded-full transition-colors"
                >
                  <X size={24} className="text-[#C08237]" />
                </button>
              </div>
            </div>

            {/* Language and Currency Section */}
            <div className="px-6 py-4 space-y-3 bg-white/40 border-b border-[#D4C4B0]/20">
              <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">Language</span>
                </div>
                <select
                  className="bg-transparent text-sm font-medium text-[#C08237] border-none outline-none cursor-pointer"
                  value={getCurrentLanguageInfo().name}
                  onChange={(e) => {
                    const lang = languageOptions.find(l => l.name === e.target.value);
                    if (lang) handleLanguageChange(lang);
                  }}
                >
                  {languageOptions.map(lang => (
                    <option key={lang.code} value={lang.name}>{lang.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">Currency</span>
                </div>
                <select
                  className="bg-transparent text-sm font-medium text-[#C08237] border-none outline-none cursor-pointer"
                  value={selectedCurrency}
                  onChange={(e) => handleCurrencyChange({code: e.target.value.split(' ')[0], symbol: e.target.value.split(' ')[1]})}
                >
                  {currencyOptions.map(currency => (
                    <option key={currency.code} value={`${currency.code} ${currency.symbol}`}>
                      {currency.code} {currency.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Navigation Links + Footer — scrollable area */}
            <div className="flex-1 overflow-y-auto min-h-0 ios-scroll">
            {/* Navigation Links */}
            <div className="px-4 py-4">
              <ul className="space-y-2">
                {navigationLinks.map((link) => (
                  <li key={link.name} className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#D4C4B0]/20 hover:shadow-md transition-shadow">
                    {/* Main Link */}
                    <div className="flex justify-between items-center px-4 py-3">
                      {link.isMainCategory ? (
                        <div className="flex items-center justify-between w-full">
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                            className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wide flex-1 text-left"
                          >
                            <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            {link.name}
                          </button>
                          {link.hasDropdown && (
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                              className="p-2 hover:bg-[#C08237]/10 rounded-lg transition-colors"
                            >
                              <ChevronRight
                                size={18}
                                className={`text-[#C08237] transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-90' : ''}`}
                              />
                            </button>
                          )}
                        </div>
                      ) : (
                        <>
                          {link.hasDropdown ? (
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                              className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wide flex-1 text-left"
                            >
                            {link.name === 'HOME' && (
                              <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                            )}
                            {link.name === 'ABOUT' && (
                              <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            {link.name === 'CUSTOM ORDERS' && (
                              <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            )}
                            {link.name === 'CONTACT US' && (
                              <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            )}
                            {link.name === 'EXHIBITIONS' && (
                              <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            )}
                            {link.name}
                          </button>
                          ) : (
                            <Link
                              href={link.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wide"
                            >
                              {link.name === 'HOME' && (
                                <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                              )}
                              {link.name === 'CUSTOM ORDERS' && (
                                <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              )}
                              {link.name === 'CONTACT US' && (
                                <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              )}
                              {link.name === 'EXHIBITIONS' && (
                                <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              )}
                              {link.name === 'BLOG' && (
                                <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              )}
                              {link.name}
                            </Link>
                          )}
                          {link.hasDropdown && (
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                              className="p-2 hover:bg-[#C08237]/10 rounded-lg transition-colors"
                            >
                              <ChevronRight
                                size={18}
                                className={`text-[#C08237] transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-90' : ''}`}
                              />
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {/* Dropdown Content with Animation */}
                    {link.hasDropdown && activeDropdown === link.name && (
                      <div className="bg-gradient-to-b from-[#FFF9F0] to-white border-t border-[#D4C4B0]/20 animate-fade-in">
                        {/* Main CATEGORY dropdown in mobile */}
                        {link.isMainCategory && (
                          <div className="px-3 py-3 space-y-2">
                            {isLoading ? (
                              <div className="text-sm text-gray-500 py-3 text-center">
                                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-[#C08237]"></div>
                                <p className="mt-2">Loading categories...</p>
                              </div>
                            ) : categories.length === 0 ? (
                              <div className="text-sm text-gray-500 py-3 text-center">No categories available</div>
                            ) : (
                              <>
                                {categories.map(category => {
                                  const categorySubCats = getSubCategoriesForCategory(category._id);
                                  const isExpanded = mobileDropdown === category._id;
                                  const isCategoryActive = category._id === activeCategoryId;

                                  return (
                                    <div key={category._id} className={`hdr-mobile-cat bg-white rounded-lg shadow-sm border border-[#D4C4B0]/20 overflow-hidden ${isCategoryActive ? 'hdr-cat-active' : ''}`}>
                                      <button
                                        onClick={() => {
                                          if (categorySubCats.length > 0) {
                                            setMobileDropdown(isExpanded ? null : category._id);
                                          }
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-2.5 text-left text-xs font-bold uppercase transition-colors hover:bg-[#C08237]/5"
                                      >
                                        <div className="flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-[#C08237]"></div>
                                          <span className={`${isLoggedIn ? 'text-gray-700' : 'text-gray-500'}`}>
                                            {category.name}
                                          </span>
                                        </div>

                                        {categorySubCats.length > 0 && (
                                          <ChevronRight
                                            size={16}
                                            className={`text-[#C08237] transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                                          />
                                        )}
                                      </button>

                                      {/* Subcategories with smooth animation */}
                                      {categorySubCats.length > 0 && isExpanded && (
                                        <div className="bg-[#FFF9F0] border-t border-[#D4C4B0]/20 px-3 py-2 space-y-1 animate-fade-in">
                                          {categorySubCats.map(subCat => {
                                            const isSubActive = subCat._id === activeSubCategoryId;
                                            return (
                                            <button
                                              key={subCat._id}
                                              onClick={() => {
                                                handleSubCategoryNavigation(
                                                  category.name,
                                                  category._id,
                                                  subCat.name,
                                                  subCat._id
                                                );
                                              }}
                                              className={`hdr-mobile-subcat flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs font-medium text-left transition-all ${
                                                isLoggedIn
                                                  ? 'text-gray-600 hover:bg-[#C08237] hover:text-white hover:pl-4'
                                                  : 'text-gray-400'
                                              } ${isSubActive ? 'hdr-cat-active' : ''}`}
                                            >
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                              </svg>
                                              <span>{subCat.name}</span>
                                            </button>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}

                                <div className="pt-2 mt-2 border-t border-[#D4C4B0]/30">
                                  <Link
                                    href="/custom-orders"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2.5 bg-[#C08237] text-white rounded-lg text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors shadow-sm"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    CUSTOM ORDERS
                                  </Link>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* Static dropdowns (ABOUT) */}
                        {!link.isMainCategory && !link.isCategory && link.hasDropdown && (
                          <div className="px-3 py-3 space-y-1">
                            {link.subItems.map(sub => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-gray-600 uppercase hover:bg-[#C08237] hover:text-white hover:pl-4 transition-all"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Login/Profile Section */}
            <div className="px-4 pb-6 pt-4 border-t-2 border-[#D4C4B0]/30 bg-gradient-to-b from-transparent to-white/50">
              {isLoggedIn ? (
                <div className="space-y-2.5">
                  {/* Customer Inquiry Button */}
                  <Link href="/productInquiry" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#C08237] text-[#C08237] px-4 py-3 rounded-xl text-xs font-bold uppercase hover:bg-[#C08237] hover:text-white hover:shadow-lg transition-all shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      CUSTOMER INQUIRY
                    </button>
                  </Link>

                  {/* Wishlist Button */}
                  <Link href="/wishlist" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#C08237] text-[#C08237] px-4 py-3 rounded-xl text-xs font-bold uppercase hover:bg-[#C08237] hover:text-white hover:shadow-lg transition-all shadow-sm relative">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      MY WISHLIST
                      {wishlist && wishlist.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] shadow-md">
                          {wishlist.length > 99 ? '99+' : wishlist.length}
                        </span>
                      )}
                    </button>
                  </Link>

                  {/* Inquiry Cart Button */}
                  <Link href="/inquiry-cart" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#C08237] text-[#C08237] px-4 py-3 rounded-xl text-xs font-bold uppercase hover:bg-[#C08237] hover:text-white hover:shadow-lg transition-all shadow-sm relative">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                      INQUIRY CART
                      {getCartCount() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#C08237] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] shadow-md">
                          {getCartCount() > 99 ? '99+' : getCartCount()}
                        </span>
                      )}
                    </button>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl text-xs font-bold uppercase hover:from-red-600 hover:to-red-700 hover:shadow-lg transition-all shadow-sm mt-4"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    LOGOUT
                  </button>
                </div>
              ) : (
                <Link href="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#C08237] to-[#a66f2e] text-white px-5 py-3.5 rounded-xl text-xs font-bold uppercase hover:from-[#a66f2e] hover:to-[#8b5a28] hover:shadow-lg transition-all shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    LOGIN TO CONTINUE
                  </button>
                </Link>
              )}
            </div>
            </div>{/* end scrollable area */}
          </div>
        </div>
      )}
    </header>
    </>
  );
};

export default Header;