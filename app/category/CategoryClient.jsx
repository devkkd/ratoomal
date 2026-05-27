// "use client";
// import React, { useState, useEffect, useCallback } from 'react';
// import { ChevronRight, Search, Heart } from 'lucide-react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useWishlistStore } from '@/store/wishlistStore';
// import { useInquiryCartStore } from '@/store/inquiryCartStore';
// import { useAuth } from '@/hooks/useAuth';
// import NotificationToast, { useNotification } from '../components/NotificationToast';

// // Static filters
// const filters = {
//     "Finish / Style": ["All Finishes", "Natural", "Hand Painted", "Antique", "Metallic", "Matte"],
//     "Material": ["Plastic", "Wooden", "Resin", "Thandi Lac", "Marble", "Metal", "Ceramic", "Glass", "Stone"],
//     "Size": ["3 inch", "6 inch", "9 inch", "12 inch", "15 inch", "18 inch", "24 inch", "36 inch"],
//     "Product Type": ["Ready Stock", "Made to Order"],
//     "Business Services": ["Custom Design", "Private Label", "Corporate Gifts", "Other"]
// };

// // Sort options
// const sortOptions = [
//     "Recommended",
//     "Latest",
//     "Popularity",
//     "Name A-Z",
//     "Name Z-A",
// ];

// const CategoryPage = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
    
//     // Get URL parameters
//     const urlCategory = searchParams.get('category');
//     const urlCategoryId = searchParams.get('id');
//     const urlSubCategory = searchParams.get('subcategory');
//     const urlSubCategoryId = searchParams.get('subid');
//     const pageParam = searchParams.get('page');
    
