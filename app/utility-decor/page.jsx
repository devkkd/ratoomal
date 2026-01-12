// // "use client";
// // import React, { useState, useEffect } from 'react';
// // import { ChevronRight, Search, Heart } from 'lucide-react';

// // // Utility / Decor category data
// // const utilityDecorCategories = [
// //     "Agarbatti Burner", "Agarbatti Stand", "Ashoka Pillar", "Ashtray", 
// //     "Bangle", "Book Mark", "Bookend", "Bowl", "Box", "Bracelet", 
// //     "CD Stand", "Candle Stand", "Card Holder", "Cart", "Chess Set", 
// //     "Christmas Hanging", "Cigarette Case", "Clock", "Coaster", "Coin Box", 
// //     "Cora Burner", "Cork", "Dairy", "Decorated", "Dinner Set", "Flower Pot",
// //     "Fruit Bowl", "Key Chain", "Letter Opener", "Magnifying Glass", "Memo Pad",
// //     "Money Clip", "Music Box", "Napkin Ring", "Paper Weight", "Pen Stand",
// //     "Photo Frame", "Souvenir", "Spice Box", "Table Lamp", "Tissue Box",
// //     "Toothpick Holder", "Tray", "Vase", "Wall Hanging", "Wine Rack"
// // ];

// // // Sample Utility / Decor products data
// // const utilityDecorProducts = [
// //     {
// //         id: 1,
// //         name: "Blue White Owl Showpiece",
// //         price: "1,500",
// //         moq: 100,
// //         img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
// //         category: "Showpiece",
// //         subCategory: "Decorated",
// //         finish: "Matte",
// //         productType: "Made to Order",
// //         services: ["Custom Design"]
// //     },
// //     {
// //         id: 2,
// //         name: "Decorative Wooden Bowl",
// //         price: "2,000",
// //         moq: 150,
// //         img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop",
// //         category: "Bowl",
// //         finish: "Hand Painted",
// //         productType: "Ready Stock",
// //         services: ["Private Label"]
// //     },
// //     {
// //         id: 3,
// //         name: "Black White Out Showpiece",
// //         price: "1,800",
// //         moq: 120,
// //         img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=500&fit=crop",
// //         category: "Showpiece",
// //         subCategory: "Decorated",
// //         finish: "Metallic",
// //         productType: "Made to Order",
// //         services: ["Custom Design", "Corporate Gifts"]
// //     },
// //     {
// //         id: 4,
// //         name: "Wooden Candle Stand",
// //         price: "850",
// //         moq: 200,
// //         img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&h=500&fit=crop",
// //         category: "Candle Stand",
// //         finish: "Natural",
// //         productType: "Ready Stock",
// //         services: []
// //     },
// //     {
// //         id: 5,
// //         name: "Decorative Coaster Set",
// //         price: "600",
// //         moq: 300,
// //         img: "https://images.unsplash.com/photo-1556909114-dad0865b86d4?w=400&h=500&fit=crop",
// //         category: "Coaster",
// //         finish: "Hand Painted",
// //         productType: "Ready Stock",
// //         services: ["Corporate Gifts"]
// //     },
// //     {
// //         id: 6,
// //         name: "Agarbatti Burner Premium",
// //         price: "950",
// //         moq: 180,
// //         img: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=500&fit=crop",
// //         category: "Agarbatti Burner",
// //         finish: "Antique",
// //         productType: "Made to Order",
// //         services: ["Custom Design"]
// //     },
// //     {
// //         id: 7,
// //         name: "Wooden Chess Set",
// //         price: "3,500",
// //         moq: 80,
// //         img: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=500&fit=crop",
// //         category: "Chess Set",
// //         finish: "Antique",
// //         productType: "Made to Order",
// //         services: ["Custom Design", "Corporate Gifts"]
// //     },
// //     {
// //         id: 8,
// //         name: "Decorative Clock Wooden",
// //         price: "2,100",
// //         moq: 110,
// //         img: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=500&fit=crop",
// //         category: "Clock",
// //         finish: "Metallic",
// //         productType: "Ready Stock",
// //         services: ["Private Label"]
// //     },
// //     {
// //         id: 9,
// //         name: "Decorative Book Mark Set",
// //         price: "450",
// //         moq: 500,
// //         img: "https://images.unsplash.com/photo-1556909114-8d2ca8c7b4dc?w=400&h=500&fit=crop",
// //         category: "Book Mark",
// //         finish: "Matte",
// //         productType: "Made to Order",
// //         services: ["Private Label"]
// //     },
// //     {
// //         id: 10,
// //         name: "Wooden Photo Frame",
// //         price: "750",
// //         moq: 250,
// //         img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=500&fit=crop",
// //         category: "Photo Frame",
// //         finish: "Natural",
// //         productType: "Ready Stock",
// //         services: ["Corporate Gifts"]
// //     },
// //     {
// //         id: 11,
// //         name: "Decorative Vase",
// //         price: "1,200",
// //         moq: 160,
// //         img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop",
// //         category: "Vase",
// //         finish: "Hand Painted",
// //         productType: "Made to Order",
// //         services: ["Custom Design"]
// //     },
// //     {
// //         id: 12,
// //         name: "Table Lamp Wooden",
// //         price: "1,800",
// //         moq: 140,
// //         img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&h=500&fit=crop",
// //         category: "Table Lamp",
// //         finish: "Natural",
// //         productType: "Ready Stock",
// //         services: []
// //     }
// // ];

// // // Product type categories
// // const productTypes = ["All Products", "Product Type 1", "Product Type 2", "Product Type 3", "Product Type 4"];

// // // Filter options
// // const filters = {
// //     "Finish / Style": ["All Finishes", "Natural", "Hand Painted", "Antique", "Metallic", "Matte"],
// //     "Minimum Order Quantity": ["50-100 pcs", "100-500 pcs", "500-3000 pcs", "1000+ pcs"],
// //     "Product Type": ["Ready Stock", "Made to Order"],
// //     "Business Services": ["Custom Design", "Private Label", "Corporate Gifts", "Other"]
// // };

// // // Sort options
// // const sortOptions = ["Recommended", "Latest", "Popularity", "Name A-Z", "Name Z-A", "Price Low to High", "Price High to Low"];

// // const UtilityDecorPage = () => {
// //     const [activeProductType, setActiveProductType] = useState("All Products");
// //     const [selectedCategory, setSelectedCategory] = useState([]);
// //     const [searchTerm, setSearchTerm] = useState("");
// //     const [isSortOpen, setIsSortOpen] = useState(false);
// //     const [selectedSort, setSelectedSort] = useState("Recommended");
// //     const [wishlist, setWishlist] = useState([]);
// //     const [filteredProducts, setFilteredProducts] = useState(utilityDecorProducts);
// //     const [sortedProducts, setSortedProducts] = useState(utilityDecorProducts);
    
// //     // Filter sidebar states
// //     const [isFilterOpen, setIsFilterOpen] = useState(false);
// //     const [selectedFilters, setSelectedFilters] = useState({
// //         "finish/style": [],
// //         "minimumorderquantity": [],
// //         "producttype": [],
// //         "businessservices": []
// //     });
// //     const [expandedSections, setExpandedSections] = useState({
// //         "Finish / Style": true,
// //         "Minimum Order Quantity": true,
// //         "Product Type": true,
// //         "Business Services": true
// //     });

// //     // Filter categories based on search
// //     const filteredCategories = utilityDecorCategories.filter(category =>
// //         category.toLowerCase().includes(searchTerm.toLowerCase())
// //     );

// //     // Handle category selection
// //     const handleCategorySelect = (category) => {
// //         setSelectedCategory(prev =>
// //             prev.includes(category)
// //                 ? prev.filter(c => c !== category)
// //                 : [...prev, category]
// //         );
// //     };

