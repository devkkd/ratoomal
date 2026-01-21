// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { Menu, X, ChevronRight } from 'lucide-react';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [allProducts, setAllProducts] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   const searchRef = useRef(null);
//   const pathname = usePathname();
//   const router = useRouter();

//   // Fetch categories, subcategories and products
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
        
//         // 1. Fetch categories
//         const categoriesResponse = await axios.get('/api/admin/categories');
//         if (categoriesResponse.data.success) {
//           setCategories(categoriesResponse.data.data || []);
//         }
        
//         // 2. Fetch subcategories
//         const subCategoriesResponse = await axios.get('/api/admin/subcategories');
//         if (subCategoriesResponse.data.success) {
//           setSubCategories(subCategoriesResponse.data.data || []);
//         }
        
//         // 3. Fetch products for search
//         const productsResponse = await axios.get('/api/admin/products');
//         if (productsResponse.data.success) {
//           const transformed = productsResponse.data.data.map(product => ({
//             id: product._id,
//             name: product.name || "Unnamed Product",
//             img: product.thumbnail || (product.images && product.images[0]) || '/images/placeholder.png',
//             categoryName: product.category?.name || "Uncategorized",
//             categoryId: product.category?._id || ""
//           }));
//           setAllProducts(transformed);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Search filter logic
//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setSearchResults([]);
//       return;
//     }

//     const filtered = allProducts.filter(product =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
//     );
    
//     setSearchResults(filtered.slice(0, 6));
//   }, [searchQuery, allProducts]);

//   // Outside click handler
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (searchRef.current && !searchRef.current.contains(e.target)) {
//         setIsSearchOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Get subcategories for a specific category
//   const getSubCategoriesForCategory = (categoryId) => {
//     if (!categoryId || !subCategories || !Array.isArray(subCategories)) {
//       return [];
//     }
    
//     return subCategories.filter(subCat => {
//       if (subCat.category && subCat.category._id) {
//         return subCat.category._id === categoryId;
//       }
//       if (subCat.category && typeof subCat.category === 'string') {
//         return subCat.category === categoryId;
//       }
//       return false;
//     });
//   };

//   // Function to handle category navigation
//   const handleCategoryNavigation = (categoryName, categoryId) => {
//     // Navigate to category page with query parameter
//     router.push(`/category?category=${encodeURIComponent(categoryName)}&id=${categoryId}`);
//     setIsMenuOpen(false);
//     setActiveDropdown(null);
//   };

//   // Function to handle subcategory navigation
//   const handleSubCategoryNavigation = (categoryName, categoryId, subCategoryName, subCategoryId) => {
//     // Navigate to category page with both category and subcategory filters
//     router.push(`/category?category=${encodeURIComponent(categoryName)}&id=${categoryId}&subcategory=${encodeURIComponent(subCategoryName)}&subid=${subCategoryId}`);
//     setIsMenuOpen(false);
//     setActiveDropdown(null);
//   };

//   // Base navigation links
//   const navLinks = [
//     { name: 'HOME', href: '/' },
//     { 
//       name: 'ABOUT',
//       href: '/about',
//       hasDropdown: true,
//       subItems: [
//         { label: 'About Us', href: '/about' },
//         { label: 'Our Vision & Philosophy', href: '/about/vision' },
//         { label: 'Our Values', href: '/about/values' },
//         { label: 'Our History', href: '/about/history' },
//         { label: 'CEO Message', href: '/about/ceo-message' }
//       ] 
//     },
//   ];

//   // Get dynamic navigation links
//   const getNavLinks = () => {
//     if (isLoading) {
//       return [...navLinks, 
//         { name: 'CATEGORY', href: '/category' },
//         { name: 'CUSTOM ORDERS', href: '/custom-orders' },
//         { name: 'CONTACT US', href: '/contact-us' }
//       ];
//     }

//     // Create dynamic navigation structure
//     return [
//       ...navLinks,
//       {
//         name: 'CATEGORY',
//         href: '/category',
//         hasDropdown: true,
//         isMainCategory: true,
//         items: [
//           // { label: 'All Products', href: '/category' },
//           ...categories.map(cat => ({
//             label: cat.name,
//             href: '#',
//             categoryId: cat._id,
//             hasSubItems: true
//           })),
//           { label: 'Custom', href: '/custom-orders' }
//         ]
//       },
//       ...categories.map(cat => ({
//         name: cat.name.toUpperCase(),
//         href: '#',
//         hasDropdown: true,
//         categoryId: cat._id,
//         isCategory: true
//       })),
//       { name: 'CUSTOM ORDERS', href: '/custom-orders' },
//       { name: 'CONTACT US', href: '/contact-us' },
//     ];
//   };

//   const navigationLinks = getNavLinks();

//   return (
//     <header className="w-full bg-[#FFF6EB] border-b border-[#A49C93]/30 relative z-50">
//       <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
//         {/* Left Side (Desktop) */}
//         <div className="hidden lg:flex items-center gap-6 text-sm text-gray-700 flex-1">
//           <div className="flex items-center gap-2 cursor-pointer font-mona">
//             <span>English</span>
//             <ChevronRight size={14} className="rotate-90" />
//           </div>
//           <div className="flex items-center gap-2 cursor-pointer font-mona">
//             <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3" />
//             <span>INR ₹</span>
//             <ChevronRight size={14} className="rotate-90" />
//           </div>
//         </div>

//         {/* Mobile Menu Icon */}
//         <div className="lg:hidden flex-1">
//           <button onClick={() => setIsMenuOpen(true)}>
//             <Menu className="text-[#C08237]" size={28} />
//           </button>
//         </div>

//         {/* Center Logo */}
//         <div className="flex justify-center flex-1">
//           <Link href="/">
//             <img src="/images/Group-56121.svg" alt="Logo" className="h-10 w-auto" />
//           </Link>
//         </div>

//         {/* Right Side (Search & Auth) */}
//         <div className="flex items-center justify-end gap-4 flex-1" ref={searchRef}>
//           <div className="relative hidden md:block">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="WHAT ARE YOU LOOKING FOR?"
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setIsSearchOpen(true);
//                 }}
//                 onFocus={() => setIsSearchOpen(true)}
//                 className="w-48 lg:w-72 font-mona pl-10 pr-4 py-2 bg-transparent text-gray-500 border border-[#A49C93] rounded-full text-[10px] focus:border-[#C08237] outline-none transition-all"
//               />
//               <img src='/images/search-normal.svg' className='w-4 absolute left-3 top-2.5' alt="search" />
//             </div>

//             {/* Search Results Dropdown */}
//             {isSearchOpen && searchQuery && (
//               <div className="absolute top-full mt-2 w-80 right-0 bg-white shadow-2xl rounded-lg border border-gray-100 overflow-hidden z-50">
//                 {searchResults.length > 0 ? (
//                   searchResults.map((product) => (
//                     <Link 
//                       key={product.id} 
//                       href={`/product/${product.id}`}
//                       onClick={() => setIsSearchOpen(false)}
//                       className="flex items-center gap-3 p-3 hover:bg-[#FFF6EB] border-b border-gray-50 last:border-0 transition-colors"
//                     >
//                       <img src={product.img} alt={product.name} className="w-12 h-12 object-cover rounded border border-gray-100" />
//                       <div>
//                         <p className="text-[11px] font-bold text-gray-800 uppercase line-clamp-1">{product.name}</p>
//                         <p className="text-[9px] text-[#C08237] font-semibold uppercase">{product.categoryName}</p>
//                       </div>
//                     </Link>
//                   ))
//                 ) : (
//                   <div className="p-4 text-center text-[11px] text-gray-500">No results for "{searchQuery}"</div>
//                 )}
//               </div>
//             )}
//           </div>

//           <button className="p-2 rounded-full border border-[#C08237] hover:bg-[#C08237] transition-all group">
//             <img src='/images/heart.svg' className='w-5 group-hover:brightness-0 group-hover:invert' alt="wishlist" />
//           </button>

//           <Link href="/login">
//             <button className="flex items-center gap-1 bg-[#C08237] text-white px-5 py-2 rounded-full text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors">
//               <img src='/images/profile.svg' className='w-4 brightness-0 invert' alt="login" />
//               LOGIN
//             </button>
//           </Link>
//         </div>
//       </div>

//       {/* --- Desktop Navigation --- */}
//       <nav className="hidden lg:block border-t border-[#A49C93]/20">
//         <div className="max-w-7xl mx-auto px-4">
//           <ul className="flex justify-center items-center gap-8">
//             {navigationLinks.map((link) => {
//               const isActive = pathname === link.href;
//               return (
//                 <li 
//                   key={link.name} 
//                   className="relative py-3 group"
//                   onMouseEnter={() => setActiveDropdown(link.name)}
//                   onMouseLeave={() => setActiveDropdown(null)}
//                 >
//                   {link.isMainCategory || link.isCategory ? (
//                     <button
//                       className={`text-[11px] font-bold tracking-widest ${isActive ? 'text-[#C08237]' : 'text-gray-800'} hover:text-[#C08237] transition-colors`}
//                     >
//                       {link.name}
//                     </button>
//                   ) : (
//                     <Link 
//                       href={link.href} 
//                       className={`text-[11px] font-bold tracking-widest ${isActive ? 'text-[#C08237]' : 'text-gray-800'} hover:text-[#C08237] transition-colors`}
//                     >
//                       {link.name}
//                     </Link>
//                   )}

//                   {/* Main CATEGORY Dropdown */}
//                   {link.hasDropdown && link.isMainCategory && activeDropdown === link.name && (
//                     <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
//                       {isLoading ? (
//                         <div className="px-5 py-3 text-center text-[12px] text-gray-500">
//                           Loading...
//                         </div>
//                       ) : (
//                         <>
//                           {/* All Products Link */}
//                           <Link
//                             href="/category"
//                             onClick={() => setActiveDropdown(null)}
//                             className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100"
//                           >
//                             ALL PRODUCTS
//                             <ChevronRight size={12} className="opacity-50" />
//                           </Link>
                          
//                           {/* Dynamic Categories */}
//                           {link.items && link.items.filter(item => item.categoryId).map((item) => {
//                             const categoryObj = categories.find(c => c._id === item.categoryId);
//                             const categorySubCats = getSubCategoriesForCategory(item.categoryId);
                            
//                             return (
//                               <div key={item.categoryId} className="relative group/sub">
//                                 <button
//                                   onClick={() => handleCategoryNavigation(categoryObj.name, item.categoryId)}
//                                   className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100"
//                                 >
//                                   {categoryObj?.name.toUpperCase()}
//                                   {categorySubCats.length > 0 && (
//                                     <ChevronRight size={12} className="opacity-50" />
//                                   )}
//                                 </button>
                                
//                                 {/* Subcategory nested dropdown */}
//                                 {categorySubCats.length > 0 && (
//                                   <div className="absolute left-full top-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all shadow-xl">
//                                     {categorySubCats.map(subCat => (
//                                       <button
//                                         key={subCat._id}
//                                         onClick={() => handleSubCategoryNavigation(
//                                           categoryObj.name, 
//                                           item.categoryId, 
//                                           subCat.name, 
//                                           subCat._id
//                                         )}
//                                         className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
//                                       >
//                                         {subCat.name.toUpperCase()}
//                                         <ChevronRight size={12} className="opacity-50" />
//                                       </button>
//                                     ))}
//                                   </div>
//                                 )}
//                               </div>
//                             );
//                           })}
                          
//                           {/* Custom Orders Link */}
//                           <Link
//                             href="/custom-orders"
//                             onClick={() => setActiveDropdown(null)}
//                             className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all"
//                           >
//                             CUSTOM
//                             <ChevronRight size={12} className="opacity-50" />
//                           </Link>
//                         </>
//                       )}
//                     </div>
//                   )}

//                   {/* Individual Category Dropdowns (ANIMAL, GOD FIGURE, etc.) */}
//                   {link.hasDropdown && link.isCategory && activeDropdown === link.name && (
//                     <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
//                       {isLoading ? (
//                         <div className="px-5 py-3 text-center text-[12px] text-gray-500">
//                           Loading...
//                         </div>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => {
//                               const categoryObj = categories.find(c => c._id === link.categoryId);
//                               if (categoryObj) {
//                                 handleCategoryNavigation(categoryObj.name, link.categoryId);
//                               }
//                             }}
//                             className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100"
//                           >
//                             ALL {link.name}
//                             <ChevronRight size={12} className="opacity-50" />
//                           </button>
                          
//                           {getSubCategoriesForCategory(link.categoryId).map(subCat => {
//                             const categoryObj = categories.find(c => c._id === link.categoryId);
//                             return (
//                               <button
//                                 key={subCat._id}
//                                 onClick={() => handleSubCategoryNavigation(
//                                   categoryObj?.name || link.name, 
//                                   link.categoryId, 
//                                   subCat.name, 
//                                   subCat._id
//                                 )}
//                                 className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
//                               >
//                                 {subCat.name.toUpperCase()}
//                                 <ChevronRight size={12} className="opacity-50" />
//                               </button>
//                             );
//                           })}
                          
//                           <Link
//                             href="/custom-orders"
//                             onClick={() => setActiveDropdown(null)}
//                             className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-t border-gray-100 mt-1"
//                           >
//                             CUSTOM ORDERS
//                             <ChevronRight size={12} className="opacity-50" />
//                           </Link>
//                         </>
//                       )}
//                     </div>
//                   )}

//                   {/* Static Dropdowns (ABOUT) */}
//                   {link.hasDropdown && !link.isMainCategory && !link.isCategory && activeDropdown === link.name && (
//                     <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
//                       {link.subItems.map((sub) => (
//                         <Link 
//                           key={sub.label} 
//                           href={sub.href}
//                           onClick={() => setActiveDropdown(null)}
//                           className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
//                         >
//                           {sub.label.toUpperCase()}
//                           <ChevronRight size={12} className="opacity-50" />
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       </nav>

//       {/* Mobile Sidebar */}
//       {isMenuOpen && (
//         <div className="fixed inset-0 z-[100] lg:hidden">
//           <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
//           <div className="fixed top-0 left-0 w-[80%] h-full bg-[#FFF6EB] p-6 shadow-xl overflow-y-auto">
//             <div className="flex justify-between items-center mb-8">
//               <img src="/images/Group-56121.svg" alt="logo" className="h-8" />
//               <button onClick={() => setIsMenuOpen(false)}>
//                 <X size={24} />
//               </button>
//             </div>
            
//             <ul className="space-y-5">
//               {navigationLinks.map((link) => (
//                 <li key={link.name} className="border-b border-gray-200 pb-3">
//                   <div className="flex justify-between items-center" 
//                     onClick={() => {
//                       if (link.hasDropdown) {
//                         setActiveDropdown(activeDropdown === link.name ? null : link.name);
//                       }
//                     }}>
//                     {link.isMainCategory || link.isCategory ? (
//                       <button className="text-[11px] font-bold text-gray-800 uppercase tracking-widest">
//                         {link.name}
//                       </button>
//                     ) : (
//                       <Link 
//                         href={link.href} 
//                         onClick={() => !link.hasDropdown && setIsMenuOpen(false)}
//                         className="text-[11px] font-bold text-gray-800 uppercase tracking-widest"
//                       >
//                         {link.name}
//                       </Link>
//                     )}
//                     {link.hasDropdown && (
//                       <ChevronRight size={16} className={`transition-transform ${activeDropdown === link.name ? 'rotate-90' : ''}`} />
//                     )}
//                   </div>
                  
//                   {/* Mobile Dropdown */}
//                   {link.hasDropdown && activeDropdown === link.name && (
//                     <ul className="mt-3 ml-4 space-y-4 border-l-2 border-[#C08237] pl-4">
//                       {/* Main CATEGORY dropdown in mobile */}
//                       {link.isMainCategory && (
//                         <>
//                           <li>
//                             <Link
//                               href="/category"
//                               onClick={() => setIsMenuOpen(false)}
//                               className="text-[10px] font-bold text-gray-500 uppercase block"
//                             >
//                               ALL PRODUCTS
//                             </Link>
//                           </li>
//                           {link.items && link.items.filter(item => item.categoryId).map(item => {
//                             const categoryObj = categories.find(c => c._id === item.categoryId);
//                             const categorySubCats = getSubCategoriesForCategory(item.categoryId);
                            
//                             return (
//                               <li key={item.categoryId}>
//                                 <div className="flex justify-between items-center">
//                                   <button
//                                     onClick={() => {
//                                       if (categoryObj) {
//                                         handleCategoryNavigation(categoryObj.name, item.categoryId);
//                                       }
//                                     }}
//                                     className="text-[10px] font-bold text-gray-500 uppercase"
//                                   >
//                                     {categoryObj?.name || item.label}
//                                   </button>
//                                   {categorySubCats.length > 0 && (
//                                     <ChevronRight 
//                                       size={12} 
//                                       className={`transition-transform ${activeDropdown === `${item.label}-sub` ? 'rotate-90' : ''}`}
//                                       onClick={(e) => {
//                                         e.preventDefault();
//                                         e.stopPropagation();
//                                         setActiveDropdown(activeDropdown === `${item.label}-sub` ? null : `${item.label}-sub`);
//                                       }}
//                                     />
//                                   )}
//                                 </div>
                                
//                                 {/* Nested subcategories in mobile */}
//                                 {categorySubCats.length > 0 && activeDropdown === `${item.label}-sub` && (
//                                   <ul className="ml-4 mt-2 space-y-2">
//                                     {categorySubCats.map(subCat => (
//                                       <li key={subCat._id}>
//                                         <button
//                                           onClick={() => {
//                                             if (categoryObj) {
//                                               handleSubCategoryNavigation(
//                                                 categoryObj.name, 
//                                                 item.categoryId, 
//                                                 subCat.name, 
//                                                 subCat._id
//                                               );
//                                             }
//                                           }}
//                                           className="text-[10px] font-bold text-gray-500 uppercase pl-2 block w-full text-left"
//                                         >
//                                           {subCat.name}
//                                         </button>
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 )}
//                               </li>
//                             );
//                           })}
//                           <li>
//                             <Link
//                               href="/custom-orders"
//                               onClick={() => setIsMenuOpen(false)}
//                               className="text-[10px] font-bold text-gray-500 uppercase block"
//                             >
//                               CUSTOM
//                             </Link>
//                           </li>
//                         </>
//                       )}
                      