//     const [activeCategory, setActiveCategory] = useState("All Products");
//     const [selectedFilters, setSelectedFilters] = useState({
//         "finish/style": [],
//         "material": [],
//         "size": [],
//         "producttype": [],
//         "businessservices": []
//     });
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [expandedSections, setExpandedSections] = useState({
//         "Finish / Style": true,
//         "Minimum Order Quantity": true,
//         "Product Type": true,
//         "Business Services": true
//     });
//     const [navigationState, setNavigationState] = useState({
//         shouldNavigate: false,
//         url: null
//     });
//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//     const [isSortOpen, setIsSortOpen] = useState(false);
//     const [selectedSort, setSelectedSort] = useState("Recommended");
//     const [products, setProducts] = useState([]);
//     const [filteredProducts, setFilteredProducts] = useState([]);
//     const [sortedProducts, setSortedProducts] = useState([]);
//     const { wishlist, toggleWishlist, isInWishlist, initialize } = useWishlistStore();
//     const { addToCart } = useInquiryCartStore();
//     const { notification, showNotification, hideNotification } = useNotification();
//     const [loading, setLoading] = useState(true);
    
//     // State for categories and subcategories from backend
//     const [backendCategories, setBackendCategories] = useState([]);
//     const [allSubCategories, setAllSubCategories] = useState([]);
//     const [searchTerms, setSearchTerms] = useState({});
    
//     // Pagination states
//     const [currentPage, setCurrentPage] = useState(1);
//     const [productsPerPage] = useState(12);
//     const [totalPages, setTotalPages] = useState(1);
//     const [currentProducts, setCurrentProducts] = useState([]);
    
//     // Get auth state from custom hook
//     const { isLoggedIn, isLoading: authLoading, isClient } = useAuth();
//     const [showLoginPrompt, setShowLoginPrompt] = useState(false);
//     const getProductImage = (product) => {
//         if (product.thumbnail && (product.thumbnail.startsWith('http') || product.thumbnail.startsWith('/'))) {
//             return product.thumbnail;
//         }
        
//         if (product.images && product.images.length > 0) {
//             const firstImage = product.images[0];
//             if (firstImage && (firstImage.startsWith('http') || firstImage.startsWith('/'))) {
//                 return firstImage;
//             }
//         }
        
//         if (product.image && (product.image.startsWith('http') || product.image.startsWith('/'))) {
//             return product.image;
//         }
        
//         return '/images/placeholder.png';
//     };

//     // Initialize wishlist from store (only once on mount)
//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             initialize();
//         }
//     }, [initialize]);

//     // Log wishlist changes for debugging
//     useEffect(() => {
//         console.log('🔍 Category Page - Wishlist changed:', wishlist);
//     }, [wishlist]);

//     // Initialize from URL parameters
//     useEffect(() => {
//         if (urlCategory && urlCategoryId) {
//             setActiveCategory(urlCategory);
            
//             if (urlSubCategoryId) {
//                 const subKey = `${urlCategoryId}-${urlSubCategoryId}`;
//                 setSelectedCategories([subKey]);
//             } else {
//                 setSelectedCategories([urlCategoryId]);
//             }
//         }
        
//         if (pageParam) {
//             const pageNum = parseInt(pageParam);
//             if (!isNaN(pageNum) && pageNum > 0) {
//                 setCurrentPage(pageNum);
//             }
//         }
        
//         // If user is not logged in and trying to access page > 1, redirect to login
//         if (!isLoggedIn && pageParam && parseInt(pageParam) > 1) {
//             setCurrentPage(1);
//             updatePageInURL(1);
//         }
//     }, [urlCategory, urlCategoryId, urlSubCategoryId, pageParam, isLoggedIn]);

//     // Handle navigation
//     useEffect(() => {
//         if (navigationState.shouldNavigate && navigationState.url) {
//             router.push(navigationState.url);
//             setNavigationState({ shouldNavigate: false, url: null });
//         }
//     }, [navigationState, router]);

//     // Fetch data from backend
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
                
//                 // Fetch categories
//                 const categoriesResponse = await fetch('/api/categories');
//                 if (categoriesResponse.ok) {
//                     const categoriesData = await categoriesResponse.json();
//                     if (categoriesData.success && categoriesData.data) {
//                         setBackendCategories(categoriesData.data);
                        
//                         const initialSearchTerms = {};
//                         categoriesData.data.forEach(cat => {
//                             initialSearchTerms[cat._id] = "";
//                         });
//                         setSearchTerms(initialSearchTerms);
                        
//                         // Fetch subcategories
//                         try {
//                             const subCatResponse = await fetch('/api/subcategories');
//                             if (subCatResponse.ok) {
//                                 const subCatData = await subCatResponse.json();
//                                 if (subCatData.success && subCatData.data) {
//                                     setAllSubCategories(subCatData.data);
//                                 }
//                             }
//                         } catch (error) {
//                             console.error('Error fetching subcategories:', error);
//                         }
//                     }
//                 }
                
//                 // Fetch products
//                 const productsResponse = await fetch('/api/products');
//                 if (productsResponse.ok) {
//                     const productsData = await productsResponse.json();
//                     if (productsData.success && productsData.data) {
//                         const transformedProducts = productsData.data.map(product => ({
//                             id: product._id,
//                             name: product.name || "Unnamed Product",
//                             code: product.code || "",
//                             price: product.price?.toString() || "0",
//                             moq: product.minimumOrderQuantity || product.moq || 0,
//                             img: getProductImage(product),
//                             category: product.category?._id || "",
//                             categoryName: product.category?.name || "Uncategorized",
//                             subCategory: product.subCategory?._id || "",
//                             subCategoryName: product.subCategory?.name || "",
//                             finish: product.finish || "Natural",
//                             material: product.material || "Plastic", // Default material
//                             size: product.size || "6 inch", // Default size
//                             productType: product.productType || "Ready Stock",
//                             services: product.services || [],
//                             thumbnail: product.thumbnail,
//                             images: product.images || []
//                         }));
                        
//                         setProducts(transformedProducts);
//                         setFilteredProducts(transformedProducts);
//                         setSortedProducts(transformedProducts);
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching data from backend:', error);
//                 setProducts([]);
//                 setFilteredProducts([]);
//                 setSortedProducts([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     // Initialize expanded sections
//     useEffect(() => {
//         if (backendCategories.length > 0) {
//             const initialExpandedSections = {};
//             backendCategories.forEach((cat, index) => {
//                 // Only expand the first category by default
//                 initialExpandedSections[cat._id] = index === 0;
//             });
//             Object.keys(filters).forEach(filter => {
//                 initialExpandedSections[filter] = true;
//             });
//             setExpandedSections(prev => ({ ...prev, ...initialExpandedSections }));
//         }
//     }, [backendCategories]);

//     // Update current products when sorted products or current page changes
//     useEffect(() => {
//         if (sortedProducts && Array.isArray(sortedProducts)) {
//             const totalPagesCount = Math.ceil(sortedProducts.length / productsPerPage);
//             setTotalPages(totalPagesCount);
            
//             let startIndex, endIndex;
            
//             if (!isLoggedIn) {
//                 // Non-logged in users can only see first page
//                 if (currentPage > 1) {
//                     // Redirect to first page if trying to access page > 1
//                     setCurrentPage(1);
//                     updatePageInURL(1);
//                     startIndex = 0;
//                 } else {
//                     startIndex = (currentPage - 1) * productsPerPage;
//                 }
//                 endIndex = Math.min(startIndex + productsPerPage, sortedProducts.length);
//             } else {
//                 // Logged in users can see all pages
//                 startIndex = (currentPage - 1) * productsPerPage;
//                 endIndex = Math.min(startIndex + productsPerPage, sortedProducts.length);
//             }
            
//             const currentProductsSlice = sortedProducts.slice(startIndex, endIndex);
//             setCurrentProducts(currentProductsSlice);
//         }
//     }, [sortedProducts, currentPage, productsPerPage, isLoggedIn]);

//     // Update page in URL
//     const updatePageInURL = (pageNumber) => {
//         const params = new URLSearchParams(searchParams.toString());
//         params.set('page', pageNumber.toString());
//         const newUrl = `${window.location.pathname}?${params.toString()}`;
//         window.history.replaceState({}, '', newUrl);
//     };

//     // Handle page change with validation
//     const handlePageChange = (pageNumber) => {
//         if (!isLoggedIn && pageNumber > 1) {
//             // Show login prompt instead of redirecting immediately
//             setShowLoginPrompt(true);
//             return;
//         }
        
//         if (pageNumber >= 1 && pageNumber <= totalPages) {
//             setCurrentPage(pageNumber);
//             updatePageInURL(pageNumber);
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//         }
//     };

//     // Generate pagination buttons
//     const renderPagination = () => {
//         const buttons = [];
        
//         // Previous button
//         const isPrevDisabled = currentPage === 1;
//         buttons.push(
//             <button
//                 key="prev"
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={isPrevDisabled}
//                 className={`px-4 py-2 rounded-lg border text-sm ${isPrevDisabled 
//                     ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
//                     : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
//             >
//                 Previous
//             </button>
//         );
        
//         // Page numbers - show all pages but disable pages > 1 for non-logged in users
//         for (let i = 1; i <= totalPages; i++) {
//             const isDisabled = !isLoggedIn && i > 1;
//             const isActive = currentPage === i;
            
//             buttons.push(
//                 <button
//                     key={i}
//                     onClick={() => !isDisabled && handlePageChange(i)}
//                     disabled={isDisabled}
//                     className={`px-4 py-2 rounded-lg border text-sm font-medium ${isActive 
//                         ? 'bg-[#C08237] text-white border-[#C08237]' 
//                         : isDisabled 
//                             ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
//                             : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
//                     title={isDisabled ? "Login to view this page" : `Page ${i}`}
//                 >
//                     {i}
//                 </button>
//             );
//         }
        
//         // Next button
//         const isNextDisabled = !isLoggedIn ? currentPage >= 1 : currentPage >= totalPages;
//         buttons.push(
//             <button
//                 key="next"
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={isNextDisabled}
//                 className={`px-4 py-2 rounded-lg border text-sm ${isNextDisabled 
//                     ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
//                     : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
//                 title={!isLoggedIn && currentPage === 1 ? "Login to view more pages" : ""}
//             >
//                 Next
//             </button>
//         );
        
//         return buttons;
//     };

//     const toggleSection = (section) => {
//         setExpandedSections(prev => ({
//             ...prev,
//             [section]: !prev[section]
//         }));
//     };

//     // Handle category change
//     const handleCategoryChange = (category) => {
//         // Check if user is logged in for non-All Products categories
//         if (category !== "All Products" && category !== "Custom" && !isLoggedIn) {
//             // Redirect to login page
//             router.push('/login');
//             return;
//         }
        
//         setActiveCategory(category);
//         setCurrentPage(1);
//         updatePageInURL(1);
        
//         if (category === "All Products") {
//             setSelectedCategories([]);
//             setNavigationState({
//                 shouldNavigate: true,
//                 url: '/category?page=1'
//             });
//         } else if (category === "Custom") {
//             setNavigationState({
//                 shouldNavigate: true,
//                 url: '/custom-orders'
//             });
//         } else {
//             const categoryObj = backendCategories.find(cat => cat.name === category);
//             if (categoryObj) {
//                 const newSelection = selectedCategories.filter(item => 
//                     !item.includes(`${categoryObj._id}-`)
//                 );
//                 setSelectedCategories([...newSelection, categoryObj._id]);
                
//                 setNavigationState({
//                     shouldNavigate: true,
//                     url: `/category?category=${encodeURIComponent(category)}&id=${categoryObj._id}&page=1`
//                 });
//             }
//         }
//     };

//     // Handle sidebar category change
//     const handleSidebarCategoryChange = (categoryId, subCategoryId = null) => {
//         // Check if user is logged in before allowing category selection
//         if (!isLoggedIn) {
//             router.push('/login');
//             return;
//         }
        
//         const key = subCategoryId ? `${categoryId}-${subCategoryId}` : categoryId;
        
//         setSelectedCategories(prev => {
//             let newSelection;
            
//             if (subCategoryId) {
//                 if (prev.includes(key)) {
//                     newSelection = prev.filter(i => i !== key);
//                 } else {
//                     newSelection = [
//                         ...prev.filter(i => i !== categoryId),
//                         key
//                     ];
//                 }
//             } else {
//                 if (prev.includes(categoryId)) {
//                     newSelection = prev.filter(i => 
//                         i !== categoryId && !i.startsWith(`${categoryId}-`)
//                     );
//                 } else {
//                     newSelection = [
//                         ...prev.filter(i => !i.startsWith(`${categoryId}-`)),
//                         categoryId
//                     ];
//                 }
//             }
            
//             const categoryObj = backendCategories.find(cat => cat._id === categoryId);
//             if (categoryObj) {
//                 setActiveCategory(categoryObj.name);
                
//                 let url;
//                 const hasSubCategories = newSelection.some(item => 
//                     item.startsWith(`${categoryId}-`)
//                 );
//                 const hasParentCategory = newSelection.includes(categoryId);
                
//                 if (hasSubCategories) {
//                     const firstSubKey = newSelection.find(item => 
//                         item.startsWith(`${categoryId}-`)
//                     );
//                     if (firstSubKey) {
//                         const [, subId] = firstSubKey.split('-');
//                         const subCategoryObj = allSubCategories.find(sub => sub._id === subId);
//                         url = `/category?category=${encodeURIComponent(categoryObj.name)}&id=${categoryId}&subcategory=${encodeURIComponent(subCategoryObj?.name || '')}&subid=${subId}&page=1`;
//                     } else {
//                         url = `/category?category=${encodeURIComponent(categoryObj.name)}&id=${categoryId}&page=1`;
//                     }
//                 } else if (hasParentCategory) {
//                     url = `/category?category=${encodeURIComponent(categoryObj.name)}&id=${categoryId}&page=1`;
//                 } else {
//                     url = '/category?page=1';
//                 }
                
//                 setNavigationState({
//                     shouldNavigate: true,
//                     url: url
//                 });
//             }
            
//             return newSelection;
//         });
        
//         // Reset to first page and update pagination
//         setCurrentPage(1);
//         updatePageInURL(1);
//     };

//     const handleFilterChange = (filterType, value) => {
//         // Check if user is logged in when applying filters (only for non-All Products)
//         if (!isLoggedIn && activeCategory !== "All Products") {
//             router.push('/login');
//             return;
//         }
        
//         const filterKey = filterType.toLowerCase().replace(/\s+/g, '');

//         setSelectedFilters(prev => ({
//             ...prev,
//             [filterKey]: prev[filterKey]?.includes(value)
//                 ? prev[filterKey].filter(item => item !== value)
//                 : [...(prev[filterKey] || []), value]
//         }));
        
//         setCurrentPage(1);
//     };

//     const handleSearchChange = (categoryId, value) => {
//         setSearchTerms(prev => ({
//             ...prev,
//             [categoryId]: value
//         }));
//     };

//     // Use the hook's toggleWishlist directly
//     // No local function needed - use toggleWishlistHook from the hook

//     const handleSort = (sortType) => {
//         setSelectedSort(sortType);
//         setIsSortOpen(false);
//         setCurrentPage(1);

//         let sorted = [...filteredProducts];

//         switch (sortType) {
//             case "Name A-Z":
//                 sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
//                 break;
//             case "Name Z-A":
//                 sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
//                 break;
//             case "Price Low to High":
//                 sorted.sort((a, b) => {
//                     const priceA = parseInt((a.price || '0').toString().replace(/,/g, '')) || 0;
//                     const priceB = parseInt((b.price || '0').toString().replace(/,/g, '')) || 0;
//                     return priceA - priceB;
//                 });
//                 break;
//             case "Price High to Low":
//                 sorted.sort((a, b) => {
//                     const priceA = parseInt((a.price || '0').toString().replace(/,/g, '')) || 0;
//                     const priceB = parseInt((b.price || '0').toString().replace(/,/g, '')) || 0;
//                     return priceB - priceA;
//                 });
//                 break;
//             case "Latest":
//                 sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
//                 break;
//             case "Popularity":
//                 sorted.sort((a, b) => (a.moq || 0) - (b.moq || 0));
//                 break;
//             default:
//                 break;
//         }

//         setSortedProducts(sorted);
//     };

//     const handleProductClick = (product) => {
//         router.push(`/product/${product.id}`);
//     };

//     // Apply filters
//     useEffect(() => {
//         let filtered = [...products];

//         // Category filter
//         if (activeCategory !== "All Products" && activeCategory !== "Custom") {
//             const categoryObj = backendCategories.find(cat => cat.name === activeCategory);
//             if (categoryObj) {
//                 filtered = filtered.filter(product => 
//                     product.category === categoryObj._id
//                 );
//             }
//         }

//         // Sub-category filter
//         if (selectedCategories.length > 0) {
//             filtered = filtered.filter(product => {
//                 return selectedCategories.some(catKey => {
//                     if (catKey.includes('-')) {
//                         const [catId, subCatId] = catKey.split('-');
//                         return product.category === catId && product.subCategory === subCatId;
//                     } else {
//                         return product.category === catKey;
//                     }
//                 });
//             });
//         }

//         // Right sidebar filters
//         if (selectedFilters["finish/style"] && selectedFilters["finish/style"].length > 0 && !selectedFilters["finish/style"].includes("All Finishes")) {
//             filtered = filtered.filter(product =>
//                 selectedFilters["finish/style"].some(finish => {
//                     if (finish === "All Finishes") return true;
//                     return product.finish === finish;
//                 })
//             );
//         }

//         if (selectedFilters["material"] && selectedFilters["material"].length > 0) {
//             filtered = filtered.filter(product => {
//                 // Assuming product has a 'material' field
//                 return selectedFilters["material"].some(material => {
//                     return product.material === material || 
//                            (product.materials && product.materials.includes(material));
//                 });
//             });
//         }

//         if (selectedFilters["size"] && selectedFilters["size"].length > 0) {
//             filtered = filtered.filter(product => {
//                 // Assuming product has a 'size' field
//                 return selectedFilters["size"].some(size => {
//                     return product.size === size || 
//                            (product.sizes && product.sizes.includes(size)) ||
//                            (product.dimensions && product.dimensions.includes(size));
//                 });
//             });
//         }

//         if (selectedFilters["producttype"] && selectedFilters["producttype"].length > 0) {
//             filtered = filtered.filter(product =>
//                 selectedFilters["producttype"].includes(product.productType)
//             );
//         }

//         if (selectedFilters["businessservices"] && selectedFilters["businessservices"].length > 0) {
//             filtered = filtered.filter(product => {
//                 if (!product.services || product.services.length === 0) return false;

//                 return selectedFilters["businessservices"].some(service => {
//                     if (service === "Other") {
//                         const mainServices = ["Custom Design", "Private Label", "Corporate Gifts"];
//                         return product.services.some(s => !mainServices.includes(s));
//                     }
//                     return product.services.includes(service);
//                 });
//             });
//         }

//         setFilteredProducts(filtered);

//         // Re-apply sorting
//         const sorted = applySorting(filtered, selectedSort);
//         setSortedProducts(sorted);
//     }, [products, activeCategory, selectedCategories, selectedFilters, selectedSort, backendCategories]);

//     const applySorting = (productsToSort, sortType) => {
//         if (!Array.isArray(productsToSort)) {
//             return [];
//         }
        
//         let sorted = [...productsToSort];

//         switch (sortType) {
//             case "Name A-Z":
//                 sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
//                 break;
//             case "Name Z-A":
//                 sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
//                 break;
//             case "Price Low to High":
//                 sorted.sort((a, b) => {
//                     const priceA = parseInt((a.price || '0').toString().replace(/,/g, '')) || 0;
//                     const priceB = parseInt((b.price || '0').toString().replace(/,/g, '')) || 0;
//                     return priceA - priceB;
//                 });
//                 break;
//             case "Price High to Low":
//                 sorted.sort((a, b) => {
//                     const priceA = parseInt((a.price || '0').toString().replace(/,/g, '')) || 0;
//                     const priceB = parseInt((b.price || '0').toString().replace(/,/g, '')) || 0;
//                     return priceB - priceA;
//                 });
//                 break;
//             case "Latest":
//                 sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
//                 break;
//             case "Popularity":
//                 sorted.sort((a, b) => (a.moq || 0) - (b.moq || 0));
//                 break;
//             default:
//                 break;
//         }

//         return sorted;
//     };

//     // Get filtered subcategories
//     const getFilteredSubCategories = (categoryId) => {
//         const searchTerm = searchTerms[categoryId]?.toLowerCase() || '';
        
//         const categorySubCats = allSubCategories.filter(subCat => {
//             if (subCat.category && subCat.category._id) {
//                 return subCat.category._id === categoryId;
//             }
//             return false;
//         });
        
//         return categorySubCats.filter(subCat => 
//             subCat.name.toLowerCase().includes(searchTerm)
//         );
//     };

//     // Clear all filters
//     const clearAllFilters = () => {
//         setSelectedFilters({
//             "finish/style": [],
//             "material": [],
//             "size": [],
//             "producttype": [],
//             "businessservices": []
//         });
//         setSelectedCategories([]);
//         setActiveCategory("All Products");
//         setCurrentPage(1);
//         updatePageInURL(1);
        
//         const resetSearchTerms = {};
//         backendCategories.forEach(cat => {
//             resetSearchTerms[cat._id] = "";
//         });
//         setSearchTerms(resetSearchTerms);
        
//         setNavigationState({
//             shouldNavigate: true,
//             url: '/category?page=1'
//         });
//     };

//     // Get checked status for filters
//     const isFilterChecked = (filterType, value) => {
//         const filterKey = filterType.toLowerCase().replace(/\s+/g, '');
//         return selectedFilters[filterKey]?.includes(value) || false;
//     };

//     // Get category names for top tabs
//     const categoryTabs = ["All Products", ...backendCategories.map(cat => cat.name), "Custom"];

//     // Calculate display text
//     const getDisplayText = () => {
//         if (isLoggedIn) {
//             // Logged in users - show current page info
//             const startIndex = (currentPage - 1) * productsPerPage + 1;
//             const endIndex = Math.min(currentPage * productsPerPage, sortedProducts.length);
//             return `Showing ${startIndex}-${endIndex} of ${sortedProducts.length} products`;
//         } else {
//             // Non-logged in users - always show first page only
//             const endIndex = Math.min(productsPerPage, sortedProducts.length);
//             return `Showing 1-${endIndex} of ${sortedProducts.length} products`;
//         }
//     };

//     return (
//         <div className="min-h-screen bg-[#FDFBF7] font-sans">
//             {/* Login Prompt Modal */}
//             {showLoginPrompt && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//                     <div className="bg-white rounded-lg max-w-md w-full p-6">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-lg font-semibold">Login Required</h3>
//                             <button 
//                                 onClick={() => setShowLoginPrompt(false)}
//                                 className="text-gray-500 hover:text-gray-700"
//                             >
//                                 ✕
//                             </button>
//                         </div>
//                         <p className="mb-4">
//                             Please login to view more products and access all pages.
//                         </p>
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setShowLoginPrompt(false)}
//                                 className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     setShowLoginPrompt(false);
//                                     router.push('/login');
//                                 }}
//                                 className="flex-1 py-2 bg-[#C08237] text-white rounded-lg hover:bg-[#9C774A]"
//                             >
//                                 Login
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Header */}
//             <header className="bg-white py-2">
//                 <div className="max-w-7xl mx-auto px-4 py-6">
//                     <h1 className="text-3xl playfair font-bold text-center text-gray-800 sm:mb-2">Category</h1>
//                 </div>
//             </header>

