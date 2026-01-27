
"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWishlistStore } from '@/store/wishlistStore';
import Link from "next/link";

export default function Utility() {
    const router = useRouter();
    const { wishlist, toggleWishlist, isInWishlist, initialize } = useWishlistStore();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initialize global wishlist store (same as GodFigurines / CuratedCollections)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            initialize();
        }
    }, [initialize]);

    // Fetch latest 4 Utility/Decor category products
    useEffect(() => {
        const fetchUtilityProducts = async () => {
            try {
                setLoading(true);
                
                // Fetch all products
                const response = await fetch('/api/products');
                if (!response.ok) throw new Error('Failed to fetch products');
                
                const data = await response.json();
                
                if (data.success && data.data) {
                    // Fetch categories to find Utility/Decor category ID
                    const categoriesRes = await fetch('/api/categories');
                    const categoriesData = await categoriesRes.json();
                    
                    if (categoriesData.success && categoriesData.data) {
                        console.log('All categories:', categoriesData.data.map(c => c.name));
                        
                        // Find Utility/Decor category (case-insensitive)
                        const utilityCategory = categoriesData.data.find(
                            cat => {
                                const nameLC = cat.name.toLowerCase().trim();
                                return nameLC === 'utility' || nameLC === 'utility/decor' || nameLC === 'decor' || nameLC.includes('utility') || nameLC.includes('decor');
                            }
                        );
                        
                        console.log('Found Utility category:', utilityCategory);
                        
                        if (utilityCategory) {
                            console.log(`Filtering products for category: ${utilityCategory._id}`);
                            
                            // Filter products by Utility category and get latest 4
                            const utilityProducts = data.data
                                .filter(product => {
                                    const categoryId = product.category?._id || product.category;
                                    const matches = categoryId === utilityCategory._id;
                                    console.log(`Product: ${product.name}, Category ID: ${categoryId}, Matches: ${matches}`);
                                    return matches;
                                })
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .slice(0, 4)
                                .map(product => ({
                                    id: product._id,
                                    name: product.name || "Unnamed Product",
                                    code: product.code || "",
                                    qty: `Minimum Order Quantity: ${product.minimumOrderQuantity || 100} Piece`,
                                    price: `₹ ${product.price || 0}/Piece`,
                                    img: product.images?.[0] || '/images/placeholder.png',
                                }));
                            
                            console.log('Filtered Utility products:', utilityProducts);
                            setProducts(utilityProducts);
                        } else {
                            console.warn('Utility category not found. Available categories:', categoriesData.data.map(c => c.name));
                            setProducts([]);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching utility products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUtilityProducts();
    }, []);

    return (
        <div className="max-w-7xl items-center mx-auto px-4 sm:px-6 lg:px-12 my-10 ">
           
            <h3 className="playfair text-xl md:text-[30px] text-center flex justify-center font-semibold letter-spacing-[-0.01em] mb-10">
               Utility / Decor
            </h3>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c48b46]"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-600">No utility/decor products found</p>
                </div>
            ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6">
                {products.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => router.push(`/product/${item.id}`)}
                        className="cursor-pointer w-full max-w-[480px] relative group"
                    >
                        <div className="relative w-full h-[280px] sm:h-[330px] bg-gray-100 overflow-hidden rounded-2xl">
                            <img
                                src={item.img}
                                alt={item.name}
                                className="w-full h-full object-cover hover:scale-105 transition duration-300"
                            />
                            
                            {/* Wishlist Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleWishlist(item.id);
                                }}
                                className="absolute top-3 right-3 z-10 p-2 bg-[#FFFFFF80] backdrop-blur-sm rounded-full 
                                           shadow-lg hover:bg-white  active:scale-95 
                                           transition-all duration-200"
                                aria-label={isInWishlist(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                {/* Heart SVG Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-6 transition-colors duration-200 ${
                                        isInWishlist(item.id) 
                                            ? "fill-red-500 text-red-500" 
                                            : "text-gray-800 fill-transparent hover:text-red-400"
                                    }`}
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={isInWishlist(item.id) ? 0 : 2}
                                >
                                    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
                                </svg>
                               
                            </button>
                        </div>

                        <div className="mt-3">
                            <h3 className="font-funnel font-semibold text-md text-black">
                                {item.name}
                            </h3>
                            {item.code && (
                                <p className="font-mono text-gray-600 text-xs mt-1">
                                    Code: <span className="font-semibold">{item.code}</span>
                                </p>
                            )}
                            <p className="font-funnel text-gray-600 font-light text-xs mt-1">
                                {item.qty}
                            </p>
                            <p className="font-funnel font-semibold text-black text-sm mt-1">
                                {item.price}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            )}

            <div className="text-center w-full flex justify-center items-center  mt-10">
               <Link href="/utility-decor">
            <button className="mt-8 mona px-10 py-4 bg-[#c48b46] text-white rounded-full flex items-center gap-1 hover:bg-[#a6753a] transition-all duration-300 font-medium text-base">
           See All Utility / Decor →
              {/* <span className="text-xl group-hover:translate-y-1 transition-transform duration-300">
                
              </span> */}
            </button>
            </Link>
            </div>

             <hr className="border-t border-gray-300 mt-8 " />
        </div>
    );
}