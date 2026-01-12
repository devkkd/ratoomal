// "use client";
// import React, { useState, useEffect } from 'react';
// import { ChevronRight, Search, Heart } from 'lucide-react';

// // Animal category data
// const animalCategories = [
//     "Bear", "Bird", "Buffalo", "Bull", "Camel", "Cat", "Cheetah",
//     "Cobra", "Cock", "Cow", "Crane", "Crocodile", "Dholamaru", "Dinosaur",
//     "Dodo", "Dog", "Dolphin", "Donkey", "Duck", "Eagle", "Elephant",
//     "Fish", "Fox", "Frog", "Giraffe", "Goat", "Hen", "Hippopotamus", 
//     "Horse", "Kangaroo", "Leopard", "Lion", "Monkey", "Mouse", "Ostrich",
//     "Owl", "Parrot", "Peacock", "Pigeon", "Rabbit", "Rhino", "Snake",
//     "Tiger", "Tortoise", "Wolf", "Zebra"
// ];

// // Sample animal products data
// const animalProducts = [
//     {
//         id: 1,
//         name: "Multicolor Wooden Elephant Statue",
//         price: "3,500",
//         moq: 100,
//         img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=500&fit=crop",
//         category: "Elephant"
//     },
//     {
//         id: 2,
//         name: "Brown Wooden Elephant Statue",
//         price: "2,500",
//         moq: 100,
//         img: "https://images.unsplash.com/photo-1560215987-7e19d88c1e85?w=400&h=500&fit=crop",
//         category: "Elephant"
//     },
//     {
//         id: 3,
//         name: "Blue White Owl Showpiece",
//         price: "1,500",
//         moq: 100,
//         img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
//         category: "Owl"
//     },
//     {
//         id: 4,
//         name: "Wooden Horse Statue",
//         price: "2,200",
//         moq: 150,
//         img: "https://images.unsplash.com/photo-1566933293061-be10b4b1b06a?w=400&h=500&fit=crop",
//         category: "Horse"
//     },
//     {
//         id: 5,
//         name: "Golden Lion Sculpture",
//         price: "4,500",
//         moq: 75,
//         img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop",
//         category: "Lion"
//     },
//     {
//         id: 6,
//         name: "Wooden Deer Family",
//         price: "3,200",
//         moq: 120,
//         img: "https://images.unsplash.com/photo-1551085254-e96b210db58a?w=400&h=500&fit=crop",
//         category: "Deer"
//     },
//     {
//         id: 7,
//         name: "Colorful Peacock Showpiece",
//         price: "2,800",
//         moq: 90,
//         img: "https://images.unsplash.com/photo-1566908829550-84e0c0db0918?w=400&h=500&fit=crop",
//         category: "Peacock"
//     },
//     {
//         id: 8,
//         name: "Wooden Tiger Carving",
//         price: "3,800",
//         moq: 80,
//         img: "https://images.unsplash.com/photo-1579168765467-3b235f938439?w=400&h=500&fit=crop",
//         category: "Tiger"
//     },
//     {
//         id: 9,
//         name: "Bird Sculpture Set",
//         price: "2,100",
//         moq: 200,
//         img: "https://images.unsplash.com/photo-1611083360739-bd5f14435b4d?w=400&h=500&fit=crop",
//         category: "Bird"
//     },
//     {
//         id: 10,
//         name: "Wooden Giraffe Family",
//         price: "3,100",
//         moq: 110,
//         img: "https://images.unsplash.com/photo-1543946602-59c20e8b3c59?w=400&h=500&fit=crop",
//         category: "Giraffe"
//     },
//     {
//         id: 11,
//         name: "Camel Desert Statue",
//         price: "2,700",
//         moq: 130,
//         img: "https://images.unsplash.com/photo-1579168767757-0d5b2d5e5a5a?w=400&h=500&fit=crop",
//         category: "Camel"
//     },
//     {
//         id: 12,
//         name: "Dolphin Pair Sculpture",
//         price: "2,900",
//         moq: 100,
//         img: "https://images.unsplash.com/photo-1543946602-59c20e8b3c59?w=400&h=500&fit=crop",
//         category: "Dolphin"
//     }
// ];

// // Product type categories (as shown in image)
// const productTypes = ["All Products", "Product Type 1", "Product Type 2", "Product Type 3", "Product Type 4"];