// //     // Toggle wishlist
// //     const toggleWishlist = (productId) => {
// //         setWishlist(prev =>
// //             prev.includes(productId)
// //                 ? prev.filter(id => id !== productId)
// //                 : [...prev, productId]
// //         );
// //     };

// //     // Fixed filter change handler
// //     const handleFilterChange = (filterType, value) => {
// //         const filterKey = filterType.toLowerCase().replace(/\s+/g, '');
        
// //         setSelectedFilters(prev => ({
// //             ...prev,
// //             [filterKey]: prev[filterKey]?.includes(value)
// //                 ? prev[filterKey].filter(item => item !== value)
// //                 : [...(prev[filterKey] || []), value]
// //         }));
// //     };

// //     // Toggle filter sections
// //     const toggleSection = (section) => {
// //         setExpandedSections(prev => ({
// //             ...prev,
// //             [section]: !prev[section]
// //         }));
// //     };

// //     // Get checked status for filters
// //     const isFilterChecked = (filterType, value) => {
// //         const filterKey = filterType.toLowerCase().replace(/\s+/g, '');
// //         return selectedFilters[filterKey]?.includes(value) || false;
// //     };

// //     // Apply filters
// //     useEffect(() => {
// //         let filtered = [...utilityDecorProducts];

// //         // Filter by selected categories
// //         if (selectedCategory.length > 0) {
// //             filtered = filtered.filter(product =>
// //                 selectedCategory.some(category =>
// //                     product.name.toLowerCase().includes(category.toLowerCase()) ||
// //                     product.category.toLowerCase() === category.toLowerCase() ||
// //                     (product.subCategory && product.subCategory.toLowerCase() === category.toLowerCase())
// //                 )
// //             );
// //         }

// //         // Filter by product type
// //         if (activeProductType !== "All Products") {
// //             filtered = filtered.filter(product => 
// //                 product.category && product.category.toLowerCase().includes(activeProductType.toLowerCase().replace('product type ', ''))
// //             );
// //         }

// //         // Right sidebar filters
// //         if (selectedFilters["finish/style"] && selectedFilters["finish/style"].length > 0 && !selectedFilters["finish/style"].includes("All Finishes")) {
// //             filtered = filtered.filter(product => 
// //                 selectedFilters["finish/style"].some(finish => {
// //                     if (finish === "All Finishes") return true;
// //                     return product.finish === finish;
// //                 })
// //             );
// //         }

// //         if (selectedFilters["minimumorderquantity"] && selectedFilters["minimumorderquantity"].length > 0) {
// //             filtered = filtered.filter(product => {
// //                 return selectedFilters["minimumorderquantity"].some(range => {
// //                     if (range === "50-100 pcs") return product.moq >= 50 && product.moq <= 100;
// //                     if (range === "100-500 pcs") return product.moq > 100 && product.moq <= 500;
// //                     if (range === "500-3000 pcs") return product.moq > 500 && product.moq <= 3000;
// //                     if (range === "1000+ pcs") return product.moq > 1000;
// //                     return true;
// //                 });
// //             });
// //         }

// //         if (selectedFilters["producttype"] && selectedFilters["producttype"].length > 0) {
// //             filtered = filtered.filter(product => 
// //                 selectedFilters["producttype"].includes(product.productType)
// //             );
// //         }

// //         if (selectedFilters["businessservices"] && selectedFilters["businessservices"].length > 0) {
// //             filtered = filtered.filter(product => {
// //                 if (!product.services || product.services.length === 0) return false;
                
// //                 return selectedFilters["businessservices"].some(service => {
// //                     if (service === "Other") {
// //                         const mainServices = ["Custom Design", "Private Label", "Corporate Gifts"];
// //                         return product.services.some(s => !mainServices.includes(s));
// //                     }
// //                     return product.services.includes(service);
// //                 });
// //             });
// //         }

// //         setFilteredProducts(filtered);
// //         applySorting(filtered, selectedSort);
// //     }, [selectedCategory, activeProductType, selectedFilters, selectedSort]);

// //     // Apply sorting
// //     const applySorting = (productsToSort, sortType) => {
// //         let sorted = [...productsToSort];

// //         switch (sortType) {
// //             case "Name A-Z":
// //                 sorted.sort((a, b) => a.name.localeCompare(b.name));
// //                 break;
// //             case "Name Z-A":
// //                 sorted.sort((a, b) => b.name.localeCompare(a.name));
// //                 break;
// //             case "Price Low to High":
// //                 sorted.sort((a, b) => {
// //                     const priceA = parseInt(a.price.replace(/,/g, '')) || 0;
// //                     const priceB = parseInt(b.price.replace(/,/g, '')) || 0;
// //                     return priceA - priceB;
// //                 });
// //                 break;
// //             case "Price High to Low":
// //                 sorted.sort((a, b) => {
// //                     const priceA = parseInt(a.price.replace(/,/g, '')) || 0;
// //                     const priceB = parseInt(b.price.replace(/,/g, '')) || 0;
// //                     return priceB - priceA;
// //                 });
// //                 break;
// //             case "Latest":
// //                 sorted.sort((a, b) => b.id - a.id);
// //                 break;
// //             case "Popularity":
// //                 sorted.sort((a, b) => a.moq - b.moq);
// //                 break;
// //             default: // "Recommended"
// //                 break;
// //         }

// //         setSortedProducts(sorted);
// //     };

// //     // Handle sort selection
// //     const handleSort = (sortType) => {
// //         setSelectedSort(sortType);
// //         setIsSortOpen(false);
// //         applySorting(filteredProducts, sortType);
// //     };

// //     // Clear all filters
// //     const clearAllFilters = () => {
// //         setSelectedCategory([]);
// //         setActiveProductType("All Products");
// //         setSearchTerm("");
// //         setSelectedFilters({
// //             "finish/style": [],
// //             "minimumorderquantity": [],
// //             "producttype": [],
// //             "businessservices": []
// //         });
// //     };

// //     return (
// //         <div className="min-h-screen bg-[#FDFBF7] font-sans">
// //             {/* Header */}
// //             <header className="bg-white py-2">
// //                 <div className="max-w-7xl mx-auto px-4 py-6">
// //                     <h1 className="text-3xl playfair font-bold text-center text-gray-800 mb-2">Utility / Decor</h1>
// //                 </div>
// //             </header>

// //             <div className="max-w-7xl mx-auto px-4 py-8">
// //                 <div className="flex flex-col lg:flex-row gap-8">
// //                     {/* Left Sidebar - Utility / Decor Categories */}
// //                     <aside className="w-full lg:w-60 flex-shrink-0">
// //                         <div className="sticky top-8">
// //                             <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
// //                                 {/* Category Header */}
// //                                 <div className="p-4 border-b border-gray-200">
// //                                     <h2 className="text-lg mona font-semibold text-gray-800">Utility / Decor</h2>
// //                                 </div>

// //                                 {/* Search Bar */}
// //                                 <div className="p-4 border-b border-gray-200">
// //                                     <div className="relative">
// //                                         <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
// //                                         <input
// //                                             type="text"
// //                                             placeholder="Search"
// //                                             value={searchTerm}
// //                                             onChange={(e) => setSearchTerm(e.target.value)}
// //                                             className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none"
// //                                         />
// //                                     </div>
// //                                 </div>

// //                                 {/* Category List */}
// //                                 <div className="p-4">
// //                                     <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2">
// //                                         {filteredCategories.map(category => (
// //                                             <label key={category} className="flex items-center gap-2 cursor-pointer">
// //                                                 <input
// //                                                     type="checkbox"
// //                                                     checked={selectedCategory.includes(category)}
// //                                                     onChange={() => handleCategorySelect(category)}
// //                                                     className="w-4 h-4 text-[#B38B59] border-gray-300 rounded focus:ring-[#B38B59]"
// //                                                 />
// //                                                 <span className="text-sm text-gray-600 hover:text-gray-900">{category}</span>
// //                                             </label>
// //                                         ))}
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </aside>