//             <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
//                 <div className="flex flex-col lg:flex-row gap-8">
//                     {/* Left Sidebar */}
//                     <aside className="w-full lg:w-60 shrink-0">
//                         <div className="sticky top-8">
//                             <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
//                                 <div className="py-3 px-2">
//                                     <div className="space-y-3">
//                                         {backendCategories.map(category => {
//                                             const categorySubCats = getFilteredSubCategories(category._id);
//                                             const isParentSelected = selectedCategories.includes(category._id);
                                            
//                                             return (
//                                                 <div key={category._id}>
//                                                     <button
//                                                         onClick={() => toggleSection(category._id)}
//                                                         className="flex justify-between items-center w-full p-2 hover:bg-gray-50 rounded"
//                                                     >
//                                                         <span className="font-medium text-sm mona text-gray-700">{category.name}</span>
//                                                         <ChevronRight
//                                                             className={`w-4 h-4 transition-transform ${expandedSections[category._id] ? 'rotate-90' : ''}`}
//                                                         />
//                                                     </button>

//                                                     {expandedSections[category._id] && categorySubCats.length > 0 && (
//                                                         <div className="pl-2 space-y-2 mt-2">
//                                                             <div className="relative">
//                                                                 <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//                                                                 <input
//                                                                     type="text"
//                                                                     placeholder={`Search in ${category.name}`}
//                                                                     value={searchTerms[category._id] || ''}
//                                                                     onChange={(e) => handleSearchChange(category._id, e.target.value)}
//                                                                     className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none"
//                                                                 />
//                                                             </div>

//                                                             <div className="max-h-48 overflow-y-auto scrollbar-hide space-y-2 pr-2">
//                                                                 <label className="flex items-center gap-2 cursor-pointer mb-2 pb-2 border-b border-gray-100">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         checked={isParentSelected}
//                                                                         onChange={() => handleSidebarCategoryChange(category._id)}
//                                                                         className="w-4 h-4 text-[#C08237] border-gray-300 rounded focus:ring-[#C08237]"
//                                                                     />
//                                                                     <span className="text-sm font-medium text-gray-800">All {category.name}</span>
//                                                                 </label>
                                                                
//                                                                 {categorySubCats.map(subCat => {
//                                                                     const isSelected = selectedCategories.includes(`${category._id}-${subCat._id}`);
                                                                    
//                                                                     return (
//                                                                         <label key={subCat._id} className="flex items-center gap-2 cursor-pointer pl-4">
//                                                                             <input
//                                                                                 type="checkbox"
//                                                                                 checked={isSelected}
//                                                                                 onChange={() => handleSidebarCategoryChange(category._id, subCat._id)}
//                                                                                 className="w-4 h-4 text-[#C08237] border-gray-300 rounded focus:ring-[#C08237]"
//                                                                             />
//                                                                             <span className="text-sm text-gray-600 hover:text-gray-900">{subCat.name}</span>
//                                                                         </label>
//                                                                     );
//                                                                 })}
//                                                             </div>
//                                                         </div>
//                                                     )}
                                                    
//                                                     {expandedSections[category._id] && categorySubCats.length === 0 && (
//                                                         <div className="pl-2 space-y-2 mt-2">
//                                                             <div className="relative">
//                                                                 <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//                                                                 <input
//                                                                     type="text"
//                                                                     placeholder={`Search in ${category.name}`}
//                                                                     value={searchTerms[category._id] || ''}
//                                                                     onChange={(e) => handleSearchChange(category._id, e.target.value)}
//                                                                     className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none"
//                                                                 />
//                                                             </div>
//                                                             <p className="text-sm text-gray-500 px-2 py-1">No subcategories found</p>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </aside>

//                     {/* Main Content */}
//                     <main className="flex-1">
//                         {/* Top Toolbar */}
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                             <div className="flex flex-wrap gap-2 ">
//                                 {categoryTabs.map((category) => (
//                                     <button
//                                         key={category}
//                                         onClick={() => handleCategoryChange(category)}
//                                         className={`px-4 py-2 rounded-full text-[12px] mona font-medium transition-colors ${activeCategory === category
//                                             ? 'bg-[#C08237] text-white'
//                                             : 'bg-white border border-gray-400 text-gray-900 hover:bg-gray-50'
//                                             }`}
//                                     >
//                                         {category}
//                                     </button>
//                                 ))}
//                             </div>

//                             <div className="flex gap-3 relative">
//                                 <div className="relative">
//                                     <button
//                                         onClick={() => setIsSortOpen(!isSortOpen)}
//                                         className="flex mona items-center gap-2 bg-white border border-gray-400 text-sm hover:bg-gray-50 px-3 py-2 rounded-full text-[12px] mona font-medium transition-colors"
//                                     >
//                                         Sort By <img src='/images/icons/arrow-3.svg' className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
//                                     </button>

//                                     {isSortOpen && (
//                                         <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
//                                             <div className="py-2">
//                                                 {sortOptions.map((option) => (
//                                                     <button
//                                                         key={option}
//                                                         onClick={() => handleSort(option)}
//                                                         className={`flex justify-between hover:bg-[#C08237] hover:text-white items-center w-full px-4 py-2 text-left text-sm ${selectedSort === option ? 'text-[white] bg-[#C08237] font-medium' : 'text-gray-700'
//                                                             }`}
//                                                     >
//                                                         <span className="mona">{option}</span>
//                                                         {selectedSort === option && (
//                                                             <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                                                             </svg>
//                                                         )}
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <button
//                                     onClick={() => setIsFilterOpen(true)}
//                                     className="flex mona items-center gap-2 bg-white border border-gray-400 text-sm hover:bg-gray-50 px-3 py-2 rounded-full text-[12px] mona font-medium transition-colors"
//                                 >
//                                     Filters <img src='/images/icons/setting-4.svg' className="w-4 h-4" />
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Results Count - Different for logged in vs non-logged in */}
//                         <div className="mb-6 flex justify-between items-center">
//                             <div>
//                                 <p className="text-gray-600">
//                                     {getDisplayText()}
//                                 </p>
//                                 {/* Only show login prompt for non-logged in users */}
//                                 {!isLoggedIn && sortedProducts.length > productsPerPage && (
//                                     <p className="text-sm text-gray-500 mt-1">
//                                         <span className="text-yellow-600 font-medium">
//                                             Login to view all {sortedProducts.length} products and access all pages
//                                         </span>
//                                     </p>
//                                 )}
//                             </div>
//                             {(selectedCategories.length > 0 || Object.values(selectedFilters).some(arr => arr.length > 0)) && (
//                                 <button
//                                     onClick={clearAllFilters}
//                                     className="text-sm text-[#C08237] hover:text-[#9C774A] font-medium"
//                                 >
//                                     Clear all filters
//                                 </button>
//                             )}
//                         </div>

//                         {/* Product Display - Category-wise sliders for "All Products", regular grid for specific categories */}
//                         {loading ? (
//                             <div className="flex justify-center items-center h-64">
//                                 <div className="text-gray-600">Loading products...</div>
//                             </div>
//                         ) : !sortedProducts || !Array.isArray(sortedProducts) || sortedProducts.length === 0 ? (
//                             <div className="text-center py-12">
//                                 <p className="text-gray-600">No products found. Try changing your filters.</p>
//                             </div>
//                         ) : activeCategory === "All Products" ? (
//                             // Category-wise sliders for "All Products"
//                             <div className="space-y-12">
//                                 {backendCategories.map(category => {
//                                     // Filter products for this category
//                                     const categoryProducts = sortedProducts.filter(product => 
//                                         product.category === category._id
//                                     );
                                    
//                                     // Skip if no products in this category
//                                     if (categoryProducts.length === 0) return null;
                                    
//                                     return (
//                                         <div key={category._id} className="category-section">
//                                             <div className="flex items-center justify-between mb-6">
//                                                 <h2 className="text-2xl font-bold text-gray-800 playfair">{category.name}</h2>
//                                                 <div className="flex items-center gap-4">
//                                                     <span className="text-sm text-gray-500">
//                                                         {categoryProducts.length} products
//                                                     </span>
//                                                     <button
//                                                         onClick={() => handleCategoryChange(category.name)}
//                                                         className="text-sm text-[#C08237] hover:text-[#9C774A] font-medium"
//                                                     >
//                                                         View All →
//                                                     </button>
//                                                 </div>
//                                             </div>
                                            
//                                             {/* Products Slider */}
//                                             <div className={`${isLoggedIn ? 'category-slider overflow-x-auto' : ''} pb-4`}>
//                                                 <div className={`flex gap-6 ${isLoggedIn ? 'min-w-max' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
//                                                     {(isLoggedIn ? categoryProducts : categoryProducts.slice(0, 3)).map(product => (
//                                                         <div 
//                                                             key={product.id} 
//                                                             className={`cursor-pointer relative group shrink-0 ${isLoggedIn ? 'w-[280px]' : 'w-full max-w-[480px]'}`}
//                                                             onClick={() => handleProductClick(product)}
//                                                         >
//                                                             <div className="relative w-full h-[280px] sm:h-[330px] bg-gray-100 overflow-hidden rounded-2xl">
//                                                                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                                                                     <img
//                                                                         src={product.img}
//                                                                         alt={product.name}
//                                                                         className="w-full h-full object-cover hover:scale-105 transition duration-300"
//                                                                         onError={(e) => {
//                                                                             if (product.thumbnail && product.thumbnail !== product.img) {
//                                                                                 e.target.src = product.thumbnail;
//                                                                             } else if (product.images && product.images.length > 0) {
//                                                                                 e.target.src = product.images[0];
//                                                                             } else {
//                                                                                 e.target.src = '/images/placeholder.png';
//                                                                             }
//                                                                         }}
//                                                                     />
//                                                                 </div>

//                                                                 <button
//                                                                     onClick={(e) => {
//                                                                         e.stopPropagation();
//                                                                         toggleWishlist(product.id);
//                                                                     }}
//                                                                     className="absolute top-3 right-3 z-10 p-2 bg-[#FFFFFF80] backdrop-blur-sm rounded-full 
//                                                                                shadow-lg hover:bg-white active:scale-95 
//                                                                                transition-all duration-200"
//                                                                 >
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         className={`h-5 w-6 transition-colors duration-200 ${isInWishlist(product.id)
//                                                                             ? "fill-red-500 text-red-500"
//                                                                             : "text-gray-800 fill-transparent hover:text-red-400"
//                                                                             }`}
//                                                                         viewBox="0 0 24 24"
//                                                                         stroke="currentColor"
//                                                                         strokeWidth={isInWishlist(product.id) ? 0 : 2}
//                                                                     >
//                                                                         <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
//                                                                     </svg>
//                                                                 </button>
//                                                             </div>

//                                                             <div className="mt-3">
//                                                                 <h3 className="mona font-semibold text-sm text-black">
//                                                                     {product.name}
//                                                                 </h3>
//                                                                 {product.code && (
//                                                                     <p className="mona text-gray-600 font-mono text-xs mt-1">
//                                                                         Code: <b>{product.code}</b>
//                                                                     </p>
//                                                                 )}
                                                                