// // Sort options
// const sortOptions = ["Recommended", "Latest", "Popularity", "Name A-Z", "Name Z-A", "Price Low to High", "Price High to Low"];

// const AnimalPage = () => {
//     const [activeProductType, setActiveProductType] = useState("All Products");
//     const [selectedAnimal, setSelectedAnimal] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [isSortOpen, setIsSortOpen] = useState(false);
//     const [selectedSort, setSelectedSort] = useState("Recommended");
//     const [wishlist, setWishlist] = useState([]);
//     const [filteredProducts, setFilteredProducts] = useState(animalProducts);
//     const [sortedProducts, setSortedProducts] = useState(animalProducts);

//     // Filter animals based on search
//     const filteredAnimals = animalCategories.filter(animal =>
//         animal.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // Handle animal selection
//     const handleAnimalSelect = (animal) => {
//         setSelectedAnimal(prev =>
//             prev.includes(animal)
//                 ? prev.filter(a => a !== animal)
//                 : [...prev, animal]
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

//     // Apply filters
//     useEffect(() => {
//         let filtered = [...animalProducts];

//         // Filter by selected animals
//         if (selectedAnimal.length > 0) {
//             filtered = filtered.filter(product =>
//                 selectedAnimal.some(animal =>
//                     product.name.toLowerCase().includes(animal.toLowerCase()) ||
//                     product.category.toLowerCase() === animal.toLowerCase()
//                 )
//             );
//         }

//         // Filter by product type (simulated - adjust based on your actual data)
//         if (activeProductType !== "All Products") {
//             filtered = filtered.filter(product => 
//                 product.category && product.category.toLowerCase().includes(activeProductType.toLowerCase().replace('product type ', ''))
//             );
//         }

//         setFilteredProducts(filtered);
//         applySorting(filtered, selectedSort);
//     }, [selectedAnimal, activeProductType, selectedSort]);

//     // Apply sorting
//     const applySorting = (productsToSort, sortType) => {
//         let sorted = [...productsToSort];

//         switch (sortType) {
//             case "Name A-Z":
//                 sorted.sort((a, b) => a.name.localeCompare(b.name));
//                 break;
//             case "Name Z-A":
//                 sorted.sort((a, b) => b.name.localeCompare(a.name));
//                 break;
//             case "Price Low to High":
//                 sorted.sort((a, b) => {
//                     const priceA = parseInt(a.price.replace(/,/g, '')) || 0;
//                     const priceB = parseInt(b.price.replace(/,/g, '')) || 0;
//                     return priceA - priceB;
//                 });
//                 break;
//             case "Price High to Low":
//                 sorted.sort((a, b) => {
//                     const priceA = parseInt(a.price.replace(/,/g, '')) || 0;
//                     const priceB = parseInt(b.price.replace(/,/g, '')) || 0;
//                     return priceB - priceA;
//                 });
//                 break;
//             case "Latest":
//                 sorted.sort((a, b) => b.id - a.id);
//                 break;
//             case "Popularity":
//                 sorted.sort((a, b) => a.moq - b.moq);
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
//     const clearFilters = () => {
//         setSelectedAnimal([]);
//         setActiveProductType("All Products");
//         setSearchTerm("");
//     };

//     return (
//         <div className="min-h-screen bg-[#FDFBF7] font-sans">
//             {/* Header */}
//             <header className="bg-white py-2">
//                 <div className="max-w-7xl mx-auto px-4 py-6">
//                     <h1 className="text-3xl playfair font-bold text-center text-gray-800 mb-2">Animal</h1>
//                 </div>
//             </header>

//             <div className="max-w-7xl mx-auto px-4 py-8">
//                 <div className="flex flex-col lg:flex-row gap-8">
//                     {/* Left Sidebar - Animal Categories */}
//                     <aside className="w-full lg:w-60 flex-shrink-0">
//                         <div className="sticky top-8">
//                             <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
//                                 {/* Category Header */}
//                                 <div className="p-4 border-b border-gray-200">
//                                     <h2 className="text-lg mona font-semibold text-gray-800">Animal</h2>
//                                 </div>