//                       {/* Individual category dropdowns in mobile */}
//                       {link.isCategory && (
//                         <>
//                           <li>
//                             <button
//                               onClick={() => {
//                                 const categoryObj = categories.find(c => c._id === link.categoryId);
//                                 if (categoryObj) {
//                                   handleCategoryNavigation(categoryObj.name, link.categoryId);
//                                 }
//                               }}
//                               className="text-[10px] font-bold text-gray-500 uppercase block w-full text-left"
//                             >
//                               ALL {link.name}
//                             </button>
//                           </li>
//                           {getSubCategoriesForCategory(link.categoryId).map(subCat => {
//                             const categoryObj = categories.find(c => c._id === link.categoryId);
//                             return (
//                               <li key={subCat._id}>
//                                 <button
//                                   onClick={() => handleSubCategoryNavigation(
//                                     categoryObj?.name || link.name, 
//                                     link.categoryId, 
//                                     subCat.name, 
//                                     subCat._id
//                                   )}
//                                   className="text-[10px] font-bold text-gray-500 uppercase block w-full text-left"
//                                 >
//                                   {subCat.name}
//                                 </button>
//                               </li>
//                             );
//                           })}
//                           <li>
//                             <Link
//                               href="/custom-orders"
//                               onClick={() => setIsMenuOpen(false)}
//                               className="text-[10px] font-bold text-gray-500 uppercase block border-t border-gray-200 pt-2 mt-2"
//                             >
//                               CUSTOM ORDERS
//                             </Link>
//                           </li>
//                         </>
//                       )}
                      
//                       {/* Static dropdowns (ABOUT) */}
//                       {!link.isMainCategory && !link.isCategory && link.hasDropdown && (
//                         <>
//                           {link.subItems.map(sub => (
//                             <li key={sub.label}>
//                               <Link 
//                                 href={sub.href} 
//                                 onClick={() => setIsMenuOpen(false)}
//                                 className="text-[10px] font-bold text-gray-500 uppercase block"
//                               >
//                                 {sub.label}
//                               </Link>
//                             </li>
//                           ))}
//                         </>
//                       )}
//                     </ul>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;

// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { Menu, X, ChevronRight } from 'lucide-react';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [allProducts, setAllProducts] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   const searchRef = useRef(null);
//   const pathname = usePathname();
//   const router = useRouter();

//   // Manual subcategories mapping for each category
//   const manualSubCategories = {
//     'animal-statues': [
//       { id: 'elephant', name: 'ELEPHANT', href: '/category/animal-statues/elephant' },
//       { id: 'lion', name: 'LION', href: '/category/animal-statues/lion' },
//       { id: 'tiger', name: 'TIGER', href: '/category/animal-statues/tiger' },
//       { id: 'horse', name: 'HORSE', href: '/category/animal-statues/horse' },
//       { id: 'bull', name: 'BULL', href: '/category/animal-statues/bull' },
//       { id: 'dog', name: 'DOG', href: '/category/animal-statues/dog' },
//     ],
//     'god-figures': [
//       { id: 'ganesha', name: 'GANESHA', href: '/category/god-figures/ganesha' },
//       { id: 'buddha', name: 'BUDDHA', href: '/category/god-figures/buddha' },
//       { id: 'krishna', name: 'KRISHNA', href: '/category/god-figures/krishna' },
//       { id: 'shiva', name: 'SHIVA', href: '/category/god-figures/shiva' },
//       { id: 'hanuman', name: 'HANUMAN', href: '/category/god-figures/hanuman' },
//     ],
//     'human-figures': [
//       { id: 'warrior', name: 'WARRIOR', href: '/category/human-figures/warrior' },
//       { id: 'dancer', name: 'DANCER', href: '/category/human-figures/dancer' },
//       { id: 'musician', name: 'MUSICIAN', href: '/category/human-figures/musician' },
//       { id: 'royal', name: 'ROYAL', href: '/category/human-figures/royal' },
//     ],
//     'abstract-forms': [
//       { id: 'geometric', name: 'GEOMETRIC', href: '/category/abstract-forms/geometric' },
//       { id: 'organic', name: 'ORGANIC', href: '/category/abstract-forms/organic' },
//       { id: 'minimalist', name: 'MINIMALIST', href: '/category/abstract-forms/minimalist' },
//     ],
//     'furniture': [
//       { id: 'chairs', name: 'CHAIRS', href: '/category/furniture/chairs' },
//       { id: 'tables', name: 'TABLES', href: '/category/furniture/tables' },
//       { id: 'stools', name: 'STOOLS', href: '/category/furniture/stools' },
//       { id: 'benches', name: 'BENCHES', href: '/category/furniture/benches' },
//     ],
//     'wall-art': [
//       { id: 'sculptures', name: 'SCULPTURES', href: '/category/wall-art/sculptures' },
//       { id: 'panels', name: 'PANELS', href: '/category/wall-art/panels' },
//       { id: 'decorations', name: 'DECORATIONS', href: '/category/wall-art/decorations' },
//     ],
//   };

//   // Fetch categories and products only
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
        
//         // 1. Fetch categories (still need for navigation structure)
//         const categoriesResponse = await axios.get('/api/admin/categories');
//         if (categoriesResponse.data.success) {
//           setCategories(categoriesResponse.data.data || []);
//         }
        
//         // 2. Fetch products for search only
//         const productsResponse = await axios.get('/api/admin/products');
//         if (productsResponse.data.success) {
//           const transformed = productsResponse.data.data.map(product => ({
//             id: product._id,
//             name: product.name || "Unnamed Product",
//             img: product.thumbnail || (product.images && product.images[0]) || '/images/placeholder.png',
//             categoryName: product.category?.name || "Uncategorized",
//             categoryId: product.category?._id || ""
//           }));
//           setAllProducts(transformed);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Search filter logic
//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setSearchResults([]);
//       return;
//     }

//     const filtered = allProducts.filter(product =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
//     );
    
//     setSearchResults(filtered.slice(0, 6));
//   }, [searchQuery, allProducts]);

