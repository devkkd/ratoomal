"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Menu, X, ChevronRight } from 'lucide-react';
import Cookies from 'js-cookie';
import { useReliableTranslation } from '@/hooks/useReliableTranslation';
import { useWishlistStore } from '@/store/wishlistStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('INR ₹');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  
  const searchRef = useRef(null);
  const langRef = useRef(null);
  const currencyRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get translation hook
  const { currentLanguage, languages, changeLanguage, getCurrentLanguageInfo, isLoading: translationLoading, translationMethod } = useReliableTranslation();
  
  // Get wishlist from Zustand store
  const { wishlist, initialize } = useWishlistStore();

  // Manual individual category links - these are the menu items on the main nav bar
  const manualCategoryLinks = [
    {
      name: 'Animal',
      href: '/animal',
      hasDropdown: true,
      isCategory: true,
      categorySlug: 'animal-statues',
      apiCategoryName: 'Animal'
    },
    {
      name: 'God Figure',
      href: '/god-figure',
      hasDropdown: true,
      isCategory: true,
      categorySlug: 'god-figures',
      apiCategoryName: 'God Figure'
    },
    {
      name: 'Utility Decor',
      href: '/utility-decor',
      hasDropdown: true,
      isCategory: true,
      categorySlug: 'utility-decor',
      apiCategoryName: 'Utility / Decor'
    }
  ];

  // Language options - now from translation hook
  const languageOptions = languages;

  // Currency options
  const currencyOptions = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: 'https://flagcdn.com/w20/in.png' },
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: 'https://flagcdn.com/w20/us.png' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: 'https://flagcdn.com/w20/eu.png' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: 'https://flagcdn.com/w20/gb.png' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: 'https://flagcdn.com/w20/jp.png' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: 'https://flagcdn.com/w20/au.png' }
  ];

  // Check authentication state on component mount and when cookies change
  useEffect(() => {
    const checkAuthState = () => {
      const token = Cookies.get('token');
      const loginFlag = Cookies.get('isLoggedIn');
      
      // User is logged in if both token exists and isLoggedIn flag is true
      const isAuthenticated = !!(token && loginFlag === 'true');
      setIsLoggedIn(isAuthenticated);
      
      console.log('🔐 Auth state check:', { token: !!token, loginFlag, isAuthenticated });
    };
    
    // Check auth state immediately
    checkAuthState();
    
    // Set up an interval to periodically check auth state (in case cookies are cleared externally)
    const authCheckInterval = setInterval(checkAuthState, 5000);
    
    return () => clearInterval(authCheckInterval);
  }, []);

  // Fetch categories, subcategories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Initialize wishlist from store
        initialize();
        
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
          const productsResponse = await axios.get('/api/products?limit=50');
          if (productsResponse.data.success) {
            const transformed = productsResponse.data.data.map(product => ({
              id: product._id,
              name: product.name || "Unnamed Product",
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
    console.log('🔍 Header - Wishlist changed:', wishlist);
  }, [wishlist]);

  // Search filter logic
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(filtered.slice(0, 6));
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
    // Navigate to category page with query parameter
    router.push(`/category?category=${encodeURIComponent(categoryName)}&id=${categoryId}`);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  // Function to handle subcategory navigation with auto-select
  const handleSubCategoryNavigation = (categoryName, categoryId, subCategoryName, subCategoryId) => {
    // Navigate to specific category page with subcategory filter
    let baseUrl = '/category';
    
    // Map category names to specific pages
    if (categoryName.toLowerCase().includes('animal')) {
      baseUrl = '/animal';
    } else if (categoryName.toLowerCase().includes('god') || categoryName.toLowerCase().includes('figure')) {
      baseUrl = '/god-figure';
    } else if (categoryName.toLowerCase().includes('utility') || categoryName.toLowerCase().includes('decor')) {
      baseUrl = '/utility-decor';
    }
    
    // Navigate with query parameters for filtering
    router.push(`${baseUrl}?category=${encodeURIComponent(categoryName)}&id=${categoryId}&subcategory=${encodeURIComponent(subCategoryName)}&subid=${subCategoryId}`);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  // Function to handle ALL category link navigation
  const handleAllCategoryNavigation = (link) => {
    // Navigate to the category page without any subcategory filter
    router.push(link.href);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  // Handle language change - now uses auto translation
  const handleLanguageChange = (language) => {
    setShowLangDropdown(false);
    changeLanguage(language.code); // This will automatically translate the entire website
    console.log('Website language changed to:', language.name);
  };

  // Handle currency change
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(`${currency.code} ${currency.symbol}`);
    setShowCurrencyDropdown(false);
    // Here you can implement currency change logic
    Cookies.set('currency', currency.code, { expires: 365 });
    // You might want to update prices or refresh data based on currency
    console.log('Currency changed to:', currency.code);
  };

  // Handle logout
  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    router.push('/');
  };

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

  // Get navigation links - combine manual category links with dynamic CATEGORY dropdown
  const getNavLinks = () => {
    if (isLoading) {
      return [...navLinks, 
        { name: 'CATEGORY', href: '/category' },
        ...manualCategoryLinks,
        { name: 'CUSTOM ORDERS', href: '/custom-orders' },
        { name: 'CONTACT US', href: '/contact-us' }
      ];
    }

    // Create navigation structure
    return [
      ...navLinks,
      {
        name: 'CATEGORY',
        href: '/category',
        hasDropdown: true,
        isMainCategory: true,
        items: [
          ...categories.map(cat => ({
            label: cat.name,
            href: '#',
            categoryId: cat._id,
            hasSubItems: true
          })),
          { label: 'Custom', href: '/custom-orders' }
        ]
      },
      ...manualCategoryLinks,
      { name: 'CUSTOM ORDERS', href: '/custom-orders' },
      { name: 'CONTACT US', href: '/contact-us' },
    ];
  };

  const navigationLinks = getNavLinks();

  return (
    <header className="w-full sticky top-0  bg-[#FFF6EB] border-b border-[#A49C93]/30 relative z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Left Side (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 text-sm text-gray-700 flex-1">
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer font-mona"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
            >
              <span>{getCurrentLanguageInfo().name}</span>
              <ChevronRight size={14} className={`rotate-90 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
            </div>
            
            {/* Language Dropdown */}
            {showLangDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="py-2">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang)}
                      className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                    >
                      <img src={lang.flag} alt={lang.name} className="w-5 h-3.5" />
                      <span className={`mona ${getCurrentLanguageInfo().name === lang.name ? 'text-[#C08237] font-medium' : 'text-gray-700'}`}>
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <div className="relative" ref={currencyRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer font-mona"
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            >
              <img src="https://flagcdn.com/w20/in.png" alt="Currency" className="w-5 h-3" />
              <span>{selectedCurrency}</span>
              <ChevronRight size={14} className={`rotate-90 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
            </div>
            
            {/* Currency Dropdown */}
            {showCurrencyDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="py-2">
                  {currencyOptions.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencyChange(currency)}
                      className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                    >
                      <img src={currency.flag} alt={currency.name} className="w-5 h-3.5" />
                      <span className={`mona ${selectedCurrency.includes(currency.code) ? 'text-[#C08237] font-medium' : 'text-gray-700'}`}>
                        {currency.code} {currency.symbol}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Icon & Search */}
        <div className="lg:hidden flex items-center gap-3 flex-1">
          <button onClick={() => setIsMenuOpen(true)}>
            <Menu className="text-[#C08237]" size={28} />
          </button>
          
          {/* Mobile Search Icon */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 border rounded-full border-[#C08237] bg-transparent hover:bg-[#C08237] transition-all group"
            >
              <img src='/images/search-normal.svg' className='w-4 h-4 group-hover:brightness-0 group-hover:invert' alt="search" />
            </button>
          </div>
        </div>

        {/* Center Logo */}
        <div className="flex justify-center flex-1">
          <Link href="/">
            <img src="/images/Group-56121.svg" alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Right Side (Search & Auth) */}
        <div className="flex items-center justify-end gap-3 flex-1" ref={searchRef}>
          {/* Search Bar */}
          <div className="relative hidden md:block">
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
                className="w-48 lg:w-72 font-mona pl-10 pr-4 py-2 bg-transparent text-gray-500 border border-[#A49C93] rounded-full text-[10px] focus:border-[#C08237] outline-none transition-all"
              />
              <img src='/images/search-normal.svg' className='w-4 absolute left-3 top-2.5' alt="search" />
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen && searchQuery && (
              <div className="absolute top-full mt-2 w-80 right-0 bg-white shadow-2xl rounded-lg border border-gray-100 overflow-hidden z-50">
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
                        <p className="text-[9px] text-[#C08237] font-semibold uppercase">{product.categoryName}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-[11px] text-gray-500">No results for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <Link href="/wishlist" className="relative">
            <div className="relative">
              <div className="p-2 flex justify-center item-center w-10 h-10 border rounded-full border-[#C08237] bg-[#C08237] hover:bg-[#a66f2e] cursor-pointer">
                <img src='/images/heart.svg' className='w-5 h-5 group-hover:brightness-0 group-hover:invert' alt="wishlist" />
              </div>
              {wishlist && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                  {wishlist.length > 99 ? '99+' : wishlist.length}
                </span>
              )}
            </div>
          </Link>

          {/* Conditional Inquiry/Profile Button */}
          {isLoggedIn ? (
            <>
              {/* Inquiry Button (Only when logged in) */}
              <Link href="/inquiry" className="hidden sm:block">
                <button className="flex items-center gap-2 bg-white text-[#C08237] border border-[#C08237] px-4 py-2 rounded-full text-xs font-bold uppercase hover:bg-[#C08237] hover:text-white transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>INQUIRY</span>
                </button>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 bg-[#C08237] text-white px-4 py-2 rounded-full text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors">
                  <img src='/images/profile.svg' className='w-4 h-4 brightness-0 invert' alt="profile" />
                  <span className="hidden sm:inline">PROFILE</span>
                </button>
                
                {/* Profile Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link href="/profile" className="block">
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex items-center gap-2">
                        <img src='/images/profile.svg' className='w-4 h-4' alt="profile" />
                        My Profile
                      </div>
                    </Link>
                    <Link href="/orders" className="block">
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        My Orders
                      </div>
                    </Link>
                    <Link href="/wishlist" className="block">
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex items-center gap-2">
                        <img src='/images/heart.svg' className='w-4 h-4' alt="wishlist" />
                        My Wishlist
                        {wishlist && wishlist.length > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                            {wishlist.length > 99 ? '99+' : wishlist.length}
                          </span>
                        )}
                      </div>
                    </Link>
                    <Link href="/inquiry" className="block sm:hidden">
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex items-center gap-2 border-t border-gray-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Inquiry
                      </div>
                    </Link>
                    <div className="border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 text-sm text-red-600 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Login Button (Only when NOT logged in) */
            <Link href="/login">
              <button className="flex items-center justify-center gap-1 bg-[#C08237] text-white px-6 py-1 rounded-full text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors">
                <img src='/images/profile.svg' className='w-4 h-4 brightness-0 invert' alt="login" />
                <span className="hidden sm:inline">LOGIN</span>
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {isSearchOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="WHAT ARE YOU LOOKING FOR?"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full font-mona pl-10 pr-4 py-3 bg-transparent text-gray-500 border border-[#A49C93] rounded-full text-sm focus:border-[#C08237] outline-none transition-all"
            />
            <img src='/images/search-normal.svg' className='w-4 absolute left-3 top-3.5' alt="search" />
          </div>
          
          {/* Mobile Search Results */}
          {searchQuery && (
            <div className="mt-3 bg-white rounded-lg border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
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
                      <p className="text-xs text-[#C08237] font-semibold uppercase">{product.categoryName}</p>
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

      {/* --- Desktop Navigation --- */}
      <nav className="hidden lg:block border-t border-[#A49C93]/20">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex justify-center items-center gap-8">
            {navigationLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li 
                  key={link.name} 
                  className="relative py-3 group"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.isMainCategory ? (
                    <button
                      className={`text-[11px] font-bold tracking-widest ${isActive ? 'text-[#C08237]' : 'text-gray-800'} hover:text-[#C08237] transition-colors`}
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link 
                      href={link.href} 
                      className={`text-[11px] font-bold tracking-widest ${isActive ? 'text-[#C08237]' : 'text-gray-800'} hover:text-[#C08237] transition-colors`}
                    >
                      {link.name}
                    </Link>
                  )}

                  {/* Main CATEGORY Dropdown (Dynamic) */}
                  {link.hasDropdown && link.isMainCategory && activeDropdown === link.name && (
                    <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
                      {isLoading ? (
                        <div className="px-6 py-4 text-center text-sm text-gray-500">
                          Loading categories...
                        </div>
                      ) : categories.length === 0 ? (
                        <div className="px-6 py-4 text-center text-sm text-gray-500">
                          No categories available
                        </div>
                      ) : (
                        <div className="py-2">
                          {categories.map((category) => (
                            <button
                              key={category._id}
                              onClick={() => handleCategoryNavigation(category.name, category._id)}
                              className="flex items-center justify-between w-full px-6 py-3 text-sm font-medium text-gray-700  hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
                            >
                              {category.name}
                              {/* <ChevronRight size={14} className="opacity-50" /> */}
                            </button>
                          ))}
                          <div className="border-t border-gray-200 mt-2 pt-2">
                            <Link
                              href="/custom-orders"
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center justify-between px-6 py-3 text-sm font-medium text-gray-700 hover:bg-[#FFF6EB] hover:text-[#C08237] transition-all"
                            >
                              CUSTOM ORDERS
                              {/* <ChevronRight size={14} className="opacity-50" /> */}
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Individual Manual Category Dropdowns (ANIMAL, GOD FIGURE, UTILITY/DECOR) */}
                  {link.hasDropdown && link.isCategory && activeDropdown === link.name && (
                    <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
                      {isLoading ? (
                        <div className="px-5 py-3 text-center text-[12px] text-gray-500">
                          Loading...
                        </div>
                      ) : (
                        <>
                          {/* Find the category in database */}
                          {(() => {
                            const categoryObj = categories.find(cat => 
                              cat.name.toLowerCase() === link.apiCategoryName.toLowerCase()
                            );
                            
                            if (!categoryObj) {
                              return (
                                <div className="text-center py-3 text-[12px] text-gray-500">
                                  No data found
                                </div>
                              );
                            }
                            
                            const categorySubCats = getSubCategoriesForCategory(categoryObj._id);
                            
                            return (
                              <>
                              
                                
                                {categorySubCats.length > 0 ? (
                                  categorySubCats.map(subCat => (
                                    <button
                                      key={subCat._id}
                                      onClick={() => handleSubCategoryNavigation(
                                        categoryObj.name, 
                                        categoryObj._id, 
                                        subCat.name, 
                                        subCat._id
                                      )}
                                      className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
                                    >
                                      {subCat.name}
                                      {/* <ChevronRight size={12} className="opacity-50" /> */}
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-5 py-3 text-center text-[11px] text-gray-500">
                                    No subcategories found
                                  </div>
                                )}
                              </>
                            );
                          })()}
                            <button
                                  onClick={() => handleAllCategoryNavigation(link)}
                                  className="flex  items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100"
                                >
                                  All {link.name}
                                  {/* <ChevronRight size={12} className="opacity-50" /> */}
                                </button>
                          
                          {/* <Link
                            href="/custom-orders"
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-t border-gray-100 mt-1"
                          >
                            CUSTOM ORDERS
                             <ChevronRight size={12} className="opacity-50" /> 
                          </Link> */}
                        </>
                      )}
                    </div>
                  )}

                  {/* Static Dropdowns (ABOUT) */}
                  {link.hasDropdown && !link.isMainCategory && !link.isCategory && activeDropdown === link.name && (
                    <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
                      {link.subItems.map((sub) => (
                        <Link 
                          key={sub.label} 
                          href={sub.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
                        >
                          {sub.label.toUpperCase()}
                          {/* <ChevronRight size={12} className="opacity-50" /> */}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-[80%] h-full bg-[#FFF6EB] p-6 shadow-xl overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <img src="/images/Group-56121.svg" alt="logo" className="h-8" />
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            {/* Mobile Language and Currency */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm font-medium">Language</span>
                <select 
                  className="bg-transparent text-sm border border-[#D4C4B0] rounded px-2 py-1 outline-none focus:border-[#C08237]"
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
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm font-medium">Currency</span>
                <select 
                  className="bg-transparent text-sm border-none outline-none"
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
            
            <ul className="space-y-5">
              {navigationLinks.map((link) => (
                <li key={link.name} className="border-b border-gray-200 pb-3">
                  <div className="flex justify-between items-center" 
                    onClick={() => {
                      if (link.hasDropdown) {
                        setActiveDropdown(activeDropdown === link.name ? null : link.name);
                      }
                    }}>
                    {link.isMainCategory ? (
                      <button className="text-[11px] font-bold text-gray-800 uppercase tracking-widest">
                        {link.name}
                      </button>
                    ) : (
                      <Link 
                        href={link.href} 
                        onClick={() => !link.hasDropdown && setIsMenuOpen(false)}
                        className="text-[11px] font-bold text-gray-800 uppercase tracking-widest"
                      >
                        {link.name}
                      </Link>
                    )}
                    {/* {link.hasDropdown && (
                      <ChevronRight size={16} className={`transition-transform ${activeDropdown === link.name ? 'rotate-90' : ''}`} />
                    )} */}
                  </div>
                  
                  {/* Mobile Dropdown */}
                  {link.hasDropdown && activeDropdown === link.name && (
                    <ul className="mt-3 ml-4 space-y-4 border-l-2 border-[#C08237] pl-4">
                      {/* Main CATEGORY dropdown in mobile */}
                      {link.isMainCategory && (
                        <>
                          {isLoading ? (
                            <li className="text-sm text-gray-500 py-2">Loading categories...</li>
                          ) : categories.length === 0 ? (
                            <li className="text-sm text-gray-500 py-2">No categories available</li>
                          ) : (
                            <>
                              {categories.map(category => (
                                <li key={category._id}>
                                  <button
                                    onClick={() => {
                                      handleCategoryNavigation(category.name, category._id);
                                    }}
                                    className="text-sm font-medium text-gray-600 uppercase py-2 block w-full text-left hover:text-[#C08237] transition-colors"
                                  >
                                    {category.name}
                                  </button>
                                </li>
                              ))}
                              <li className="border-t border-gray-200 pt-2 mt-2">
                                <Link
                                  href="/custom-orders"
                                  onClick={() => setIsMenuOpen(false)}
                                  className="text-sm font-medium text-gray-600 uppercase py-2 block hover:text-[#C08237] transition-colors"
                                >
                                  CUSTOM ORDERS
                                </Link>
                              </li>
                            </>
                          )}
                        </>
                      )}
                      
                      {/* Individual manual category dropdowns in mobile */}
                      {link.isCategory && (
                        <>
                          {(() => {
                            const categoryObj = categories.find(cat => 
                              cat.name.toLowerCase() === link.apiCategoryName.toLowerCase()
                            );
                            
                            if (!categoryObj) {
                              return (
                                <li className="text-[10px] text-gray-500 text-center py-2">
                                  No data found
                                </li>
                              );
                            }
                            
                            const categorySubCats = getSubCategoriesForCategory(categoryObj._id);
                            
                            return (
                              <>
                                <li>
                                  <button
                                    onClick={() => handleAllCategoryNavigation(link)}
                                    className="text-[10px] font-bold text-gray-500 uppercase block w-full text-left"
                                  >
                                    ALL {link.name}
                                  </button>
                                </li>
                                {categorySubCats.map(subCat => (
                                  <li key={subCat._id}>
                                    <button
                                      onClick={() => {
                                        if (categoryObj) {
                                          handleSubCategoryNavigation(
                                            categoryObj.name, 
                                            categoryObj._id, 
                                            subCat.name, 
                                            subCat._id
                                          );
                                        }
                                      }}
                                      className="text-[10px] font-bold text-gray-500 uppercase block w-full text-left"
                                    >
                                      {subCat.name}
                                    </button>
                                  </li>
                                ))}
                              </>
                            );
                          })()}
                          <li>
                            <Link
                              href="/custom-orders"
                              onClick={() => setIsMenuOpen(false)}
                              className="text-[10px] font-bold text-gray-500 uppercase block border-t border-gray-200 pt-2 mt-2"
                            >
                              CUSTOM ORDERS
                            </Link>
                          </li>
                        </>
                      )}
                      
                      {/* Static dropdowns (ABOUT) */}
                      {!link.isMainCategory && !link.isCategory && link.hasDropdown && (
                        <>
                          {link.subItems.map(sub => (
                            <li key={sub.label}>
                              <Link 
                                href={sub.href} 
                                onClick={() => setIsMenuOpen(false)}
                                className="text-[10px] font-bold text-gray-500 uppercase block"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </>
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile Login/Profile */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              {isLoggedIn ? (
                <div className="space-y-3">
                  {/* Inquiry Button in Mobile */}
                  <Link href="/inquiry" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 bg-white border border-[#C08237] text-[#C08237] px-5 py-3 rounded-full text-xs font-bold uppercase hover:bg-[#C08237] hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      INQUIRY
                    </button>
                  </Link>
                  
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 bg-[#C08237] text-white px-5 py-3 rounded-full text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors">
                      <img src='/images/profile.svg' className='w-4 h-4 brightness-0 invert' alt="profile" />
                      MY PROFILE
                    </button>
                  </Link>
                  <Link href="/orders" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 border border-[#C08237] text-[#C08237] px-5 py-3 rounded-full text-xs font-bold uppercase hover:bg-[#C08237] hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      MY ORDERS
                    </button>
                  </Link>
                  <Link href="/wishlist" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 border border-[#C08237] text-[#C08237] px-5 py-3 rounded-full text-xs font-bold uppercase hover:bg-[#C08237] hover:text-white transition-colors">
                      <img src='/images/heart.svg' className='w-4 h-4' alt="wishlist" />
                      MY WISHLIST
                      {wishlist && wishlist.length > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] ml-1">
                          {wishlist.length > 99 ? '99+' : wishlist.length}
                        </span>
                      )}
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 border border-red-500 text-red-500 px-5 py-3 rounded-full text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    LOGOUT
                  </button>
                </div>
              ) : (
                <Link href="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 bg-[#C08237] text-white px-5 py-3 rounded-full text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors">
                    <img src='/images/profile.svg' className='w-4 h-4 brightness-0 invert' alt="login" />
                    LOGIN
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;