//                                 {/* Search Bar */}
//                                 <div className="p-4 border-b border-gray-200">
//                                     <div className="relative">
//                                         <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//                                         <input
//                                             type="text"
//                                             placeholder="Search"
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                             className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Animal List */}
//                                 <div className="p-4">
//                                     <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2">
//                                         {filteredAnimals.map(animal => (
//                                             <label key={animal} className="flex items-center gap-2 cursor-pointer">
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={selectedAnimal.includes(animal)}
//                                                     onChange={() => handleAnimalSelect(animal)}
//                                                     className="w-4 h-4 text-[#B38B59] border-gray-300 rounded focus:ring-[#B38B59]"
//                                                 />
//                                                 <span className="text-sm text-gray-600 hover:text-gray-900">{animal}</span>
//                                             </label>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </aside>

//                     {/* Main Content */}
//                     <main className="flex-1">
//                         {/* Top Toolbar */}
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                             {/* Product Type Filters */}
//                             <div className="flex flex-wrap gap-2">
//                                 {productTypes.map(type => (
//                                     <button
//                                         key={type}
//                                         onClick={() => setActiveProductType(type)}
//                                         className={`px-4 py-2 rounded-full text-[12px] mona font-medium transition-colors ${activeProductType === type
//                                                 ? 'bg-[#B38B59] text-white'
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
//                                                         className={`flex justify-between items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-sm ${selectedSort === option ? 'text-[#B38B59] font-medium' : 'text-gray-700'
//                                                             }`}
//                                                     >
//                                                         <span>{option}</span>
//                                                         {selectedSort === option && (
//                                                             <svg className="w-4 h-4 text-[#B38B59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
//                                     onClick={clearFilters}
//                                     className="flex items-center gap-2 bg-white border border-gray-400 text-sm hover:bg-gray-50 px-3 py-2 rounded-full text-[12px] mona font-medium transition-colors"
//                                 >
//                                     <span>Clear</span>
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Results Count */}
//                         <div className="mb-6">
//                             <p className="text-gray-600">
//                                 Showing <span className="font-semibold">{sortedProducts.length}</span> products
//                             </p>
//                         </div>

//                         {/* Product Grid */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {sortedProducts.map(product => (
//                                 <div key={product.id} className="cursor-pointer w-full max-w-[480px] relative group">
//                                     <div className="relative w-full h-[280px] sm:h-[330px] bg-gray-100 overflow-hidden rounded-2xl">
//                                         <img
//                                             src={product.img}
//                                             alt={product.name}
//                                             className="w-full h-full object-cover hover:scale-105 transition duration-300"
//                                         />

//                                         {/* Wishlist Button */}
//                                         <button
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 toggleWishlist(product.id);
//                                             }}
//                                             className="absolute top-3 right-3 z-10 p-2 bg-[#FFFFFF80] backdrop-blur-sm rounded-full 
//                                                            shadow-lg hover:bg-white active:scale-95 
//                                                            transition-all duration-200"
//                                             aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
//                                         >
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className={`h-5 w-6 transition-colors duration-200 ${wishlist.includes(product.id)
//                                                         ? "fill-red-500 text-red-500"
//                                                         : "text-gray-800 fill-transparent hover:text-red-400"
//                                                     }`}
//                                                 viewBox="0 0 24 24"
//                                                 stroke="currentColor"
//                                                 strokeWidth={wishlist.includes(product.id) ? 0 : 2}
//                                             >
//                                                 <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
//                                             </svg>
//                                         </button>
//                                     </div>

//                                     <div className="mt-3">
//                                         <h3 className="mona font-semibold text-sm text-black line-clamp-1">
//                                             {product.name}
//                                         </h3>
//                                         <p className="mona text-gray-700 font-normal text-xs mt-1">
//                                             Minimum Order Quantity: <b>{product.moq} Piece</b>
//                                         </p>
//                                         <p className="mona font-semibold text-black text-xs mt-1">
//                                             ₹ {product.price}/Piece
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Load More Button */}
//                         {sortedProducts.length > 0 && (
//                             <div className="text-center mt-12">
//                                 <button className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
//                                     Load More Products
//                                 </button>
//                             </div>
//                         )}

//                         {/* No Products Found */}
//                         {sortedProducts.length === 0 && (
//                             <div className="text-center py-12">
//                                 <p className="text-gray-600">No animal products found. Try changing your filters.</p>
//                             </div>
//                         )}
//                     </main>
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

// export default AnimalPage;

// "use client";
// import React, { useState, useEffect } from 'react';
// import { ChevronRight, Search, Heart } from 'lucide-react';