// //                     {/* Main Content */}
// //                     <main className="flex-1">
// //                         {/* Top Toolbar */}
// //                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
// //                             {/* Product Type Filters */}
// //                             <div className="flex flex-wrap gap-2">
// //                                 {productTypes.map(type => (
// //                                     <button
// //                                         key={type}
// //                                         onClick={() => setActiveProductType(type)}
// //                                         className={`px-4 py-2 rounded-full text-[12px] mona font-medium transition-colors ${activeProductType === type
// //                                                 ? 'bg-[#B38B59] text-white'
// //                                                 : 'bg-white border border-gray-400 text-gray-900 hover:bg-gray-50'
// //                                             }`}
// //                                     >
// //                                         {type}
// //                                     </button>
// //                                 ))}
// //                             </div>

// //                             {/* Sort and Filter Buttons */}
// //                             <div className="flex gap-3 relative">
// //                                 {/* Sort By Dropdown */}
// //                                 <div className="relative">
// //                                     <button
// //                                         onClick={() => setIsSortOpen(!isSortOpen)}
// //                                         className="flex items-center gap-2 bg-white border border-gray-400 text-sm hover:bg-gray-50 px-3 py-2 rounded-full text-[12px] mona font-medium transition-colors"
// //                                     >
// //                                         Sort By <img src='/images/icons/arrow-3.svg' className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
// //                                     </button>

// //                                     {/* Sort Dropdown Menu */}
// //                                     {isSortOpen && (
// //                                         <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
// //                                             <div className="py-2">
// //                                                 {sortOptions.map((option) => (
// //                                                     <button
// //                                                         key={option}
// //                                                         onClick={() => handleSort(option)}
// //                                                         className={`flex justify-between items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-sm ${selectedSort === option ? 'text-[#B38B59] font-medium' : 'text-gray-700'
// //                                                             }`}
// //                                                     >
// //                                                         <span>{option}</span>
// //                                                         {selectedSort === option && (
// //                                                             <svg className="w-4 h-4 text-[#B38B59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
// //                                                             </svg>
// //                                                         )}
// //                                                     </button>
// //                                                 ))}
// //                                             </div>
// //                                         </div>
// //                                     )}
// //                                 </div>

// //                                 {/* Filter Button */}
// //                                 <button
// //                                     onClick={() => setIsFilterOpen(true)}
// //                                     className="flex items-center gap-2 bg-white border border-gray-400 text-sm hover:bg-gray-50 px-3 py-2 rounded-full text-[12px] mona font-medium transition-colors"
// //                                 >
// //                                     Filters <img src='/images/icons/setting-4.svg' className="w-4 h-4" />
// //                                 </button>
// //                             </div>
// //                         </div>

// //                         {/* Results Count and Clear Filters */}
// //                         <div className="mb-6 flex justify-between items-center">
// //                             <p className="text-gray-600">
// //                                 Showing <span className="font-semibold">{sortedProducts.length}</span> products
// //                             </p>
// //                             {(selectedCategory.length > 0 || Object.values(selectedFilters).some(arr => arr.length > 0)) && (
// //                                 <button
// //                                     onClick={clearAllFilters}
// //                                     className="text-sm text-[#B38B59] hover:text-[#9C774A] font-medium"
// //                                 >
// //                                     Clear all filters
// //                                 </button>
// //                             )}
// //                         </div>

// //                         {/* Product Grid */}
// //                         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //                             {sortedProducts.map(product => (
// //                                 <div key={product.id} className="cursor-pointer w-full max-w-[480px] relative group">
// //                                     <div className="relative w-full h-[280px] sm:h-[330px] bg-gray-100 overflow-hidden rounded-2xl">
// //                                         <img
// //                                             src={product.img}
// //                                             alt={product.name}
// //                                             className="w-full h-full object-cover hover:scale-105 transition duration-300"
// //                                         />

// //                                         {/* Wishlist Button */}
// //                                         <button
// //                                             onClick={(e) => {
// //                                                 e.stopPropagation();
// //                                                 toggleWishlist(product.id);
// //                                             }}
// //                                             className="absolute top-3 right-3 z-10 p-2 bg-[#FFFFFF80] backdrop-blur-sm rounded-full 
// //                                                            shadow-lg hover:bg-white active:scale-95 
// //                                                            transition-all duration-200"
// //                                             aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
// //                                         >
// //                                             <svg
// //                                                 xmlns="http://www.w3.org/2000/svg"
// //                                                 className={`h-5 w-6 transition-colors duration-200 ${wishlist.includes(product.id)
// //                                                         ? "fill-red-500 text-red-500"
// //                                                         : "text-gray-800 fill-transparent hover:text-red-400"
// //                                                     }`}
// //                                                 viewBox="0 0 24 24"
// //                                                 stroke="currentColor"
// //                                                 strokeWidth={wishlist.includes(product.id) ? 0 : 2}
// //                                             >
// //                                                 <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
// //                                             </svg>
// //                                         </button>
// //                                     </div>

// //                                     <div className="mt-3">
// //                                         <h3 className="mona font-semibold text-sm text-black line-clamp-1">
// //                                             {product.name}
// //                                         </h3>
// //                                         <p className="mona text-gray-700 font-normal text-xs mt-1">
// //                                             Minimum Order Quantity: <b>{product.moq} Piece</b>
// //                                         </p>
// //                                         <p className="mona font-semibold text-black text-xs mt-1">
// //                                             ₹ {product.price}/Piece
// //                                         </p>
// //                                     </div>
// //                                 </div>
// //                             ))}
// //                         </div>

// //                         {/* Load More Button */}
// //                         {sortedProducts.length > 0 && (
// //                             <div className="text-center mt-12">
// //                                 <button className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
// //                                     Load More Products
// //                                 </button>
// //                             </div>
// //                         )}

// //                         {/* No Products Found */}
// //                         {sortedProducts.length === 0 && (
// //                             <div className="text-center py-12">
// //                                 <p className="text-gray-600">No utility/decor products found. Try changing your filters.</p>
// //                             </div>
// //                         )}
// //                     </main>
// //                 </div>
// //             </div>

// //             {/* Filter Sidebar (Right Side) */}
// //             <div className={`fixed inset-0 z-50 transition-all duration-300 ${isFilterOpen ? 'visible' : 'invisible'}`}>
// //                 {/* Overlay */}
// //                 <div
// //                     className={`absolute inset-0 bg-black transition-opacity duration-300 ${isFilterOpen ? 'opacity-50' : 'opacity-0'}`}
// //                     onClick={() => setIsFilterOpen(false)}
// //                 />

// //                 {/* Filter Panel */}
// //                 <div className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
// //                     <div className="h-full flex flex-col">
// //                         {/* Panel Header */}
// //                         <div className="flex items-center justify-between p-6 border-b border-gray-200">
// //                             <h2 className="text-xl mona font-bold text-gray-800">Filters</h2>
// //                             <button
// //                                 onClick={() => setIsFilterOpen(false)}
// //                                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// //                             >
// //                                 <img src="/images/icons/close-circle.svg" className="w-7 h-7" alt="Close" />
// //                             </button>
// //                         </div>

// //                         {/* Filter Content */}
// //                         <div className="flex-1 overflow-y-auto p-6 space-y-6">
// //                             {Object.entries(filters).map(([title, options]) => (
// //                                 <div key={title}>
// //                                     <button
// //                                         onClick={() => toggleSection(title)}
// //                                         className="flex justify-between items-center w-full mb-4"
// //                                     >
// //                                         <h3 className="text-sm mona font-semibold text-gray-800">{title}</h3>
// //                                         <ChevronRight
// //                                             className={`w-4 h-4 transition-transform ${expandedSections[title] ? 'rotate-90' : ''}`}
// //                                         />
// //                                     </button>

