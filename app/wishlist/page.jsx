"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/wishlistStore';
import { Heart, MessageCircle } from 'lucide-react';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, toggleWishlist, initialize } = useWishlistStore();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Mark component as mounted on client (hydration check)
  useEffect(() => {
    console.log('🎯 WishlistPage mounted on client');
    setIsClient(true);
    // Initialize store from localStorage when component mounts
    if (typeof window !== 'undefined') {
      console.log('📦 Before initialize - wishlist:', wishlist);
      initialize();
      console.log('📦 After initialize - wishlist should update');
    }
  }, [initialize]);

  // Log wishlist state changes
  useEffect(() => {
    console.log('🔍 Wishlist Page - Store wishlist:', wishlist);
  }, [wishlist]);

  // Fetch products when wishlist changes
  useEffect(() => {
    if (!isClient) return;

    console.log('📋 Wishlist state changed:', wishlist);
    console.log('📊 Current wishlist length:', wishlist?.length || 0);

    const fetchWishlistProducts = async () => {
      try {
        setLoading(true);
        if (!wishlist || wishlist.length === 0) {
          setWishlistProducts([]);
          return;
        }

        const res = await fetch('/api/products');
        const data = await res.json();
        
        if (data.success && data.data) {
          const filtered = data.data.filter(product => wishlist.includes(product._id));
          const transformed = filtered.map(product => ({
            id: product._id,
            name: product.name,
            code: product.code || "",
            price: product.price || "0",
            moq: product.minimumOrderQuantity || 100,
            img: product.images?.[0] || '/images/placeholder.png',
          }));
          setWishlistProducts(transformed);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    console.log('📋 Fetching products for wishlist:', wishlist);
    fetchWishlistProducts();
  }, [wishlist, isClient]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-20">
      {/* Floating Enquiry Button */}
    
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-4xl playfair font-bold  text-[#1A1A1A] mb-4">
          Saved Products
        </h1>
        <p className="text-gray-600 mona max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
          View and manage the products you&apos;ve saved for future reference. This space helps verified buyers compare designs, shortlist collections, and plan bulk or custom inquiries efficiently.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        {!isClient ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <Heart className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No products saved yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {wishlistProducts.map((product) => (
              <div 
                key={product.id} 
                className="group cursor-pointer"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-white mb-4">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  {/* Heart Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <Heart 
                      size={16} 
                      className={`transition-colors ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                    />
                  </button>
                </div>

                {/* Product Details */}
                <div className="space-y-1">
                  <h3 className="mona font-semibold text-sm text-black">
                    {product.name}
                  </h3>
                  {product.code && (
                    <p className="text-[12px] text-gray-600 font-mono">
                      Code: <span className="font-bold text-black">{product.code}</span>
                    </p>
                  )}
                  <p className="text-[12px] text-gray-600">
                    Minimum Order Quantity: <span className="font-bold text-black">{product.moq} Piece</span>
                  </p>
                  <p className="text-[13px] font-bold text-black pt-1">
                    ₹ {Number(product.price).toLocaleString('en-IN')}/Piece
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}