//   // Outside click handler
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (searchRef.current && !searchRef.current.contains(e.target)) {
//         setIsSearchOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Get manual subcategories for a specific category
//   const getSubCategoriesForCategory = (categoryId) => {
//     if (!categoryId) return [];
    
//     // Convert MongoDB _id to slug format for manual mapping
//     const category = categories.find(c => c._id === categoryId);
//     if (!category) return [];
    
//     // Map category name to manual subcategories
//     const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
//     return manualSubCategories[categorySlug] || [];
//   };

//   // Function to handle category navigation
//   const handleCategoryNavigation = (categoryName, categoryId) => {
//     // Navigate to category page with query parameter
//     router.push(`/category?category=${encodeURIComponent(categoryName)}&id=${categoryId}`);
//     setIsMenuOpen(false);
//     setActiveDropdown(null);
//   };

//   // Function to handle subcategory navigation
//   const handleSubCategoryNavigation = (subcategoryHref) => {
//     // Navigate directly to the subcategory page
//     router.push(subcategoryHref);
//     setIsMenuOpen(false);
//     setActiveDropdown(null);
//   };

//   // Base navigation links
//   const navLinks = [
//     { name: 'HOME', href: '/' },
//     { 
//       name: 'ABOUT',
//       href: '/about',
//       hasDropdown: true,
//       subItems: [
//         { label: 'About Us', href: '/about' },
//         { label: 'Our Vision & Philosophy', href: '/about/vision' },
//         { label: 'Our Values', href: '/about/values' },
//         { label: 'Our History', href: '/about/history' },
//         { label: 'CEO Message', href: '/about/ceo-message' }
//       ] 
//     },
//   ];

//   // Get dynamic navigation links
//   const getNavLinks = () => {
//     if (isLoading) {
//       return [...navLinks, 
//         { name: 'CATEGORY', href: '/category' },
//         { name: 'CUSTOM ORDERS', href: '/custom-orders' },
//         { name: 'CONTACT US', href: '/contact-us' }
//       ];
//     }

//     // Create dynamic navigation structure
//     return [
//       ...navLinks,
//       {
//         name: 'CATEGORY',
//         href: '/category',
//         hasDropdown: true,
//         isMainCategory: true,
//         items: [
//           ...categories.map(cat => ({
//             label: cat.name,
//             href: '#',
//             categoryId: cat._id,
//             hasSubItems: true
//           })),
//           { label: 'Custom', href: '/custom-orders' }
//         ]
//       },
//       ...categories.map(cat => ({
//         name: cat.name.toUpperCase(),
//         href: '#',
//         hasDropdown: true,
//         categoryId: cat._id,
//         isCategory: true
//       })),
//       { name: 'CUSTOM ORDERS', href: '/custom-orders' },
//       { name: 'CONTACT US', href: '/contact-us' },
//     ];
//   };

//   const navigationLinks = getNavLinks();

//   return (
//     <header className="w-full bg-[#FFF6EB] border-b border-[#A49C93]/30 relative z-50">
//       <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
//         {/* Left Side (Desktop) */}
//         <div className="hidden lg:flex items-center gap-6 text-sm text-gray-700 flex-1">
//           <div className="flex items-center gap-2 cursor-pointer font-mona">
//             <span>English</span>
//             <ChevronRight size={14} className="rotate-90" />
//           </div>
//           <div className="flex items-center gap-2 cursor-pointer font-mona">
//             <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3" />
//             <span>INR ₹</span>
//             <ChevronRight size={14} className="rotate-90" />
//           </div>
//         </div>

//         {/* Mobile Menu Icon */}
//         <div className="lg:hidden flex-1">
//           <button onClick={() => setIsMenuOpen(true)}>
//             <Menu className="text-[#C08237]" size={28} />
//           </button>
//         </div>

//         {/* Center Logo */}
//         <div className="flex justify-center flex-1">
//           <Link href="/">
//             <img src="/images/Group-56121.svg" alt="Logo" className="h-10 w-auto" />
//           </Link>
//         </div>

//         {/* Right Side (Search & Auth) */}
//         <div className="flex items-center justify-end gap-4 flex-1" ref={searchRef}>
//           <div className="relative hidden md:block">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="WHAT ARE YOU LOOKING FOR?"
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setIsSearchOpen(true);
//                 }}
//                 onFocus={() => setIsSearchOpen(true)}
//                 className="w-48 lg:w-72 font-mona pl-10 pr-4 py-2 bg-transparent text-gray-500 border border-[#A49C93] rounded-full text-[10px] focus:border-[#C08237] outline-none transition-all"
//               />
//               <img src='/images/search-normal.svg' className='w-4 absolute left-3 top-2.5' alt="search" />
//             </div>

//             {/* Search Results Dropdown */}
//             {isSearchOpen && searchQuery && (
//               <div className="absolute top-full mt-2 w-80 right-0 bg-white shadow-2xl rounded-lg border border-gray-100 overflow-hidden z-50">
//                 {searchResults.length > 0 ? (
//                   searchResults.map((product) => (
//                     <Link 
//                       key={product.id} 
//                       href={`/product/${product.id}`}
//                       onClick={() => setIsSearchOpen(false)}
//                       className="flex items-center gap-3 p-3 hover:bg-[#FFF6EB] border-b border-gray-50 last:border-0 transition-colors"
//                     >
//                       <img src={product.img} alt={product.name} className="w-12 h-12 object-cover rounded border border-gray-100" />
//                       <div>
//                         <p className="text-[11px] font-bold text-gray-800 uppercase line-clamp-1">{product.name}</p>
//                         <p className="text-[9px] text-[#C08237] font-semibold uppercase">{product.categoryName}</p>
//                       </div>
//                     </Link>
//                   ))
//                 ) : (
//                   <div className="p-4 text-center text-[11px] text-gray-500">No results for "{searchQuery}"</div>
//                 )}
//               </div>
//             )}
//           </div>

//           <button className="p-2 rounded-full border border-[#C08237] hover:bg-[#C08237] transition-all group">
//             <img src='/images/heart.svg' className='w-5 group-hover:brightness-0 group-hover:invert' alt="wishlist" />
//           </button>

//           <Link href="/login">
//             <button className="flex items-center gap-1 bg-[#C08237] text-white px-5 py-2 rounded-full text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors">
//               <img src='/images/profile.svg' className='w-4 brightness-0 invert' alt="login" />
//               LOGIN
//             </button>
//           </Link>
//         </div>
//       </div>

//       {/* --- Desktop Navigation --- */}
//       <nav className="hidden lg:block border-t border-[#A49C93]/20">
//         <div className="max-w-7xl mx-auto px-4">
//           <ul className="flex justify-center items-center gap-8">
//             {navigationLinks.map((link) => {
//               const isActive = pathname === link.href;
//               return (
//                 <li 
//                   key={link.name} 
//                   className="relative py-3 group"
//                   onMouseEnter={() => setActiveDropdown(link.name)}
//                   onMouseLeave={() => setActiveDropdown(null)}
//                 >
//                   {link.isMainCategory || link.isCategory ? (
//                     <button
//                       className={`text-[11px] font-bold tracking-widest ${isActive ? 'text-[#C08237]' : 'text-gray-800'} hover:text-[#C08237] transition-colors`}
//                     >
//                       {link.name}
//                     </button>
//                   ) : (
//                     <Link 
//                       href={link.href} 
//                       className={`text-[11px] font-bold tracking-widest ${isActive ? 'text-[#C08237]' : 'text-gray-800'} hover:text-[#C08237] transition-colors`}
//                     >
//                       {link.name}
//                     </Link>
//                   )}

//                   {/* Main CATEGORY Dropdown */}
//                   {link.hasDropdown && link.isMainCategory && activeDropdown === link.name && (
//                     <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
//                       {isLoading ? (
//                         <div className="px-5 py-3 text-center text-[12px] text-gray-500">
//                           Loading...
//                         </div>
//                       ) : (
//                         <>
//                           {/* All Products Link */}
//                           {/* <Link
//                             href="/category"
//                             onClick={() => setActiveDropdown(null)}
//                             className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100"
//                           >
//                             ALL PRODUCTS
//                             <ChevronRight size={12} className="opacity-50" />
//                           </Link> */}
                          
//                           {/* Dynamic Categories */}
//                           {link.items && link.items.filter(item => item.categoryId).map((item) => {
//                             const categoryObj = categories.find(c => c._id === item.categoryId);
//                             const categorySubCats = getSubCategoriesForCategory(item.categoryId);
                            
//                             return (
//                               <div key={item.categoryId} className="relative group/sub">
//                                 <button
//                                   onClick={() => handleCategoryNavigation(categoryObj.name, item.categoryId)}
//                                   className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100"
//                                 >
//                                   {categoryObj?.name.toUpperCase()}
//                                   {categorySubCats.length > 0 && (
//                                     <ChevronRight size={12} className="opacity-50" />
//                                   )}
//                                 </button>
                                
//                                 {/* Subcategory nested dropdown */}
//                                 {categorySubCats.length > 0 && (
//                                   <div className="absolute left-full top-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all shadow-xl">
//                                     {categorySubCats.map(subCat => (
//                                       <Link
//                                         key={subCat.id}
//                                         href={subCat.href}
//                                         onClick={() => setActiveDropdown(null)}
//                                         className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
//                                       >
//                                         {subCat.name}
//                                         <ChevronRight size={12} className="opacity-50" />
//                                       </Link>
//                                     ))}
//                                   </div>
//                                 )}
//                               </div>
//                             );
//                           })}
                          
//                           {/* Custom Orders Link */}
//                           <Link
//                             href="/custom-orders"
//                             onClick={() => setActiveDropdown(null)}
//                             className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all"
//                           >
//                             CUSTOM
//                             <ChevronRight size={12} className="opacity-50" />
//                           </Link>
//                         </>
//                       )}
//                     </div>
//                   )}

//                   {/* Individual Category Dropdowns (ANIMAL, GOD FIGURE, etc.) */}
//                   {link.hasDropdown && link.isCategory && activeDropdown === link.name && (
//                     <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
//                       {isLoading ? (
//                         <div className="px-5 py-3 text-center text-[12px] text-gray-500">
//                           Loading...
//                         </div>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => {
//                               const categoryObj = categories.find(c => c._id === link.categoryId);
//                               if (categoryObj) {
//                                 handleCategoryNavigation(categoryObj.name, link.categoryId);
//                               }
//                             }}
//                             className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100"
//                           >
//                             ALL {link.name}
//                             <ChevronRight size={12} className="opacity-50" />
//                           </button>
                          
//                           {getSubCategoriesForCategory(link.categoryId).map(subCat => (
//                             <Link
//                               key={subCat.id}
//                               href={subCat.href}
//                               onClick={() => setActiveDropdown(null)}
//                               className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
//                             >
//                               {subCat.name}
//                               <ChevronRight size={12} className="opacity-50" />
//                             </Link>
//                           ))}
                          
//                           <Link
//                             href="/custom-orders"
//                             onClick={() => setActiveDropdown(null)}
//                             className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-t border-gray-100 mt-1"
//                           >
//                             CUSTOM ORDERS
//                             <ChevronRight size={12} className="opacity-50" />
//                           </Link>
//                         </>
//                       )}
//                     </div>
//                   )}

//                   {/* Static Dropdowns (ABOUT) */}
//                   {link.hasDropdown && !link.isMainCategory && !link.isCategory && activeDropdown === link.name && (
//                     <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
//                       {link.subItems.map((sub) => (
//                         <Link 
//                           key={sub.label} 
//                           href={sub.href}
//                           onClick={() => setActiveDropdown(null)}
//                           className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
//                         >
//                           {sub.label.toUpperCase()}
//                           <ChevronRight size={12} className="opacity-50" />
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       </nav>

//       {/* Mobile Sidebar */}
//       {isMenuOpen && (
//         <div className="fixed inset-0 z-[100] lg:hidden">
//           <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
//           <div className="fixed top-0 left-0 w-[80%] h-full bg-[#FFF6EB] p-6 shadow-xl overflow-y-auto">
//             <div className="flex justify-between items-center mb-8">
//               <img src="/images/Group-56121.svg" alt="logo" className="h-8" />
//               <button onClick={() => setIsMenuOpen(false)}>
//                 <X size={24} />
//               </button>
//             </div>
            
//             <ul className="space-y-5">
//               {navigationLinks.map((link) => (
//                 <li key={link.name} className="border-b border-gray-200 pb-3">
//                   <div className="flex justify-between items-center" 
//                     onClick={() => {
//                       if (link.hasDropdown) {
//                         setActiveDropdown(activeDropdown === link.name ? null : link.name);
//                       }
//                     }}>
//                     {link.isMainCategory || link.isCategory ? (
//                       <button className="text-[11px] font-bold text-gray-800 uppercase tracking-widest">
//                         {link.name}
//                       </button>
//                     ) : (
//                       <Link 
//                         href={link.href} 
//                         onClick={() => !link.hasDropdown && setIsMenuOpen(false)}
//                         className="text-[11px] font-bold text-gray-800 uppercase tracking-widest"
//                       >
//                         {link.name}
//                       </Link>
//                     )}
//                     {link.hasDropdown && (
//                       <ChevronRight size={16} className={`transition-transform ${activeDropdown === link.name ? 'rotate-90' : ''}`} />
//                     )}
//                   </div>
                  
//                   {/* Mobile Dropdown */}
//                   {link.hasDropdown && activeDropdown === link.name && (
//                     <ul className="mt-3 ml-4 space-y-4 border-l-2 border-[#C08237] pl-4">
//                       {/* Main CATEGORY dropdown in mobile */}
//                       {link.isMainCategory && (
//                         <>
//                           <li>
//                             <Link
//                               href="/category"
//                               onClick={() => setIsMenuOpen(false)}
//                               className="text-[10px] font-bold text-gray-500 uppercase block"
//                             >
//                               ALL PRODUCTS
//                             </Link>
//                           </li>
//                           {link.items && link.items.filter(item => item.categoryId).map(item => {
//                             const categoryObj = categories.find(c => c._id === item.categoryId);
//                             const categorySubCats = getSubCategoriesForCategory(item.categoryId);
                            
//                             return (
//                               <li key={item.categoryId}>
//                                 <div className="flex justify-between items-center">
//                                   <button
//                                     onClick={() => {
//                                       if (categoryObj) {
//                                         handleCategoryNavigation(categoryObj.name, item.categoryId);
//                                       }
//                                     }}
//                                     className="text-[10px] font-bold text-gray-500 uppercase"
//                                   >
//                                     {categoryObj?.name || item.label}
//                                   </button>
//                                   {categorySubCats.length > 0 && (
//                                     <ChevronRight 
//                                       size={12} 
//                                       className={`transition-transform ${activeDropdown === `${item.label}-sub` ? 'rotate-90' : ''}`}
//                                       onClick={(e) => {
//                                         e.preventDefault();
//                                         e.stopPropagation();
//                                         setActiveDropdown(activeDropdown === `${item.label}-sub` ? null : `${item.label}-sub`);
//                                       }}
//                                     />
//                                   )}
//                                 </div>
                                
//                                 {/* Nested subcategories in mobile */}
//                                 {categorySubCats.length > 0 && activeDropdown === `${item.label}-sub` && (
//                                   <ul className="ml-4 mt-2 space-y-2">
//                                     {categorySubCats.map(subCat => (
//                                       <li key={subCat.id}>
//                                         <Link
//                                           href={subCat.href}
//                                           onClick={() => setIsMenuOpen(false)}
//                                           className="text-[10px] font-bold text-gray-500 uppercase pl-2 block w-full text-left"
//                                         >
//                                           {subCat.name}
//                                         </Link>
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 )}
//                               </li>
//                             );
//                           })}
//                           <li>
//                             <Link
//                               href="/custom-orders"
//                               onClick={() => setIsMenuOpen(false)}
//                               className="text-[10px] font-bold text-gray-500 uppercase block"
//                             >
//                               CUSTOM
//                             </Link>
//                           </li>
//                         </>
//                       )}
                      