// //                                     {expandedSections[title] && (
// //                                         <div className="space-y-2 pl-2">
// //                                             {options.map(option => (
// //                                                 <label key={option} className="flex items-center gap-2 cursor-pointer py-1">
// //                                                     <input
// //                                                         type="checkbox"
// //                                                         checked={isFilterChecked(title, option)}
// //                                                         onChange={() => handleFilterChange(title, option)}
// //                                                         className="w-4 h-4 text-[#B38B59] border-gray-300 rounded focus:ring-[#B38B59]"
// //                                                     />
// //                                                     <span className="text-sm text-gray-600 hover:text-gray-900">{option}</span>
// //                                                 </label>
// //                                             ))}
// //                                         </div>
// //                                     )}
// //                                 </div>
// //                             ))}
// //                         </div>

// //                         {/* Panel Footer */}
// //                         <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
// //                             <button
// //                                 onClick={clearAllFilters}
// //                                 className="flex-1 py-3 bg-white border border-gray-400 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
// //                             >
// //                                 Clear All
// //                             </button>
// //                             <button
// //                                 onClick={() => setIsFilterOpen(false)}
// //                                 className="flex-1 py-3 bg-[#B38B59] text-white font-medium rounded-lg hover:bg-[#9C774A] transition-colors"
// //                             >
// //                                 Apply Filters
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Close dropdown when clicking outside */}
// //             {isSortOpen && (
// //                 <div
// //                     className="fixed inset-0 z-30"
// //                     onClick={() => setIsSortOpen(false)}
// //                 />
// //             )}
// //         </div>
// //     );
// // };

// // export default UtilityDecorPage;


// "use client";
// import React, { useState, useEffect } from 'react';
// import { ChevronRight, Search, Heart } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// // Filter options
// const filters = {
//     "Finish / Style": ["All Finishes", "Natural", "Hand Painted", "Antique", "Metallic", "Matte"],
//     "Minimum Order Quantity": ["50-100 pcs", "100-500 pcs", "500-3000 pcs", "1000+ pcs"],
//     "Product Type": ["Ready Stock", "Made to Order"],
//     "Business Services": ["Custom Design", "Private Label", "Corporate Gifts", "Other"]
// };

// // Sort options
// const sortOptions = ["Recommended", "Latest", "Popularity", "Name A-Z", "Name Z-A", "Price Low to High", "Price High to Low"];

// const UtilityDecorPage = () => {
//     const [activeProductType, setActiveProductType] = useState("All Products");
//     const [selectedCategory, setSelectedCategory] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [isSortOpen, setIsSortOpen] = useState(false);
//     const [selectedSort, setSelectedSort] = useState("Recommended");
//     const [wishlist, setWishlist] = useState([]);
//     const [filteredProducts, setFilteredProducts] = useState([]);
//     const [sortedProducts, setSortedProducts] = useState([]);
    
//     // Filter sidebar states
//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//     const [selectedFilters, setSelectedFilters] = useState({
//         "finish/style": [],
//         "minimumorderquantity": [],
//         "producttype": [],
//         "businessservices": []
//     });
//     const [expandedSections, setExpandedSections] = useState({
//         "Finish / Style": true,
//         "Minimum Order Quantity": true,
//         "Product Type": true,
//         "Business Services": true
//     });

//     // Dynamic data states
//     const [utilityDecorProducts, setUtilityDecorProducts] = useState([]);
//     const [utilityDecorCategories, setUtilityDecorCategories] = useState([]);
//     const [productTypes, setProductTypes] = useState(["All Products"]);
//     const [loading, setLoading] = useState(true);
//     const [utilityDecorSubCategories, setUtilityDecorSubCategories] = useState([]);
//     const router = useRouter();

//     // Fetch data from backend
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 console.log('Fetching Utility/Decor page data...');
                
//                 // 1. Fetch all categories to find Utility/Decor category
//                 const categoriesResponse = await fetch('/api/admin/categories');
//                 if (categoriesResponse.ok) {
//                     const categoriesData = await categoriesResponse.json();
//                     console.log('Categories data:', categoriesData);
                    
//                     if (categoriesData.success && categoriesData.data) {
//                         // Find Utility/Decor category (search for variations)
//                         const utilityDecorCategory = categoriesData.data.find(cat => {
//                             const name = cat.name?.toLowerCase() || '';
//                             return name.includes('utility') || 
//                                    name.includes('decor') || 
//                                    name.includes('utensil') ||
//                                    name.includes('home') ||
//                                    name.includes('decorative') ||
//                                    name.includes('accessory');
//                         });
                        
//                         console.log('Found Utility/Decor category:', utilityDecorCategory);
                        
//                         if (utilityDecorCategory) {
//                             // 2. Fetch all subcategories
//                             const subCatResponse = await fetch('/api/admin/subcategories');
//                             if (subCatResponse.ok) {
//                                 const subCatData = await subCatResponse.json();
//                                 console.log('All subcategories:', subCatData);
                                
//                                 if (subCatData.success && subCatData.data) {
//                                     // Filter subcategories that belong to Utility/Decor category
//                                     const utilityDecorSubCats = subCatData.data.filter(subCat => {
//                                         if (subCat.category) {
//                                             // Handle both string and object format
//                                             const categoryId = typeof subCat.category === 'string' 
//                                                 ? subCat.category 
//                                                 : subCat.category._id;
                                            
//                                             return categoryId === utilityDecorCategory._id;
//                                         }
//                                         return false;
//                                     });
                                    
//                                     console.log('Utility/Decor subcategories:', utilityDecorSubCats);
                                    
//                                     // Get category names from subcategories
//                                     const utilityDecorNames = utilityDecorSubCats.map(subCat => subCat.name);
//                                     setUtilityDecorCategories(utilityDecorNames);
//                                     setUtilityDecorSubCategories(utilityDecorSubCats);
//                                 }
//                             }
//                         } else {
//                             console.log('Utility/Decor category not found, using fallback categories');
//                             // Fallback categories if not found in backend
//                             setUtilityDecorCategories([
//                                 "Agarbatti Burner", "Agarbatti Stand", "Ashoka Pillar", "Ashtray", 
//                                 "Bangle", "Book Mark", "Bookend", "Bowl", "Box", "Bracelet", 
//                                 "CD Stand", "Candle Stand", "Card Holder", "Cart", "Chess Set", 
//                                 "Christmas Hanging", "Cigarette Case", "Clock", "Coaster", "Coin Box", 
//                                 "Cora Burner", "Cork", "Dairy", "Decorated", "Dinner Set", "Flower Pot",
//                                 "Fruit Bowl", "Key Chain", "Letter Opener", "Magnifying Glass", "Memo Pad",
//                                 "Money Clip", "Music Box", "Napkin Ring", "Paper Weight", "Pen Stand",
//                                 "Photo Frame", "Souvenir", "Spice Box", "Table Lamp", "Tissue Box",
//                                 "Toothpick Holder", "Tray", "Vase", "Wall Hanging", "Wine Rack"
//                             ]);
//                         }
//                     }
//                 } else {
//                     console.error('Failed to fetch categories:', categoriesResponse.status);
//                 }
                
//                 // 3. Fetch all products
//                 const productsResponse = await fetch('/api/admin/products');
//                 if (productsResponse.ok) {
//                     const productsData = await productsResponse.json();
//                     console.log('Products data:', productsData);
                    
//                     if (productsData.success && productsData.data) {
//                         // Filter only utility/decor products
//                         const utilityDecorProductsData = productsData.data.filter(product => {
//                             // Check if product belongs to Utility/Decor category
//                             if (product.category) {
//                                 const categoryName = typeof product.category === 'string' 
//                                     ? product.category 
//                                     : (product.category.name || "");
                                
