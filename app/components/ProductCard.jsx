"use client";
import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/wishlistStore';
import { useInquiryCartStore } from '@/store/inquiryCartStore';
import { useAuth } from '@/hooks/useAuth';
import NotificationToast, { useNotification } from './NotificationToast';

const ProductCard = ({ 
  product, 
  showInquiryButton = true, 
  showWishlistButton = true,
  className = "" 
}) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToCart } = useInquiryCartStore();
  const { notification, showNotification, hideNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  // Get product image with fallback
  const getProductImage = (product) => {
    if (product?.thumbnail && (product.thumbnail.startsWith('http') || product.thumbnail.startsWith('/'))) {
      return product.thumbnail;
    }
    
    if (product?.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (firstImage && (firstImage.startsWith('http') || firstImage.startsWith('/'))) {
        return firstImage;
      }
    }
    
    if (product?.image && (product.image.startsWith('http') || product.image.startsWith('/'))) {
      return product.image;
    }
    
    return '/images/placeholder.png';
  };

  // Handle add to inquiry cart
  const handleAddToInquiry = (e) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (!product) return;

    setIsLoading(true);
    
    try {
      // Add to cart with first available size or default
      const defaultSize = product.sizes && product.sizes.length > 0 ? [product.sizes[0]] : ['3"'];
      addToCart(product, defaultSize, 1);
      showNotification('Product added to inquiry cart!', 'cart');
    } catch (error) {
      console.error('Error adding to inquiry cart:', error);
      showNotification('Failed to add product to cart', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (!product) return;

    try {
      toggleWishlist(product);
      const isInWish = isInWishlist(product.id || product._id);
      showNotification(
        isInWish ? 'Removed from wishlist' : 'Added to wishlist', 
        'wishlist'
      );
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  // Handle product view
  const handleViewProduct = () => {
    if (!product) return;
    const productId = product.id || product._id;
    router.push(`/product/${productId}`);
  };

  if (!product) {
    return (
      <div className={`border rounded-lg overflow-hidden bg-gray-100 animate-pulse ${className}`}>
        <div className="h-56 bg-gray-200" />
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-3 bg-gray-200 rounded mb-3 w-1/2" />
          <div className="h-8 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const productId = product.id || product._id;
  const isInWish = isInWishlist(productId);

  return (
    <>
      <div 
        className={`border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full ${className}`}
        onClick={handleViewProduct}
      >
        {/* Product Image */}
        <div className="relative h-56 bg-gray-200 overflow-hidden flex-shrink-0">
          <img
            src={getProductImage(product)}
            alt={product.name || 'Product'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/images/placeholder.png';
            }}
          />
          
          {/* Wishlist Button - Perfectly Centered */}
          {showWishlistButton && (
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 shadow-lg flex items-center justify-center ${
                isInWish 
                  ? 'bg-red-500/90 text-white' 
                  : 'bg-white/90 text-gray-700 hover:bg-red-50'
              }`}
              aria-label={isInWish ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart 
                className={`w-5 h-5 transition-all duration-300 ${
                  isInWish ? 'fill-current scale-110' : 'hover:scale-110'
                }`} 
                strokeWidth={isInWish ? 0 : 2}
              />
            </button>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewProduct();
                }}
                className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="View Product"
              >
                <Eye className="w-4 h-4" />
              </button>
              
              {showInquiryButton && (
                <button
                  onClick={handleAddToInquiry}
                  disabled={isLoading}
                  className="bg-[#C08237] text-white p-2 rounded-full hover:bg-[#a56e2e] transition-colors disabled:opacity-50"
                  title="Add to Inquiry Cart"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Details - Flex grow to fill remaining space */}
        <div className="p-4 flex flex-col flex-grow">
          <h4 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-[#C08237] transition-colors min-h-[3.5rem]">
            {product.name || 'Product Name'}
          </h4>

          <p className="text-sm text-gray-600 mb-2">
            {product.category && product.subCategory 
              ? `${product.category} • ${product.subCategory}`
              : product.category || 'Category'
            }
          </p>

          <div className="flex items-center justify-between mb-3">
            <p className="text-lg font-bold text-[#C08237]">
              ₹{product.price || '0'}
            </p>
            {product.moq && (
              <p className="text-xs text-gray-500">
                MOQ: {product.moq}
              </p>
            )}
          </div>

          {/* Available Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Available Sizes:</p>
              <div className="flex flex-wrap gap-1">
                {product.sizes.slice(0, 4).map((size, index) => (
                  <span 
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 4 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                    +{product.sizes.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons - Push to bottom */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewProduct();
              }}
              className="flex-1 bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            
            {showInquiryButton && (
              <button
                onClick={handleAddToInquiry}
                disabled={isLoading}
                className="flex-1 bg-[#C08237] text-white px-3 py-2 rounded text-sm font-medium hover:bg-[#a56e2e] transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Inquiry
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      <NotificationToast
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </>
  );
};

export default ProductCard;