//                       {/* Individual category dropdowns in mobile */}
//                       {link.isCategory && (
//                         <>
//                           <li>
//                             <button
//                               onClick={() => {
//                                 const categoryObj = categories.find(c => c._id === link.categoryId);
//                                 if (categoryObj) {
//                                   handleCategoryNavigation(categoryObj.name, link.categoryId);
//                                 }
//                               }}
//                               className="text-[10px] font-bold text-gray-500 uppercase block w-full text-left"
//                             >
//                               ALL {link.name}
//                             </button>
//                           </li>
//                           {getSubCategoriesForCategory(link.categoryId).map(subCat => (
//                             <li key={subCat.id}>
//                               <Link
//                                 href={subCat.href}
//                                 onClick={() => setIsMenuOpen(false)}
//                                 className="text-[10px] font-bold text-gray-500 uppercase block w-full text-left"
//                               >
//                                 {subCat.name}
//                               </Link>
//                             </li>
//                           ))}
//                           <li>
//                             <Link
//                               href="/custom-orders"
//                               onClick={() => setIsMenuOpen(false)}
//                               className="text-[10px] font-bold text-gray-500 uppercase block border-t border-gray-200 pt-2 mt-2"
//                             >
//                               CUSTOM ORDERS
//                             </Link>
//                           </li>
//                         </>
//                       )}
                      
//                       {/* Static dropdowns (ABOUT) */}
//                       {!link.isMainCategory && !link.isCategory && link.hasDropdown && (
//                         <>
//                           {link.subItems.map(sub => (
//                             <li key={sub.label}>
//                               <Link 
//                                 href={sub.href} 
//                                 onClick={() => setIsMenuOpen(false)}
//                                 className="text-[10px] font-bold text-gray-500 uppercase block"
//                               >
//                                 {sub.label}
//                               </Link>
//                             </li>
//                           ))}
//                         </>
//                       )}
//                     </ul>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;
// end
// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { Menu, X, ChevronRight } from 'lucide-react';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [allProducts, setAllProducts] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
  
//   const searchRef = useRef(null);
//   const pathname = usePathname();
//   const router = useRouter();

//   // 1. Aapke Manual Links aur Subcategories
//   const manualNavConfig = [
//     { name: 'HOME', href: '/' },
 
//      { 
//       name: 'ABOUT',
//       href: '/about',
//       // hasDropdown: true,
//       subItems: [
//         { name: 'About Us', href: '/about' },
//         { name: 'Our Vision & Philosophy', href: '/about/vision' },
//         { name: 'Our Values', href: '/about/values' },
//         { name: 'Our History', href: '/about/history' },
//         { name: 'CEO Message', href: '/about/ceo-message' }
//       ] 
//     },
//      { 
//       name: 'CATEGORY', 
//       href: '/category', // Main Page Link
//       subItems: [
//         { name: 'Animal', href: '/category/animal/elephant' },
//         { name: 'GOD FIGURE', href: '/category/animal/horse' },
//         { name: 'UTILITY / DECOR', href: '/category/animal/camel' },
//       ]
//     },
//     { 
//       name: 'ANIMAL', 
//       href: '/animal', // Main Page Link
//       subItems: [
//         { name: 'Elephant', href: '/category/animal/elephant' },
//         { name: 'Horse', href: '/category/animal/horse' },
//         { name: 'Camel', href: '/category/animal/camel' },
//         { name: 'Lion', href: '/category/animal/lion' },
//         { name: 'Cow', href: '/category/animal/cow' },
//       ]
//     },
//     { 
//       name: 'GOD FIGURE', 
//       href: '/god-figure', 
//       subItems: [
//         { name: 'Ganesha', href: '/category/god-figure/ganesha' },
//         { name: 'Buddha', href: '/category/god-figure/buddha' },
//         { name: 'Krishna', href: '/category/god-figure/krishna' },
//         { name: 'Shiva', href: '/category/god-figure/shiva' },
//       ]
//     },
//     { 
//       name: 'UTILITY / DECOR', 
//       href: '/utility-decor', 
//       subItems: [
//         { name: 'Agarbatti Burner', href: '/category/utility-decor/burner' },
//         { name: 'Agarbatti Stand', href: '/category/utility-decor/stand' },
//         { name: 'Ashoka Pillar', href: '/category/utility-decor/pillar' },
//         { name: 'Ashtray', href: '/category/utility-decor/ashtray' },
//         { name: 'Bangle', href: '/category/utility-decor/bangle' },
//         { name: 'Bowl', href: '/category/utility-decor/bowl' },
//       ]
//     },
//     { name: 'CUSTOM ORDERS', href: '/custom-orders' },
//     { name: 'CONTACT US', href: '/contact-us' },
//   ];

//   // Search ke liye products fetch karna (sirf search functionality ke liye)
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get('/api/admin/products');
//         if (res.data.success) {
//           setAllProducts(res.data.data.map(p => ({
//             id: p._id,
//             name: p.name,
//             img: p.thumbnail || p.images?.[0] || '/images/placeholder.png',
//             categoryName: p.category?.name || "Handicraft"
//           })));
//         }
//       } catch (e) { console.error(e); }
//     };
//     fetchProducts();
//   }, []);

//   // Search logic
//   useEffect(() => {
//     if (!searchQuery.trim()) { setSearchResults([]); return; }
//     const filtered = allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
//     setSearchResults(filtered.slice(0, 5));
//   }, [searchQuery, allProducts]);

//   return (
//     <header className="w-full bg-[#FFF6EB] border-b border-[#A49C93]/30 relative z-50">
//       {/* Top Bar */}
//       <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
//         <div className="hidden lg:flex items-center gap-6 text-sm text-gray-700 flex-1">
//           <div className="flex items-center gap-2 cursor-pointer">
//             <span>English</span> <ChevronRight size={14} className="rotate-90" />
//           </div>
//           <div className="flex items-center gap-2 cursor-pointer">
//             <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3" />
//             <span>INR ₹</span> <ChevronRight size={14} className="rotate-90" />
//           </div>
//         </div>

//         <div className="lg:hidden flex-1">
//           <button onClick={() => setIsMenuOpen(true)}><Menu className="text-[#C08237]" size={28} /></button>
//         </div>

//         <div className="flex justify-center flex-1">
//           <Link href="/"><img src="/images/Group-56121.svg" alt="Logo" className="h-10 w-auto" /></Link>
//         </div>

//         <div className="flex items-center justify-end gap-4 flex-1" ref={searchRef}>
//           <div className="relative hidden md:block">
//             <input
//               type="text"
//               placeholder="WHAT ARE YOU LOOKING FOR?"
//               value={searchQuery}
//               onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
//               className="w-48 lg:w-72 pl-10 pr-4 py-2 bg-transparent border border-[#A49C93] rounded-full text-[10px] outline-none"
//             />
//             {isSearchOpen && searchResults.length > 0 && (
//               <div className="absolute top-full mt-2 w-80 right-0 bg-white shadow-2xl rounded-lg border z-50 overflow-hidden">
//                 {searchResults.map(p => (
//                   <Link key={p.id} href={`/product/${p.id}`} className="flex items-center gap-3 p-3 hover:bg-[#FFF6EB] border-b">
//                     <img src={p.img} className="w-10 h-10 object-cover rounded" />
//                     <div>
//                       <p className="text-[11px] font-bold uppercase">{p.name}</p>
//                       <p className="text-[9px] text-[#C08237]">{p.categoryName}</p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//           <Link href="/login" className="bg-[#C08237] text-white px-5 py-2 rounded-full text-xs font-bold">LOGIN</Link>
//         </div>
//       </div>

//       {/* --- Desktop Navigation (Manual) --- */}
//       <nav className="hidden lg:block border-t border-[#A49C93]/20">
//         <div className="max-w-7xl mx-auto px-4">
//           <ul className="flex justify-center items-center gap-8">
//             {manualNavConfig.map((link) => (
//               <li 
//                 key={link.name} 
//                 className="relative py-4 group"
//                 onMouseEnter={() => setActiveDropdown(link.name)}
//                 onMouseLeave={() => setActiveDropdown(null)}
//               >
//                 <Link 
//                   href={link.href} 
//                   className={`text-[11px] font-bold tracking-widest hover:text-[#C08237] transition-colors ${pathname === link.href ? 'text-[#C08237]' : 'text-gray-800'}`}
//                 >
//                   {link.name}
//                 </Link>

//                 {/* UI Dropdown jaisa aapne image mein dikhaya */}
//                 {link.subItems && activeDropdown === link.name && (
//                   <div className="absolute top-full left-0 w-56 bg-[#FFFCF5] border border-[#D7CEC2] py-1 shadow-xl rounded-sm z-50 animate-in fade-in slide-in-from-top-2">
//                     {link.subItems.map((sub) => (
//                       <Link
//                         key={sub.href}
//                         href={sub.href}
//                         className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
//                       >
//                         {sub.name}
//                         {/* <ChevronRight size={12} className="opacity-50" /> */}
//                       </Link>
//                     ))}
//                     {/* View All Link */}
//                     {/* <Link href={link.href} className="block text-center py-2 text-[10px] text-[#C08237] font-bold border-t border-gray-100 bg-gray-50/50">
//                         SEE ALL {link.name} → 
//                     </Link> */}
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </nav>

//       {/* Mobile Sidebar (Simplified Manual) */}
//       {isMenuOpen && (
//         <div className="fixed inset-0 z-[100] lg:hidden">
//           <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
//           <div className="fixed top-0 left-0 w-[80%] h-full bg-[#FFF6EB] p-6 shadow-xl overflow-y-auto">
//             <div className="flex justify-between items-center mb-8">
//               <img src="/images/Group-56121.svg" alt="logo" className="h-8" />
//               <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
//             </div>
//             <ul className="space-y-4">
//               {manualNavConfig.map((link) => (
//                 <li key={link.name} className="border-b border-gray-200 pb-2">
//                   <div className="flex justify-between items-center" onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}>
//                     <Link href={link.href} className="text-[12px] font-bold text-gray-800">{link.name}</Link>
//                     {link.subItems && <ChevronRight size={16} className={activeDropdown === link.name ? 'rotate-90' : ''} />}
//                   </div>
//                   {link.subItems && activeDropdown === link.name && (
//                     <ul className="mt-2 ml-4 space-y-2 border-l-2 border-[#C08237] pl-4">
//                       {link.subItems.map(sub => (
//                         <li key={sub.name}><Link href={sub.href} className="text-[11px] text-gray-600 block py-1">{sub.name}</Link></li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;

// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { Menu, X, ChevronRight } from 'lucide-react';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [allProducts, setAllProducts] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   const searchRef = useRef(null);
//   const pathname = usePathname();
//   const router = useRouter();

//   // Manual individual category links - these are the menu items on the main nav bar
//   const manualCategoryLinks = [
//     {
//       name: 'ANIMAL',
//       href: '/animal',
//       hasDropdown: true,
//       isCategory: true,
//       categoryId: 'animal-statues',
//       subcategories: [
//         { id: 'elephant', name: 'ELEPHANT', href: '/category/animal-statues/elephant' },
//         { id: 'lion', name: 'LION', href: '/category/animal-statues/lion' },
//         { id: 'tiger', name: 'TIGER', href: '/category/animal-statues/tiger' },
//         { id: 'horse', name: 'HORSE', href: '/category/animal-statues/horse' },
//         { id: 'bull', name: 'BULL', href: '/category/animal-statues/bull' },
//         { id: 'dog', name: 'DOG', href: '/category/animal-statues/dog' },
//       ]
//     },
//     {
//       name: 'GOD FIGURE',
//       href: '/category/god-figures',
//       hasDropdown: true,
//       isCategory: true,
//       categoryId: 'god-figures',
//       subcategories: [
//         { id: 'ganesha', name: 'GANESHA', href: '/category/god-figures/ganesha' },
//         { id: 'buddha', name: 'BUDDHA', href: '/category/god-figures/buddha' },
//         { id: 'krishna', name: 'KRISHNA', href: '/category/god-figures/krishna' },
//         { id: 'shiva', name: 'SHIVA', href: '/category/god-figures/shiva' },
//         { id: 'hanuman', name: 'HANUMAN', href: '/category/god-figures/hanuman' },
//       ]
//     },
//     {
//       name: 'UTILITY / DECOR',
//       href: '/category/utility-decor',
//       hasDropdown: true,
//       isCategory: true,
//       categoryId: 'utility-decor',
//       subcategories: [
//         { id: 'lamps', name: 'LAMPS', href: '/category/utility-decor/lamps' },
//         { id: 'vases', name: 'VASES', href: '/category/utility-decor/vases' },
//         { id: 'bowls', name: 'BOWLS', href: '/category/utility-decor/bowls' },
//         { id: 'candle-holders', name: 'CANDLE HOLDERS', href: '/category/utility-decor/candle-holders' },
//       ]
//     }
//   ];