// // Animal category data
// const animalCategories = [
//     "Bear", "Bird", "Buffalo", "Bull", "Camel", "Cat", "Cheetah",
//     "Cobra", "Cock", "Cow", "Crane", "Crocodile", "Dholamaru", "Dinosaur",
//     "Dodo", "Dog", "Dolphin", "Donkey", "Duck", "Eagle", "Elephant",
//     "Fish", "Fox", "Frog", "Giraffe", "Goat", "Hen", "Hippopotamus", 
//     "Horse", "Kangaroo", "Leopard", "Lion", "Monkey", "Mouse", "Ostrich",
//     "Owl", "Parrot", "Peacock", "Pigeon", "Rabbit", "Rhino", "Snake",
//     "Tiger", "Tortoise", "Wolf", "Zebra"
// ];

// // Sample animal products data
// const animalProducts = [
//     {
//         id: 1,
//         name: "Multicolor Wooden Elephant Statue",
//         price: "3,500",
//         moq: 100,
//         img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=500&fit=crop",
//         category: "Elephant",
//         finish: "Hand Painted",
//         productType: "Made to Order",
//         services: ["Custom Design"]
//     },
//     {
//         id: 2,
//         name: "Brown Wooden Elephant Statue",
//         price: "2,500",
//         moq: 100,
//         img: "https://images.unsplash.com/photo-1560215987-7e19d88c1e85?w=400&h=500&fit=crop",
//         category: "Elephant",
//         finish: "Natural",
//         productType: "Ready Stock",
//         services: ["Private Label"]
//     },
//     {
//         id: 3,
//         name: "Blue White Owl Showpiece",
//         price: "1,500",
//         moq: 100,
//         img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
//         category: "Owl",
//         finish: "Matte",
//         productType: "Made to Order",
//         services: ["Custom Design", "Corporate Gifts"]
//     },
//     {
//         id: 4,
//         name: "Wooden Horse Statue",
//         price: "2,200",
//         moq: 150,
//         img: "https://images.unsplash.com/photo-1566933293061-be10b4b1b06a?w=400&h=500&fit=crop",
//         category: "Horse",
//         finish: "Natural",
//         productType: "Ready Stock",
//         services: []
//     },
//     {
//         id: 5,
//         name: "Golden Lion Sculpture",
//         price: "4,500",
//         moq: 75,
//         img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop",
//         category: "Lion",
//         finish: "Metallic",
//         productType: "Made to Order",
//         services: ["Custom Design", "Corporate Gifts"]
//     },
//     {
//         id: 6,
//         name: "Wooden Deer Family",
//         price: "3,200",
//         moq: 120,
//         img: "https://images.unsplash.com/photo-1551085254-e96b210db58a?w=400&h=500&fit=crop",
//         category: "Deer",
//         finish: "Natural",
//         productType: "Ready Stock",
//         services: ["Private Label"]
//     },
//     {
//         id: 7,
//         name: "Colorful Peacock Showpiece",
//         price: "2,800",
//         moq: 90,
//         img: "https://images.unsplash.com/photo-1566908829550-84e0c0db0918?w=400&h=500&fit=crop",
//         category: "Peacock",
//         finish: "Hand Painted",
//         productType: "Made to Order",
//         services: ["Custom Design"]
//     },
//     {
//         id: 8,
//         name: "Wooden Tiger Carving",
//         price: "3,800",
//         moq: 80,
//         img: "https://images.unsplash.com/photo-1579168765467-3b235f938439?w=400&h=500&fit=crop",
//         category: "Tiger",
//         finish: "Antique",
//         productType: "Made to Order",
//         services: ["Custom Design"]
//     },
//     {
//         id: 9,
//         name: "Bird Sculpture Set",
//         price: "2,100",
//         moq: 200,
//         img: "https://images.unsplash.com/photo-1611083360739-bd5f14435b4d?w=400&h=500&fit=crop",
//         category: "Bird",
//         finish: "Antique",
//         productType: "Ready Stock",
//         services: ["Corporate Gifts"]
//     },
//     {
//         id: 10,
//         name: "Wooden Giraffe Family",
//         price: "3,100",
//         moq: 110,
//         img: "https://images.unsplash.com/photo-1543946602-59c20e8b3c59?w=400&h=500&fit=crop",
//         category: "Giraffe",
//         finish: "Natural",
//         productType: "Made to Order",
//         services: ["Private Label"]
//     },
//     {
//         id: 11,
//         name: "Camel Desert Statue",
//         price: "2,700",
//         moq: 130,
//         img: "https://images.unsplash.com/photo-1579168767757-0d5b2d5e5a5a?w=400&h=500&fit=crop",
//         category: "Camel",
//         finish: "Hand Painted",
//         productType: "Ready Stock",
//         services: ["Corporate Gifts"]
//     },
//     {
//         id: 12,
//         name: "Dolphin Pair Sculpture",
//         price: "2,900",
//         moq: 100,
//         img: "https://images.unsplash.com/photo-1543946602-59c20e8b3c59?w=400&h=500&fit=crop",
//         category: "Dolphin",
//         finish: "Natural",
//         productType: "Made to Order",
//         services: ["Custom Design"]
//     }
// ];

