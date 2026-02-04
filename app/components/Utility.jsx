
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWishlistStore } from '@/store/wishlistStore';
import { useInquiryCartStore } from '@/store/inquiryCartStore';
import NotificationToast, { useNotification } from './NotificationToast';
import Link from "next/link";

export default function Utility() {
    const router = useRouter();
    const { wishlist, toggleWishlist, isInWishlist, initialize } = useWishlistStore();
    const { addToCart, initialize: initializeCart } = useInquiryCartStore();
    const { notification, showNotification, hideNotification } = useNotification();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initialize stores
    useEffect(() => {
        if (typeof window !== 'undefined') {
            initialize();
            initializeCart();
        }
    }, [initialize, initializeCart]);

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
                        // Find Utility/Decor category (case-insensitive)
                        const utilityCategory = categoriesData.data.find(
                            cat => {
                                const nameLC = cat.name.toLowerCase().trim();
                                return nameLC.includes('utility') || nameLC.includes('decor');
                            }
                        );
                        
                        if (utilityCategory) {
                            // Filter products by Utility category and get latest 4
                            const utilityProducts = data.data
                                .filter(product => {
                                    const categoryId = product.category?._id || product.category;
                                    return categoryId === utilityCategory._id;
                                })
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .slice(0, 4)
                                .map(product => ({
                                    id: product._id,
                                    name: product.name || "Unnamed Product",
                                    code: product.code || "",
                                    qty: `Minimum Order Quantity: ${product.minimumOrderQuantity || 100} Piece`,
                                    price: `₹ ${product.price || 0}/Piece`,
                                    img: product.thumbnail || product.images?.[0] || '/images/placeholder.png',
                                }));
                            
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

    // Handle add to inquiry cart
    const handleAddToInquiry = (product, quantity, e) => {
        e.stopPropagation();
        console.log('➕ Adding to inquiry cart:', { product: product.id, quantity });
        
        // Add to inquiry cart with size 3
        addToCart(product, ['3'], quantity);
        
        // Show success notification
        showNotification('Product added to inquiry cart!', 'cart');
    };

    return (
        <div className="max-w-7xl items-center mx-auto px-4 sm:px-6 lg:px-12 mt-4">
           
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:px-6">
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
                                onError={(e) => {
                                    e.target.src = '/images/placeholder.png';
                                }}
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
                            
                            {/* Add to Inquiry Section */}
                            <div className="mt-3 space-y-2">
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
                                        const quantityInput = e.target.parentElement.parentElement.querySelector('input[type="number"]');
                                        const quantity = parseInt(quantityInput?.value) || 1;
                                        handleAddToInquiry(item, quantity, e);
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
                    </div>
                ))}
            </div>
            )}

            <div className="text-center w-full flex justify-center items-center  mt-10">
               <Link href="/utility-decor">
            <button className="mt-6 mona px-10 py-4 bg-[#c48b46] text-white rounded-full flex items-center gap-1 hover:bg-[#a6753a] transition-all duration-300 font-medium text-base">
           See All Utility / Decor →
              {/* <span className="text-xl group-hover:translate-y-1 transition-transform duration-300">
                
              </span> */}
            </button>
            </Link>
            </div>

             <hr className="border-t border-gray-300 mt-8 " />
             
             {/* Notification Toast */}
             <NotificationToast
                 message={notification.message}
                 type={notification.type}
                 isVisible={notification.isVisible}
                 onClose={hideNotification}
             />
        </div>
    );
}