//   // Manual subcategories mapping for dynamic categories in the main CATEGORY dropdown
//   const manualSubCategories = {
//     'animal-statues': [
//       { id: 'elephant', name: 'ELEPHANT', href: '/category/animal-statues/elephant' },
//       { id: 'lion', name: 'LION', href: '/category/animal-statues/lion' },
//       { id: 'tiger', name: 'TIGER', href: '/category/animal-statues/tiger' },
//       { id: 'horse', name: 'HORSE', href: '/category/animal-statues/horse' },
//       { id: 'bull', name: 'BULL', href: '/category/animal-statues/bull' },
//       { id: 'dog', name: 'DOG', href: '/category/animal-statues/dog' },
//     ],
//     'god-figures': [
//       { id: 'ganesha', name: 'GANESHA', href: '/category/god-figures/ganesha' },
//       { id: 'buddha', name: 'BUDDHA', href: '/category/god-figures/buddha' },
//       { id: 'krishna', name: 'KRISHNA', href: '/category/god-figures/krishna' },
//       { id: 'shiva', name: 'SHIVA', href: '/category/god-figures/shiva' },
//       { id: 'hanuman', name: 'HANUMAN', href: '/category/god-figures/hanuman' },
//     ],
//     'utility-decor': [
//       { id: 'lamps', name: 'LAMPS', href: '/category/utility-decor/lamps' },
//       { id: 'vases', name: 'VASES', href: '/category/utility-decor/vases' },
//       { id: 'bowls', name: 'BOWLS', href: '/category/utility-decor/bowls' },
//       { id: 'candle-holders', name: 'CANDLE HOLDERS', href: '/category/utility-decor/candle-holders' },
//     ],
//     'human-figures': [
//       { id: 'warrior', name: 'WARRIOR', href: '/category/human-figures/warrior' },
//       { id: 'dancer', name: 'DANCER', href: '/category/human-figures/dancer' },
//       { id: 'musician', name: 'MUSICIAN', href: '/category/human-figures/musician' },
//       { id: 'royal', name: 'ROYAL', href: '/category/human-figures/royal' },
//     ],
//     'abstract-forms': [
//       { id: 'geometric', name: 'GEOMETRIC', href: '/category/abstract-forms/geometric' },
//       { id: 'organic', name: 'ORGANIC', href: '/category/abstract-forms/organic' },
//       { id: 'minimalist', name: 'MINIMALIST', href: '/category/abstract-forms/minimalist' },
//     ],
//     'furniture': [
//       { id: 'chairs', name: 'CHAIRS', href: '/category/furniture/chairs' },
//       { id: 'tables', name: 'TABLES', href: '/category/furniture/tables' },
//       { id: 'stools', name: 'STOOLS', href: '/category/furniture/stools' },
//       { id: 'benches', name: 'BENCHES', href: '/category/furniture/benches' },
//     ],
//     'wall-art': [
//       { id: 'sculptures', name: 'SCULPTURES', href: '/category/wall-art/sculptures' },
//       { id: 'panels', name: 'PANELS', href: '/category/wall-art/panels' },
//       { id: 'decorations', name: 'DECORATIONS', href: '/category/wall-art/decorations' },
//     ],
//   };

//   // Fetch categories and products
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
        
//         // 1. Fetch categories (for the main CATEGORY dropdown)
//         const categoriesResponse = await axios.get('/api/admin/categories');
//         if (categoriesResponse.data.success) {
//           setCategories(categoriesResponse.data.data || []);
//         }
        
//         // 2. Fetch products for search only
//         const productsResponse = await axios.get('/api/admin/products');
//         if (productsResponse.data.success) {
//           const transformed = productsResponse.data.data.map(product => ({
//             id: product._id,
//             name: product.name || "Unnamed Product",
//             img: product.thumbnail || (product.images && product.images[0]) || '/images/placeholder.png',
//             categoryName: product.category?.name || "Uncategorized",
//             categoryId: product.category?._id || ""
//           }));
//           setAllProducts(transformed);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Search filter logic
//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setSearchResults([]);
//       return;
//     }

//     const filtered = allProducts.filter(product =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
//     );
    
//     setSearchResults(filtered.slice(0, 6));
//   }, [searchQuery, allProducts]);

//   // Outside click handler
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (searchRef.current && !searchRef.current.contains(e.target)) {
//         setIsSearchOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Get manual subcategories for a specific category (for main CATEGORY dropdown)
//   const getSubCategoriesForCategory = (categoryId) => {
//     if (!categoryId) return [];
    
//     // Convert MongoDB _id to slug format for manual mapping
//     const category = categories.find(c => c._id === categoryId);
//     if (!category) return [];
    
//     // Map category name to manual subcategories
//     const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
//     return manualSubCategories[categorySlug] || [];
//   };

//   // Function to handle category navigation (for main CATEGORY dropdown)
//   const handleCategoryNavigation = (categoryName, categoryId) => {
//     // Navigate to category page with query parameter
//     router.push(`/category?category=${encodeURIComponent(categoryName)}&id=${categoryId}`);
//     setIsMenuOpen(false);
//     setActiveDropdown(null);
//   };

//   // Base navigation links
//   const navLinks = [
//     { name: 'HOME', href: '/' },
//     { 
//       name: 'ABOUT',
//       href: '/about',
//       hasDropdown: true,
//       subItems: [
//         { label: 'About Us', href: '/about' },
//         { label: 'Our Vision & Philosophy', href: '/about/vision' },
//         { label: 'Our Values', href: '/about/values' },
//         { label: 'Our History', href: '/about/history' },
//         { label: 'CEO Message', href: '/about/ceo-message' }
//       ] 
//     },
//   ];

//   // Get navigation links - combine manual category links with dynamic CATEGORY dropdown
//   const getNavLinks = () => {
//     if (isLoading) {
//       return [...navLinks, 
//         { name: 'CATEGORY', href: '/category' },
//         ...manualCategoryLinks,
//         { name: 'CUSTOM ORDERS', href: '/custom-orders' },
//         { name: 'CONTACT US', href: '/contact-us' }
//       ];
//     }

//     // Create navigation structure
//     return [
//       ...navLinks,
//       {
//         name: 'CATEGORY',
//         href: '/category',
//         hasDropdown: true,
//         isMainCategory: true,
//         items: [
//           ...categories.map(cat => ({
//             label: cat.name,
//             href: '#',
//             categoryId: cat._id,
//             hasSubItems: true
//           })),
//           { label: 'Custom', href: '/custom-orders' }
//         ]
//       },
//       ...manualCategoryLinks,
//       { name: 'CUSTOM ORDERS', href: '/custom-orders' },
//       { name: 'CONTACT US', href: '/contact-us' },
//     ];
//   };

//   const navigationLinks = getNavLinks();

//   return (
//     <header className="w-full bg-[#FFF6EB] border-b border-[#A49C93]/30 relative z-50">
//       <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
//         {/* Left Side (Desktop) */}
//         <div className="hidden lg:flex items-center gap-6 text-sm text-gray-700 flex-1">
//           <div className="flex items-center gap-2 cursor-pointer font-mona">
//             <span>English</span>
//             <ChevronRight size={14} className="rotate-90" />
//           </div>
//           <div className="flex items-center gap-2 cursor-pointer font-mona">
//             <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3" />
//             <span>INR ₹</span>
//             <ChevronRight size={14} className="rotate-90" />
//           </div>
//         </div>

//         {/* Mobile Menu Icon */}
//         <div className="lg:hidden flex-1">
//           <button onClick={() => setIsMenuOpen(true)}>
//             <Menu className="text-[#C08237]" size={28} />
//           </button>
//         </div>

//         {/* Center Logo */}
//         <div className="flex justify-center flex-1">
//           <Link href="/">
//             <img src="/images/Group-56121.svg" alt="Logo" className="h-10 w-auto" />
//           </Link>
//         </div>

//         {/* Right Side (Search & Auth) */}
//         <div className="flex items-center justify-end gap-4 flex-1" ref={searchRef}>
//           <div className="relative hidden md:block">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="WHAT ARE YOU LOOKING FOR?"
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setIsSearchOpen(true);
//                 }}
//                 onFocus={() => setIsSearchOpen(true)}
//                 className="w-48 lg:w-72 font-mona pl-10 pr-4 py-2 bg-transparent text-gray-500 border border-[#A49C93] rounded-full text-[10px] focus:border-[#C08237] outline-none transition-all"
//               />
//               <img src='/images/search-normal.svg' className='w-4 absolute left-3 top-2.5' alt="search" />
//             </div>

//             {/* Search Results Dropdown */}
//             {isSearchOpen && searchQuery && (
//               <div className="absolute top-full mt-2 w-80 right-0 bg-white shadow-2xl rounded-lg border border-gray-100 overflow-hidden z-50">
//                 {searchResults.length > 0 ? (
//                   searchResults.map((product) => (
//                     <Link 
//                       key={product.id} 
//                       href={`/product/${product.id}`}
//                       onClick={() => setIsSearchOpen(false)}
//                       className="flex items-center gap-3 p-3 hover:bg-[#FFF6EB] border-b border-gray-50 last:border-0 transition-colors"
//                     >
//                       <img src={product.img} alt={product.name} className="w-12 h-12 object-cover rounded border border-gray-100" />
//                       <div>
//                         <p className="text-[11px] font-bold text-gray-800 uppercase line-clamp-1">{product.name}</p>
//                         <p className="text-[9px] text-[#C08237] font-semibold uppercase">{product.categoryName}</p>
//                       </div>
//                     </Link>
//                   ))
//                 ) : (
//                   <div className="p-4 text-center text-[11px] text-gray-500">No results for "{searchQuery}"</div>
//                 )}
//               </div>
//             )}
//           </div>

//           <button className="p-2 rounded-full border border-[#C08237] hover:bg-[#C08237] transition-all group">
//             <img src='/images/heart.svg' className='w-5 group-hover:brightness-0 group-hover:invert' alt="wishlist" />
//           </button>

//           <Link href="/login">
//             <button className="flex items-center gap-1 bg-[#C08237] text-white px-5 py-2 rounded-full text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors">
//               <img src='/images/profile.svg' className='w-4 brightness-0 invert' alt="login" />
//               LOGIN
//             </button>
//           </Link>
//         </div>
//       </div>

//       {/* --- Desktop Navigation --- */}
//       <nav className="hidden lg:block border-t border-[#A49C93]/20">
//         <div className="max-w-7xl mx-auto px-4">
//           <ul className="flex justify-center items-center gap-8">
//             {navigationLinks.map((link) => {
//               const isActive = pathname === link.href;
//               return (
//                 <li 
//                   key={link.name} 
//                   className="relative py-3 group"
//                   onMouseEnter={() => setActiveDropdown(link.name)}
//                   onMouseLeave={() => setActiveDropdown(null)}
//                 >
//                   {link.isMainCategory ? (
//                     <button
//                       className={`text-[11px] font-bold tracking-widest ${isActive ? 'text-[#C08237]' : 'text-gray-800'} hover:text-[#C08237] transition-colors`}
//                     >
//                       {link.name}
//                     </button>
//                   ) : (
//                     <Link 
//                       href={link.href} 
//                       className={`text-[11px] font-bold tracking-widest ${isActive ? 'text-[#C08237]' : 'text-gray-800'} hover:text-[#C08237] transition-colors`}
//                     >
//                       {link.name}
//                     </Link>
//                   )}

//                   {/* Main CATEGORY Dropdown (Dynamic) */}
//                   {link.hasDropdown && link.isMainCategory && activeDropdown === link.name && (
//                     <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
//                       {isLoading ? (
//                         <div className="px-5 py-3 text-center text-[12px] text-gray-500">
//                           Loading...
//                         </div>
//                       ) : (
//                         <>
//                           {/* Dynamic Categories */}
//                           {link.items && link.items.filter(item => item.categoryId).map((item) => {
//                             const categoryObj = categories.find(c => c._id === item.categoryId);
//                             const categorySubCats = getSubCategoriesForCategory(item.categoryId);
                            
//                             return (
//                               <div key={item.categoryId} className="relative group/sub">
//                                 <button
//                                   onClick={() => handleCategoryNavigation(categoryObj.name, item.categoryId)}
//                                   className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100"
//                                 >
//                                   {categoryObj?.name.toUpperCase()}
//                                   {categorySubCats.length > 0 && (
//                                     <ChevronRight size={12} className="opacity-50" />
//                                   )}
//                                 </button>
                                
//                                 {/* Subcategory nested dropdown */}
//                                 {categorySubCats.length > 0 && (
//                                   <div className="absolute left-full top-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all shadow-xl">
//                                     {categorySubCats.map(subCat => (
//                                       <Link
//                                         key={subCat.id}
//                                         href={subCat.href}
//                                         onClick={() => setActiveDropdown(null)}
//                                         className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
//                                       >
//                                         {subCat.name}
//                                         <ChevronRight size={12} className="opacity-50" />
//                                       </Link>
//                                     ))}
//                                   </div>
//                                 )}
//                               </div>
//                             );
//                           })}
                          
//                           {/* Custom Orders Link */}
//                           <Link
//                             href="/custom-orders"
//                             onClick={() => setActiveDropdown(null)}
//                             className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-t border-gray-100"
//                           >
//                             CUSTOM
//                             <ChevronRight size={12} className="opacity-50" />
//                           </Link>
//                         </>
//                       )}
//                     </div>
//                   )}

//                   {/* Individual Manual Category Dropdowns (ANIMAL, GOD FIGURE, UTILITY/DECOR) */}
//                   {link.hasDropdown && link.isCategory && activeDropdown === link.name && (
//                     <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
//                       <Link
//                         href={link.href}
//                         onClick={() => setActiveDropdown(null)}
//                         className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100"
//                       >
//                         ALL {link.name}
//                         <ChevronRight size={12} className="opacity-50" />
//                       </Link>
                      
//                       {link.subcategories && link.subcategories.map(subCat => (
//                         <Link
//                           key={subCat.id}
//                           href={subCat.href}
//                           onClick={() => setActiveDropdown(null)}
//                           className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
//                         >
//                           {subCat.name}
//                           <ChevronRight size={12} className="opacity-50" />
//                         </Link>
//                       ))}
                      
//                       <Link
//                         href="/custom-orders"
//                         onClick={() => setActiveDropdown(null)}
//                         className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-t border-gray-100 mt-1"
//                       >
//                         CUSTOM ORDERS
//                         <ChevronRight size={12} className="opacity-50" />
//                       </Link>
//                     </div>
//                   )}

//                   {/* Static Dropdowns (ABOUT) */}
//                   {link.hasDropdown && !link.isMainCategory && !link.isCategory && activeDropdown === link.name && (
//                     <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
//                       {link.subItems.map((sub) => (
//                         <Link 
//                           key={sub.label} 
//                           href={sub.href}
//                           onClick={() => setActiveDropdown(null)}
//                           className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
//                         >
//                           {sub.label.toUpperCase()}
//                           <ChevronRight size={12} className="opacity-50" />
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       </nav>

//       {/* Mobile Sidebar */}
//       {isMenuOpen && (
//         <div className="fixed inset-0 z-[100] lg:hidden">
//           <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
//           <div className="fixed top-0 left-0 w-[80%] h-full bg-[#FFF6EB] p-6 shadow-xl overflow-y-auto">
//             <div className="flex justify-between items-center mb-8">
//               <img src="/images/Group-56121.svg" alt="logo" className="h-8" />
//               <button onClick={() => setIsMenuOpen(false)}>
//                 <X size={24} />
//               </button>
//             </div>
            
//             <ul className="space-y-5">
//               {navigationLinks.map((link) => (
//                 <li key={link.name} className="border-b border-gray-200 pb-3">
//                   <div className="flex justify-between items-center" 
//                     onClick={() => {
//                       if (link.hasDropdown) {
//                         setActiveDropdown(activeDropdown === link.name ? null : link.name);
//                       }
//                     }}>
//                     {link.isMainCategory ? (
//                       <button className="text-[11px] font-bold text-gray-800 uppercase tracking-widest">
//                         {link.name}
//                       </button>
//                     ) : (
//                       <Link 
//                         href={link.href} 
//                         onClick={() => !link.hasDropdown && setIsMenuOpen(false)}
//                         className="text-[11px] font-bold text-gray-800 uppercase tracking-widest"
//                       >
//                         {link.name}
//                       </Link>
//                     )}
//                     {link.hasDropdown && (
//                       <ChevronRight size={16} className={`transition-transform ${activeDropdown === link.name ? 'rotate-90' : ''}`} />
//                     )}
//                   </div>
                  
//                   {/* Mobile Dropdown */}
//                   {link.hasDropdown && activeDropdown === link.name && (
//                     <ul className="mt-3 ml-4 space-y-4 border-l-2 border-[#C08237] pl-4">
//                       {/* Main CATEGORY dropdown in mobile */}
//                       {link.isMainCategory && (
//                         <>
//                           {link.items && link.items.filter(item => item.categoryId).map(item => {
//                             const categoryObj = categories.find(c => c._id === item.categoryId);
//                             const categorySubCats = getSubCategoriesForCategory(item.categoryId);
                            
//                             return (
//                               <li key={item.categoryId}>
//                                 <div className="flex justify-between items-center">
//                                   <button
//                                     onClick={() => {
//                                       if (categoryObj) {
//                                         handleCategoryNavigation(categoryObj.name, item.categoryId);
//                                       }
//                                     }}
//                                     className="text-[10px] font-bold text-gray-500 uppercase"
//                                   >
//                                     {categoryObj?.name || item.label}
//                                   </button>
//                                   {categorySubCats.length > 0 && (
//                                     <ChevronRight 
//                                       size={12} 
//                                       className={`transition-transform ${activeDropdown === `${item.label}-sub` ? 'rotate-90' : ''}`}
//                                       onClick={(e) => {
//                                         e.preventDefault();
//                                         e.stopPropagation();
//                                         setActiveDropdown(activeDropdown === `${item.label}-sub` ? null : `${item.label}-sub`);
//                                       }}
//                                     />
//                                   )}
//                                 </div>
                                
//                                 {/* Nested subcategories in mobile */}
//                                 {categorySubCats.length > 0 && activeDropdown === `${item.label}-sub` && (
//                                   <ul className="ml-4 mt-2 space-y-2">
//                                     {categorySubCats.map(subCat => (
//                                       <li key={subCat.id}>
//                                         <Link
//                                           href={subCat.href}
//                                           onClick={() => setIsMenuOpen(false)}
//                                           className="text-[10px] font-bold text-gray-500 uppercase pl-2 block w-full text-left"
//                                         >
//                                           {subCat.name}
//                                         </Link>
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 )}
//                               </li>
//                             );
//                           })}
//                           <li>
//                             <Link
//                               href="/custom-orders"
//                               onClick={() => setIsMenuOpen(false)}
//                               className="text-[10px] font-bold text-gray-500 uppercase block border-t border-gray-200 pt-2 mt-2"
//                             >
//                               CUSTOM
//                             </Link>
//                           </li>
//                         </>
//                       )}
                      