// // Product type categories
// const productTypes = ["All Products", "Product Type 1", "Product Type 2", "Product Type 3", "Product Type 4"];

// // Filter options (same as CategoryPage)
// const filters = {
//     "Finish / Style": ["All Finishes", "Natural", "Hand Painted", "Antique", "Metallic", "Matte"],
//     "Minimum Order Quantity": ["50-100 pcs", "100-500 pcs", "500-3000 pcs", "1000+ pcs"],
//     "Product Type": ["Ready Stock", "Made to Order"],
//     "Business Services": ["Custom Design", "Private Label", "Corporate Gifts", "Other"]
// };

// // Sort options
// const sortOptions = ["Recommended", "Latest", "Popularity", "Name A-Z", "Name Z-A", "Price Low to High", "Price High to Low"];

// const AnimalPage = () => {
//     const [activeProductType, setActiveProductType] = useState("All Products");
//     const [selectedAnimal, setSelectedAnimal] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [isSortOpen, setIsSortOpen] = useState(false);
//     const [selectedSort, setSelectedSort] = useState("Recommended");
//     const [wishlist, setWishlist] = useState([]);
//     const [filteredProducts, setFilteredProducts] = useState(animalProducts);
//     const [sortedProducts, setSortedProducts] = useState(animalProducts);
    
//     // Filter sidebar states (same as CategoryPage)
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

//     // Filter animals based on search
//     const filteredAnimals = animalCategories.filter(animal =>
//         animal.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // Handle animal selection
//     const handleAnimalSelect = (animal) => {
//         setSelectedAnimal(prev =>
//             prev.includes(animal)
//                 ? prev.filter(a => a !== animal)
//                 : [...prev, animal]
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

//     // Fixed filter change handler (same as CategoryPage)
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
//         let filtered = [...animalProducts];

//         // Filter by selected animals
//         if (selectedAnimal.length > 0) {
//             filtered = filtered.filter(product =>
//                 selectedAnimal.some(animal =>
//                     product.name.toLowerCase().includes(animal.toLowerCase()) ||
//                     product.category.toLowerCase() === animal.toLowerCase()
//                 )
//             );
//         }

//         // Filter by product type
//         if (activeProductType !== "All Products") {
//             filtered = filtered.filter(product => 
//                 product.category && product.category.toLowerCase().includes(activeProductType.toLowerCase().replace('product type ', ''))
//             );
//         }

//         // Right sidebar filters (same as CategoryPage)
//         if (selectedFilters["finish/style"] && selectedFilters["finish/style"].length > 0 && !selectedFilters["finish/style"].includes("All Finishes")) {
//             filtered = filtered.filter(product => 
//                 selectedFilters["finish/style"].some(finish => {
//                     if (finish === "All Finishes") return true;
//                     return product.finish === finish;
//                 })
//             );
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
//         applySorting(filtered, selectedSort);
//     }, [selectedAnimal, activeProductType, selectedFilters, selectedSort]);

//     // Apply sorting
//     const applySorting = (productsToSort, sortType) => {
//         let sorted = [...productsToSort];

//         switch (sortType) {
//             case "Name A-Z":
//                 sorted.sort((a, b) => a.name.localeCompare(b.name));
//                 break;
//             case "Name Z-A":
//                 sorted.sort((a, b) => b.name.localeCompare(a.name));
//                 break;
//             case "Price Low to High":
//                 sorted.sort((a, b) => {
//                     const priceA = parseInt(a.price.replace(/,/g, '')) || 0;
//                     const priceB = parseInt(b.price.replace(/,/g, '')) || 0;
//                     return priceA - priceB;
//                 });
//                 break;
//             case "Price High to Low":
//                 sorted.sort((a, b) => {
//                     const priceA = parseInt(a.price.replace(/,/g, '')) || 0;
//                     const priceB = parseInt(b.price.replace(/,/g, '')) || 0;
//                     return priceB - priceA;
//                 });
//                 break;
//             case "Latest":
//                 sorted.sort((a, b) => b.id - a.id);
//                 break;
//             case "Popularity":
//                 sorted.sort((a, b) => a.moq - b.moq);
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
//         setSelectedAnimal([]);
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
//                     <h1 className="text-3xl playfair font-bold text-center text-gray-800 mb-2">Animal</h1>
//                 </div>
//             </header>

