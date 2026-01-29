"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/wishlistStore';
import { useInquiryCartStore } from '@/store/inquiryCartStore';
import NotificationToast, { useNotification } from '../components/NotificationToast';

// Filter options
const filters = {
    "Finish / Style": ["All Finishes", "Natural", "Hand Painted", "Antique", "Metallic", "Matte"],
    "Material": ["Plastic", "Wooden", "Resin", "Thandi Lac", "Marble", "Metal", "Ceramic", "Glass", "Stone"],
    "Size": ["3 inch", "6 inch", "9 inch", "12 inch", "15 inch", "18 inch", "24 inch", "36 inch"],
    "Product Type": ["Ready Stock", "Made to Order"],
    "Business Services": ["Custom Design", "Private Label", "Corporate Gifts", "Other"]
};

// Sort options
const sortOptions = ["Recommended", "Latest", "Popularity", "Name A-Z", "Name Z-A", "Price Low to High", "Price High to Low"];

const PRODUCTS_PER_PAGE = 12;

const UtilityDecorPage = () => {
    const router = useRouter();
    const { wishlist, toggleWishlist, isInWishlist, initialize } = useWishlistStore();
    const { addToCart } = useInquiryCartStore();
    const { notification, showNotification, hideNotification } = useNotification();
    
    const [activeProductType, setActiveProductType] = useState("All Products");
    const [selectedDecor, setSelectedDecor] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState("Recommended");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    
    // Login state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    
    // Filter sidebar states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        "finish/style": [],
        "material": [],
        "size": [],
        "producttype": [],
        "businessservices": []
    });
    const [expandedSections, setExpandedSections] = useState({
        "Finish / Style": true,
        "Material": true,
        "Size": true,
        "Product Type": true,
        "Business Services": true
    });

    // Dynamic data states
    const [decorProducts, setDecorProducts] = useState([]);
    const [decorCategories, setDecorCategories] = useState([]);
    const [productTypes, setProductTypes] = useState(["All Products"]);
    const [loading, setLoading] = useState(true);
    const [decorSubCategories, setDecorSubCategories] = useState([]);

    // Check login status with multiple sources
    const checkLoginStatus = () => {
        let loggedIn = false;
        
        // 1. Check for cookies
        if (typeof document !== 'undefined') {
            const cookies = document.cookie.split('; ');
            const tokenCookie = cookies.find(row => row.trim().startsWith('token='));
            const isLoggedInCookie = cookies.find(row => row.trim().startsWith('isLoggedIn='));
            
            if (tokenCookie || isLoggedInCookie) {
                loggedIn = true;
            }
        }
        
        // 2. Check localStorage as backup
        if (typeof window !== 'undefined') {
            const localStorageToken = localStorage.getItem('token');
            const localStorageIsLoggedIn = localStorage.getItem('isLoggedIn');
            
            if (localStorageToken || localStorageIsLoggedIn === 'true') {
                loggedIn = true;
            }
        }
        
        console.log('🔐 Utility-Decor Page - Login status check:', loggedIn);
        setIsLoggedIn(loggedIn);
        return loggedIn;
    };

    // Initialize wishlist and check login
    useEffect(() => {
        if (typeof window !== 'undefined') {
            initialize();
            checkLoginStatus();
        }
    }, [initialize]);

    // Log wishlist changes
    useEffect(() => {
        console.log('🔍 Utility-Decor Page - Wishlist changed:', wishlist);
    }, [wishlist]);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Fetching utility-decor page data...');
                
                // 1. Fetch all categories to find Utility-Decor category
                const categoriesResponse = await fetch('/api/categories');
                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json();
                    console.log('Categories data:', categoriesData);
                    
                    if (categoriesData.success && categoriesData.data) {
                        // Find Utility-Decor category (case-insensitive search)
                        const decorCategory = categoriesData.data.find(cat => 
                            cat.name && (cat.name.toLowerCase().includes("utility") || cat.name.toLowerCase().includes("decor"))
                        );
                        
                        console.log('Found utility-decor category:', decorCategory);
                        
                        if (decorCategory) {
                            // 2. Fetch all subcategories
                            const subCatResponse = await fetch('/api/subcategories');
                            if (subCatResponse.ok) {
                                const subCatData = await subCatResponse.json();
                                console.log('All subcategories:', subCatData);
                                
                                if (subCatData.success && subCatData.data) {
                                    // Filter subcategories for this category
                                    const categorySubCats = subCatData.data.filter(subCat => 
                                        subCat.category && subCat.category._id === decorCategory._id
                                    );
                                    
                                    // Extract unique subcategory names
                                    const subCatNames = [...new Set(categorySubCats.map(s => s.name).filter(Boolean))];
                                    setDecorCategories(subCatNames);
                                    setDecorSubCategories(categorySubCats);
                                    console.log('Utility-Decor subcategories:', subCatNames);
                                }
                            }
                        }
                    }
                }

                // 3. Fetch products
                const productsResponse = await fetch('/api/products');
                if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    console.log('Products data:', productsData);
                    
                    if (productsData.success && productsData.data) {
                        // Filter only utility-decor products
                        const decorProductsData = productsData.data.filter(product => {
                            // Check if product belongs to Utility-Decor category
                            if (product.category) {
                                const categoryName = typeof product.category === 'string' 
                                    ? product.category 
                                    : (product.category.name || "");
                                
                                return categoryName.toLowerCase().includes("utility") || categoryName.toLowerCase().includes("decor");
                            }
                            return false;
                        });
                        
                        console.log('Utility-Decor products found:', decorProductsData.length);
                        
                        // Transform products to match frontend structure
                        const transformedProducts = decorProductsData.map(product => ({
                            id: product._id,
                            name: product.name || "Unnamed Product",
                            code: product.code || "",
                            price: product.price?.toString() || "0",
                            moq: product.minimumOrderQuantity || product.moq || 0,
                            img: product.images?.[0],
                            category: product.subCategory?.name || "",
                            subCategoryId: product.subCategory?._id || "",
                            finish: product.finish || "Natural",
                            material: product.material || "Plastic",
                            size: product.size || "6 inch",
                            productType: product.productType || "Ready Stock",
                            services: product.services || [],
                            createdAt: product.createdAt || new Date().toISOString()
                        }));
                        
                        console.log('Transformed products:', transformedProducts);
                        
                        setDecorProducts(transformedProducts);
                        setFilteredProducts(transformedProducts);
                        setSortedProducts(transformedProducts);
                        
                        // Extract unique product types
                        const types = [...new Set(transformedProducts.map(p => p.productType).filter(Boolean))];
                        setProductTypes(["All Products", ...types]);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter decorations based on search
    const filteredDecorations = decorCategories.filter(decor =>
        decor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle decoration selection
    const handleDecorSelect = (decor) => {
        // Check if user is logged in before allowing decoration selection
        if (!isLoggedIn) {
            setShowLoginPrompt(true);
            return;
        }
        
        setSelectedDecor(prev =>
            prev.includes(decor)
                ? prev.filter(d => d !== decor)
                : [...prev, decor]
        );
    };

    // Handle product click
    const handleProductClick = (product) => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        router.push(`/product/${product.id}`);
    };

    // Fixed filter change handler
    const handleFilterChange = (filterType, value) => {
        // Check if user is logged in when applying filters
        if (!isLoggedIn) {
            setShowLoginPrompt(true);
            return;
        }
        
        const filterKey = filterType.toLowerCase().replace(/\s+/g, '');
        
        setSelectedFilters(prev => ({
            ...prev,
            [filterKey]: prev[filterKey]?.includes(value)
                ? prev[filterKey].filter(item => item !== value)
                : [...(prev[filterKey] || []), value]
        }));
    };

    // Toggle filter sections
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Get checked status for filters
    const isFilterChecked = (filterType, value) => {
        const filterKey = filterType.toLowerCase().replace(/\s+/g, '');
        return selectedFilters[filterKey]?.includes(value) || false;
    };

    // Apply filters
    useEffect(() => {
        let filtered = [...decorProducts];
        
        console.log('Applying filters...');
        console.log('Selected decorations:', selectedDecor);
        console.log('Total decor products:', filtered.length);

        // Filter by selected decorations (subcategories)
        if (selectedDecor.length > 0) {
            filtered = filtered.filter(product =>
                selectedDecor.includes(product.category)
            );
            console.log('Filtered by decoration:', filtered.length);
        }

        // Filter by product type
        if (activeProductType !== "All Products") {
            filtered = filtered.filter(product =>
                product.productType === activeProductType
            );
            console.log('Filtered by product type:', filtered.length);
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
                    return product.material === material;
                });
            });
        }

        if (selectedFilters["size"] && selectedFilters["size"].length > 0) {
            filtered = filtered.filter(product => {
                return selectedFilters["size"].some(size => {
                    return product.size === size;
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
        setSortedProducts(applySorting(filtered, selectedSort));
    }, [decorProducts, selectedDecor, activeProductType, selectedFilters, selectedSort]);

    // Handle pagination based on login status
    useEffect(() => {
        if (!isLoggedIn) {
            // Show only first page for non-logged-in users
            setDisplayedProducts(sortedProducts.slice(0, PRODUCTS_PER_PAGE));
        } else {
            // Show based on current page for logged-in users
            const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
            const endIdx = startIdx + PRODUCTS_PER_PAGE;
            setDisplayedProducts(sortedProducts.slice(startIdx, endIdx));
        }
    }, [sortedProducts, currentPage, isLoggedIn]);

    // Apply sorting
    const applySorting = (productsToSort, sortType) => {
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
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "Popularity":
                sorted.sort((a, b) => (a.moq || 0) - (b.moq || 0));
                break;
            default:
                break;
        }

        return sorted;
    };

    // Handle sort selection
    const handleSort = (sortType) => {
        setSelectedSort(sortType);
        setIsSortOpen(false);
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
        setSelectedDecor([]);
        setActiveProductType("All Products");
        setSearchTerm("");
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
                            Please login to access utility/decor categories and apply filters.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLoginPrompt(false)}
                                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => router.push('/login')}
                                className="flex-1 py-2 bg-[#C08237] text-white rounded-lg hover:bg-[#9C774A]"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="bg-white py-2">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl playfair font-bold text-center text-gray-800 mb-2">Utility / Decor</h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar - Categories */}
                    <aside className="w-full lg:w-60 flex-shrink-0">
                        <div className="sticky top-8">
                            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                                {/* Category Header */}
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-lg mona font-semibold text-gray-800">Decor Categories</h2>
                                </div>

                                {/* Search Bar */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search decorations"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Categories List */}
                                <div className="p-4">
                                    <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2">
                                        {loading ? (
                                            <div className="text-center py-4">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C08237] mx-auto"></div>
                                                <p className="mt-2 text-sm text-gray-600">Loading decorations...</p>
                                            </div>
                                        ) : filteredDecorations.length > 0 ? (
                                            <>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    Found {filteredDecorations.length} decor types
                                                </p>
                                                {filteredDecorations.map(decor => (
                                                    <label key={decor} className="flex items-center gap-2 cursor-pointer py-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedDecor.includes(decor)}
                                                            onChange={() => handleDecorSelect(decor)}
                                                            className="w-4 h-4 text-[#C08237] border-gray-300 rounded focus:ring-[#C08237]"
                                                            disabled={!isLoggedIn}
                                                        />
                                                        <span className={`text-sm ${!isLoggedIn ? 'text-gray-400' : 'text-gray-600 hover:text-gray-900'}`}>
                                                            {decor}
                                                        </span>
                                                    </label>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-sm text-gray-500">No decoration categories found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Top Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            {/* Product Type Tabs */}
                            <div className="flex flex-wrap gap-2">
                                {productTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setActiveProductType(type)}
                                        className={`px-4 py-2 rounded-full text-[12px] mona font-medium transition-colors ${activeProductType === type
                                                ? 'bg-[#C08237] text-white'
                                                : 'bg-white border border-gray-400 text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Sort and Filter Buttons */}
                            <div className="flex gap-3 relative">
                                {/* Sort By */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        className="flex items-center gap-2 bg-white border border-gray-400 text-sm hover:bg-gray-50 px-3 py-2 rounded-full text-[12px] mona font-medium transition-colors"
                                    >
                                        Sort By <img src='/images/icons/arrow-3.svg' className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Sort Dropdown */}
                                    {isSortOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                            <div className="py-2">
                                                {sortOptions.map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => handleSort(option)}
                                                        className={`flex justify-between items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-sm ${selectedSort === option ? 'text-[#C08237] font-medium' : 'text-gray-700'
                                                            }`}
                                                    >
                                                        <span className="mona">{option}</span>
                                                        {selectedSort === option && (
                                                            <svg className="w-4 h-4 text-[#C08237]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                            </svg>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Filters Button */}
                                <button
                                    onClick={() => setIsFilterOpen(true)}
                                    className="flex items-center gap-2 bg-white border border-gray-400 text-sm hover:bg-gray-50 px-3 py-2 rounded-full text-[12px] mona font-medium transition-colors"
                                >
                                    Filters <img src='/images/icons/setting-4.svg' className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Results Count and Clear Filters */}
                        <div className="mb-6 flex justify-between items-center">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold">{displayedProducts.length}</span> of <span className="font-semibold">{sortedProducts.length}</span> products
                                {!isLoggedIn && <span className="text-xs text-orange-600 ml-2">(Limited view - Login to see all)</span>}
                            </p>
                            {(selectedDecor.length > 0 || Object.values(selectedFilters).some(arr => arr.length > 0)) && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-[#C08237] hover:text-[#9C774A] font-medium"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C08237] mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Loading decor products...</p>
                                </div>
                            </div>
                        ) : displayedProducts.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 text-lg mb-2">No decor products found</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="mt-6 px-4 py-2 bg-[#C08237] text-white rounded-lg hover:bg-[#9C774A] transition"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Products */}
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {displayedProducts.map(product => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            showInquiryButton={true}
                                            showWishlistButton={true}
                                            className={!isLoggedIn ? 'opacity-75' : ''}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {sortedProducts.length > PRODUCTS_PER_PAGE && (
                                    <div className="mt-12">
                                        <div className="flex flex-col items-center">
                                            {/* Non-logged-in users message */}
                                            {!isLoggedIn && (
                                                <div className="mb-4 text-center">
                                                    <p className="text-sm text-gray-600">
                                                        Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE)}</span>
                                                        <span className="ml-2 text-yellow-600">
                                                            • <button 
                                                                onClick={() => router.push('/login')}
                                                                className="text-[#C08237] font-medium hover:underline"
                                                            >
                                                                Login
                                                            </button> to view all pages
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {/* Pagination for logged-in users */}
                                            {isLoggedIn && (
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    <button
                                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                        disabled={currentPage === 1}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                                    >
                                                        ← Previous
                                                    </button>
                                                    
                                                    {Array.from({ length: Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE) }).map((_, i) => (
                                                        <button
                                                            key={i + 1}
                                                            onClick={() => setCurrentPage(i + 1)}
                                                            className={`px-3 py-2 rounded-lg transition ${
                                                                currentPage === i + 1
                                                                    ? 'bg-[#C08237] text-white'
                                                                    : 'border border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    ))}
                                                    
                                                    <button
                                                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE), p + 1))}
                                                        disabled={currentPage === Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE)}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                                    >
                                                        Next →
                                                    </button>
                                                </div>
                                            )}
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
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black transition-opacity duration-300 ${isFilterOpen ? 'opacity-50' : 'opacity-0'}`}
                    onClick={() => setIsFilterOpen(false)}
                />

                {/* Filter Panel */}
                <div className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl mona font-bold text-gray-800">Filters</h2>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <img src="/images/icons/close-circle.svg" className="w-7 h-7" alt="Close" />
                            </button>
                        </div>

                        {/* Filter Options */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {Object.entries(filters).map(([title, options]) => (
                                <div key={title}>
                                    <button
                                        onClick={() => toggleSection(title)}
                                        className="flex justify-between items-center w-full mb-4"
                                    >
                                        <h3 className="text-sm mona font-semibold text-gray-800">{title}</h3>
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
                                                        disabled={!isLoggedIn}
                                                    />
                                                    <span className={`text-sm ${!isLoggedIn ? 'text-gray-400' : 'text-gray-600 hover:text-gray-900'}`}>
                                                        {option}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer Buttons */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                            <button
                                onClick={clearAllFilters}
                                className="flex-1 py-3 bg-white border border-gray-400 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="flex-1 py-3 bg-[#C08237] text-white font-medium rounded-lg hover:bg-[#9C774A] transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sort dropdown backdrop */}
            {isSortOpen && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsSortOpen(false)}
                />
            )}
        </div>
    );
};

export default UtilityDecorPage;