//                       {/* Individual manual category dropdowns in mobile */}
//                       {link.isCategory && (
//                         <>
//                           <li>
//                             <Link
//                               href={link.href}
//                               onClick={() => setIsMenuOpen(false)}
//                               className="text-[10px] font-bold text-gray-500 uppercase block w-full text-left"
//                             >
//                               ALL {link.name}
//                             </Link>
//                           </li>
//                           {link.subcategories && link.subcategories.map(subCat => (
//                             <li key={subCat.id}>
//                               <Link
//                                 href={subCat.href}
//                                 onClick={() => setIsMenuOpen(false)}
//                                 className="text-[10px] font-bold text-gray-500 uppercase block w-full text-left"
//                               >
//                                 {subCat.name}
//                               </Link>
//                             </li>
//                           ))}
//                           <li>
//                             <Link
//                               href="/custom-orders"
//                               onClick={() => setIsMenuOpen(false)}
//                               className="text-[10px] font-bold text-gray-500 uppercase block border-t border-gray-200 pt-2 mt-2"
//                             >
//                               CUSTOM ORDERS
//                             </Link>
//                           </li>
//                         </>
//                       )}
                      
//                       {/* Static dropdowns (ABOUT) */}
//                       {!link.isMainCategory && !link.isCategory && link.hasDropdown && (
//                         <>
//                           {link.subItems.map(sub => (
//                             <li key={sub.label}>
//                               <Link 
//                                 href={sub.href} 
//                                 onClick={() => setIsMenuOpen(false)}
//                                 className="text-[10px] font-bold text-gray-500 uppercase block"
//                               >
//                                 {sub.label}
//                               </Link>
//                             </li>
//                           ))}
//                         </>
//                       )}
//                     </ul>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;


// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { Menu, X, ChevronRight } from 'lucide-react';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [allProducts, setAllProducts] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   const searchRef = useRef(null);
//   const pathname = usePathname();
//   const router = useRouter();

//   // Manual individual category links - these are the menu items on the main nav bar
//   const manualCategoryLinks = [
//     {
//       name: 'ANIMAL',
//       href: '/animal',
//       hasDropdown: true,
//       isCategory: true,
//       categorySlug: 'animal-statues',
//       apiCategoryName: 'Animal'
//     },
//     {
//       name: 'GOD FIGURE',
//       href: '/god-figures',
//       hasDropdown: true,
//       isCategory: true,
//       categorySlug: 'god-figures',
//       apiCategoryName: 'God Figure'
//     },
//     {
//       name: 'UTILITY / DECOR',
//       href: '/utility-decor',
//       hasDropdown: true,
//       isCategory: true,
//       categorySlug: 'utility-decor',
//       apiCategoryName: 'Utility / Decor'
//     }
//   ];

//   // Fetch categories, subcategories and products
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
        
//         // 1. Fetch categories (for the main CATEGORY dropdown)
//         const categoriesResponse = await axios.get('/api/admin/categories');
//         if (categoriesResponse.data.success) {
//           setCategories(categoriesResponse.data.data || []);
//         }
        
//         // 2. Fetch subcategories for all categories
//         const subCategoriesResponse = await axios.get('/api/admin/subcategories');
//         if (subCategoriesResponse.data.success) {
//           setSubCategories(subCategoriesResponse.data.data || []);
//         }
        
//         // 3. Fetch products for search only
//         const productsResponse = await axios.get('/api/admin/products');
//         if (productsResponse.data.success) {
//           const transformed = productsResponse.data.data.map(product => ({
//             id: product._id,
//             name: product.name || "Unnamed Product",
//             img: product.thumbnail || (product.images && product.images[0]) || '/images/placeholder.png',
//             categoryName: product.category?.name || "Uncategorized",
//             categoryId: product.category?._id || ""
//           }));
//           setAllProducts(transformed);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Search filter logic
//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setSearchResults([]);
//       return;
//     }

//     const filtered = allProducts.filter(product =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
//     );
    
//     setSearchResults(filtered.slice(0, 6));
//   }, [searchQuery, allProducts]);