//                                 const categoryLower = categoryName.toLowerCase();
//                                 return categoryLower.includes('utility') || 
//                                        categoryLower.includes('decor') || 
//                                        categoryLower.includes('utensil') ||
//                                        categoryLower.includes('home') ||
//                                        categoryLower.includes('accessory') ||
//                                        categoryLower.includes('showpiece') ||
//                                        categoryLower.includes('bowl') ||
//                                        categoryLower.includes('candle') ||
//                                        categoryLower.includes('coaster') ||
//                                        categoryLower.includes('clock') ||
//                                        categoryLower.includes('vase') ||
//                                        categoryLower.includes('lamp');
//                             }
//                             return false;
//                         });
                        
//                         console.log('Utility/Decor products found:', utilityDecorProductsData.length);
                        
//                         // Transform products to match frontend structure
//                         const transformedProducts = utilityDecorProductsData.map(product => ({
//                             id: product._id,
//                             name: product.name || "Unnamed Product",
//                             price: product.price?.toString() || "0",
//                             moq: product.minimumOrderQuantity || product.moq || 0,
//                             img: product.images?.[0] || '/images/placeholder.jpg',
//                             category: product.subCategory?.name || "",
//                             subCategoryId: product.subCategory?._id || "",
//                             finish: product.finish || "Natural",
//                             productType: product.productType || "Ready Stock",
//                             services: product.services || [],
//                             createdAt: product.createdAt || new Date().toISOString()
//                         }));
                        
//                         console.log('Transformed products:', transformedProducts);
                        
//                         setUtilityDecorProducts(transformedProducts);
//                         setFilteredProducts(transformedProducts);
//                         setSortedProducts(transformedProducts);
                        
//                         // Extract unique product types
//                         const types = [...new Set(transformedProducts.map(p => p.productType).filter(Boolean))];
//                         setProductTypes(["All Products", ...types]);
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 // Fallback to static data if API fails
//                 setUtilityDecorCategories([
//                     "Agarbatti Burner", "Agarbatti Stand", "Ashoka Pillar", "Ashtray", 
//                     "Bangle", "Book Mark", "Bookend", "Bowl", "Box", "Bracelet", 
//                     "CD Stand", "Candle Stand", "Card Holder", "Cart", "Chess Set", 
//                     "Christmas Hanging", "Cigarette Case", "Clock", "Coaster", "Coin Box", 
//                     "Cora Burner", "Cork", "Dairy", "Decorated", "Dinner Set", "Flower Pot",
//                     "Fruit Bowl", "Key Chain", "Letter Opener", "Magnifying Glass", "Memo Pad",
//                     "Money Clip", "Music Box", "Napkin Ring", "Paper Weight", "Pen Stand",
//                     "Photo Frame", "Souvenir", "Spice Box", "Table Lamp", "Tissue Box",
//                     "Toothpick Holder", "Tray", "Vase", "Wall Hanging", "Wine Rack"
//                 ]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     // Filter categories based on search
//     const filteredCategories = utilityDecorCategories.filter(category =>
//         category.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // Handle category selection
//     const handleCategorySelect = (category) => {
//         setSelectedCategory(prev =>
//             prev.includes(category)
//                 ? prev.filter(c => c !== category)
//                 : [...prev, category]
//         );
//     };

//     // Toggle wishlist
//     const toggleWishlist = (productId) => {
//         setWishlist(prev =>
//             prev.includes(productId)
//                 ? prev.filter(id => id !== productId)
//                 : [...prev, productId]
//         );
//     };

//     // Handle product click
//     const handleProductClick = (product) => {
//         router.push(`/product/${product.id}`);
//     };

//     // Fixed filter change handler
//     const handleFilterChange = (filterType, value) => {
//         const filterKey = filterType.toLowerCase().replace(/\s+/g, '');
        
//         setSelectedFilters(prev => ({
//             ...prev,
//             [filterKey]: prev[filterKey]?.includes(value)
//                 ? prev[filterKey].filter(item => item !== value)
//                 : [...(prev[filterKey] || []), value]
//         }));
//     };

//     // Toggle filter sections
//     const toggleSection = (section) => {
//         setExpandedSections(prev => ({
//             ...prev,
//             [section]: !prev[section]
//         }));
//     };

//     // Get checked status for filters
//     const isFilterChecked = (filterType, value) => {
//         const filterKey = filterType.toLowerCase().replace(/\s+/g, '');
//         return selectedFilters[filterKey]?.includes(value) || false;
//     };

//     // Apply filters
//     useEffect(() => {
//         let filtered = [...utilityDecorProducts];
        
//         console.log('Applying filters...');
//         console.log('Selected categories:', selectedCategory);
//         console.log('Total utility/decor products:', filtered.length);

//         // Filter by selected categories (subcategories)
//         if (selectedCategory.length > 0) {
//             filtered = filtered.filter(product => {
//                 return selectedCategory.some(category => {
//                     // Direct name comparison
//                     if (product.category && product.category.toLowerCase() === category.toLowerCase()) {
//                         return true;
//                     }
                    
//                     // Check if product name contains category name
//                     if (product.name && product.name.toLowerCase().includes(category.toLowerCase())) {
//                         return true;
//                     }
                    
//                     return false;
//                 });
//             });
            
//             console.log('After category filter:', filtered.length);
//         }

//         // Filter by product type
//         if (activeProductType !== "All Products") {
//             filtered = filtered.filter(product => 
//                 product.productType === activeProductType
//             );
//             console.log('After product type filter:', filtered.length);
//         }

//         // Right sidebar filters
//         if (selectedFilters["finish/style"] && selectedFilters["finish/style"].length > 0 && !selectedFilters["finish/style"].includes("All Finishes")) {
//             filtered = filtered.filter(product => 
//                 selectedFilters["finish/style"].some(finish => {
//                     if (finish === "All Finishes") return true;
//                     return product.finish === finish;
//                 })
//             );
//             console.log('After finish filter:', filtered.length);
//         }

//         if (selectedFilters["minimumorderquantity"] && selectedFilters["minimumorderquantity"].length > 0) {
//             filtered = filtered.filter(product => {
//                 return selectedFilters["minimumorderquantity"].some(range => {
//                     if (range === "50-100 pcs") return product.moq >= 50 && product.moq <= 100;
//                     if (range === "100-500 pcs") return product.moq > 100 && product.moq <= 500;
//                     if (range === "500-3000 pcs") return product.moq > 500 && product.moq <= 3000;
//                     if (range === "1000+ pcs") return product.moq > 1000;
//                     return true;
//                 });
//             });
//             console.log('After MOQ filter:', filtered.length);
//         }

//         if (selectedFilters["producttype"] && selectedFilters["producttype"].length > 0) {
//             filtered = filtered.filter(product => 
//                 selectedFilters["producttype"].includes(product.productType)
//             );
//             console.log('After product type filter:', filtered.length);
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
//             console.log('After services filter:', filtered.length);
//         }

//         setFilteredProducts(filtered);
//         applySorting(filtered, selectedSort);
//     }, [utilityDecorProducts, selectedCategory, activeProductType, selectedFilters, selectedSort]);

//     // Apply sorting
//     const applySorting = (productsToSort, sortType) => {
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
//                 sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
//                 break;
//             case "Popularity":
//                 sorted.sort((a, b) => (a.moq || 0) - (b.moq || 0));
//                 break;
//             default: // "Recommended"
//                 break;
//         }

//         setSortedProducts(sorted);
//     };

//     // Handle sort selection
//     const handleSort = (sortType) => {
//         setSelectedSort(sortType);
//         setIsSortOpen(false);
//         applySorting(filteredProducts, sortType);
//     };

//     // Clear all filters
//     const clearAllFilters = () => {
//         setSelectedCategory([]);
//         setActiveProductType("All Products");
//         setSearchTerm("");
//         setSelectedFilters({
//             "finish/style": [],
//             "minimumorderquantity": [],
//             "producttype": [],
//             "businessservices": []
//         });
//     };