//             <div className="max-w-7xl mx-auto px-4 py-8">
//                 <div className="flex flex-col lg:flex-row gap-8">
//                     {/* Left Sidebar - Animal Categories */}
//                     <aside className="w-full lg:w-60 flex-shrink-0">
//                         <div className="sticky top-8">
//                             <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
//                                 {/* Category Header */}
//                                 <div className="p-4 border-b border-gray-200">
//                                     <h2 className="text-lg mona font-semibold text-gray-800">Animal</h2>
//                                 </div>

//                                 {/* Search Bar */}
//                                 <div className="p-4 border-b border-gray-200">
//                                     <div className="relative">
//                                         <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//                                         <input
//                                             type="text"
//                                             placeholder="Search"
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                             className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Animal List */}
//                                 <div className="p-4">
//                                     <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2">
//                                         {filteredAnimals.map(animal => (
//                                             <label key={animal} className="flex items-center gap-2 cursor-pointer">
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={selectedAnimal.includes(animal)}
//                                                     onChange={() => handleAnimalSelect(animal)}
//                                                     className="w-4 h-4 text-[#B38B59] border-gray-300 rounded focus:ring-[#B38B59]"
//                                                 />
//                                                 <span className="text-sm text-gray-600 hover:text-gray-900">{animal}</span>
//                                             </label>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </aside>

//                     {/* Main Content */}
//                     <main className="flex-1">
//                         {/* Top Toolbar - Updated with Filter button */}
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                             {/* Product Type Filters */}
//                             <div className="flex flex-wrap gap-2">
//                                 {productTypes.map(type => (
//                                     <button
//                                         key={type}
//                                         onClick={() => setActiveProductType(type)}
//                                         className={`px-4 py-2 rounded-full text-[12px] mona font-medium transition-colors ${activeProductType === type
//                                                 ? 'bg-[#B38B59] text-white'
//                                                 : 'bg-white border border-gray-400 text-gray-900 hover:bg-gray-50'
//                                             }`}
//                                     >
//                                         {type}
//                                     </button>
//                                 ))}
//                             </div>

//                             {/* Sort and Filter Buttons - Updated */}
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
//                                                         className={`flex justify-between items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-sm ${selectedSort === option ? 'text-[#B38B59] font-medium' : 'text-gray-700'
//                                                             }`}
//                                                     >
//                                                         <span>{option}</span>
//                                                         {selectedSort === option && (
//                                                             <svg className="w-4 h-4 text-[#B38B59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                                                             </svg>
//                                                         )}
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Filter Button (same as CategoryPage) */}
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
//                             {(selectedAnimal.length > 0 || Object.values(selectedFilters).some(arr => arr.length > 0)) && (
//                                 <button
//                                     onClick={clearAllFilters}
//                                     className="text-sm text-[#B38B59] hover:text-[#9C774A] font-medium"
//                                 >
//                                     Clear all filters
//                                 </button>
//                             )}
//                         </div>

//                         {/* Product Grid */}
//                         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {sortedProducts.map(product => (
//                                 <div key={product.id} className="cursor-pointer w-full max-w-[480px] relative group">
//                                     <div className="relative w-full h-[280px] sm:h-[330px] bg-gray-100 overflow-hidden rounded-2xl">
//                                         <img
//                                             src={product.img}
//                                             alt={product.name}
//                                             className="w-full h-full object-cover hover:scale-105 transition duration-300"
//                                         />

//                                         {/* Wishlist Button */}
//                                         <button
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 toggleWishlist(product.id);
//                                             }}
//                                             className="absolute top-3 right-3 z-10 p-2 bg-[#FFFFFF80] backdrop-blur-sm rounded-full 
//                                                            shadow-lg hover:bg-white active:scale-95 
//                                                            transition-all duration-200"
//                                             aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
//                                         >
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className={`h-5 w-6 transition-colors duration-200 ${wishlist.includes(product.id)
//                                                         ? "fill-red-500 text-red-500"
//                                                         : "text-gray-800 fill-transparent hover:text-red-400"
//                                                     }`}
//                                                 viewBox="0 0 24 24"
//                                                 stroke="currentColor"
//                                                 strokeWidth={wishlist.includes(product.id) ? 0 : 2}
//                                             >
//                                                 <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
//                                             </svg>
//                                         </button>
//                                     </div>

