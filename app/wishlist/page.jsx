"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/wishlistStore';
import { useInquiryCartStore } from '@/store/inquiryCartStore';
import { useAuth } from '@/hooks/useAuth';
import { Heart } from 'lucide-react';
import NotificationToast, { useNotification } from '../components/NotificationToast';

const getProductImage = (product) => {
  if (product.thumbnail && (product.thumbnail.startsWith('http') || product.thumbnail.startsWith('/'))) {
    return product.thumbnail;
  }
  if (product.images && product.images.length > 0) {
    const first = product.images[0];
    if (first && (first.startsWith('http') || first.startsWith('/'))) return first;
  }
  return '/images/placeholder.png';
};

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, toggleWishlist, isInWishlist, initialize } = useWishlistStore();
  const { addToCart } = useInquiryCartStore();
  const { isLoggedIn } = useAuth();
  const { notification, showNotification, hideNotification } = useNotification();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isClient) return;
    const fetch_ = async () => {
      try {
        setLoading(true);
        if (!wishlist || wishlist.length === 0) { setWishlistProducts([]); return; }
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        if (data.success && data.data) {
          const filtered = data.data
            .filter(p => wishlist.includes(p._id))
            .map(p => ({
              id: p._id,
              slug: p.slug || p._id,
              name: p.name || 'Unnamed Product',
              code: p.code || '',
              price: p.price ?? 0,
              moq: p.moq || p.minimumOrderQuantity || 1,
              thumbnail: p.thumbnail || '',
              images: p.images || [],
              img: getProductImage(p),
              sizes: p.sizes || [],
            }));
          setWishlistProducts(filtered);
        }
      } catch (err) {
        console.error('Wishlist fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [wishlist, isClient]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-20">

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-[2px] w-10 bg-gradient-to-r from-transparent to-[#C08237] rounded-full" />
          <Heart className="w-5 h-5 text-[#C08237] fill-[#C08237]" />
          <div className="h-[2px] w-10 bg-gradient-to-l from-transparent to-[#C08237] rounded-full" />
        </div>
        <h1 className="text-3xl md:text-4xl playfair font-bold text-[#1A1A1A] mb-3">
          Saved Products
        </h1>
        <p className="text-gray-500 mona max-w-2xl mx-auto text-sm leading-relaxed">
          View and manage the products you&apos;ve saved for future reference.
        </p>
        {wishlistProducts.length > 0 && (
          <div className="inline-flex items-center gap-2 mt-4 bg-white px-4 py-2 rounded-full shadow-sm border border-[#E5DDD5]">
            <span className="text-sm font-semibold text-gray-700 mona">
              {wishlistProducts.length} saved {wishlistProducts.length === 1 ? 'product' : 'products'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Loading skeleton */}
        {(!isClient || loading) && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-[280px] sm:h-[330px] bg-gray-200 rounded-2xl mb-3" />
                <div className="space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-200 rounded-full w-1/2" />
                  <div className="h-9 bg-gray-200 rounded-md w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {isClient && !loading && wishlistProducts.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-red-300" size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-700 playfair mb-2">Nothing saved yet</h3>
            <p className="text-gray-400 mona text-sm mb-6">Browse our collection and save products you love.</p>
            <button
              onClick={() => router.push('/category')}
              className="bg-gradient-to-r from-[#C08237] to-[#9C774A] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg transition-all mona"
            >
              Explore Collection
            </button>
          </div>
        )}

        {/* Product Grid — exact same card as CategoryClient */}
        {isClient && !loading && wishlistProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistProducts.map((product) => (
              <a
                key={product.id}
                href={`/product/${product.slug}`}
                className="cursor-pointer w-full relative group flex flex-col h-full no-underline"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/product/${product.slug}`);
                }}
              >
                {/* Image */}
                <div className="relative w-full h-[280px] sm:h-[330px] bg-gray-100 overflow-hidden rounded-2xl">
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

                  {/* Wishlist toggle button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 z-10 p-2.5 bg-[#FFFFFF90] backdrop-blur-sm rounded-full shadow-lg hover:bg-white active:scale-95 transition-all duration-200 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-colors duration-200 ${
                        isInWishlist(product.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-800 fill-transparent hover:text-red-400'
                      }`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={isInWishlist(product.id) ? 0 : 2}
                    >
                      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                    </svg>
                  </button>
                </div>

                {/* Info below image */}
                <div className="mt-3 flex flex-col flex-grow">
                  <div className="shrink-0">
                    <h3 className="mona font-semibold text-sm text-black line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    {product.code && (
                      <p className="mona text-gray-600 font-mono text-xs mt-1">
                        Code: <b>{product.code}</b>
                      </p>
                    )}
                  </div>

                  {/* Add to Inquiry button — pushed to bottom */}
                  <div className="mt-auto">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isLoggedIn) { router.push('/login'); return; }
                        addToCart(product, ['3'], 1);
                        showNotification('Product added to inquiry cart!', 'cart');
                      }}
                      className="w-full my-2 py-2 bg-[#C08237] text-white text-xs font-medium rounded-md hover:bg-[#9C774A] transition-colors flex items-center justify-center gap-1"
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
        )}
      </div>

      <NotificationToast
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
}