//     return (
//         <div className="min-h-screen bg-[#FDFBF7] font-sans">
//             {/* Header */}
//             <header className="bg-white py-2">
//                 <div className="max-w-7xl mx-auto px-4 py-6">
//                     <h1 className="text-3xl playfair font-bold text-center text-gray-800 mb-2">Utility / Decor</h1>
//                 </div>
//             </header>

//             <div className="max-w-7xl mx-auto px-4 py-8">
//                 <div className="flex flex-col lg:flex-row gap-8">
//                     {/* Left Sidebar - Utility / Decor Categories */}
//                     <aside className="w-full lg:w-60 flex-shrink-0">
//                         <div className="sticky top-8">
//                             <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
//                                 {/* Category Header */}
//                                 <div className="p-4 border-b border-gray-200">
//                                     <h2 className="text-lg mona font-semibold text-gray-800">Categories</h2>
//                                 </div>

//                                 {/* Search Bar */}
//                                 <div className="p-4 border-b border-gray-200">
//                                     <div className="relative">
//                                         <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//                                         <input
//                                             type="text"
//                                             placeholder="Search categories"
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                             className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Category List */}
//                                 <div className="p-4">
//                                     <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2">
//                                         {loading ? (
//                                             <div className="text-center py-4">
//                                                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C08237] mx-auto"></div>
//                                                 <p className="mt-2 text-sm text-gray-600">Loading categories...</p>
//                                             </div>
//                                         ) : filteredCategories.length > 0 ? (
//                                             <>
//                                                 <p className="text-xs text-gray-500 mb-2">
//                                                     Found {filteredCategories.length} categories
//                                                 </p>
//                                                 {filteredCategories.map(category => {
//                                                     // Count products for this category
//                                                     const productCount = utilityDecorProducts.filter(product => 
//                                                         product.category && product.category.toLowerCase() === category.toLowerCase()
//                                                     ).length;
                                                    
//                                                     return (
//                                                         <label key={category} className="flex items-center gap-2 cursor-pointer py-1">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 checked={selectedCategory.includes(category)}
//                                                                 onChange={() => handleCategorySelect(category)}
//                                                                 className="w-4 h-4 text-[#C08237] border-gray-300 rounded focus:ring-[#C08237]"
//                                                             />
//                                                             <div className="flex justify-between items-center w-full">
//                                                                 <span className="text-sm text-gray-600 hover:text-gray-900">
//                                                                     {category}
//                                                                 </span>
//                                                                 <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
//                                                                     {productCount}
//                                                                 </span>
//                                                             </div>
//                                                         </label>
//                                                     );
//                                                 })}
//                                             </>
//                                         ) : (
//                                             <div className="text-center py-4">
//                                                 <p className="text-sm text-gray-500">No categories found</p>
//                                                 <p className="text-xs text-gray-400 mt-1">
//                                                     Check if "Utility/Decor" category exists in database
//                                                 </p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </aside>

//                     {/* Main Content */}
//                     <main className="flex-1">
//                         {/* Debug Info */}
                       

//                         {/* Top Toolbar */}
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                             {/* Product Type Filters */}
//                             <div className="flex flex-wrap gap-2">
//                                 {productTypes.map(type => (
//                                     <button
//                                         key={type}
//                                         onClick={() => setActiveProductType(type)}
//                                         className={`px-4 py-2 rounded-full text-[12px] mona font-medium transition-colors ${activeProductType === type
//                                                 ? 'bg-[#C08237] text-white'
//                                                 : 'bg-white border border-gray-400 text-gray-900 hover:bg-gray-50'
//                                             }`}
//                                     >
//                                         {type}
//                                     </button>
//                                 ))}
//                             </div>

//                             {/* Sort and Filter Buttons */}
//                             <div className="flex gap-3 relative">
//                                 {/* Sort By Dropdown */}
//                                 <div className="relative">
//                                     <button
//                                         onClick={() => setIsSortOpen(!isSortOpen)}
//                                         className="flex items-center gap-2 bg-white border border-gray-400 text-sm hover:bg-gray-50 px-3 py-2 rounded-full text-[12px] mona font-medium transition-colors"
//                                     >
//                                         Sort By <img src='/images/icons/arrow-3.svg' className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
//                                     </button>

//                                     {/* Sort Dropdown Menu */}
//                                     {isSortOpen && (
//                                         <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
//                                             <div className="py-2">
//                                                 {sortOptions.map((option) => (
//                                                     <button
//                                                         key={option}
//                                                         onClick={() => handleSort(option)}
//                                                         className={`flex justify-between items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-sm ${selectedSort === option ? 'text-[#C08237] font-medium' : 'text-gray-700'
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

//                                 {/* Filter Button */}
//                                 <button
//                                     onClick={() => setIsFilterOpen(true)}
//                                     className="flex items-center gap-2 bg-white border border-gray-400 text-sm hover:bg-gray-50 px-3 py-2 rounded-full text-[12px] mona font-medium transition-colors"
//                                 >
//                                     Filters <img src='/images/icons/setting-4.svg' className="w-4 h-4" />
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Results Count and Clear Filters */}
//                         <div className="mb-6 flex justify-between items-center">
//                             <p className="text-gray-600">
//                                 Showing <span className="font-semibold">{sortedProducts.length}</span> products
//                             </p>
//                             {(selectedCategory.length > 0 || Object.values(selectedFilters).some(arr => arr.length > 0)) && (
//                                 <button
//                                     onClick={clearAllFilters}
//                                     className="text-sm text-[#C08237] hover:text-[#9C774A] font-medium"
//                                 >
//                                     Clear all filters
//                                 </button>
//                             )}
//                         </div>

//                         {/* Loading State */}
//                         {loading ? (
//                             <div className="flex justify-center items-center h-64">
//                                 <div className="text-center">
//                                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C08237] mx-auto"></div>
//                                     <p className="mt-4 text-gray-600">Loading utility/decor products...</p>
//                                     <p className="text-sm text-gray-500 mt-2">Fetching data from backend...</p>
//                                 </div>
//                             </div>
//                         ) : sortedProducts.length === 0 ? (
//                             <div className="text-center py-12 bg-gray-50 rounded-lg">
//                                 <p className="text-gray-600 text-lg mb-2">No utility/decor products found</p>
//                                 <p className="text-sm text-gray-500 mb-4">
//                                     Try changing your filters or check if:
//                                 </p>
                                
//                                 <button
//                                     onClick={clearAllFilters}
//                                     className="mt-6 px-4 py-2 bg-[#C08237] text-white rounded-lg hover:bg-[#9C774A] transition"
//                                 >
//                                     Clear All Filters
//                                 </button>
//                             </div>
//                         ) : (
//                             <>
//                                 {/* Product Grid */}
//                                 <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                                     {sortedProducts.map(product => (
//                                         <div 
//                                             key={product.id} 
//                                             className="cursor-pointer w-full max-w-[480px] relative group"
//                                             onClick={() => handleProductClick(product)}
//                                         >
//                                             <div className="relative w-full h-[280px] sm:h-[330px] bg-gray-100 overflow-hidden rounded-2xl">
//                                                 <img
//                                                     src={product.img}
//                                                     alt={product.name}
//                                                     className="w-full h-full object-cover hover:scale-105 transition duration-300"
//                                                 />

//                                                 {/* Wishlist Button */}
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         toggleWishlist(product.id);
//                                                     }}
//                                                     className="absolute top-3 right-3 z-10 p-2 bg-[#FFFFFF80] backdrop-blur-sm rounded-full 
//                                                                shadow-lg hover:bg-white active:scale-95 
//                                                                transition-all duration-200"
//                                                     aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
//                                                 >
//                                                     <svg
//                                                         xmlns="http://www.w3.org/2000/svg"
//                                                         className={`h-5 w-6 transition-colors duration-200 ${wishlist.includes(product.id)
//                                                                 ? "fill-red-500 text-red-500"
//                                                                 : "text-gray-800 fill-transparent hover:text-red-400"
//                                                             }`}
//                                                         viewBox="0 0 24 24"
//                                                         stroke="currentColor"
//                                                         strokeWidth={wishlist.includes(product.id) ? 0 : 2}
//                                                     >
//                                                         <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
//                                                     </svg>
//                                                 </button>
//                                             </div>