//                                     <div className="mt-3">
//                                         <h3 className="mona font-semibold text-sm text-black line-clamp-1">
//                                             {product.name}
//                                         </h3>
//                                         <p className="mona text-gray-700 font-normal text-xs mt-1">
//                                             Minimum Order Quantity: <b>{product.moq} Piece</b>
//                                         </p>
//                                         <p className="mona font-semibold text-black text-xs mt-1">
//                                             ₹ {product.price}/Piece
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Load More Button */}
//                         {sortedProducts.length > 0 && (
//                             <div className="text-center mt-12">
//                                 <button className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
//                                     Load More Products
//                                 </button>
//                             </div>
//                         )}

//                         {/* No Products Found */}
//                         {sortedProducts.length === 0 && (
//                             <div className="text-center py-12">
//                                 <p className="text-gray-600">No animal products found. Try changing your filters.</p>
//                             </div>
//                         )}
//                     </main>
//                 </div>
//             </div>

//             {/* Filter Sidebar (Right Side) - Same as CategoryPage */}
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
//                                                         className="w-4 h-4 text-[#B38B59] border-gray-300 rounded focus:ring-[#B38B59]"
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
//                                 className="flex-1 py-3 bg-[#B38B59] text-white font-medium rounded-lg hover:bg-[#9C774A] transition-colors"
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

// export default AnimalPage;

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

