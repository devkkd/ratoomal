"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, Heart, X } from 'lucide-react';
import fallbackProducts from '../../public/data/products.json'; // Import fallback data
import { useRouter } from 'next/navigation';

// Category data structure
const categories = {
    "Animal": [
        "Bear", "Bird", "Buffalo", "Bull", "Camel", "Cat", "Cheetah",
        "Cow", "Crow", "Crane", "Crocodile", "Deer", "Dinosaur",
        "Dog", "Dolphin", "Donkey", "Duck", "Eagle", "Elephant",
        "Fish", "Giraffe", "Goat", "Hen", "Hippopotamus", "Horse",
        "Kangaroo"
    ],
    "God Figure": ["Ganesha", "Laxmi", "Shiva", "Vishnu", "Krishna", "Buddha"],
    "Utility / Decor": {
        "Souvenir": [],
        "Agarbatti Burner": [],
        "Agarbatti Stand": [],
        "Ashoka Pillar": [],
        "Ashtray": [],
        "Bangle": [],
        "Book Mark": [],
        "Bowl": [],
        "Box": [],
        "Basket": [],
        "CD Stand": [],
        "Candle Stand": [],
        "Card Holder": [],
        "Cart": [],
        "Chess Set": [],
        "Christmas Hanging": [],
        "Cigarette Case": [],
        "Clock": [],
        "Coaster": [],
        "Coin Box": [],
        "Cora Burner": [],
        "Cork": [],
        "Dairy": [],
        "Decorated": []
    }
};

// Filter options
const filters = {
    "Finish / Style": ["All Finishes", "Natural", "Hand Painted", "Antique", "Metallic", "Matte"],
    "Minimum Order Quantity": ["50-100 pcs", "100-500 pcs", "500-3000 pcs", "1000+ pcs"],
    "Product Type": ["Ready Stock", "Made to Order"],
    "Business Services": ["Custom Design", "Private Label", "Corporate Gifts", "Other"]
};

// Sort options
const sortOptions = [
    "Recommended",
    "Latest",
    "Popularity",
    "Name A-Z",
    "Name Z-A",
    "Price Low to High",
    "Price High to Low"
];