//                                             <div className="mt-3">
//                                                 <h3 className="mona font-semibold text-sm text-black line-clamp-1">
//                                                     {product.name}
//                                                 </h3>
//                                                 {product.category && (
//                                                     <p className="mona text-gray-700 font-normal text-xs mt-1">
//                                                         Category: <b>{product.category}</b>
//                                                     </p>
//                                                 )}
//                                                 <p className="mona text-gray-700 font-normal text-xs mt-1">
//                                                     Minimum Order Quantity: <b>{product.moq} Piece{product.moq !== 1 ? 's' : ''}</b>
//                                                 </p>
//                                                 <p className="mona font-semibold text-black text-xs mt-1">
//                                                     ₹ {product.price}/Piece
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {/* Load More Button */}
//                                 {sortedProducts.length > 0 && (
//                                     <div className="text-center mt-12">
//                                         <button className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
//                                             Load More Products
//                                         </button>
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                     </main>
//                 </div>
//             </div>

//             {/* Filter Sidebar (Right Side) */}
//             <div className={`fixed inset-0 z-50 transition-all duration-300 ${isFilterOpen ? 'visible' : 'invisible'}`}>
//                 {/* Overlay */}
//                 <div
//                     className={`absolute inset-0 bg-black transition-opacity duration-300 ${isFilterOpen ? 'opacity-50' : 'opacity-0'}`}
//                     onClick={() => setIsFilterOpen(false)}
//                 />

//                 {/* Filter Panel */}
//                 <div className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//                     <div className="h-full flex flex-col">
//                         {/* Panel Header */}
//                         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                             <h2 className="text-xl mona font-bold text-gray-800">Filters</h2>
//                             <button
//                                 onClick={() => setIsFilterOpen(false)}
//                                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                             >
//                                 <img src="/images/icons/close-circle.svg" className="w-7 h-7" alt="Close" />
//                             </button>
//                         </div>

//                         {/* Filter Content */}
//                         <div className="flex-1 overflow-y-auto p-6 space-y-6">
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

//                         {/* Panel Footer */}
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
//         </div>
//     );
// };

// export default UtilityDecorPage;

"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Filter options
const filters = {
    "Finish / Style": ["All Finishes", "Natural", "Hand Painted", "Antique", "Metallic", "Matte"],
    "Minimum Order Quantity": ["50-100 pcs", "100-500 pcs", "500-3000 pcs", "1000+ pcs"],
    "Product Type": ["Ready Stock", "Made to Order"],
    "Business Services": ["Custom Design", "Private Label", "Corporate Gifts", "Other"]
};

// Sort options
const sortOptions = ["Recommended", "Latest", "Popularity", "Name A-Z", "Name Z-A", "Price Low to High", "Price High to Low"];