//   // Outside click handler
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (searchRef.current && !searchRef.current.contains(e.target)) {
//         setIsSearchOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Get subcategories for a specific category
//   const getSubCategoriesForCategory = (categoryId) => {
//     if (!categoryId || !subCategories || !Array.isArray(subCategories)) {
//       return [];
//     }
    
//     return subCategories.filter(subCat => {
//       if (subCat.category && subCat.category._id) {
//         return subCat.category._id === categoryId;
//       }
//       if (subCat.category && typeof subCat.category === 'string') {
//         return subCat.category === categoryId;
//       }
//       return false;
//     });
//   };

//   // Get subcategories for manual category by name
//   const getSubCategoriesForManualCategory = (categoryName) => {
//     if (!categoryName || !categories || !subCategories) return [];
    
//     // Find the category by name (case-insensitive)
//     const category = categories.find(cat => 
//       cat.name.toLowerCase() === categoryName.toLowerCase()
//     );
    
//     if (!category) return [];
    
//     // Get subcategories for this category
//     return getSubCategoriesForCategory(category._id);
//   };

//   // Function to handle category navigation (for main CATEGORY dropdown)
//   const handleCategoryNavigation = (categoryName, categoryId) => {
//     // Navigate to category page with query parameter
//     router.push(`/category?category=${encodeURIComponent(categoryName)}&id=${categoryId}`);
//     setIsMenuOpen(false);
//     setActiveDropdown(null);
//   };

//   // Function to handle subcategory navigation
//   const handleSubCategoryNavigation = (categoryName, categoryId, subCategoryName, subCategoryId) => {
//     // Navigate to specific category page with subcategory filter
//     let baseUrl = '/category';
    
//     // Map category names to specific pages
//     if (categoryName.toLowerCase().includes('animal')) {
//       baseUrl = '/animal';
//     } else if (categoryName.toLowerCase().includes('god') || categoryName.toLowerCase().includes('figure')) {
//       baseUrl = '/god-figure';
//     } else if (categoryName.toLowerCase().includes('utility') || categoryName.toLowerCase().includes('decor')) {
//       baseUrl = '/utility-decor';
//     }
    
//     // Navigate with query parameters for filtering
//     router.push(`${baseUrl}?category=${encodeURIComponent(categoryName)}&id=${categoryId}&subcategory=${encodeURIComponent(subCategoryName)}&subid=${subCategoryId}`);
//     setIsMenuOpen(false);
//     setActiveDropdown(null);
//   };

//   // Base navigation links
//   const navLinks = [
//     { name: 'HOME', href: '/' },
//     { 
//       name: 'ABOUT',
//       href: '/about',
//       hasDropdown: true,
//       subItems: [
//         { label: 'About Us', href: '/about' },
//         { label: 'Our Vision & Philosophy', href: '/about/vision' },
//         { label: 'Our Values', href: '/about/values' },
//         { label: 'Our History', href: '/about/history' },
//         { label: 'CEO Message', href: '/about/ceo-message' }
//       ] 
//     },
//   ];

//   // Get navigation links - combine manual category links with dynamic CATEGORY dropdown
//   const getNavLinks = () => {
//     if (isLoading) {
//       return [...navLinks, 
//         { name: 'CATEGORY', href: '/category' },
//         ...manualCategoryLinks,
//         { name: 'CUSTOM ORDERS', href: '/custom-orders' },
//         { name: 'CONTACT US', href: '/contact-us' }
//       ];
//     }

//     // Create navigation structure
//     return [
//       ...navLinks,
//       {
//         name: 'CATEGORY',
//         href: '/category',
//         hasDropdown: true,
//         isMainCategory: true,
//         items: [
//           ...categories.map(cat => ({
//             label: cat.name,
//             href: '#',
//             categoryId: cat._id,
//             hasSubItems: true
//           })),
//           { label: 'Custom', href: '/custom-orders' }
//         ]
//       },
//       ...manualCategoryLinks,
//       { name: 'CUSTOM ORDERS', href: '/custom-orders' },
//       { name: 'CONTACT US', href: '/contact-us' },
//     ];
//   };

//   const navigationLinks = getNavLinks();

//   return (
//     <header className="w-full bg-[#FFF6EB] border-b border-[#A49C93]/30 relative z-50">
//       <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
//         {/* Left Side (Desktop) */}
//         <div className="hidden lg:flex items-center gap-6 text-sm text-gray-700 flex-1">
//           <div className="flex items-center gap-2 cursor-pointer font-mona">
//             <span>English</span>
//             <ChevronRight size={14} className="rotate-90" />
//           </div>
//           <div className="flex items-center gap-2 cursor-pointer font-mona">
//             <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3" />
//             <span>INR ₹</span>
//             <ChevronRight size={14} className="rotate-90" />
//           </div>
//         </div>

//         {/* Mobile Menu Icon */}
//         <div className="lg:hidden flex-1">
//           <button onClick={() => setIsMenuOpen(true)}>
//             <Menu className="text-[#C08237]" size={28} />
//           </button>
//         </div>

//         {/* Center Logo */}
//         <div className="flex justify-center flex-1">
//           <Link href="/">
//             <img src="/images/Group-56121.svg" alt="Logo" className="h-10 w-auto" />
//           </Link>
//         </div>

//         {/* Right Side (Search & Auth) */}
//         <div className="flex items-center justify-end gap-4 flex-1" ref={searchRef}>
//           <div className="relative hidden md:block">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="WHAT ARE YOU LOOKING FOR?"
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setIsSearchOpen(true);
//                 }}
//                 onFocus={() => setIsSearchOpen(true)}
//                 className="w-48 lg:w-72 font-mona pl-10 pr-4 py-2 bg-transparent text-gray-500 border border-[#A49C93] rounded-full text-[10px] focus:border-[#C08237] outline-none transition-all"
//               />
//               <img src='/images/search-normal.svg' className='w-4 absolute left-3 top-2.5' alt="search" />
//             </div>

//             {/* Search Results Dropdown */}
//             {isSearchOpen && searchQuery && (
//               <div className="absolute top-full mt-2 w-80 right-0 bg-white shadow-2xl rounded-lg border border-gray-100 overflow-hidden z-50">
//                 {searchResults.length > 0 ? (
//                   searchResults.map((product) => (
//                     <Link 
//                       key={product.id} 
//                       href={`/product/${product.id}`}
//                       onClick={() => setIsSearchOpen(false)}
//                       className="flex items-center gap-3 p-3 hover:bg-[#FFF6EB] border-b border-gray-50 last:border-0 transition-colors"
//                     >
//                       <img src={product.img} alt={product.name} className="w-12 h-12 object-cover rounded border border-gray-100" />
//                       <div>
//                         <p className="text-[11px] font-bold text-gray-800 uppercase line-clamp-1">{product.name}</p>
//                         <p className="text-[9px] text-[#C08237] font-semibold uppercase">{product.categoryName}</p>
//                       </div>
//                     </Link>
//                   ))
//                 ) : (
//                   <div className="p-4 text-center text-[11px] text-gray-500">No results for "{searchQuery}"</div>
//                 )}
//               </div>
//             )}
//           </div>

//           <button className="p-2 rounded-full border border-[#C08237] hover:bg-[#C08237] transition-all group">
//             <img src='/images/heart.svg' className='w-5 group-hover:brightness-0 group-hover:invert' alt="wishlist" />
//           </button>

//           <Link href="/login">
//             <button className="flex items-center gap-1 bg-[#C08237] text-white px-5 py-2 rounded-full text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors">
//               <img src='/images/profile.svg' className='w-4 brightness-0 invert' alt="login" />
//               LOGIN
//             </button>
//           </Link>
//         </div>
//       </div>

//       {/* --- Desktop Navigation --- */}
//       <nav className="hidden lg:block border-t border-[#A49C93]/20">
//         <div className="max-w-7xl mx-auto px-4">
//           <ul className="flex justify-center items-center gap-8">
//             {navigationLinks.map((link) => {
//               const isActive = pathname === link.href;
//               return (
//                 <li 
//                   key={link.name} 
//                   className="relative py-3 group"
//                   onMouseEnter={() => setActiveDropdown(link.name)}
//                   onMouseLeave={() => setActiveDropdown(null)}
//                 >
//                   {link.isMainCategory ? (
//                     <button
//                       className={`text-[11px] font-bold tracking-widest ${isActive ? 'text-[#C08237]' : 'text-gray-800'} hover:text-[#C08237] transition-colors`}
//                     >
//                       {link.name}
//                     </button>
//                   ) : (
//                     <Link 
//                       href={link.href} 
//                       className={`text-[11px] font-bold tracking-widest ${isActive ? 'text-[#C08237]' : 'text-gray-800'} hover:text-[#C08237] transition-colors`}
//                     >
//                       {link.name}
//                     </Link>
//                   )}

//                   {/* Main CATEGORY Dropdown (Dynamic) */}
//                   {link.hasDropdown && link.isMainCategory && activeDropdown === link.name && (
//                     <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
//                       {isLoading ? (
//                         <div className="px-5 py-3 text-center text-[12px] text-gray-500">
//                           Loading...
//                         </div>
//                       ) : (
//                         <>
//                           {/* Dynamic Categories */}
//                           {link.items && link.items.filter(item => item.categoryId).map((item) => {
//                             const categoryObj = categories.find(c => c._id === item.categoryId);
//                             const categorySubCats = getSubCategoriesForCategory(item.categoryId);
                            
//                             return (
//                               <div key={item.categoryId} className="relative group/sub">
//                                 <button
//                                   onClick={() => handleCategoryNavigation(categoryObj.name, item.categoryId)}
//                                   className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100"
//                                 >
//                                   {categoryObj?.name.toUpperCase()}
//                                   {categorySubCats.length > 0 && (
//                                     <ChevronRight size={12} className="opacity-50" />
//                                   )}
//                                 </button>
                                
//                                 {/* Subcategory nested dropdown */}
//                                 {categorySubCats.length > 0 && (
//                                   <div className="absolute left-full top-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all shadow-xl">
//                                     {categorySubCats.map(subCat => (
//                                       <button
//                                         key={subCat._id}
//                                         onClick={() => handleSubCategoryNavigation(
//                                           categoryObj.name, 
//                                           item.categoryId, 
//                                           subCat.name, 
//                                           subCat._id
//                                         )}
//                                         className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
//                                       >
//                                         {subCat.name.toUpperCase()}
//                                         <ChevronRight size={12} className="opacity-50" />
//                                       </button>
//                                     ))}
//                                   </div>
//                                 )}
//                               </div>
//                             );
//                           })}
                          
//                           {/* Custom Orders Link */}
//                           <Link
//                             href="/custom-orders"
//                             onClick={() => setActiveDropdown(null)}
//                             className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-t border-gray-100"
//                           >
//                             CUSTOM
//                             <ChevronRight size={12} className="opacity-50" />
//                           </Link>
//                         </>
//                       )}
//                     </div>
//                   )}

//                   {/* Individual Manual Category Dropdowns (ANIMAL, GOD FIGURE, UTILITY/DECOR) */}
//                   {link.hasDropdown && link.isCategory && activeDropdown === link.name && (
//                     <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
//                       {isLoading ? (
//                         <div className="px-5 py-3 text-center text-[12px] text-gray-500">
//                           Loading...
//                         </div>
//                       ) : (
//                         <>
//                           {/* Find the category in database */}
//                           {(() => {
//                             const categoryObj = categories.find(cat => 
//                               cat.name.toLowerCase() === link.apiCategoryName.toLowerCase()
//                             );
                            
//                             if (!categoryObj) {
//                               return (
//                                 <div className="text-center py-3 text-[12px] text-gray-500">
//                                   No data found
//                                 </div>
//                               );
//                             }
                            
//                             const categorySubCats = getSubCategoriesForCategory(categoryObj._id);
                            
//                             return (
//                               <>
//                                 <Link
//                                   href={link.href}
//                                   onClick={() => setActiveDropdown(null)}
//                                   className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100"
//                                 >
//                                   ALL {link.name}
//                                   <ChevronRight size={12} className="opacity-50" />
//                                 </Link>
                                
//                                 {categorySubCats.length > 0 ? (
//                                   categorySubCats.map(subCat => (
//                                     <button
//                                       key={subCat._id}
//                                       onClick={() => handleSubCategoryNavigation(
//                                         categoryObj.name, 
//                                         categoryObj._id, 
//                                         subCat.name, 
//                                         subCat._id
//                                       )}
//                                       className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
//                                     >
//                                       {subCat.name.toUpperCase()}
//                                       <ChevronRight size={12} className="opacity-50" />
//                                     </button>
//                                   ))
//                                 ) : (
//                                   <div className="px-5 py-3 text-center text-[11px] text-gray-500">
//                                     No subcategories found
//                                   </div>
//                                 )}
//                               </>
//                             );
//                           })()}
                          
//                           <Link
//                             href="/custom-orders"
//                             onClick={() => setActiveDropdown(null)}
//                             className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-t border-gray-100 mt-1"
//                           >
//                             CUSTOM ORDERS
//                             <ChevronRight size={12} className="opacity-50" />
//                           </Link>
//                         </>
//                       )}
//                     </div>
//                   )}

//                   {/* Static Dropdowns (ABOUT) */}
//                   {link.hasDropdown && !link.isMainCategory && !link.isCategory && activeDropdown === link.name && (
//                     <div className="absolute top-full left-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 rounded-sm shadow-xl">
//                       {link.subItems.map((sub) => (
//                         <Link 
//                           key={sub.label} 
//                           href={sub.href}
//                           onClick={() => setActiveDropdown(null)}
//                           className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
//                         >
//                           {sub.label.toUpperCase()}
//                           <ChevronRight size={12} className="opacity-50" />
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       </nav>

//       {/* Mobile Sidebar */}
//       {isMenuOpen && (
//         <div className="fixed inset-0 z-[100] lg:hidden">
//           <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
//           <div className="fixed top-0 left-0 w-[80%] h-full bg-[#FFF6EB] p-6 shadow-xl overflow-y-auto">
//             <div className="flex justify-between items-center mb-8">
//               <img src="/images/Group-56121.svg" alt="logo" className="h-8" />
//               <button onClick={() => setIsMenuOpen(false)}>
//                 <X size={24} />
//               </button>
//             </div>
            
//             <ul className="space-y-5">
//               {navigationLinks.map((link) => (
//                 <li key={link.name} className="border-b border-gray-200 pb-3">
//                   <div className="flex justify-between items-center" 
//                     onClick={() => {
//                       if (link.hasDropdown) {
//                         setActiveDropdown(activeDropdown === link.name ? null : link.name);
//                       }
//                     }}>
//                     {link.isMainCategory ? (
//                       <button className="text-[11px] font-bold text-gray-800 uppercase tracking-widest">
//                         {link.name}
//                       </button>
//                     ) : (
//                       <Link 
//                         href={link.href} 
//                         onClick={() => !link.hasDropdown && setIsMenuOpen(false)}
//                         className="text-[11px] font-bold text-gray-800 uppercase tracking-widest"
//                       >
//                         {link.name}
//                       </Link>
//                     )}
//                     {link.hasDropdown && (
//                       <ChevronRight size={16} className={`transition-transform ${activeDropdown === link.name ? 'rotate-90' : ''}`} />
//                     )}
//                   </div>
                  
//                   {/* Mobile Dropdown */}
//                   {link.hasDropdown && activeDropdown === link.name && (
//                     <ul className="mt-3 ml-4 space-y-4 border-l-2 border-[#C08237] pl-4">
//                       {/* Main CATEGORY dropdown in mobile */}
//                       {link.isMainCategory && (
//                         <>
//                           {link.items && link.items.filter(item => item.categoryId).map(item => {
//                             const categoryObj = categories.find(c => c._id === item.categoryId);
//                             const categorySubCats = getSubCategoriesForCategory(item.categoryId);
                            
//                             return (
//                               <li key={item.categoryId}>
//                                 <div className="flex justify-between items-center">
//                                   <button
//                                     onClick={() => {
//                                       if (categoryObj) {
//                                         handleCategoryNavigation(categoryObj.name, item.categoryId);
//                                       }
//                                     }}
//                                     className="text-[10px] font-bold text-gray-500 uppercase"
//                                   >
//                                     {categoryObj?.name || item.label}
//                                   </button>
//                                   {categorySubCats.length > 0 && (
//                                     <ChevronRight 
//                                       size={12} 
//                                       className={`transition-transform ${activeDropdown === `${item.label}-sub` ? 'rotate-90' : ''}`}
//                                       onClick={(e) => {
//                                         e.preventDefault();
//                                         e.stopPropagation();
//                                         setActiveDropdown(activeDropdown === `${item.label}-sub` ? null : `${item.label}-sub`);
//                                       }}
//                                     />
//                                   )}
//                                 </div>
                                
//                                 {/* Nested subcategories in mobile */}
//                                 {categorySubCats.length > 0 && activeDropdown === `${item.label}-sub` && (
//                                   <ul className="ml-4 mt-2 space-y-2">
//                                     {categorySubCats.map(subCat => (
//                                       <li key={subCat._id}>
//                                         <button
//                                           onClick={() => {
//                                             if (categoryObj) {
//                                               handleSubCategoryNavigation(
//                                                 categoryObj.name, 
//                                                 item.categoryId, 
//                                                 subCat.name, 
//                                                 subCat._id
//                                               );
//                                             }
//                                           }}
//                                           className="text-[10px] font-bold text-gray-500 uppercase pl-2 block w-full text-left"
//                                         >
//                                           {subCat.name}
//                                         </button>
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 )}
//                               </li>
//                             );
//                           })}
//                           <li>
//                             <Link
//                               href="/custom-orders"
//                               onClick={() => setIsMenuOpen(false)}
//                               className="text-[10px] font-bold text-gray-500 uppercase block border-t border-gray-200 pt-2 mt-2"
//                             >
//                               CUSTOM
//                             </Link>
//                           </li>
//                         </>
//                       )}
                      