const CategoryPage = () => {
    const [activeCategory, setActiveCategory] = useState("All Products");
    const [selectedFilters, setSelectedFilters] = useState({
        "finish/style": [],
        "minimumorderquantity": [],
        "producttype": [],
        "businessservices": []
    });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [expandedSections, setExpandedSections] = useState({
        "Utility / Decor": true,
        "Finish / Style": true,
        "Minimum Order Quantity": true,
        "Product Type": true,
        "Business Services": true
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState("Recommended");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerms, setSearchTerms] = useState({
        "Animal": "",
        "God Figure": "",
        "Utility / Decor": ""
    });
const handleProductClick = (product) => {
  // Try both routes
  router.push(`/product/${product.id}`);
};
    
     const router = useRouter();
    // Fetch products from JSON file
// Replace your fetchProducts useEffect with this:
useEffect(() => {
    const fetchProducts = async () => {
        try {
            setLoading(true);
            console.log('Starting fetch...');
            
            // Try to fetch from JSON file
            const response = await fetch('/data/products.json');
            
            if (response.ok) {
                const data = await response.json();
                console.log('Raw fetched data:', data);
                
                // IMPORTANT: Check the structure of your JSON
                // If it's { "products": [...] } then we need data.products
                // If it's directly an array, then we use data
                
                let productsArray;
                
                if (data && data.products && Array.isArray(data.products)) {
                    // Case 1: { "products": [...] }
                    console.log('JSON has products property');
                    productsArray = data.products;
                } else if (Array.isArray(data)) {
                    // Case 2: Direct array
                    console.log('JSON is direct array');
                    productsArray = data;
                } else {
                    // Case 3: Invalid structure
                    console.error('Invalid JSON structure:', data);
                    productsArray = [];
                }
                
                console.log('Products array to set:', productsArray);
                
                setProducts(productsArray);
                setFilteredProducts(productsArray);
                setSortedProducts(productsArray);
            } else {
                console.warn('JSON file not found, using imported fallback data');
                console.log('Fallback products:', fallbackProducts);
                
                // Check fallback structure too
                let fallbackArray;
                if (fallbackProducts && fallbackProducts.products && Array.isArray(fallbackProducts.products)) {
                    fallbackArray = fallbackProducts.products;
                } else if (Array.isArray(fallbackProducts)) {
                    fallbackArray = fallbackProducts;
                } else {
                    fallbackArray = [];
                }
                
                setProducts(fallbackArray);
                setFilteredProducts(fallbackArray);
                setSortedProducts(fallbackArray);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            
            // Handle fallback structure
            let fallbackArray;
            if (fallbackProducts && fallbackProducts.products && Array.isArray(fallbackProducts.products)) {
                fallbackArray = fallbackProducts.products;
            } else if (Array.isArray(fallbackProducts)) {
                fallbackArray = fallbackProducts;
            } else {
                fallbackArray = [];
            }
            
            setProducts(fallbackArray);
            setFilteredProducts(fallbackArray);
            setSortedProducts(fallbackArray);
        } finally {
            setLoading(false);
        }
    };

    fetchProducts();
}, []);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };


    const handleCategoryChange = (category, item) => {
        setSelectedCategories(prev => {
            const key = `${category}-${item}`;
            if (prev.includes(key)) {
                return prev.filter(i => i !== key);
            } else {
                return [...prev, key];
            }
        });
    };

    // Fixed filter change handler
    const handleFilterChange = (filterType, value) => {
        // Create a consistent key name from filter title
        const filterKey = filterType.toLowerCase().replace(/\s+/g, '');

        setSelectedFilters(prev => ({
            ...prev,
            [filterKey]: prev[filterKey]?.includes(value)
                ? prev[filterKey].filter(item => item !== value)
                : [...(prev[filterKey] || []), value]
        }));
    };

    const handleSearchChange = (category, value) => {
        setSearchTerms(prev => ({
            ...prev,
            [category]: value
        }));
    };

    // Toggle wishlist
    const toggleWishlist = (productId) => {
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    // Sort functionality
    const handleSort = (sortType) => {
        setSelectedSort(sortType);
        setIsSortOpen(false);

        let sorted = [...filteredProducts];

        switch (sortType) {
            case "Name A-Z":
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "Name Z-A":
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "Price Low to High":
                sorted.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/,/g, '')) || 0;
                    const priceB = parseInt(b.price.replace(/,/g, '')) || 0;
                    return priceA - priceB;
                });
                break;
            case "Price High to Low":
                sorted.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/,/g, '')) || 0;
                    const priceB = parseInt(b.price.replace(/,/g, '')) || 0;
                    return priceB - priceA;
                });
                break;
            case "Latest":
                sorted.sort((a, b) => b.id - a.id);
                break;
            case "Popularity":
                sorted.sort((a, b) => (a.moq || 0) - (b.moq || 0));
                break;
            default: // "Recommended"
                // Keep original order
                break;
        }

        setSortedProducts(sorted);
    };

    // Apply filters whenever dependencies change
    useEffect(() => {
        let filtered = [...products];

        // Category filter
        if (activeCategory !== "All Products") {
            filtered = filtered.filter(product => {
                if (activeCategory === "Animal" && product.category === "Animal") return true;
                if (activeCategory === "God Figure" && product.category === "God Figure") return true;
                if (activeCategory === "Utility / Decor" && product.category === "Utility / Decor") return true;
                return false;
            });
        }

        // Sub-category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product => {
                return selectedCategories.some(catKey => {
                    const [catType, subCat] = catKey.split('-');
                    if (catType === "Animal" && product.category === "Animal") {
                        return product.name.toLowerCase().includes(subCat.toLowerCase()) ||
                            (product.subCategory && product.subCategory.toLowerCase() === subCat.toLowerCase());
                    }
                    if (catType === "God Figure" && product.category === "God Figure") {
                        return product.name.toLowerCase().includes(subCat.toLowerCase()) ||
                            (product.subCategory && product.subCategory.toLowerCase() === subCat.toLowerCase());
                    }
                    if (catType === "Utility / Decor" && product.category === "Utility / Decor") {
                        return product.name.toLowerCase().includes(subCat.toLowerCase()) ||
                            (product.subCategory && product.subCategory.toLowerCase() === subCat.toLowerCase());
                    }
                    return false;
                });
            });
        }

        // Right sidebar filters - FIXED
        if (selectedFilters["finish/style"] && selectedFilters["finish/style"].length > 0 && !selectedFilters["finish/style"].includes("All Finishes")) {
            filtered = filtered.filter(product =>
                selectedFilters["finish/style"].some(finish => {
                    if (finish === "All Finishes") return true;
                    return product.finish === finish;
                })
            );
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
        }

        if (selectedFilters["producttype"] && selectedFilters["producttype"].length > 0) {
            filtered = filtered.filter(product =>
                selectedFilters["producttype"].includes(product.productType)
            );
        }

        if (selectedFilters["businessservices"] && selectedFilters["businessservices"].length > 0) {
            filtered = filtered.filter(product => {
                // Check if product has services and filter
                if (!product.services || product.services.length === 0) return false;

                return selectedFilters["businessservices"].some(service => {
                    if (service === "Other") {
                        // For "Other" service, check if product has services not in the main list
                        const mainServices = ["Custom Design", "Private Label", "Corporate Gifts"];
                        return product.services.some(s => !mainServices.includes(s));
                    }
                    return product.services.includes(service);
                });
            });
        }

        setFilteredProducts(filtered);

        // Re-apply sorting to newly filtered products
        const sorted = applySorting(filtered, selectedSort);
        setSortedProducts(sorted);
    }, [products, activeCategory, selectedCategories, selectedFilters, selectedSort]);

    // Separate sorting function to avoid dependency issues
    // const applySorting = (productsToSort, sortType) => {
    //     let sorted = [...productsToSort];

    //     switch (sortType) {
    //         case "Name A-Z":
    //             sorted.sort((a, b) => a.name.localeCompare(b.name));
    //             break;
    //         case "Name Z-A":
    //             sorted.sort((a, b) => b.name.localeCompare(a.name));
    //             break;
    //         case "Price Low to High":
    //             sorted.sort((a, b) => {
    //                 const priceA = parseInt(a.price.replace(/,/g, '')) || 0;
    //                 const priceB = parseInt(b.price.replace(/,/g, '')) || 0;
    //                 return priceA - priceB;
    //             });
    //             break;
    //         case "Price High to Low":
    //             sorted.sort((a, b) => {
    //                 const priceA = parseInt(a.price.replace(/,/g, '')) || 0;
    //                 const priceB = parseInt(b.price.replace(/,/g, '')) || 0;
    //                 return priceB - priceA;
    //             });
    //             break;
    //         case "Latest":
    //             sorted.sort((a, b) => b.id - a.id);
    //             break;
    //         case "Popularity":
    //             sorted.sort((a, b) => (a.moq || 0) - (b.moq || 0));
    //             break;
    //         default: // "Recommended"
    //             // Keep original order
    //             break;
    //     }

    //     return sorted;
    // };

    // applySorting function ko update karein:
const applySorting = (productsToSort, sortType) => {
    // Safety check: productsToSort array hai ya nahi
    if (!Array.isArray(productsToSort)) {
        console.error('applySorting: productsToSort is not an array', productsToSort);
        return [];
    }
    
    // Create a new array for sorting
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
                const priceA = parseInt((a.price || '0').replace(/,/g, '')) || 0;
                const priceB = parseInt((b.price || '0').replace(/,/g, '')) || 0;
                return priceA - priceB;
            });
            break;
        case "Price High to Low":
            sorted.sort((a, b) => {
                const priceA = parseInt((a.price || '0').replace(/,/g, '')) || 0;
                const priceB = parseInt((b.price || '0').replace(/,/g, '')) || 0;
                return priceB - priceA;
            });
            break;
        case "Latest":
            sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
            break;
        case "Popularity":
            sorted.sort((a, b) => (a.moq || 0) - (b.moq || 0));
            break;
        default: // "Recommended"
            // Keep original order
            break;
    }

    return sorted;
};



    // Get filtered items for each category with search
    const getFilteredCategoryItems = (category) => {
        if (category === "Utility / Decor") {
            const items = Object.keys(categories[category]);
            const searchTerm = searchTerms[category]?.toLowerCase() || '';
            return items.filter(item =>
                item.toLowerCase().includes(searchTerm)
            );
        } else {
            const items = categories[category];
            const searchTerm = searchTerms[category]?.toLowerCase() || '';
            return items.filter(item =>
                item.toLowerCase().includes(searchTerm)
            );
        }
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedFilters({
            "finish/style": [],
            "minimumorderquantity": [],
            "producttype": [],
            "businessservices": []
        });
        setSelectedCategories([]);
        setActiveCategory("All Products");
        setSearchTerms({
            "Animal": "",
            "God Figure": "",
            "Utility / Decor": ""
        });
    };

    // Get checked status for filters - FIXED
    const isFilterChecked = (filterType, value) => {
        const filterKey = filterType.toLowerCase().replace(/\s+/g, '');
        return selectedFilters[filterKey]?.includes(value) || false;
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans">
            {/* Header */}
            <header className="bg-white py-2">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl playfair font-bold text-center text-gray-800 mb-2">Category</h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar - Only Categories */}
                    <aside className="w-full lg:w-60 flex-shrink-0">
                        <div className="sticky top-8">
                            {/* Categories Filter */}
                            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                                <div className="py-3 px-2">
                                    <div className="space-y-3">
                                        {Object.keys(categories).map(category => (
                                            <div key={category}>
                                                <button
                                                    onClick={() => toggleSection(category)}
                                                    className="flex justify-between items-center w-full p-2 hover:bg-gray-50 rounded"
                                                >
                                                    <span className="font-medium text-sm mona text-gray-700">{category}</span>
                                                    <ChevronRight
                                                        className={`w-4 h-4 transition-transform ${expandedSections[category] ? 'rotate-90' : ''}`}
                                                    />
                                                </button>

                                                {expandedSections[category] && (
                                                    <div className="pl-2 space-y-2 mt-2">
                                                        {/* Search bar for all categories */}
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                placeholder={`Search in ${category}`}
                                                                value={searchTerms[category] || ''}
                                                                onChange={(e) => handleSearchChange(category, e.target.value)}
                                                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none"
                                                            />
                                                        </div>

                                                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                                                            {getFilteredCategoryItems(category).map(item => (
                                                                <label key={item} className="flex items-center gap-2 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedCategories.includes(`${category}-${item}`)}
                                                                        onChange={() => handleCategoryChange(category, item)}
                                                                        className="w-4 h-4 text-[#C08237] border-gray-300 rounded focus:ring-[#C08237]"
                                                                    />
                                                                    <span className="text-sm text-gray-600 hover:text-gray-900">{item}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Top Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div className="flex flex-wrap gap-2 ">
                                {["All Products", "Animal", "God Figure", "Utility / Decor", "Custom"].map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`px-4 py-2 rounded-full text-[12px] mona font-medium transition-colors ${activeCategory === category
                                            ? 'bg-[#C08237] text-white'
                                            : 'bg-white border border-gray-400 text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3 relative">
                                {/* Sort By Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        className="flex mona items-center gap-2 bg-white border border-gray-400 text-sm hover:bg-gray-50 px-3 py-2 rounded-full text-[12px] mona font-medium transition-colors"
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
                                                        className={`flex justify-between hover:bg-[#C08237] hover:text-white items-center w-full px-4 py-2 text-left text-sm ${selectedSort === option ? 'text-[white] bg-[#C08237] font-medium' : 'text-gray-700'
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

                                <button
                                    onClick={() => setIsFilterOpen(true)}
                                    className="flex mona items-center gap-2 bg-white border border-gray-400 text-sm hover:bg-gray-50 px-3 py-2 rounded-full text-[12px] mona font-medium transition-colors"
                                >
                                    Filters <img src='/images/icons/setting-4.svg' className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Results Count and Clear Filters */}
                        <div className="mb-6 flex justify-between items-center">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold">{sortedProducts.length}</span> products
                            </p>
                            {(selectedCategories.length > 0 || Object.values(selectedFilters).some(arr => arr.length > 0)) && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-[#C08237] hover:text-[#9C774A] font-medium"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>

                        {/* Product Grid */}
                  {loading ? (
    <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading products...</div>
    </div>
) : !sortedProducts || !Array.isArray(sortedProducts) || sortedProducts.length === 0 ? (
    <div className="text-center py-12">
        <p className="text-gray-600">No products found. Try changing your filters.</p>
        <p className="text-gray-500 text-sm mt-2">
            Debug: sortedProducts is {sortedProducts ? (Array.isArray(sortedProducts) ? 'array' : typeof sortedProducts) : 'null/undefined'}
        </p>
    </div>
) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedProducts.map(product => (
                                    <div 
  key={product.id} 
  className="cursor-pointer w-full max-w-[480px] relative group"
  onClick={() => handleProductClick(product)} // product object पास करें
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
                                                    toggleWishlist(product.id);
                                                }}
                                                className="absolute top-3 right-3 z-10 p-2 bg-[#FFFFFF80] backdrop-blur-sm rounded-full 
                                                           shadow-lg hover:bg-white active:scale-95 
                                                           transition-all duration-200"
                                                aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`h-5 w-6 transition-colors duration-200 ${wishlist.includes(product.id)
                                                        ? "fill-red-500 text-red-500"
                                                        : "text-gray-800 fill-transparent hover:text-red-400"
                                                        }`}
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={wishlist.includes(product.id) ? 0 : 2}
                                                >
                                                    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="mt-3">
                                            <h3 className="mona font-semibold text-sm text-black">
                                                {product.name}
                                            </h3>
                                            <p className="mona text-gray-700 font-normal text-xs mt-1">
                                                Minimum Order Quantity: <b>{product.moq} Piece{product.moq !== 1 ? 's' : ''}</b>
                                            </p>
                                            <p className="mona font-semibold text-black text-xs mt-1">
                                                ₹ {product.price}/Piece
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Load More Button */}
                        {!loading && sortedProducts.length > 0 && (
                            <div className="text-center mt-12">
                                <button className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                    Load More Products
                                </button>
                            </div>
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

                        {/* Filter Content - FIXED */}
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

export default CategoryPage;