const AnimalPage = () => {
    const [activeProductType, setActiveProductType] = useState("All Products");
    const [selectedAnimal, setSelectedAnimal] = useState([]);
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
    const [animalProducts, setAnimalProducts] = useState([]);
    const [animalCategories, setAnimalCategories] = useState([]);
    const [productTypes, setProductTypes] = useState(["All Products"]);
    const [loading, setLoading] = useState(true);
    const [animalSubCategories, setAnimalSubCategories] = useState([]);
    const router = useRouter();

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Fetching animal page data...');
                
                // 1. Fetch all categories to find Animal category
                const categoriesResponse = await fetch('/api/admin/categories');
                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json();
                    console.log('Categories data:', categoriesData);
                    
                    if (categoriesData.success && categoriesData.data) {
                        // Find Animal category (case-insensitive search)
                        const animalCategory = categoriesData.data.find(cat => 
                            cat.name && cat.name.toLowerCase().includes("animal")
                        );
                        
                        console.log('Found animal category:', animalCategory);
                        
                        if (animalCategory) {
                            // 2. Fetch all subcategories
                            const subCatResponse = await fetch('/api/admin/subcategories');
                            if (subCatResponse.ok) {
                                const subCatData = await subCatResponse.json();
                                console.log('All subcategories:', subCatData);
                                
                                if (subCatData.success && subCatData.data) {
                                    // Filter subcategories that belong to Animal category
                                    const animalSubCats = subCatData.data.filter(subCat => {
                                        // Check if subCategory has category field that matches animal category
                                        if (subCat.category) {
                                            // Handle both string and object format
                                            const categoryId = typeof subCat.category === 'string' 
                                                ? subCat.category 
                                                : subCat.category._id;
                                            
                                            return categoryId === animalCategory._id;
                                        }
                                        return false;
                                    });
                                    
                                    console.log('Animal subcategories:', animalSubCats);
                                    
                                    // Get animal names from subcategories
                                    const animalNames = animalSubCats.map(subCat => subCat.name);
                                    setAnimalCategories(animalNames);
                                    setAnimalSubCategories(animalSubCats);
                                }
                            }
                        }
                    }
                }
                
                // 3. Fetch all products
                const productsResponse = await fetch('/api/admin/products');
                if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    console.log('Products data:', productsData);
                    
                    if (productsData.success && productsData.data) {
                        // Filter only animal products
                        const animalProductsData = productsData.data.filter(product => {
                            // Check if product belongs to Animal category
                            if (product.category) {
                                const categoryName = typeof product.category === 'string' 
                                    ? product.category 
                                    : (product.category.name || "");
                                
                                return categoryName.toLowerCase().includes("animal");
                            }
                            return false;
                        });
                        
                        console.log('Animal products found:', animalProductsData.length);
                        
                        // Transform products to match frontend structure
                        const transformedProducts = animalProductsData.map(product => ({
                            id: product._id,
                            name: product.name || "Unnamed Product",
                            price: product.price?.toString() || "0",
                            moq: product.minimumOrderQuantity || product.moq || 0,
                            img: product.images?.[0] || '/images/placeholder.jpg',
                            category: product.subCategory?.name || "",
                            subCategoryId: product.subCategory?._id || "",
                            finish: product.finish || "Natural",
                            productType: product.productType || "Ready Stock",
                            services: product.services || [],
                            createdAt: product.createdAt || new Date().toISOString()
                        }));
                        
                        console.log('Transformed products:', transformedProducts);
                        
                        setAnimalProducts(transformedProducts);
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

    // Filter animals based on search
    const filteredAnimals = animalCategories.filter(animal =>
        animal.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle animal selection
    const handleAnimalSelect = (animal) => {
        setSelectedAnimal(prev =>
            prev.includes(animal)
                ? prev.filter(a => a !== animal)
                : [...prev, animal]
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
        let filtered = [...animalProducts];
        
        console.log('Applying filters...');
        console.log('Selected animals:', selectedAnimal);
        console.log('Total animal products:', filtered.length);

        // Filter by selected animals (subcategories)
        if (selectedAnimal.length > 0) {
            filtered = filtered.filter(product => {
                return selectedAnimal.some(animal => {
                    // Direct name comparison
                    if (product.category && product.category.toLowerCase() === animal.toLowerCase()) {
                        return true;
                    }
                    
                    // Check if product name contains animal name
                    if (product.name && product.name.toLowerCase().includes(animal.toLowerCase())) {
                        return true;
                    }
                    
                    return false;
                });
            });
            
            console.log('After animal filter:', filtered.length);
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
    }, [animalProducts, selectedAnimal, activeProductType, selectedFilters, selectedSort]);

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
        setSelectedAnimal([]);
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
                    <h1 className="text-3xl playfair font-bold text-center text-gray-800 mb-2">Animal</h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar - Animal Categories */}
                    <aside className="w-full lg:w-60 flex-shrink-0">
                        <div className="sticky top-8">
                            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                                {/* Category Header */}
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-lg mona font-semibold text-gray-800">Animal Categories</h2>
                                </div>

                                {/* Search Bar */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search animals"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Animal List */}
                                <div className="p-4">
                                    <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2">
                                        {loading ? (
                                            <div className="text-center py-4">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C08237] mx-auto"></div>
                                                <p className="mt-2 text-sm text-gray-600">Loading animals...</p>
                                            </div>
                                        ) : filteredAnimals.length > 0 ? (
                                            <>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    Found {filteredAnimals.length} animal types
                                                </p>
                                                {filteredAnimals.map(animal => {
                                                    // Count products for this animal
                                                    const productCount = animalProducts.filter(product => 
                                                        product.category && product.category.toLowerCase() === animal.toLowerCase()
                                                    ).length;
                                                    
                                                    return (
                                                        <label key={animal} className="flex items-center gap-2 cursor-pointer py-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedAnimal.includes(animal)}
                                                                onChange={() => handleAnimalSelect(animal)}
                                                                className="w-4 h-4 text-[#C08237] border-gray-300 rounded focus:ring-[#C08237]"
                                                            />
                                                            <div className="flex justify-between items-center w-full">
                                                                <span className="text-sm text-gray-600 hover:text-gray-900">
                                                                    {animal}
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
                                                <p className="text-sm text-gray-500">No animal categories found</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Check if "Animal" category exists in database
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
                            {(selectedAnimal.length > 0 || Object.values(selectedFilters).some(arr => arr.length > 0)) && (
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
                                    <p className="mt-4 text-gray-600">Loading animal products...</p>
                                    <p className="text-sm text-gray-500 mt-2">Fetching data from backend...</p>
                                </div>
                            </div>
                        ) : sortedProducts.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 text-lg mb-2">No animal products found</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Try changing your filters or check if:
                                </p>
                               
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
                                    {sortedProducts.map(product => (
                                        <div 
                                            key={product.id} 
                                            className="cursor-pointer w-full max-w-[480px] relative group"
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
                                                        Animal: <b>{product.category}</b>
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

export default AnimalPage;