//                       {/* Individual manual category dropdowns in mobile */}
//                       {link.isCategory && (
//                         <>
//                           {(() => {
//                             const categoryObj = categories.find(cat => 
//                               cat.name.toLowerCase() === link.apiCategoryName.toLowerCase()
//                             );
                            
//                             if (!categoryObj) {
//                               return (
//                                 <li className="text-[10px] text-gray-500 text-center py-2">
//                                   No data found
//                                 </li>
//                               );
//                             }
                            
//                             const categorySubCats = getSubCategoriesForCategory(categoryObj._id);
                            
//                             return (
//                               <>
//                                 <li>
//                                   <Link
//                                     href={link.href}
//                                     onClick={() => setIsMenuOpen(false)}
//                                     className="text-[10px] font-bold text-gray-500 uppercase block w-full text-left"
//                                   >
//                                     ALL {link.name}
//                                   </Link>
//                                 </li>
//                                 {categorySubCats.map(subCat => (
//                                   <li key={subCat._id}>
//                                     <button
//                                       onClick={() => {
//                                         if (categoryObj) {
//                                           handleSubCategoryNavigation(
//                                             categoryObj.name, 
//                                             categoryObj._id, 
//                                             subCat.name, 
//                                             subCat._id
//                                           );
//                                         }
//                                       }}
//                                       className="text-[10px] font-bold text-gray-500 uppercase block w-full text-left"
//                                     >
//                                       {subCat.name}
//                                     </button>
//                                   </li>
//                                 ))}
//                               </>
//                             );
//                           })()}
//                           <li>
//                             <Link
//                               href="/custom-orders"
//                               onClick={() => setIsMenuOpen(false)}
//                               className="text-[10px] font-bold text-gray-500 uppercase block border-t border-gray-200 pt-2 mt-2"
//                             >
//                               CUSTOM ORDERS
//                             </Link>
//                           </li>
//                         </>
//                       )}
                      
//                       {/* Static dropdowns (ABOUT) */}
//                       {!link.isMainCategory && !link.isCategory && link.hasDropdown && (
//                         <>
//                           {link.subItems.map(sub => (
//                             <li key={sub.label}>
//                               <Link 
//                                 href={sub.href} 
//                                 onClick={() => setIsMenuOpen(false)}
//                                 className="text-[10px] font-bold text-gray-500 uppercase block"
//                               >
//                                 {sub.label}
//                               </Link>
//                             </li>
//                           ))}
//                         </>
//                       )}
//                     </ul>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;

"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Menu, X, ChevronRight } from 'lucide-react';
import Cookies from 'js-cookie';
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
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCurrency, setSelectedCurrency] = useState('INR ₹');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  
  const searchRef = useRef(null);
  const langRef = useRef(null);
  const currencyRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get wishlist from Zustand store
  const { wishlist, initializeWishlist } = useWishlistStore();

  // Manual individual category links - these are the menu items on the main nav bar
  const manualCategoryLinks = [
    {
      name: 'ANIMAL',
      href: '/animal',
      hasDropdown: true,
      isCategory: true,
      categorySlug: 'animal-statues',
      apiCategoryName: 'Animal'
    },
    {
      name: 'GOD FIGURE',
      href: '/god-figure',
      hasDropdown: true,
      isCategory: true,
      categorySlug: 'god-figures',
      apiCategoryName: 'God Figure'
    },
    {
      name: 'UTILITY / DECOR',
      href: '/utility-decor',
      hasDropdown: true,
      isCategory: true,
      categorySlug: 'utility-decor',
      apiCategoryName: 'Utility / Decor'
    }
  ];

  // Language options
  const languageOptions = [
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/us.png' },
    { code: 'hi', name: 'हिन्दी', flag: 'https://flagcdn.com/w20/in.png' },
    { code: 'es', name: 'Español', flag: 'https://flagcdn.com/w20/es.png' },
    { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/w20/de.png' },
    { code: 'zh', name: '中文', flag: 'https://flagcdn.com/w20/cn.png' }
  ];

  // Currency options
  const currencyOptions = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: 'https://flagcdn.com/w20/in.png' },
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: 'https://flagcdn.com/w20/us.png' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: 'https://flagcdn.com/w20/eu.png' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: 'https://flagcdn.com/w20/gb.png' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: 'https://flagcdn.com/w20/jp.png' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: 'https://flagcdn.com/w20/au.png' }
  ];

  // Fetch categories, subcategories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Initialize wishlist from store
        initializeWishlist();
        
        // 2. Check if user is logged in
        const token = Cookies.get('token');
        setIsLoggedIn(!!token);
        
        // 3. Fetch categories (for the main CATEGORY dropdown)
        const categoriesResponse = await axios.get('/api/admin/categories');
        if (categoriesResponse.data.success) {
          setCategories(categoriesResponse.data.data || []);
        }
        
        // 4. Fetch subcategories for all categories
        const subCategoriesResponse = await axios.get('/api/admin/subcategories');
        if (subCategoriesResponse.data.success) {
          setSubCategories(subCategoriesResponse.data.data || []);
        }
        
        // 5. Fetch products for search only
        const productsResponse = await axios.get('/api/admin/products');
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
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [initializeWishlist]);

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

  // Handle language change
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language.name);
    setShowLangDropdown(false);
    // Here you can implement language change logic
    // For example, store in cookies/localStorage and reload page
    Cookies.set('language', language.code, { expires: 365 });
    // You might want to refresh the page or update content based on language
    console.log('Language changed to:', language.code);
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

  // Get current language from cookie
  useEffect(() => {
    const savedLang = Cookies.get('language');
    const savedCurrency = Cookies.get('currency');
    
    if (savedLang) {
      const lang = languageOptions.find(l => l.code === savedLang);
      if (lang) setSelectedLanguage(lang.name);
    }
    
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
        { label: 'Our Vision & Philosophy', href: '/about/vision' },
        { label: 'Our Values', href: '/about/values' },
        { label: 'Our History', href: '/about/history' },
        { label: 'CEO Message', href: '/about/ceo-message' }
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
    <header className="w-full bg-[#FFF6EB] border-b border-[#A49C93]/30 relative z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Left Side (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 text-sm text-gray-700 flex-1">
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer font-mona"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
            >
              <span>{selectedLanguage}</span>
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
                      <span className={`mona ${selectedLanguage === lang.name ? 'text-[#C08237] font-medium' : 'text-gray-700'}`}>
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

        {/* Mobile Menu Icon */}
        <div className="lg:hidden flex-1">
          <button onClick={() => setIsMenuOpen(true)}>
            <Menu className="text-[#C08237]" size={28} />
          </button>
        </div>

        {/* Center Logo */}
        <div className="flex justify-center flex-1">
          <Link href="/">
            <img src="/images/Group-56121.svg" alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Right Side (Search & Auth) */}
        <div className="flex items-center justify-end gap-4 flex-1" ref={searchRef}>
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

            <Link href="/wishlist">
          <button className="p-2 border border-[#C08237] hover:bg-[#C08237] transition-all group relative">
            <img src='/images/heart.svg' className='w-5 group-hover:brightness-0 group-hover:invert' alt="wishlist" />
            {wishlist && wishlist.length > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {wishlist.length > 99 ? '99+' : wishlist.length}
              </span>
            )}
          </button>
            </Link>

          {/* Conditional Login/Profile Button */}
          {isLoggedIn ? (
            <div className="relative group">
              <button className="flex items-center gap-1 bg-[#C08237] text-white px-5 py-2 rounded-full text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors">
                <img src='/images/profile.svg' className='w-4 brightness-0 invert' alt="profile" />
                PROFILE
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link href="/profile">
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
                    My Profile
                  </div>
                </Link>
                <Link href="/orders">
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
                    My Orders
                  </div>
                </Link>
                <div className="border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <button className="flex items-center gap-1 bg-[#C08237] text-white px-5 py-2 rounded-full text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors">
                <img src='/images/profile.svg' className='w-4 brightness-0 invert' alt="login" />
                LOGIN
              </button>
            </Link>
          )}
        </div>
      </div>

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
                        <div className="px-5 py-3 text-center text-[12px] text-gray-500">
                          Loading...
                        </div>
                      ) : (
                        <>
                          {/* Dynamic Categories */}
                          {link.items && link.items.filter(item => item.categoryId).map((item) => {
                            const categoryObj = categories.find(c => c._id === item.categoryId);
                            const categorySubCats = getSubCategoriesForCategory(item.categoryId);
                            
                            return (
                              <div key={item.categoryId} className="relative group/sub">
                                <button
                                  onClick={() => handleCategoryNavigation(categoryObj.name, item.categoryId)}
                                  className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100"
                                >
                                  {categoryObj?.name.toUpperCase()}
                                  {categorySubCats.length > 0 && (
                                    <ChevronRight size={12} className="opacity-50" />
                                  )}
                                </button>
                                
                                {/* Subcategory nested dropdown */}
                                {categorySubCats.length > 0 && (
                                  <div className="absolute left-full top-0 w-60 bg-[#FFFCF5] border border-[#D7CEC2] py-1 z-50 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all shadow-xl">
                                    {categorySubCats.map(subCat => (
                                      <button
                                        key={subCat._id}
                                        onClick={() => handleSubCategoryNavigation(
                                          categoryObj.name, 
                                          item.categoryId, 
                                          subCat.name, 
                                          subCat._id
                                        )}
                                        className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100 last:border-0"
                                      >
                                        {subCat.name.toUpperCase()}
                                        <ChevronRight size={12} className="opacity-50" />
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          
                          {/* Custom Orders Link */}
                          <Link
                            href="/custom-orders"
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-t border-gray-100"
                          >
                            CUSTOM
                            <ChevronRight size={12} className="opacity-50" />
                          </Link>
                        </>
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
                                <button
                                  onClick={() => handleAllCategoryNavigation(link)}
                                  className="flex items-center justify-between w-full px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-b border-gray-100"
                                >
                                  ALL {link.name}
                                  <ChevronRight size={12} className="opacity-50" />
                                </button>
                                
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
                                      {subCat.name.toUpperCase()}
                                      <ChevronRight size={12} className="opacity-50" />
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
                          
                          <Link
                            href="/custom-orders"
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between px-5 py-3 text-[12px] font-medium text-gray-700 hover:bg-[#C08237] hover:text-white transition-all border-t border-gray-100 mt-1"
                          >
                            CUSTOM ORDERS
                            <ChevronRight size={12} className="opacity-50" />
                          </Link>
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
                          <ChevronRight size={12} className="opacity-50" />
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
                  className="bg-transparent text-sm border-none outline-none"
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange({name: e.target.value})}
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
                    {link.hasDropdown && (
                      <ChevronRight size={16} className={`transition-transform ${activeDropdown === link.name ? 'rotate-90' : ''}`} />
                    )}
                  </div>
                  
                  {/* Mobile Dropdown */}
                  {link.hasDropdown && activeDropdown === link.name && (
                    <ul className="mt-3 ml-4 space-y-4 border-l-2 border-[#C08237] pl-4">
                      {/* Main CATEGORY dropdown in mobile */}
                      {link.isMainCategory && (
                        <>
                          {link.items && link.items.filter(item => item.categoryId).map(item => {
                            const categoryObj = categories.find(c => c._id === item.categoryId);
                            const categorySubCats = getSubCategoriesForCategory(item.categoryId);
                            
                            return (
                              <li key={item.categoryId}>
                                <div className="flex justify-between items-center">
                                  <button
                                    onClick={() => {
                                      if (categoryObj) {
                                        handleCategoryNavigation(categoryObj.name, item.categoryId);
                                      }
                                    }}
                                    className="text-[10px] font-bold text-gray-500 uppercase"
                                  >
                                    {categoryObj?.name || item.label}
                                  </button>
                                  {categorySubCats.length > 0 && (
                                    <ChevronRight 
                                      size={12} 
                                      className={`transition-transform ${activeDropdown === `${item.label}-sub` ? 'rotate-90' : ''}`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setActiveDropdown(activeDropdown === `${item.label}-sub` ? null : `${item.label}-sub`);
                                      }}
                                    />
                                  )}
                                </div>
                                
                                {/* Nested subcategories in mobile */}
                                {categorySubCats.length > 0 && activeDropdown === `${item.label}-sub` && (
                                  <ul className="ml-4 mt-2 space-y-2">
                                    {categorySubCats.map(subCat => (
                                      <li key={subCat._id}>
                                        <button
                                          onClick={() => {
                                            if (categoryObj) {
                                              handleSubCategoryNavigation(
                                                categoryObj.name, 
                                                item.categoryId, 
                                                subCat.name, 
                                                subCat._id
                                              );
                                            }
                                          }}
                                          className="text-[10px] font-bold text-gray-500 uppercase pl-2 block w-full text-left"
                                        >
                                          {subCat.name}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                          <li>
                            <Link
                              href="/custom-orders"
                              onClick={() => setIsMenuOpen(false)}
                              className="text-[10px] font-bold text-gray-500 uppercase block border-t border-gray-200 pt-2 mt-2"
                            >
                              CUSTOM
                            </Link>
                          </li>
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
                  <Link href="/profile">
                    <button className="w-full bg-[#C08237] text-white px-5 py-3 rounded-full text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors">
                      MY PROFILE
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full border border-[#C08237] text-[#C08237] px-5 py-3 rounded-full text-xs font-bold uppercase hover:bg-[#C08237] hover:text-white transition-colors"
                  >
                    LOGOUT
                  </button>
                </div>
              ) : (
                <Link href="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full bg-[#C08237] text-white px-5 py-3 rounded-full text-xs font-bold uppercase hover:bg-[#a66f2e] transition-colors">
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