const UtilityDecorPage = () => {
    const [activeProductType, setActiveProductType] = useState("All Products");
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState("Recommended");
    const [wishlist, setWishlist] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    
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
    const [utilityDecorProducts, setUtilityDecorProducts] = useState([]);
    const [utilityDecorCategories, setUtilityDecorCategories] = useState([]);
    const [productTypes, setProductTypes] = useState(["All Products"]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fallback images agar product images na ho
    const fallbackImages = [
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1556909114-dad0865b86d4?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=500&fit=crop"
    ];

    // Get random fallback image
    const getRandomFallbackImage = () => {
        return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    };

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Fetching Utility/Decor page data...');
                
                // 1. Fetch all categories
                const categoriesResponse = await fetch('/api/admin/categories');
                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json();
                    console.log('Categories data:', categoriesData);
                    
                    if (categoriesData.success && categoriesData.data) {
                        // Find Utility/Decor category
                        const utilityDecorCategory = categoriesData.data.find(cat => {
                            const name = cat.name?.toLowerCase() || '';
                            return name.includes('utility') || 
                                   name.includes('decor') || 
                                   name.includes('utensil') ||
                                   name.includes('home') ||
                                   name.includes('decorative') ||
                                   name.includes('accessory') ||
                                   name === 'utility / decor';
                        });
                        
                        console.log('Found Utility/Decor category:', utilityDecorCategory);
                        
                        if (utilityDecorCategory) {
                            // 2. Fetch all subcategories
                            const subCatResponse = await fetch('/api/admin/subcategories');
                            if (subCatResponse.ok) {
                                const subCatData = await subCatResponse.json();
                                console.log('All subcategories:', subCatData);
                                
                                if (subCatData.success && subCatData.data) {
                                    // Filter subcategories that belong to Utility/Decor category
                                    const utilityDecorSubCats = subCatData.data.filter(subCat => {
                                        if (subCat.category) {
                                            const categoryId = typeof subCat.category === 'string' 
                                                ? subCat.category 
                                                : subCat.category._id;
                                            return categoryId === utilityDecorCategory._id;
                                        }
                                        return false;
                                    });
                                    
                                    // Get category names from subcategories
                                    const utilityDecorNames = utilityDecorSubCats.map(subCat => subCat.name);
                                    setUtilityDecorCategories(utilityDecorNames);
                                    console.log('Utility/Decor categories:', utilityDecorNames);
                                }
                            }
                        } else {
                            console.log('Utility/Decor category not found, using fallback categories');
                            setUtilityDecorCategories([
                                "Agarbatti Burner", "Agarbatti Stand", "Ashoka Pillar", "Ashtray", 
                                "Bangle", "Book Mark", "Bookend", "Bowl", "Box", "Bracelet", 
                                "CD Stand", "Candle Stand", "Card Holder", "Cart", "Chess Set", 
                                "Christmas Hanging", "Cigarette Case", "Clock", "Coaster", "Coin Box", 
                                "Cora Burner", "Cork", "Dairy", "Decorated", "Dinner Set", "Flower Pot",
                                "Fruit Bowl", "Key Chain", "Letter Opener", "Magnifying Glass", "Memo Pad",
                                "Money Clip", "Music Box", "Napkin Ring", "Paper Weight", "Pen Stand",
                                "Photo Frame", "Souvenir", "Spice Box", "Table Lamp", "Tissue Box",
                                "Toothpick Holder", "Tray", "Vase", "Wall Hanging", "Wine Rack"
                            ]);
                        }
                    }
                }
                
                // 3. Fetch all products
                const productsResponse = await fetch('/api/admin/products');
                if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    console.log('Products API response:', productsData);
                    
                    if (productsData.success && productsData.data) {
                        console.log('Total products:', productsData.data.length);
                        
                        // Filter only utility/decor products
                        const utilityDecorProductsData = productsData.data.filter(product => {
                            if (product.category) {
                                const categoryName = typeof product.category === 'string' 
                                    ? product.category 
                                    : (product.category.name || "");
                                
                                const categoryLower = categoryName.toLowerCase();
                                console.log('Product category:', categoryName);
                                
                                return categoryLower.includes('utility') || 
                                       categoryLower.includes('decor') || 
                                       categoryLower.includes('utensil') ||
                                       categoryLower.includes('home') ||
                                       categoryLower.includes('accessory') ||
                                       categoryLower.includes('showpiece') ||
                                       categoryLower.includes('bowl') ||
                                       categoryLower.includes('candle') ||
                                       categoryLower.includes('coaster') ||
                                       categoryLower.includes('clock') ||
                                       categoryLower.includes('vase') ||
                                       categoryLower.includes('lamp');
                            }
                            return false;
                        });
                        
                        console.log('Utility/Decor products found:', utilityDecorProductsData.length);
                        console.log('Sample product:', utilityDecorProductsData[0]);
                        
                        // Transform products to match frontend structure
                        const transformedProducts = utilityDecorProductsData.map(product => {
                            // Fix image URL - agar images array mein hai
                            let productImage = getRandomFallbackImage();
                            
                            if (product.images && product.images.length > 0) {
                                // Agar image string hai directly
                                if (typeof product.images[0] === 'string') {
                                    productImage = product.images[0];
                                } 
                                // Agar object hai toh URL property check karo
                                else if (product.images[0].url) {
                                    productImage = product.images[0].url;
                                }
                                // Agar direct object hai
                                else if (product.images[0]) {
                                    // Object ka string representation check karo
                                    const imgObj = product.images[0];
                                    productImage = imgObj.toString().startsWith('http') 
                                        ? imgObj.toString() 
                                        : getRandomFallbackImage();
                                }
                            }
                            
                            return {
                                id: product._id,
                                name: product.name || "Unnamed Product",
                                price: product.price?.toString() || "0",
                                moq: product.minimumOrderQuantity || product.moq || 0,
                                img: productImage,
                                category: product.subCategory?.name || product.category?.name || "",
                                subCategoryId: product.subCategory?._id || "",
                                finish: product.finish || "Natural",
                                productType: product.productType || "Ready Stock",
                                services: product.services || [],
                                createdAt: product.createdAt || new Date().toISOString()
                            };
                        });
                        
                        console.log('Transformed products:', transformedProducts);
                        
                        setUtilityDecorProducts(transformedProducts);
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
                setUtilityDecorCategories([
                    "Agarbatti Burner", "Agarbatti Stand", "Ashoka Pillar", "Ashtray", 
                    "Bangle", "Book Mark", "Bookend", "Bowl", "Box", "Bracelet", 
                    "CD Stand", "Candle Stand", "Card Holder", "Cart", "Chess Set", 
                    "Christmas Hanging", "Cigarette Case", "Clock", "Coaster", "Coin Box", 
                    "Cora Burner", "Cork", "Dairy", "Decorated", "Dinner Set", "Flower Pot",
                    "Fruit Bowl", "Key Chain", "Letter Opener", "Magnifying Glass", "Memo Pad",
                    "Money Clip", "Music Box", "Napkin Ring", "Paper Weight", "Pen Stand",
                    "Photo Frame", "Souvenir", "Spice Box", "Table Lamp", "Tissue Box",
                    "Toothpick Holder", "Tray", "Vase", "Wall Hanging", "Wine Rack"
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter categories based on search
    const filteredCategories = utilityDecorCategories.filter(category =>
        category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle category selection
    const handleCategorySelect = (category) => {
        setSelectedCategory(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    // Toggle wishlist
    const toggleWishlist = (productId) => {
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    // Handle product click
    const handleProductClick = (product) => {
        router.push(`/product/${product.id}`);
    };

    // Fixed filter change handler
    const handleFilterChange = (filterType, value) => {
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
        let filtered = [...utilityDecorProducts];
        
        console.log('Applying filters...');
        console.log('Selected categories:', selectedCategory);
        console.log('Total utility/decor products:', filtered.length);

        // Filter by selected categories (subcategories)
        if (selectedCategory.length > 0) {
            filtered = filtered.filter(product => {
                return selectedCategory.some(category => {
                    // Direct name comparison
                    if (product.category && product.category.toLowerCase() === category.toLowerCase()) {
                        return true;
                    }
                    
                    // Check if product name contains category name
                    if (product.name && product.name.toLowerCase().includes(category.toLowerCase())) {
                        return true;
                    }
                    
                    return false;
                });
            });
            
            console.log('After category filter:', filtered.length);
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
    }, [utilityDecorProducts, selectedCategory, activeProductType, selectedFilters, selectedSort]);

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
        setSelectedCategory([]);
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
            {/* Header */}
            <header className="bg-white py-2">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl playfair font-bold text-center text-gray-800 mb-2">Utility / Decor</h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar - Utility / Decor Categories */}
                    <aside className="w-full lg:w-60 flex-shrink-0">
                        <div className="sticky top-8">
                            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                                {/* Category Header */}
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-lg mona font-semibold text-gray-800">Categories</h2>
                                </div>

                                {/* Search Bar */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search categories"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Category List */}
                                <div className="p-4">
                                    <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2">
                                        {loading ? (
                                            <div className="text-center py-4">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C08237] mx-auto"></div>
                                                <p className="mt-2 text-sm text-gray-600">Loading categories...</p>
                                            </div>
                                        ) : filteredCategories.length > 0 ? (
                                            <>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    Found {filteredCategories.length} categories
                                                </p>
                                                {filteredCategories.map(category => {
                                                    // Count products for this category
                                                    const productCount = utilityDecorProducts.filter(product => 
                                                        product.category && product.category.toLowerCase() === category.toLowerCase()
                                                    ).length;
                                                    
                                                    return (
                                                        <label key={category} className="flex items-center gap-2 cursor-pointer py-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedCategory.includes(category)}
                                                                onChange={() => handleCategorySelect(category)}
                                                                className="w-4 h-4 text-[#C08237] border-gray-300 rounded focus:ring-[#C08237]"
                                                            />
                                                            <div className="flex justify-between items-center w-full">
                                                                <span className="text-sm text-gray-600 hover:text-gray-900">
                                                                    {category}
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
                                                <p className="text-sm text-gray-500">No categories found</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Check if "Utility/Decor" category exists in database
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
                        {/* Debug Info */}
                        <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-50 rounded">
                            <div className="flex gap-4">
                                <span>Categories: {utilityDecorCategories.length}</span>
                                <span>Products: {utilityDecorProducts.length}</span>
                                <span>Selected: {selectedCategory.length}</span>
                                <span>Showing: {sortedProducts.length}</span>
                            </div>
                            {selectedCategory.length > 0 && (
                                <div className="mt-1">
                                    Selected: {selectedCategory.join(', ')}
                                </div>
                            )}
                        </div>

                        {/* Top Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            {/* Product Type Filters */}
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
                                Showing <span className="font-semibold">{sortedProducts.length}</span> products
                            </p>
                            {(selectedCategory.length > 0 || Object.values(selectedFilters).some(arr => arr.length > 0)) && (
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
                                    <p className="mt-4 text-gray-600">Loading utility/decor products...</p>
                                    <p className="text-sm text-gray-500 mt-2">Fetching data from backend...</p>
                                </div>
                            </div>
                        ) : sortedProducts.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 text-lg mb-2">No utility/decor products found</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Try changing your filters or check if:
                                </p>
                                <ul className="text-sm text-gray-500 text-left max-w-md mx-auto">
                                    <li className="mb-1">• "Utility/Decor" category exists in database</li>
                                    <li className="mb-1">• Products are assigned to Utility/Decor category</li>
                                    <li className="mb-1">• Utility/Decor subcategories are properly linked</li>
                                    <li>• Products have correct category references</li>
                                </ul>
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
                                    {sortedProducts.map((product, index) => (
                                        <div 
                                            key={`${product.id}-${index}`} 
                                            className="cursor-pointer w-full max-w-[480px] relative group"
                                            onClick={() => handleProductClick(product)}
                                        >
                                            <div className="relative w-full h-[280px] sm:h-[330px] bg-gray-100 overflow-hidden rounded-2xl">
                                                <img
                                                    src={product.img || getRandomFallbackImage()}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                                    onError={(e) => {
                                                        e.target.src = getRandomFallbackImage();
                                                    }}
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
                                                <h3 className="mona font-semibold text-sm text-black line-clamp-1">
                                                    {product.name}
                                                </h3>
                                                {product.category && (
                                                    <p className="mona text-gray-700 font-normal text-xs mt-1">
                                                        Category: <b>{product.category}</b>
                                                    </p>
                                                )}
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

                                {/* Load More Button */}
                                {sortedProducts.length > 0 && (
                                    <div className="text-center mt-12">
                                        <button className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                            Load More Products
                                        </button>
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

export default UtilityDecorPage;