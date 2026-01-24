"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/wishlistStore';
import Cookies from 'js-cookie';

// Filter options
const filters = {
    "Finish / Style": ["All Finishes", "Natural", "Hand Painted", "Antique", "Metallic", "Matte"],
    "Minimum Order Quantity": ["50-100 pcs", "100-500 pcs", "500-3000 pcs", "1000+ pcs"],
    "Product Type": ["Ready Stock", "Made to Order"],
    "Business Services": ["Custom Design", "Private Label", "Corporate Gifts", "Other"]
};

// Sort options
const sortOptions = ["Recommended", "Latest", "Popularity", "Name A-Z", "Name Z-A", "Price Low to High", "Price High to Low"];

const PRODUCTS_PER_PAGE = 12;

const GodFigurePage = () => {
    const router = useRouter();
    const { wishlist, toggleWishlist, isInWishlist, initialize } = useWishlistStore();
    
    const [activeProductType, setActiveProductType] = useState("All Products");
    const [selectedGodFigure, setSelectedGodFigure] = useState([]);
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
        "minimumorderquantity": [],
        "producttype": [],
        "businessservices": []
    });
    const [expandedSections, setExpandedSections] = useState({
        "Finish / Style": true,
        "Minimum Order Quantity": true,
        "Product Type": true,
        "Business Services": true
    });

    // Dynamic data states
    const [godFigureProducts, setGodFigureProducts] = useState([]);
    const [godFigureCategories, setGodFigureCategories] = useState([]);
    const [productTypes, setProductTypes] = useState(["All Products"]);
    const [loading, setLoading] = useState(true);
    const [godFigureSubCategories, setGodFigureSubCategories] = useState([]);

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
        
        console.log('🔐 God Figure Page - Login status check:', loggedIn);
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
        console.log('🔍 God Figure Page - Wishlist changed:', wishlist);
    }, [wishlist]);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Fetching God Figure page data...');
                
                // 1. Fetch all categories to find God Figure category
                const categoriesResponse = await fetch('/api/categories');
                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json();
                    console.log('Categories data:', categoriesData);
                    
                    if (categoriesData.success && categoriesData.data) {
                        // Find God Figure category (search for variations)
                        const godFigureCategory = categoriesData.data.find(cat => {
                            const name = cat.name?.toLowerCase() || '';
                            return name.includes('god') || 
                                   name.includes('figure') || 
                                   name.includes('deity') ||
                                   name.includes('religious');
                        });
                        
                        console.log('Found God Figure category:', godFigureCategory);
                        
                        if (godFigureCategory) {
                            // 2. Fetch all subcategories
                            const subCatResponse = await fetch('/api/subcategories');
                            if (subCatResponse.ok) {
                                const subCatData = await subCatResponse.json();
                                console.log('All subcategories:', subCatData);
                                
                                if (subCatData.success && subCatData.data) {
                                    // Filter subcategories that belong to God Figure category
                                    const godFigureSubCats = subCatData.data.filter(subCat => {
                                        if (subCat.category) {
                                            // Handle both string and object format
                                            const categoryId = typeof subCat.category === 'string' 
                                                ? subCat.category 
                                                : subCat.category._id;
                                            
                                            return categoryId === godFigureCategory._id;
                                        }
                                        return false;
                                    });
                                    
                                    console.log('God Figure subcategories:', godFigureSubCats);
                                    
                                    // Get god figure names from subcategories
                                    const godFigureNames = godFigureSubCats.map(subCat => subCat.name);
                                    setGodFigureCategories(godFigureNames);
                                    setGodFigureSubCategories(godFigureSubCats);
                                }
                            }
                        } else {
                            console.log('God Figure category not found, using fallback categories');
                            // Fallback categories if not found in backend
                            setGodFigureCategories([
                                "Bal Gopal", "Christ", "Durga", "Gandhi Ji", "Ganesh", 
                                "Ganesh/Laxmi", "Gautam Buddha", "Hanuman", "Kali Mata", 
                                "Krishna", "Laughing Buddha", "Laxmi", "Mahaveer", 
                                "Mother Mary", "Narasimha", "Natraj", "Parashuram", 
                                "Radha Krishna", "Ram Darbar", "Sai Baba", "Saraswati",
                                "Shiva", "Vishnu"
                            ]);
                        }
                    }
                } else {
                    console.error('Failed to fetch categories:', categoriesResponse.status);
                }
                
                // 3. Fetch all products
                const productsResponse = await fetch('/api/products');
                if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    console.log('Products data:', productsData);
                    
                    if (productsData.success && productsData.data) {
                        // Filter only god figure products
                        const godFigureProductsData = productsData.data.filter(product => {
                            // Check if product belongs to God Figure category
                            if (product.category) {
                                const categoryName = typeof product.category === 'string' 
                                    ? product.category 
                                    : (product.category.name || "");
                                
                                const categoryLower = categoryName.toLowerCase();
                                return categoryLower.includes('god') || 
                                       categoryLower.includes('figure') || 
                                       categoryLower.includes('deity') ||
                                       categoryLower.includes('religious') ||
                                       categoryLower.includes('ganesh') ||
                                       categoryLower.includes('buddha') ||
                                       categoryLower.includes('krishna') ||
                                       categoryLower.includes('shiva') ||
                                       categoryLower.includes('laxmi');
                            }
                            return false;
                        });
                        
                        console.log('God Figure products found:', godFigureProductsData.length);
                        
                        // Transform products to match frontend structure
                        const transformedProducts = godFigureProductsData.map(product => ({
                            id: product._id,
                            name: product.name || "Unnamed Product",
                            price: product.price?.toString() || "0",
                            moq: product.minimumOrderQuantity || product.moq || 0,
                            img: product.images?.[0] || '/images/placeholder.png',
                            category: product.subCategory?.name || "",
                            subCategoryId: product.subCategory?._id || "",
                            finish: product.finish || "Natural",
                            productType: product.productType || "Ready Stock",
                            services: product.services || [],
                            createdAt: product.createdAt || new Date().toISOString()
                        }));
                        
                        console.log('Transformed products:', transformedProducts);
                        
                        setGodFigureProducts(transformedProducts);
                        setFilteredProducts(transformedProducts);
                        setSortedProducts(transformedProducts);
                        
                        // Extract unique product types
                        const types = [...new Set(transformedProducts.map(p => p.productType).filter(Boolean))];
                        setProductTypes(["All Products", ...types]);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Fallback to static data if API fails
                setGodFigureCategories([
                    "Bal Gopal", "Christ", "Durga", "Gandhi Ji", "Ganesh", 
                    "Ganesh/Laxmi", "Gautam Buddha", "Hanuman", "Kali Mata", 
                    "Krishna", "Laughing Buddha", "Laxmi", "Mahaveer", 
                    "Mother Mary", "Narasimha", "Natraj", "Parashuram", 
                    "Radha Krishna", "Ram Darbar", "Sai Baba", "Saraswati",
                    "Shiva", "Vishnu"
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter god figures based on search
    const filteredGodFigures = godFigureCategories.filter(godFigure =>
        godFigure.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle god figure selection
    const handleGodFigureSelect = (godFigure) => {
        // Check if user is logged in before allowing god figure selection
        if (!isLoggedIn) {
            setShowLoginPrompt(true);
            return;
        }
        
        setSelectedGodFigure(prev =>
            prev.includes(godFigure)
                ? prev.filter(g => g !== godFigure)
                : [...prev, godFigure]
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
        // Check if user is logged in when applying filters (God Figure page requires login for filters)
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
        let filtered = [...godFigureProducts];
        
        console.log('Applying filters...');
        console.log('Selected god figures:', selectedGodFigure);
        console.log('Total god figure products:', filtered.length);

        // Filter by selected god figures (subcategories)
        if (selectedGodFigure.length > 0) {
            filtered = filtered.filter(product => {
                return selectedGodFigure.some(godFigure => {
                    // Direct name comparison
                    if (product.category && product.category.toLowerCase() === godFigure.toLowerCase()) {
                        return true;
                    }
                    
                    // Check if product name contains god figure name
                    if (product.name && product.name.toLowerCase().includes(godFigure.toLowerCase())) {
                        return true;
                    }
                    
                    return false;
                });
            });
            
            console.log('After god figure filter:', filtered.length);
        }

        // Filter by product type
        if (activeProductType !== "All Products") {
            filtered = filtered.filter(product => 
                product.productType === activeProductType
            );
            console.log('After product type filter:', filtered.length);
        }

        // Right sidebar filters
        if (selectedFilters["finish/style"] && selectedFilters["finish/style"].length > 0 && !selectedFilters["finish/style"].includes("All Finishes")) {
            filtered = filtered.filter(product => 
                selectedFilters["finish/style"].some(finish => {
                    if (finish === "All Finishes") return true;
                    return product.finish === finish;
                })
            );
            console.log('After finish filter:', filtered.length);
        }

        if (selectedFilters["minimumorderquantity"] && selectedFilters["minimumorderquantity"].length > 0) {
            filtered = filtered.filter(product => {
                return selectedFilters["minimumorderquantity"].some(range => {
                    if (range === "50-100 pcs") return product.moq >= 50 && product.moq <= 100;
                    if (range === "100-500 pcs") return product.moq > 100 && product.moq <= 500;
                    if (range === "500-3000 pcs") return product.moq > 500 && product.moq <= 3000;
                    if (range === "1000+ pcs") return product.moq > 1000;
                    return true;
                });
            });
            console.log('After MOQ filter:', filtered.length);
        }

        if (selectedFilters["producttype"] && selectedFilters["producttype"].length > 0) {
            filtered = filtered.filter(product => 
                selectedFilters["producttype"].includes(product.productType)
            );
            console.log('After product type filter:', filtered.length);
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
            console.log('After services filter:', filtered.length);
        }

        setFilteredProducts(filtered);
        applySorting(filtered, selectedSort);
        setCurrentPage(1); // Reset to first page when filters change
    }, [godFigureProducts, selectedGodFigure, activeProductType, selectedFilters, selectedSort]);

    // Handle pagination based on login status
    useEffect(() => {
        if (sortedProducts.length === 0) {
            setDisplayedProducts([]);
            return;
        }

        if (isLoggedIn) {
            // Logged in: Show all products with pagination
            const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
            const endIndex = startIndex + PRODUCTS_PER_PAGE;
            setDisplayedProducts(sortedProducts.slice(startIndex, endIndex));
        } else {
            // Not logged in: Show only first page (limited view)
            setDisplayedProducts(sortedProducts.slice(0, PRODUCTS_PER_PAGE));
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
                sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
            case "Popularity":
                sorted.sort((a, b) => (a.moq || 0) - (b.moq || 0));
                break;
            default: // "Recommended"
                break;
        }

        setSortedProducts(sorted);
    };

    // Handle sort selection
    const handleSort = (sortType) => {
        setSelectedSort(sortType);
        setIsSortOpen(false);
        applySorting(filteredProducts, sortType);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedGodFigure([]);
        setActiveProductType("All Products");
        setSearchTerm("");
        setSelectedFilters({
            "finish/style": [],
            "minimumorderquantity": [],
            "producttype": [],
            "businessservices": []
        });
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
                            Please login to access god figure categories and apply filters. This helps us provide personalized recommendations for your bulk orders.
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

            {/* Header */}
            <header className="bg-white py-2">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl playfair font-bold text-center text-gray-800 mb-2">God Figure</h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar - God Figure Categories */}
                    <aside className="w-full lg:w-60 flex-shrink-0">
                        <div className="sticky top-8">
                            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                                {/* Category Header */}
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-lg mona font-semibold text-gray-800">God Figures</h2>
                                </div>

                                {/* Search Bar */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search god figures"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* God Figure List */}
                                <div className="p-4">
                                    <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2">
                                        {loading ? (
                                            <div className="text-center py-4">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C08237] mx-auto"></div>
                                                <p className="mt-2 text-sm text-gray-600">Loading god figures...</p>
                                            </div>
                                        ) : filteredGodFigures.length > 0 ? (
                                            <>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    Found {filteredGodFigures.length} god figure types
                                                </p>
                                                {filteredGodFigures.map(godFigure => {
                                                    // Count products for this god figure
                                                    const productCount = godFigureProducts.filter(product => 
                                                        product.category && product.category.toLowerCase() === godFigure.toLowerCase()
                                                    ).length;
                                                    
                                                    return (
                                                        <label key={godFigure} className="flex items-center gap-2 cursor-pointer py-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedGodFigure.includes(godFigure)}
                                                                onChange={() => handleGodFigureSelect(godFigure)}
                                                                className="w-4 h-4 text-[#C08237] border-gray-300 rounded focus:ring-[#C08237]"
                                                            />
                                                            <div className="flex justify-between items-center w-full">
                                                                <span className="text-sm text-gray-600 hover:text-gray-900">
                                                                    {godFigure}
                                                                </span>
                                                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                                                    {productCount}
                                                                </span>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-sm text-gray-500">No god figure categories found</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Check if "God Figure" category exists in database
                                                </p>
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
                            {/* Product Type Filters */}
                            <div className="flex flex-wrap gap-2">
                                {productTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            // Check if user is logged in for non-All Products types
                                            if (type !== "All Products" && !isLoggedIn) {
                                                setShowLoginPrompt(true);
                                                return;
                                            }
                                            setActiveProductType(type);
                                        }}
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
                                {/* Sort By Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        className="flex items-center gap-2 bg-white border border-gray-400 text-sm hover:bg-gray-50 px-3 py-2 rounded-full text-[12px] mona font-medium transition-colors"
                                    >
                                        Sort By <img src='/images/icons/arrow-3.svg' className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Sort Dropdown Menu */}
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

                                {/* Filter Button */}
                                <button
                                    onClick={() => {
                                        if (!isLoggedIn) {
                                            setShowLoginPrompt(true);
                                            return;
                                        }
                                        setIsFilterOpen(true);
                                    }}
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
                            {(selectedGodFigure.length > 0 || Object.values(selectedFilters).some(arr => arr.length > 0)) && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-[#C08237] hover:text-[#9C774A] font-medium"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C08237] mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Loading god figure products...</p>
                                </div>
                            </div>
                        ) : displayedProducts.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 text-lg mb-2">No god figure products found</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="mt-6 px-4 py-2 bg-[#C08237] text-white rounded-lg hover:bg-[#9C774A] transition"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Product Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {displayedProducts.map(product => (
                                        <div 
                                            key={product.id} 
                                            className={`cursor-pointer w-full max-w-[480px] relative group ${!isLoggedIn ? 'opacity-75' : ''}`}
                                            onClick={() => handleProductClick(product)}
                                        >
                                            <div className="relative w-full h-[280px] sm:h-[330px] bg-gray-100 overflow-hidden rounded-2xl">
                                                <img
                                                    src={product.img}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                                />

                                                {/* Wishlist Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (isLoggedIn) {
                                                            toggleWishlist(product.id);
                                                        } else {
                                                            router.push('/login');
                                                        }
                                                    }}
                                                    className="absolute top-3 right-3 z-10 p-2 bg-[#FFFFFF80] backdrop-blur-sm rounded-full 
                                                               shadow-lg hover:bg-white active:scale-95 
                                                               transition-all duration-200"
                                                    aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className={`h-5 w-6 transition-colors duration-200 ${isInWishlist(product.id)
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

                                            <div className="mt-3">
                                                <h3 className="mona font-semibold text-sm text-black line-clamp-1">
                                                    {product.name}
                                                </h3>
                                                {product.category && (
                                                    <p className="mona text-gray-700 font-normal text-xs mt-1">
                                                        God Figure: <b>{product.category}</b>
                                                    </p>
                                                )}
                                                <p className="mona text-gray-700 font-normal text-xs mt-1">
                                                    Minimum Order Quantity: <b>{product.moq} Piece{product.moq !== 1 ? 's' : ''}</b>
                                                </p>
                                                <p className="mona font-semibold text-black text-xs mt-1">
                                                    ₹ {Number(product.price).toLocaleString('en-IN')}/Piece
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination - Show only if there are multiple pages */}
                                {sortedProducts.length > PRODUCTS_PER_PAGE && (
                                    <div className="mt-12">
                                        <div className="flex flex-col items-center">
                                            {/* Pagination Info - Only show for non-logged in users */}
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
                                            
                                            {/* Pagination Buttons - Show for logged in users */}
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

            {/* Filter Sidebar (Right Side) */}
            <div className={`fixed inset-0 z-50 transition-all duration-300 ${isFilterOpen ? 'visible' : 'invisible'}`}>
                {/* Overlay */}
                <div
                    className={`absolute inset-0 bg-black transition-opacity duration-300 ${isFilterOpen ? 'opacity-50' : 'opacity-0'}`}
                    onClick={() => setIsFilterOpen(false)}
                />

                {/* Filter Panel */}
                <div className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="h-full flex flex-col">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl mona font-bold text-gray-800">Filters</h2>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <img src="/images/icons/close-circle.svg" className="w-7 h-7" alt="Close" />
                            </button>
                        </div>

                        {/* Filter Content */}
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
                                                    />
                                                    <span className="text-sm text-gray-600 hover:text-gray-900">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Panel Footer */}
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

            {/* Close dropdown when clicking outside */}
            {isSortOpen && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsSortOpen(false)}
                />
            )}
        </div>
    );
};

export default GodFigurePage;