//                                                                 {/* Add to Inquiry Section */}
//                                                                 <div className="mt-3 space-y-2">
//                                                                     {/* Quantity Selector */}
//                                                                     <div className="flex items-center justify-between">
//                                                                         <span className="text-xs hidden sm:flex text-gray-600">Quantity:</span>
//                                                                         <div className="flex items-center mx-auto sm:mx-0 border border-gray-300 rounded-md">
//                                                                             <button 
//                                                                                 onClick={(e) => {
//                                                                                     e.stopPropagation();
//                                                                                     const input = e.target.parentElement.querySelector('input');
//                                                                                     const currentValue = parseInt(input.value) || 1;
//                                                                                     if (currentValue > 6) {
//                                                                                         input.value = currentValue - 6;
//                                                                                     } else {
//                                                                                         input.value = 1;
//                                                                                     }
//                                                                                 }}
//                                                                                 className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-l-md"
//                                                                             >
//                                                                                 -
//                                                                             </button>
//                                                                             <input 
//                                                                                 type="number" 
//                                                                                 min="1" 
//                                                                                 step="6"
//                                                                                 defaultValue="1"
//                                                                                 onClick={(e) => e.stopPropagation()}
//                                                                                 className="w-12 px-1 py-1 text-xs text-center border-x border-gray-300 focus:outline-none"
//                                                                             />
//                                                                             <button 
//                                                                                 onClick={(e) => {
//                                                                                     e.stopPropagation();
//                                                                                     const input = e.target.parentElement.querySelector('input');
//                                                                                     const currentValue = parseInt(input.value) || 1;
//                                                                                     if (currentValue === 1) {
//                                                                                         input.value = 6;
//                                                                                     } else {
//                                                                                         input.value = currentValue + 6;
//                                                                                     }
//                                                                                 }}
//                                                                                 className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-r-md"
//                                                                             >
//                                                                                 +
//                                                                             </button>
//                                                                         </div>
//                                                                     </div>
                                                                    
//                                                                     {/* Add to Inquiry Button */}
//                                                                     <button
//                                                                         onClick={(e) => {
//                                                                             e.stopPropagation();
//                                                                             if (!isLoggedIn) {
//                                                                                 router.push('/login');
//                                                                                 return;
//                                                                             }
                                                                            
//                                                                             // Add to inquiry cart with only 3-inch size by default
//                                                                             const quantityInput = e.target.parentElement.parentElement.querySelector('input[type="number"]');
//                                                                             const quantity = parseInt(quantityInput?.value) || 1;
                                                                            
//                                                                             // Add to cart with only 3-inch size
//                                                                             addToCart(product, ['3'], quantity);
                                                                            
//                                                                             // Show notification
//                                                                             showNotification('Product added to inquiry cart!', 'cart');
//                                                                         }}
//                                                                         className="w-full py-2 bg-[#C08237] text-white text-xs font-medium rounded-md hover:bg-[#9C774A] transition-colors flex items-center justify-center gap-1"
//                                                                     >
//                                                                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                                                                         </svg>
//                                                                         Add to Inquiry
//                                                                     </button>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     ))}
//                                                 </div>
                                                
//                                                 {/* Show login prompt for non-logged in users if there are more products */}
//                                                 {!isLoggedIn && categoryProducts.length > 3 && (
//                                                     <div className="mt-4 text-center">
//                                                         <p className="text-sm text-gray-600 mb-2">
//                                                             Showing 3 of {categoryProducts.length} products
//                                                         </p>
//                                                         <button
//                                                             onClick={() => router.push('/login')}
//                                                             className="text-[#C08237] hover:text-[#9C774A] font-medium text-sm"
//                                                         >
//                                                             Login to view all {categoryProducts.length} products
//                                                         </button>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
                                
//                                 {/* Show message if no products found in any category */}
//                                 {backendCategories.every(category => 
//                                     sortedProducts.filter(product => product.category === category._id).length === 0
//                                 ) && (
//                                     <div className="text-center py-12">
//                                         <p className="text-gray-600">No products found in any category.</p>
//                                     </div>
//                                 )}
//                             </div>
//                         ) : (
//                             // Regular grid for specific categories
//                             <>
//                                 <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                                     {currentProducts.map(product => (
//                                         <div 
//                                             key={product.id} 
//                                             className="cursor-pointer w-full max-w-[480px] relative group"
//                                             onClick={() => handleProductClick(product)}
//                                         >
//                                             <div className="relative w-full h-[280px] sm:h-[330px] bg-gray-100 overflow-hidden rounded-2xl">
//                                                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                                                     <img
//                                                         src={product.img}
//                                                         alt={product.name}
//                                                         className="w-full h-full object-cover hover:scale-105 transition duration-300"
//                                                         onError={(e) => {
//                                                             if (product.thumbnail && product.thumbnail !== product.img) {
//                                                                 e.target.src = product.thumbnail;
//                                                             } else if (product.images && product.images.length > 0) {
//                                                                 e.target.src = product.images[0];
//                                                             } else {
//                                                                 e.target.src = '/images/placeholder.png';
//                                                             }
//                                                         }}
//                                                     />
//                                                 </div>

//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         console.log('❤️ Heart button clicked for:', product.id);
//                                                         toggleWishlist(product.id);
//                                                     }}
//                                                     className="absolute top-3 right-3 z-10 p-2 bg-[#FFFFFF80] backdrop-blur-sm rounded-full 
//                                                                shadow-lg hover:bg-white active:scale-95 
//                                                                transition-all duration-200"
//                                                 >
//                                                     <svg
//                                                         xmlns="http://www.w3.org/2000/svg"
//                                                         className={`h-5 w-6 transition-colors duration-200 ${isInWishlist(product.id)
//                                                             ? "fill-red-500 text-red-500"
//                                                             : "text-gray-800 fill-transparent hover:text-red-400"
//                                                             }`}
//                                                         viewBox="0 0 24 24"
//                                                         stroke="currentColor"
//                                                         strokeWidth={isInWishlist(product.id) ? 0 : 2}
//                                                     >
//                                                         <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
//                                                     </svg>
//                                                 </button>
//                                             </div>

//                                             <div className="mt-3">
//                                                 <h3 className="mona font-semibold text-sm text-black">
//                                                     {product.name}
//                                                 </h3>
//                                                 {product.code && (
//                                                     <p className="mona text-gray-600 font-mono text-xs mt-1">
//                                                         Code: <b>{product.code}</b>
//                                                     </p>
//                                                 )}
                                                
//                                                 {/* Add to Inquiry Section */}
//                                                 <div className="mt-3 space-y-2">
//                                                     {/* Quantity Selector */}
//                                                     <div className="flex items-center justify-between">
//                                                         <span className="text-xs hidden sm:flex text-gray-600">Quantity:</span>
//                                                         <div className="flex items-center mx-auto sm:mx-0 border border-gray-300 rounded-md">
//                                                             <button 
//                                                                 onClick={(e) => {
//                                                                     e.stopPropagation();
//                                                                     const input = e.target.parentElement.querySelector('input');
//                                                                     const currentValue = parseInt(input.value) || 1;
//                                                                     if (currentValue > 6) {
//                                                                         input.value = currentValue - 6;
//                                                                     } else {
//                                                                         input.value = 1;
//                                                                     }
//                                                                 }}
//                                                                 className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-l-md"
//                                                             >
//                                                                 -
//                                                             </button>
//                                                             <input 
//                                                                 type="number" 
//                                                                 min="1" 
//                                                                 step="6"
//                                                                 defaultValue="1"
//                                                                 onClick={(e) => e.stopPropagation()}
//                                                                 className="w-12 px-1 py-1 text-xs text-center border-x border-gray-300 focus:outline-none"
//                                                             />
//                                                             <button 
//                                                                 onClick={(e) => {
//                                                                     e.stopPropagation();
//                                                                     const input = e.target.parentElement.querySelector('input');
//                                                                     const currentValue = parseInt(input.value) || 1;
//                                                                     if (currentValue === 1) {
//                                                                         input.value = 6;
//                                                                     } else {
//                                                                         input.value = currentValue + 6;
//                                                                     }
//                                                                 }}
//                                                                 className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-r-md"
//                                                             >
//                                                                 +
//                                                             </button>
//                                                         </div>
//                                                     </div>
                                                    
//                                                     {/* Add to Inquiry Button */}
//                                                     <button
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             if (!isLoggedIn) {
//                                                                 router.push('/login');
//                                                                 return;
//                                                             }
                                                            
//                                                             // Add to inquiry cart with only 3-inch size by default
//                                                             const quantityInput = e.target.parentElement.parentElement.querySelector('input[type="number"]');
//                                                             const quantity = parseInt(quantityInput?.value) || 1;
                                                            
//                                                             // Add to cart with only 3-inch size
//                                                             addToCart(product, ['3'], quantity);
                                                            
//                                                             // Show notification
//                                                             showNotification('Product added to inquiry cart!', 'cart');
//                                                         }}
//                                                         className="w-full py-2 bg-[#C08237] text-white text-xs font-medium rounded-md hover:bg-[#9C774A] transition-colors flex items-center justify-center gap-1"
//                                                     >
//                                                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                                                         </svg>
//                                                         Add to Inquiry
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {/* Pagination - Show only for specific categories, not for "All Products" */}
//                                 {activeCategory !== "All Products" && sortedProducts.length > productsPerPage && (
//                                     <div className="mt-12">
//                                         <div className="flex flex-col items-center">
//                                             {/* Pagination Info - Only show for non-logged in users */}
//                                             {!isLoggedIn && (
//                                                 <div className="mb-4 text-center">
//                                                     <p className="text-sm text-gray-600">
//                                                         Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
//                                                         <span className="ml-2 text-yellow-600">
//                                                             • <button 
//                                                                 onClick={() => router.push('/login')}
//                                                                 className="text-[#C08237] font-medium hover:underline"
//                                                             >
//                                                                 Login
//                                                             </button> to view all pages
//                                                         </span>
//                                                     </p>
//                                                 </div>
//                                             )}
                                            
//                                             {/* Pagination Buttons */}
//                                             <div className="flex flex-wrap justify-center gap-2">
//                                                 {renderPagination()}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                     </main>
//                 </div>
//             </div>

//             {/* Filter Sidebar */}
//             <div className={`fixed inset-0 z-50 transition-all duration-300 ${isFilterOpen ? 'visible' : 'invisible'}`}>
//                 <div
//                     className={`absolute inset-0 bg-black transition-opacity duration-300 ${isFilterOpen ? 'opacity-50' : 'opacity-0'}`}
//                     onClick={() => setIsFilterOpen(false)}
//                 />

//                 <div className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//                     <div className="h-full flex flex-col">
//                         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                             <h2 className="text-xl mona font-bold text-gray-800">Filters</h2>
//                             <button
//                                 onClick={() => setIsFilterOpen(false)}
//                                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                             >
//                                 <img src="/images/icons/close-circle.svg" className="w-7 h-7" alt="Close" />
//                             </button>
//                         </div>

//                         <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
//                             {Object.entries(filters).map(([title, options]) => (
//                                 <div key={title}>
//                                     <button
//                                         onClick={() => toggleSection(title)}
//                                         className="flex justify-between items-center w-full mb-4"
//                                     >
//                                         <h3 className="text-sm mona font-semibold text-gray-800">{title}</h3>
//                                         <ChevronRight
//                                             className={`w-4 h-4 transition-transform ${expandedSections[title] ? 'rotate-90' : ''}`}
//                                         />
//                                     </button>

//                                     {expandedSections[title] && (
//                                         <div className="space-y-2 pl-2">
//                                             {options.map(option => (
//                                                 <label key={option} className="flex items-center gap-2 cursor-pointer py-1">
//                                                     <input
//                                                         type="checkbox"
//                                                         checked={isFilterChecked(title, option)}
//                                                         onChange={() => handleFilterChange(title, option)}
//                                                         className="w-4 h-4 text-[#C08237] border-gray-300 rounded focus:ring-[#C08237]"
//                                                     />
//                                                     <span className="text-sm text-gray-600 hover:text-gray-900">{option}</span>
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
//                             <button
//                                 onClick={clearAllFilters}
//                                 className="flex-1 py-3 bg-white border border-gray-400 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                             >
//                                 Clear All
//                             </button>
//                             <button
//                                 onClick={() => setIsFilterOpen(false)}
//                                 className="flex-1 py-3 bg-[#C08237] text-white font-medium rounded-lg hover:bg-[#9C774A] transition-colors"
//                             >
//                                 Apply Filters
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Close dropdown when clicking outside */}
//             {isSortOpen && (
//                 <div
//                     className="fixed inset-0 z-30"
//                     onClick={() => setIsSortOpen(false)}
//                 />
//             )}

//             {/* Notification Toast */}
//             <NotificationToast
//                 message={notification.message}
//                 type={notification.type}
//                 isVisible={notification.isVisible}
//                 onClose={hideNotification}
//             />
//         </div>
//     );
// };

// export default CategoryPage;


"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Search, Heart } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWishlistStore } from '@/store/wishlistStore';
import { useInquiryCartStore } from '@/store/inquiryCartStore';
import { useAuth } from '@/hooks/useAuth';
import NotificationToast, { useNotification } from '../components/NotificationToast';

// Static filters
const filters = {
    "Finish / Style": ["All Finishes", "Natural", "Hand Painted", "Antique", "Metallic", "Matte"],
    "Material": ["Plastic", "Wooden", "Resin", "Thandi Lac", "Marble", "Metal", "Ceramic", "Glass", "Stone"],
    "Size": ["3 inch", "6 inch", "9 inch", "12 inch", "15 inch", "18 inch", "24 inch", "36 inch"],
    "Product Type": ["Ready Stock", "Made to Order"],
};

// Sort options
const sortOptions = [
    "Recommended",
    "Latest",
    "Popularity",
    "Name A-Z",
    "Name Z-A",
];

const CategoryPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get URL parameters
    const urlCategory = searchParams.get('category');
    const urlCategoryId = searchParams.get('id');
    const urlSubCategory = searchParams.get('subcategory');
    const urlSubCategoryId = searchParams.get('subid');
    const pageParam = searchParams.get('page');
    
    const [activeCategory, setActiveCategory] = useState("All Products");
    const [selectedFilters, setSelectedFilters] = useState({
        "finish/style": [],
        "material": [],
        "size": [],
        "producttype": [],
    });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [expandedSections, setExpandedSections] = useState({
        "Finish / Style": true,
        "Minimum Order Quantity": true,
        "Product Type": true,
    });
    const [navigationState, setNavigationState] = useState({
        shouldNavigate: false,
        url: null
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState("Recommended");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const { wishlist, toggleWishlist, isInWishlist, initialize } = useWishlistStore();
    const { addToCart } = useInquiryCartStore();
    const { notification, showNotification, hideNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    
    // State for categories and subcategories from backend
    const [backendCategories, setBackendCategories] = useState([]);
    const [allSubCategories, setAllSubCategories] = useState([]);
    const [searchTerms, setSearchTerms] = useState({});
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [currentProducts, setCurrentProducts] = useState([]);
    
    // Get auth state from custom hook
    const { isLoggedIn, isLoading: authLoading, isClient } = useAuth();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const getProductImage = (product) => {
        if (product.thumbnail && (product.thumbnail.startsWith('http') || product.thumbnail.startsWith('/'))) {
            return product.thumbnail;
        }
        
        if (product.images && product.images.length > 0) {
            const firstImage = product.images[0];
            if (firstImage && (firstImage.startsWith('http') || firstImage.startsWith('/'))) {
                return firstImage;
            }
        }
        
        if (product.image && (product.image.startsWith('http') || product.image.startsWith('/'))) {
            return product.image;
        }
        
        return '/images/placeholder.png';
    };

    // Get category products with limit for non-logged in users
    const getCategoryProducts = (categoryId) => {
        const categoryProducts = sortedProducts.filter(product => 
            product.category === categoryId
        );
        
        // Non-logged in users can see up to 4 products per category
        if (!isLoggedIn) {
            return categoryProducts.slice(0, 4);
        }
        
        // Logged in users ke liye all products
        return categoryProducts;
    };

    // Initialize wishlist from store (only once on mount)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            initialize();
        }
    }, [initialize]);

    // Log wishlist changes for debugging
    useEffect(() => {
        console.log('🔍 Category Page - Wishlist changed:', wishlist);
    }, [wishlist]);

    // Initialize from URL parameters
    useEffect(() => {
        if (urlCategory && urlCategoryId) {
            setActiveCategory(urlCategory);
            
            if (urlSubCategoryId) {
                const subKey = `${urlCategoryId}-${urlSubCategoryId}`;
                setSelectedCategories([subKey]);
            } else {
                setSelectedCategories([urlCategoryId]);
            }
        }
        
        if (pageParam) {
            const pageNum = parseInt(pageParam);
            if (!isNaN(pageNum) && pageNum > 0) {
                setCurrentPage(pageNum);
            }
        }
        
        // Only reset to page 1 for non-logged-in users after auth has finished loading
        if (!authLoading && !isLoggedIn && pageParam && parseInt(pageParam) > 1) {
            setCurrentPage(1);
            updatePageInURL(1);
        }
    }, [urlCategory, urlCategoryId, urlSubCategoryId, pageParam, isLoggedIn, authLoading]);

    // Handle navigation
    useEffect(() => {
        if (navigationState.shouldNavigate && navigationState.url) {
            router.push(navigationState.url);
            setNavigationState({ shouldNavigate: false, url: null });
        }
    }, [navigationState, router]);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch categories
                const categoriesResponse = await fetch('/api/categories');
                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json();
                    if (categoriesData.success && categoriesData.data) {
                        setBackendCategories(categoriesData.data);
                        
                        const initialSearchTerms = {};
                        categoriesData.data.forEach(cat => {
                            initialSearchTerms[cat._id] = "";
                        });
                        setSearchTerms(initialSearchTerms);
                        
                        // Fetch subcategories
                        try {
                            const subCatResponse = await fetch('/api/subcategories');
                            if (subCatResponse.ok) {
                                const subCatData = await subCatResponse.json();
                                if (subCatData.success && subCatData.data) {
                                    setAllSubCategories(subCatData.data);
                                }
                            }
                        } catch (error) {
                            console.error('Error fetching subcategories:', error);
                        }
                    }
                }
                
                // Fetch products
                const productsResponse = await fetch('/api/products');
                if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    if (productsData.success && productsData.data) {
                        const transformedProducts = productsData.data.map(product => ({
                            id: product._id,
                            slug: product.slug || null,
                            name: product.name || "Unnamed Product",
                            code: product.code || "",
                            price: product.price?.toString() || "0",
                            moq: product.minimumOrderQuantity || product.moq || 0,
                            img: getProductImage(product),
                            category: product.category?._id || "",
                            categoryName: product.category?.name || "Uncategorized",
                            subCategory: product.subCategory?._id || "",
                            subCategoryName: product.subCategory?.name || "",
                            finish: product.finish || "Natural",
                            material: product.material || "Plastic",
                            size: product.size || "6 inch",
                            productType: product.productType || "Ready Stock",
                            services: product.services || [],
                            thumbnail: product.thumbnail,
                            images: product.images || []
                        }));
                        
                        setProducts(transformedProducts);
                        setFilteredProducts(transformedProducts);
                        setSortedProducts(transformedProducts);
                    }
                }
            } catch (error) {
                console.error('Error fetching data from backend:', error);
                setProducts([]);
                setFilteredProducts([]);
                setSortedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Initialize expanded sections
    useEffect(() => {
        if (backendCategories.length > 0) {
            const initialExpandedSections = {};
            backendCategories.forEach((cat, index) => {
                initialExpandedSections[cat._id] = index === 0;
            });
            Object.keys(filters).forEach(filter => {
                initialExpandedSections[filter] = true;
            });
            setExpandedSections(prev => ({ ...prev, ...initialExpandedSections }));
        }
    }, [backendCategories]);

    // Update current products when sorted products or current page changes
    useEffect(() => {
        if (sortedProducts && Array.isArray(sortedProducts)) {
            const totalPagesCount = Math.ceil(sortedProducts.length / productsPerPage);
            setTotalPages(totalPagesCount);
            
            let startIndex, endIndex;
            
            if (!authLoading && !isLoggedIn) {
                // Non-logged in users can only see first page
                if (currentPage > 1) {
                    setCurrentPage(1);
                    updatePageInURL(1);
                    startIndex = 0;
                } else {
                    startIndex = (currentPage - 1) * productsPerPage;
                }
                endIndex = Math.min(startIndex + productsPerPage, sortedProducts.length);
            } else {
                startIndex = (currentPage - 1) * productsPerPage;
                endIndex = Math.min(startIndex + productsPerPage, sortedProducts.length);
            }
            
            const currentProductsSlice = sortedProducts.slice(startIndex, endIndex);
            setCurrentProducts(currentProductsSlice);
        }
    }, [sortedProducts, currentPage, productsPerPage, isLoggedIn, authLoading]);

    // Scroll back to last viewed product when returning from product detail page
    // Runs only after loading is done and products are rendered in the DOM
    useEffect(() => {
        if (loading) return;
        if (currentProducts.length === 0) return;
        if (typeof window === 'undefined') return;

        const lastProductId = sessionStorage.getItem('lastViewedProductId');
        if (!lastProductId) return;

        // Check if the product is on the current page
        const isOnPage = currentProducts.some(p => p.id === lastProductId);
        if (!isOnPage) return;

        // Poll for the element — DOM may not be painted yet right after state update
        let attempts = 0;
        const maxAttempts = 20; // try for up to 2 seconds
        const interval = setInterval(() => {
            attempts++;
            const el = document.getElementById(`product-${lastProductId}`);
            if (el) {
                clearInterval(interval);
                // Scroll so the product is visible with some space above it
                const offset = 120; // account for sticky header
                const top = el.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
                sessionStorage.removeItem('lastViewedProductId');
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                sessionStorage.removeItem('lastViewedProductId');
            }
        }, 100);

        return () => clearInterval(interval);
    }, [loading, currentProducts]);

    // Update page in URL — use router.replace so Next.js tracks it in history
    // This ensures browser back button restores the correct page number
    const updatePageInURL = (pageNumber) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.replace(newUrl, { scroll: false });
    };

    // Handle page change with validation
    const handlePageChange = (pageNumber) => {
        if (!isLoggedIn && pageNumber > 1) {
            setShowLoginPrompt(true);
            return;
        }
        
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            updatePageInURL(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Generate pagination buttons
    const renderPagination = () => {
        const buttons = [];
        
        const isPrevDisabled = currentPage === 1;
        buttons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={isPrevDisabled}
                className={`px-4 py-2 rounded-lg border text-sm ${isPrevDisabled 
                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
                Previous
            </button>
        );
        
        for (let i = 1; i <= totalPages; i++) {
            const isDisabled = !isLoggedIn && i > 1;
            const isActive = currentPage === i;
            
            buttons.push(
                <button
                    key={i}
                    onClick={() => !isDisabled && handlePageChange(i)}
                    disabled={isDisabled}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${isActive 
                        ? 'bg-[#C08237] text-white border-[#C08237]' 
                        : isDisabled 
                            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    title={isDisabled ? "Login to view this page" : `Page ${i}`}
                >
                    {i}
                </button>
            );
        }
        
        const isNextDisabled = !isLoggedIn ? currentPage >= 1 : currentPage >= totalPages;
        buttons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={isNextDisabled}
                className={`px-4 py-2 rounded-lg border text-sm ${isNextDisabled 
                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                title={!isLoggedIn && currentPage === 1 ? "Login to view more pages" : ""}
            >
                Next
            </button>
        );
        
        return buttons;
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Handle category change
    const handleCategoryChange = (category) => {
        // Agar "All Products" click kiya aur user logged in nahi hai
        if (category === "All Products" && !isLoggedIn) {
            router.push('/login');
            return;
        }
        
        // Agar "All Products" nahi hai to existing logic
        if (category !== "All Products" && category !== "Custom" && !isLoggedIn) {
            router.push('/login');
            return;
        }
        
        setActiveCategory(category);
        setCurrentPage(1);
        updatePageInURL(1);
        
        if (category === "All Products") {
            setSelectedCategories([]);
            setNavigationState({
                shouldNavigate: true,
                url: '/category?page=1'
            });
        } else if (category === "Custom") {
            setNavigationState({
                shouldNavigate: true,
                url: '/custom-orders'
            });
        } else {
            const categoryObj = backendCategories.find(cat => cat.name === category);
            if (categoryObj) {
                const newSelection = selectedCategories.filter(item => 
                    !item.includes(`${categoryObj._id}-`)
                );
                setSelectedCategories([...newSelection, categoryObj._id]);
                
                setNavigationState({
                    shouldNavigate: true,
                    url: `/category?category=${encodeURIComponent(category)}&id=${categoryObj._id}&page=1`
                });
            }
        }
    };

    // Handle sidebar category change
    const handleSidebarCategoryChange = (categoryId, subCategoryId = null) => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        
        const key = subCategoryId ? `${categoryId}-${subCategoryId}` : categoryId;
        
        setSelectedCategories(prev => {
            let newSelection;
            
            if (subCategoryId) {
                if (prev.includes(key)) {
                    newSelection = prev.filter(i => i !== key);
                } else {
                    newSelection = [
                        ...prev.filter(i => i !== categoryId),
                        key
                    ];
                }
            } else {
                if (prev.includes(categoryId)) {
                    newSelection = prev.filter(i => 
                        i !== categoryId && !i.startsWith(`${categoryId}-`)
                    );
                } else {
                    newSelection = [
                        ...prev.filter(i => !i.startsWith(`${categoryId}-`)),
                        categoryId
                    ];
                }
            }
            
            const categoryObj = backendCategories.find(cat => cat._id === categoryId);
            if (categoryObj) {
                setActiveCategory(categoryObj.name);
                
                let url;
                const hasSubCategories = newSelection.some(item => 
                    item.startsWith(`${categoryId}-`)
                );
                const hasParentCategory = newSelection.includes(categoryId);
                
                if (hasSubCategories) {
                    const firstSubKey = newSelection.find(item => 
                        item.startsWith(`${categoryId}-`)
                    );
                    if (firstSubKey) {
                        const [, subId] = firstSubKey.split('-');
                        const subCategoryObj = allSubCategories.find(sub => sub._id === subId);
                        url = `/category?category=${encodeURIComponent(categoryObj.name)}&id=${categoryId}&subcategory=${encodeURIComponent(subCategoryObj?.name || '')}&subid=${subId}&page=1`;
                    } else {
                        url = `/category?category=${encodeURIComponent(categoryObj.name)}&id=${categoryId}&page=1`;
                    }
                } else if (hasParentCategory) {
                    url = `/category?category=${encodeURIComponent(categoryObj.name)}&id=${categoryId}&page=1`;
                } else {
                    url = '/category?page=1';
                }
                
                setNavigationState({
                    shouldNavigate: true,
                    url: url
                });
            }
            
            return newSelection;
        });
        
        setCurrentPage(1);
        updatePageInURL(1);
    };

    const handleFilterChange = (filterType, value) => {
        if (!isLoggedIn && activeCategory !== "All Products") {
            router.push('/login');
            return;
        }
        
        const filterKey = filterType.toLowerCase().replace(/\s+/g, '');

        setSelectedFilters(prev => ({
            ...prev,
            [filterKey]: prev[filterKey]?.includes(value)
                ? prev[filterKey].filter(item => item !== value)
                : [...(prev[filterKey] || []), value]
        }));
        
        setCurrentPage(1);
    };

    const handleSearchChange = (categoryId, value) => {
        setSearchTerms(prev => ({
            ...prev,
            [categoryId]: value
        }));
    };

    const handleSort = (sortType) => {
        setSelectedSort(sortType);
        setIsSortOpen(false);
        setCurrentPage(1);

        let sorted = [...filteredProducts];

        switch (sortType) {
            case "Name A-Z":
                sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            case "Name Z-A":
                sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
                break;
            case "Price Low to High":
                sorted.sort((a, b) => {
                    const priceA = parseInt((a.price || '0').toString().replace(/,/g, '')) || 0;
                    const priceB = parseInt((b.price || '0').toString().replace(/,/g, '')) || 0;
                    return priceA - priceB;
                });
                break;
            case "Price High to Low":
                sorted.sort((a, b) => {
                    const priceA = parseInt((a.price || '0').toString().replace(/,/g, '')) || 0;
                    const priceB = parseInt((b.price || '0').toString().replace(/,/g, '')) || 0;
                    return priceB - priceA;
                });
                break;
            case "Latest":
                sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
                break;
            case "Popularity":
                sorted.sort((a, b) => (a.moq || 0) - (b.moq || 0));
                break;
            default:
                break;
        }

        setSortedProducts(sorted);
    };

    const handleProductClick = (product) => {
        // Save product id so we can scroll back to it when user navigates back
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('lastViewedProductId', product.id);
        }
        router.push(`/product/${product.slug || product.id}`);
    };

    // Apply filters
    useEffect(() => {
        let filtered = [...products];

        // Category filter
        if (activeCategory !== "All Products" && activeCategory !== "Custom") {
            const categoryObj = backendCategories.find(cat => cat.name === activeCategory);
            if (categoryObj) {
                filtered = filtered.filter(product => 
                    product.category === categoryObj._id
                );
            }
        }

        // Sub-category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product => {
                return selectedCategories.some(catKey => {
                    if (catKey.includes('-')) {
                        const [catId, subCatId] = catKey.split('-');
                        return product.category === catId && product.subCategory === subCatId;
                    } else {
                        return product.category === catKey;
                    }
                });
            });
        }

        // Right sidebar filters
        if (selectedFilters["finish/style"] && selectedFilters["finish/style"].length > 0 && !selectedFilters["finish/style"].includes("All Finishes")) {
            filtered = filtered.filter(product =>
                selectedFilters["finish/style"].some(finish => {
                    if (finish === "All Finishes") return true;
                    return product.finish === finish;
                })
            );
        }

        if (selectedFilters["material"] && selectedFilters["material"].length > 0) {
            filtered = filtered.filter(product => {
                return selectedFilters["material"].some(material => {
                    return product.material === material || 
                           (product.materials && product.materials.includes(material));
                });
            });
        }

        if (selectedFilters["size"] && selectedFilters["size"].length > 0) {
            filtered = filtered.filter(product => {
                return selectedFilters["size"].some(size => {
                    return product.size === size || 
                           (product.sizes && product.sizes.includes(size)) ||
                           (product.dimensions && product.dimensions.includes(size));
                });
            });
        }

        if (selectedFilters["producttype"] && selectedFilters["producttype"].length > 0) {
            filtered = filtered.filter(product =>
                selectedFilters["producttype"].includes(product.productType)
            );
        }

        if (selectedFilters["businessservices"] && selectedFilters["businessservices"].length > 0) {
            filtered = filtered.filter(product => {
                if (!product.services || product.services.length === 0) return false;

                return selectedFilters["businessservices"].some(service => {
                    if (service === "Other") {
                        const mainServices = ["Custom Design", "Private Label", "Corporate Gifts"];
                        return product.services.some(s => !mainServices.includes(s));
                    }
                    return product.services.includes(service);
                });
            });
        }

        setFilteredProducts(filtered);

        // Re-apply sorting
        const sorted = applySorting(filtered, selectedSort);
        setSortedProducts(sorted);
    }, [products, activeCategory, selectedCategories, selectedFilters, selectedSort, backendCategories]);

    const applySorting = (productsToSort, sortType) => {
        if (!Array.isArray(productsToSort)) {
            return [];
        }
        
        let sorted = [...productsToSort];

        switch (sortType) {
            case "Name A-Z":
                sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            case "Name Z-A":
                sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
                break;
            case "Price Low to High":
                sorted.sort((a, b) => {
                    const priceA = parseInt((a.price || '0').toString().replace(/,/g, '')) || 0;
                    const priceB = parseInt((b.price || '0').toString().replace(/,/g, '')) || 0;
                    return priceA - priceB;
                });
                break;
            case "Price High to Low":
                sorted.sort((a, b) => {
                    const priceA = parseInt((a.price || '0').toString().replace(/,/g, '')) || 0;
                    const priceB = parseInt((b.price || '0').toString().replace(/,/g, '')) || 0;
                    return priceB - priceA;
                });
                break;
            case "Latest":
                sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
                break;
            case "Popularity":
                sorted.sort((a, b) => (a.moq || 0) - (b.moq || 0));
                break;
            default:
                break;
        }

        return sorted;
    };

    // Get filtered subcategories
    const getFilteredSubCategories = (categoryId) => {
        const searchTerm = searchTerms[categoryId]?.toLowerCase() || '';
        
        const categorySubCats = allSubCategories.filter(subCat => {
            if (subCat.category && subCat.category._id) {
                return subCat.category._id === categoryId;
            }
            return false;
        });
        
        return categorySubCats.filter(subCat => 
            subCat.name.toLowerCase().includes(searchTerm)
        );
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedFilters({
            "finish/style": [],
            "material": [],
            "size": [],
            "producttype": [],
            "businessservices": []
        });
        setSelectedCategories([]);
        setActiveCategory("All Products");
        setCurrentPage(1);
        updatePageInURL(1);
        
        const resetSearchTerms = {};
        backendCategories.forEach(cat => {
            resetSearchTerms[cat._id] = "";
        });
        setSearchTerms(resetSearchTerms);
        
        setNavigationState({
            shouldNavigate: true,
            url: '/category?page=1'
        });
    };

    // Get checked status for filters
    const isFilterChecked = (filterType, value) => {
        const filterKey = filterType.toLowerCase().replace(/\s+/g, '');
        return selectedFilters[filterKey]?.includes(value) || false;
    };

    // Get category names for top tabs
    const categoryTabs = ["All Products", ...backendCategories.map(cat => cat.name), "Custom"];

    // Calculate display text
    const getDisplayText = () => {
        if (isLoggedIn) {
            const startIndex = (currentPage - 1) * productsPerPage + 1;
            const endIndex = Math.min(currentPage * productsPerPage, sortedProducts.length);
            return `Showing ${startIndex}-${endIndex} of ${sortedProducts.length} products`;
        } else {
            const endIndex = Math.min(productsPerPage, sortedProducts.length);
            return `Showing 1-${endIndex} of ${sortedProducts.length} products`;
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans">
            {/* Login Prompt Modal */}
            {showLoginPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Login Required</h3>
                            <button 
                                onClick={() => setShowLoginPrompt(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="mb-4">
                            Please login to view more products and access all pages.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLoginPrompt(false)}
                                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowLoginPrompt(false);
                                    router.push('/login');
                                }}
                                className="flex-1 py-2 bg-[#C08237] text-white rounded-lg hover:bg-[#9C774A]"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header - NOT sticky, just normal flow */}
            <header className="bg-white">
                <div className="max-w-7xl mx-auto px-4 py-2 md:py-3 ">
                    <div className="text-center space-y-1 md:space-y-1">
                        {/* Decorative Line */}
                        {/* <div className="flex items-center justify-center gap-2 md:gap-3 ">
                            <div className="h-px w-8 md:w-10 bg-gradient-to-r from-transparent to-[#C08237]"></div>
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-[#C08237]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                            </svg>
                            <div className="h-px w-8 md:w-10 bg-gradient-to-l from-transparent to-[#C08237]"></div>
                        </div> */}
                        
                        {/* Main Heading - Smaller Size */}
                        <h1 className="text-xl md:text-3xl playfair font-bold text-gray-900 tracking-tight">
                            Explore Our Collection
                        </h1>
                        
                        {/* Subtitle */}
                        <p className="text-gray-600 text-xs md:text-sm mona max-w-2xl mx-auto">
                            Discover handcrafted treasures across our curated categories
                        </p>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-6 ">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                    {/* Left Sidebar - Hidden on mobile, shown on desktop */}
                    <aside className="hidden lg:block lg:w-64 shrink-0">
                        <div className="sticky top-[160px] md:top-[180px] space-y-4">
                            {/* Categories Section */}
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-gradient-to-r from-[#C08237] to-[#9C774A] px-4 py-3.5">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-wide">Categories</h3>
                                </div>
                                <div className="py-3 px-2 max-h-[400px] overflow-y-auto scrollbar-hide">
                                    <div className="space-y-3">
                                        {backendCategories.map(category => {
                                            const categorySubCats = getFilteredSubCategories(category._id);
                                            const isParentSelected = selectedCategories.includes(category._id);
                                            
                                            return (
                                                <div key={category._id}>
                                                    <button
                                                        onClick={() => toggleSection(category._id)}
                                                        className="flex justify-between items-center w-full p-2 hover:bg-gray-50 rounded"
                                                    >
                                                        <span className="font-medium text-sm mona text-gray-700">{category.name}</span>
                                                        <ChevronRight
                                                            className={`w-4 h-4 transition-transform ${expandedSections[category._id] ? 'rotate-90' : ''}`}
                                                        />
                                                    </button>

                                                    {expandedSections[category._id] && categorySubCats.length > 0 && (
                                                        <div className="pl-2 space-y-2 mt-2">
                                                            <div className="relative">
                                                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                                <input
                                                                    type="text"
                                                                    placeholder={`Search in ${category.name}`}
                                                                    value={searchTerms[category._id] || ''}
                                                                    onChange={(e) => handleSearchChange(category._id, e.target.value)}
                                                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none"
                                                                />
                                                            </div>

                                                            <div className="max-h-48 overflow-y-auto scrollbar-hide space-y-2 pr-2">
                                                                <label className="flex items-center gap-2 cursor-pointer mb-2 pb-2 border-b border-gray-100">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isParentSelected}
                                                                        onChange={() => handleSidebarCategoryChange(category._id)}
                                                                        className="w-4 h-4 text-[#C08237] border-gray-300 rounded focus:ring-[#C08237]"
                                                                    />
                                                                    <span className="text-sm font-medium text-gray-800">All {category.name}</span>
                                                                </label>
                                                                
                                                                {categorySubCats.map(subCat => {
                                                                    const isSelected = selectedCategories.includes(`${category._id}-${subCat._id}`);
                                                                    
                                                                    return (
                                                                        <label key={subCat._id} className="flex items-center gap-2 cursor-pointer pl-4">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={isSelected}
                                                                                onChange={() => handleSidebarCategoryChange(category._id, subCat._id)}
                                                                                className="w-4 h-4 text-[#C08237] border-gray-300 rounded focus:ring-[#C08237]"
                                                                            />
                                                                            <span className="text-sm text-gray-600 hover:text-gray-900">{subCat.name}</span>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {expandedSections[category._id] && categorySubCats.length === 0 && (
                                                        <div className="pl-2 space-y-2 mt-2">
                                                            <div className="relative">
                                                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                                <input
                                                                    type="text"
                                                                    placeholder={`Search in ${category.name}`}
                                                                    value={searchTerms[category._id] || ''}
                                                                    onChange={(e) => handleSearchChange(category._id, e.target.value)}
                                                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none"
                                                                />
                                                            </div>
                                                            <p className="text-sm text-gray-500 px-2 py-1">No subcategories found</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {/* Top Toolbar - Sticky below Explore Our Collection header */}
                        <div className="sticky top-[80px] md:top-[130px] z-40 bg-white py-4 -mx-4 px-4 mb-6  shadow-sm">
                            <div className="flex flex-col gap-4">
                                {/* Mobile: Categories Button + Sort + Clear Filter */}
                                <div className="flex lg:hidden items-center gap-2.5 w-full relative">
                                    <button
                                        onClick={() => setIsFilterOpen(true)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#C08237] to-[#9C774A] text-white px-4 py-3 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                        Categories & Filters
                                    </button>
                                    
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsSortOpen(!isSortOpen)}
                                            className="flex items-center justify-center bg-white border-2 border-gray-300 p-3 rounded-xl hover:border-[#C08237] transition-colors"
                                            title="Sort"
                                        >
                                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                            </svg>
                                        </button>

                                        {/* Sort Dropdown for Mobile */}
                                        {isSortOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-[60]">
                                                <div className="py-2">
                                                    {sortOptions.map((option) => (
                                                        <button
                                                            key={option}
                                                            onClick={() => handleSort(option)}
                                                            className={`flex justify-between hover:bg-[#C08237] hover:text-white items-center w-full px-4 py-2 text-left text-sm ${selectedSort === option ? 'text-white bg-[#C08237] font-medium' : 'text-gray-700'
                                                                }`}
                                                        >
                                                            <span>{option}</span>
                                                            {selectedSort === option && (
                                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Clear Filter Button - Only show if filters are active */}
                                    {(selectedCategories.length > 0 || Object.values(selectedFilters).some(arr => arr.length > 0)) && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="flex items-center justify-center bg-red-50 border-2 border-red-300 p-3 rounded-xl hover:bg-red-100 hover:border-red-400 transition-all"
                                            title="Clear all filters"
                                        >
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Desktop: Category Tabs + Sort/Filter */}
                                <div className="hidden lg:flex justify-between items-center gap-4">
                                    <div className="flex flex-wrap gap-2.5">
                                        {categoryTabs.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => handleCategoryChange(category)}
                                                className={`px-5 py-2.5 rounded-full text-sm mona font-medium transition-all shadow-sm ${activeCategory === category
                                                    ? 'bg-gradient-to-r from-[#C08237] to-[#9C774A] text-white shadow-md scale-105'
                                                    : 'bg-white border-2 border-gray-300 text-gray-900 hover:border-[#C08237] hover:shadow-md'
                                                    } ${category === "All Products" && !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                title={category === "All Products" && !isLoggedIn ? "Login to view All Products" : ""}
                                                disabled={category === "All Products" && !isLoggedIn}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex gap-3 relative">
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsSortOpen(!isSortOpen)}
                                                className="flex mona items-center gap-2 bg-white border-2 border-gray-300 text-sm hover:border-[#C08237] hover:shadow-md px-4 py-2.5 rounded-full font-medium transition-all"
                                            >
                                                Sort By <img src='/images/icons/arrow-3.svg' className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {isSortOpen && (
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                                    <div className="py-2">
                                                        {sortOptions.map((option) => (
                                                            <button
                                                                key={option}
                                                                onClick={() => handleSort(option)}
                                                                className={`flex justify-between hover:bg-[#C08237] hover:text-white items-center w-full px-4 py-2 text-left text-sm ${selectedSort === option ? 'text-[white] bg-[#C08237] font-medium' : 'text-gray-700'
                                                                    }`}
                                                            >
                                                                <span className="mona">{option}</span>
                                                                {selectedSort === option && (
                                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Filter Button for Desktop */}
                                        <button
                                            onClick={() => setIsFilterOpen(true)}
                                            className="flex mona items-center gap-2 bg-white border-2 border-gray-300 text-sm hover:border-[#C08237] hover:shadow-md px-4 py-2.5 rounded-full font-medium transition-all"
                                        >
                                            Filters <img src='/images/icons/setting-4.svg' className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Mobile: Horizontal Scrollable Category Tabs */}
                                <div className="lg:hidden overflow-x-auto -mx-4 px-4 scrollbar-thin scrollbar-thumb-[#C08237] scrollbar-track-gray-200">
                                    <div className="flex gap-2.5 min-w-max pb-2">
                                        {categoryTabs.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => handleCategoryChange(category)}
                                                className={`px-4 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeCategory === category
                                                    ? 'bg-gradient-to-r from-[#C08237] to-[#9C774A] text-white shadow-md scale-105'
                                                    : 'bg-white border-2 border-gray-300 text-gray-900 hover:border-[#C08237]'
                                                    } ${category === "All Products" && !isLoggedIn ? 'opacity-50' : ''}`}
                                                disabled={category === "All Products" && !isLoggedIn}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results Count */}
                        {/* <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div>
                                <p className="text-gray-700 font-medium">
                                    {getDisplayText()}
                                </p>
                                {!isLoggedIn && sortedProducts.length > productsPerPage && (
                                    <p className="text-sm text-gray-500 mt-1.5">
                                        <span className="text-amber-600 font-medium">
                                            Login to view all {sortedProducts.length} products and access all pages
                                        </span>
                                    </p>
                                )}
                            </div>
                            {(selectedCategories.length > 0 || Object.values(selectedFilters).some(arr => arr.length > 0)) && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-[#C08237] hover:text-[#9C774A] font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Clear all filters
                                </button>
                            )}
                        </div> */}

                        {/* Product Display */}
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-gray-600">Loading products...</div>
                            </div>
                        ) : !sortedProducts || !Array.isArray(sortedProducts) || sortedProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600">No products found. Try changing your filters.</p>
                            </div>
                        ) : activeCategory === "All Products" ? (
                            // Category-wise sections for "All Products" - Non-logged in users see only 3 products per category
                            <div className="space-y-12">
                                {backendCategories.map(category => {
                                    const categoryProducts = getCategoryProducts(category._id);
                                    const totalCategoryProducts = sortedProducts.filter(p => p.category === category._id).length;
                                    
                                    if (categoryProducts.length === 0) return null;
                                    
                                    return (
                                        <div key={category._id} className="category-section">
                                            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-8 bg-gradient-to-b from-[#C08237] to-[#9C774A] rounded-full"></div>
                                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 playfair">{category.name}</h2>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                                                        {isLoggedIn 
                                                            ? `${totalCategoryProducts} products` 
                                                            : `${categoryProducts.length} of ${totalCategoryProducts}`
                                                        }
                                                    </span>
                                                    <button
                                                        onClick={() => handleCategoryChange(category.name)}
                                                        className="text-sm text-[#C08237] hover:text-[#9C774A] font-semibold flex items-center gap-1 transition-colors"
                                                    >
                                                        View All 
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Products Grid - 2 columns mobile, 4 columns desktop */}
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
                                                {categoryProducts.map(product => (
                                                    <a
                                                        key={product.id}
                                                        id={`product-${product.id}`}
                                                        href={`/product/${product.slug || product.id}`}
                                                        className="cursor-pointer w-full max-w-[480px] relative group flex flex-col h-full no-underline"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleProductClick(product);
                                                        }}
                                                    >
                                                        <div className="relative w-full h-[280px] sm:h-[330px] bg-gray-100 overflow-hidden rounded-2xl">
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                <img
                                                                    src={product.img}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                                                    onError={(e) => {
                                                                        if (product.thumbnail && product.thumbnail !== product.img) {
                                                                            e.target.src = product.thumbnail;
                                                                        } else if (product.images && product.images.length > 0) {
                                                                            e.target.src = product.images[0];
                                                                        } else {
                                                                            e.target.src = '/images/placeholder.png';
                                                                        }
                                                                    }}
                                                                />
                                                            </div>

                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleWishlist(product.id);
                                                                }}
                                                                className="absolute top-3 right-3 z-10 p-2.5 bg-[#FFFFFF90] backdrop-blur-sm rounded-full 
                                                                           shadow-lg hover:bg-white active:scale-95 
                                                                           transition-all duration-200 flex items-center justify-center"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className={`h-5 w-5 transition-colors duration-200 ${isInWishlist(product.id)
                                                                        ? "fill-red-500 text-red-500"
                                                                        : "text-gray-800 fill-transparent hover:text-red-400"
                                                                        }`}
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={isInWishlist(product.id) ? 0 : 2}
                                                                >
                                                                    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                                                                </svg>
                                                            </button>
                                                        </div>

                                                        {/* Content Section - Flexible Height */}
                                                        <div className="mt-3 flex flex-col flex-grow">
                                                            {/* Product Info - Fixed Height */}
                                                            <div className="flex-shrink-0">
                                                                <h3 className="mona font-semibold text-sm text-black line-clamp-2 min-h-[2.5rem]">
                                                                    {product.name}
                                                                </h3>
                                                                {product.code && (
                                                                    <p className="mona text-gray-600 font-mono text-xs mt-1">
                                                                        Code: <b>{product.code}</b>
                                                                    </p>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Add to Inquiry Section - Push to Bottom */}
                                                            <div className="space-y-2 mt-auto">
                                                                {/* Quantity Selector */}
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs hidden sm:flex text-gray-600">Quantity:</span>
                                                                    <div className="flex items-center mx-auto sm:mx-0 border border-gray-300 rounded-md">
                                                                        <button 
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                const input = e.target.parentElement.querySelector('input');
                                                                                const currentValue = parseInt(input.value) || 1;
                                                                                if (currentValue > 6) {
                                                                                    input.value = currentValue - 6;
                                                                                } else {
                                                                                    input.value = 1;
                                                                                }
                                                                            }}
                                                                            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-l-md"
                                                                        >
                                                                            -
                                                                        </button>
                                                                        <input 
                                                                            type="number" 
                                                                            min="1" 
                                                                            step="6"
                                                                            defaultValue="1"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            className="w-12 px-1 py-1 text-xs text-center border-x border-gray-300 focus:outline-none"
                                                                        />
                                                                        <button 
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                const input = e.target.parentElement.querySelector('input');
                                                                                const currentValue = parseInt(input.value) || 1;
                                                                                if (currentValue === 1) {
                                                                                    input.value = 6;
                                                                                } else {
                                                                                    input.value = currentValue + 6;
                                                                                }
                                                                            }}
                                                                            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-r-md"
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Add to Inquiry Button */}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (!isLoggedIn) {
                                                                            router.push('/login');
                                                                            return;
                                                                        }
                                                                        
                                                                        const quantityInput = e.target.parentElement.parentElement.querySelector('input[type="number"]');
                                                                        const quantity = parseInt(quantityInput?.value) || 1;
                                                                        
                                                                        addToCart(product, ['3'], quantity);
                                                                        
                                                                        showNotification('Product added to inquiry cart!', 'cart');
                                                                    }}
                                                                    className="w-full py-2 bg-[#C08237] text-white text-xs font-medium rounded-md hover:bg-[#9C774A] transition-colors flex items-center justify-center gap-1"
                                                                >
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                                    </svg>
                                                                    Add to Inquiry
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                            
                                            {/* Login prompt for non-logged in users if there are more than 12 products */}
                                            {!isLoggedIn && totalCategoryProducts > 12 && (
                                                <div className="mt-8 text-center bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border-2 border-amber-200">
                                                    <p className="text-gray-700 mb-3 font-medium">Want to see all products?</p>
                                                    <button
                                                        onClick={() => router.push('/login')}
                                                        className="bg-gradient-to-r from-[#C08237] to-[#9C774A] text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all inline-flex items-center gap-2"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                        </svg>
                                                        Login to view all {totalCategoryProducts} products
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                
                                {/* Show message if no products found in any category */}
                                {backendCategories.every(category => 
                                    sortedProducts.filter(product => product.category === category._id).length === 0
                                ) && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-600">No products found in any category.</p>
                                        {!isLoggedIn && (
                                            <button
                                                onClick={() => router.push('/login')}
                                                className="mt-4 bg-[#C08237] text-white px-6 py-2 rounded-lg hover:bg-[#9C774A]"
                                            >
                                                Login to View Products
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Regular grid for specific categories
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7">
                                    {currentProducts.map(product => (
                                        <a
                                            key={product.id}
                                            id={`product-${product.id}`}
                                            href={`/product/${product.slug || product.id}`}
                                            className="cursor-pointer w-full max-w-[480px] relative group flex flex-col h-full no-underline"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleProductClick(product);
                                            }}
                                        >
                                            <div className="relative w-full h-[280px] sm:h-[330px] bg-gray-100 overflow-hidden rounded-2xl">
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                    <img
                                                        src={product.img}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                                        onError={(e) => {
                                                            if (product.thumbnail && product.thumbnail !== product.img) {
                                                                e.target.src = product.thumbnail;
                                                            } else if (product.images && product.images.length > 0) {
                                                                e.target.src = product.images[0];
                                                            } else {
                                                                e.target.src = '/images/placeholder.png';
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleWishlist(product.id);
                                                    }}
                                                    className="absolute top-3 right-3 z-10 p-2.5 bg-[#FFFFFF90] backdrop-blur-sm rounded-full 
                                                               shadow-lg hover:bg-white active:scale-95 
                                                               transition-all duration-200 flex items-center justify-center"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className={`h-5 w-5 transition-colors duration-200 ${isInWishlist(product.id)
                                                            ? "fill-red-500 text-red-500"
                                                            : "text-gray-800 fill-transparent hover:text-red-400"
                                                            }`}
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={isInWishlist(product.id) ? 0 : 2}
                                                    >
                                                        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Content Section - Flexible Height */}
                                            <div className="mt-3 flex flex-col flex-grow">
                                                {/* Product Info - Fixed Height */}
                                                <div className="flex-shrink-0">
                                                    <h3 className="mona font-semibold text-sm text-black line-clamp-2 min-h-[2.5rem]">
                                                        {product.name}
                                                    </h3>
                                                    {product.code && (
                                                        <p className="mona text-gray-600 font-mono text-xs mt-1">
                                                            Code: <b>{product.code}</b>
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                {/* Add to Inquiry Section - Push to Bottom */}
                                                <div className="space-y-2 mt-auto">
                                                    {/* Quantity Selector */}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs hidden sm:flex text-gray-600">Quantity:</span>
                                                        <div className="flex items-center mx-auto sm:mx-0 border border-gray-300 rounded-md">
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const input = e.target.parentElement.querySelector('input');
                                                                    const currentValue = parseInt(input.value) || 1;
                                                                    if (currentValue > 6) {
                                                                        input.value = currentValue - 6;
                                                                    } else {
                                                                        input.value = 1;
                                                                    }
                                                                }}
                                                                className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-l-md"
                                                            >
                                                                -
                                                            </button>
                                                            <input 
                                                                type="number" 
                                                                min="1" 
                                                                step="6"
                                                                defaultValue="1"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="w-12 px-1 py-1 text-xs text-center border-x border-gray-300 focus:outline-none"
                                                            />
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const input = e.target.parentElement.querySelector('input');
                                                                    const currentValue = parseInt(input.value) || 1;
                                                                    if (currentValue === 1) {
                                                                        input.value = 6;
                                                                    } else {
                                                                        input.value = currentValue + 6;
                                                                    }
                                                                }}
                                                                className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-r-md"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Add to Inquiry Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!isLoggedIn) {
                                                                router.push('/login');
                                                                return;
                                                            }
                                                            
                                                            const quantityInput = e.target.parentElement.parentElement.querySelector('input[type="number"]');
                                                            const quantity = parseInt(quantityInput?.value) || 1;
                                                            
                                                            addToCart(product, ['3'], quantity);
                                                            
                                                            showNotification('Product added to inquiry cart!', 'cart');
                                                        }}
                                                        className="w-full py-2 bg-[#C08237] text-white text-xs font-medium rounded-md hover:bg-[#9C774A] transition-colors flex items-center justify-center gap-1"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        Add to Inquiry
                                                    </button>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>

                                {/* Pagination - Show only for specific categories */}
                                {activeCategory !== "All Products" && sortedProducts.length > productsPerPage && (
                                    <div className="mt-12 pt-8 border-t-2 border-gray-200">
                                        <div className="flex flex-col items-center">
                                            {!isLoggedIn && (
                                                <div className="mb-6 text-center bg-amber-50 px-6 py-4 rounded-xl border border-amber-200">
                                                    <p className="text-sm text-gray-700">
                                                        Page <span className="font-bold text-[#C08237]">{currentPage}</span> of <span className="font-bold text-[#C08237]">{totalPages}</span>
                                                        <span className="ml-2 text-amber-700">
                                                            • <button 
                                                                onClick={() => router.push('/login')}
                                                                className="text-[#C08237] font-semibold hover:underline"
                                                            >
                                                                Login
                                                            </button> to view all pages
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                            
                                            <div className="flex flex-wrap justify-center gap-2.5">
                                                {renderPagination()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>

            {/* Filter Sidebar */}
            <div className={`fixed inset-0 z-50 transition-all duration-300 ${isFilterOpen ? 'visible' : 'invisible'}`}>
                <div
                    className={`absolute inset-0 bg-black transition-opacity duration-300 ${isFilterOpen ? 'opacity-50' : 'opacity-0'}`}
                    onClick={() => setIsFilterOpen(false)}
                />

                <div className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 bg-gradient-to-r from-[#FDFBF7] to-white">
                            <h2 className="text-xl mona font-bold text-gray-900">
                                <span className="lg:hidden">Categories & Filters</span>
                                <span className="hidden lg:inline">Filters</span>
                            </h2>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
                            {/* Categories Section - Only show on mobile */}
                            <div className="lg:hidden pb-6 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Categories</h3>
                                <div className="space-y-3">
                                    {backendCategories.map(category => {
                                        const categorySubCats = getFilteredSubCategories(category._id);
                                        const isParentSelected = selectedCategories.includes(category._id);
                                        
                                        return (
                                            <div key={category._id}>
                                                <button
                                                    onClick={() => toggleSection(category._id)}
                                                    className="flex justify-between items-center w-full p-2 hover:bg-gray-50 rounded"
                                                >
                                                    <span className="font-medium text-sm text-gray-700">{category.name}</span>
                                                    <ChevronRight
                                                        className={`w-4 h-4 transition-transform ${expandedSections[category._id] ? 'rotate-90' : ''}`}
                                                    />
                                                </button>

                                                {expandedSections[category._id] && categorySubCats.length > 0 && (
                                                    <div className="pl-2 space-y-2 mt-2">
                                                        <div className="relative mb-3">
                                                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                placeholder={`Search in ${category.name}`}
                                                                value={searchTerms[category._id] || ''}
                                                                onChange={(e) => handleSearchChange(category._id, e.target.value)}
                                                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none"
                                                            />
                                                        </div>

                                                        <div className="max-h-48 overflow-y-auto scrollbar-hide space-y-2 pr-2">
                                                            <label className="flex items-center gap-2 cursor-pointer mb-2 pb-2 border-b border-gray-100">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isParentSelected}
                                                                    onChange={() => handleSidebarCategoryChange(category._id)}
                                                                    className="w-4 h-4 text-[#C08237] border-gray-300 rounded focus:ring-[#C08237]"
                                                                />
                                                                <span className="text-sm font-medium text-gray-800">All {category.name}</span>
                                                            </label>
                                                            
                                                            {categorySubCats.map(subCat => {
                                                                const isSelected = selectedCategories.includes(`${category._id}-${subCat._id}`);
                                                                
                                                                return (
                                                                    <label key={subCat._id} className="flex items-center gap-2 cursor-pointer pl-4">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isSelected}
                                                                            onChange={() => handleSidebarCategoryChange(category._id, subCat._id)}
                                                                            className="w-4 h-4 text-[#C08237] border-gray-300 rounded focus:ring-[#C08237]"
                                                                        />
                                                                        <span className="text-sm text-gray-600 hover:text-gray-900">{subCat.name}</span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Filters Section */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Filters</h3>
                                {Object.entries(filters).map(([title, options]) => (
                                    <div key={title} className="mb-6">
                                        <button
                                            onClick={() => toggleSection(title)}
                                            className="flex justify-between items-center w-full mb-3"
                                        >
                                            <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
                                            <ChevronRight
                                                className={`w-4 h-4 transition-transform ${expandedSections[title] ? 'rotate-90' : ''}`}
                                            />
                                        </button>

                                        {expandedSections[title] && (
                                            <div className="space-y-2 pl-2">
                                                {options.map(option => (
                                                    <label key={option} className="flex items-center gap-2 cursor-pointer py-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={isFilterChecked(title, option)}
                                                            onChange={() => handleFilterChange(title, option)}
                                                            className="w-4 h-4 text-[#C08237] border-gray-300 rounded focus:ring-[#C08237]"
                                                        />
                                                        <span className="text-sm text-gray-600 hover:text-gray-900">{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t-2 border-gray-200 bg-gradient-to-r from-[#FDFBF7] to-white flex gap-3">
                            <button
                                onClick={clearAllFilters}
                                className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="flex-1 py-3 bg-gradient-to-r from-[#C08237] to-[#9C774A] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Close dropdown when clicking outside */}
            {isSortOpen && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsSortOpen(false)}
                />
            )}

            {/* Notification Toast */}
            <NotificationToast
                message={notification.message}
                type={notification.type}
                isVisible={notification.isVisible}
                onClose={hideNotification}
            />
        </div>
    );
};

export default CategoryPage;
