'use client';

import React, { useEffect } from 'react';
import { create } from 'zustand';
import { persistMiddleware } from './middleware/persistMiddleware';

/**
 * Zustand Inquiry Cart Store with proper localStorage persistence
 */

export const useInquiryCartStore = create(
  persistMiddleware((set, get) => ({
    // State
    cart: [], // Array of cart items with product details, sizes, quantities
    loading: false,
    error: null,

    // Initialize store - load from localStorage on mount with expiration check
    initialize: () => {
      if (typeof window === 'undefined') {
        // console.log('🔧 Initialize Cart: Server-side, skipping');
        return;
      }

      // console.log('🔧 Initialize Cart: Client-side - loading from localStorage');
      
      try {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('inquiry_cart_store');
        // console.log('📦 Retrieved cart from localStorage:', savedCart);
        
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          const cart = parsed.cart || [];
          
          // Filter out expired items (older than 7 days)
          const now = new Date();
          const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
          
          const validCart = cart.filter(item => {
            if (!item.addedAt) return false; // Remove items without timestamp
            const addedDate = new Date(item.addedAt);
            const isValid = addedDate > sevenDaysAgo;
            
            if (!isValid) {
              console.log('🗑️ Removing expired cart item:', item.name, 'added:', addedDate);
            }
            
            return isValid;
          });
          
          console.log(`✅ Loaded ${validCart.length} valid items (${cart.length - validCart.length} expired items removed)`);
          set({ cart: validCart });
          
          // Update localStorage if items were removed
          if (validCart.length !== cart.length) {
            localStorage.setItem('inquiry_cart_store', JSON.stringify({ cart: validCart }));
          }
        } else {
          // console.log('⚠️  No saved cart found in localStorage');
        }
        
      } catch (error) {
        console.error('❌ Error initializing cart:', error);
        // Clear corrupted data
        localStorage.removeItem('inquiry_cart_store');
        set({ cart: [] });
      }
    },

    // Add product to cart
    addToCart: (product, selectedSizes = [], quantity = 1) => {
      const { cart } = get();
      
      console.log('➕ Adding to cart:', { product: product.id || product._id, selectedSizes, quantity });
      
      const productId = product.id || product._id;
      
      // Check if same product with same sizes already exists
      const existingItemIndex = cart.findIndex(item => 
        item.productId === productId && 
        JSON.stringify(item.selectedSizes.sort()) === JSON.stringify(selectedSizes.sort())
      );
      
      if (existingItemIndex !== -1) {
        // Product with same sizes exists, update quantity
        const newCart = [...cart];
        newCart[existingItemIndex].quantity += quantity;
        set({ cart: newCart });
        console.log('✅ Updated existing cart item quantity:', newCart[existingItemIndex]);
      } else {
        // Create new cart item
        const cartItem = {
          id: `${productId}_${Date.now()}`, // Unique ID for cart item
          productId: productId,
          name: product.name,
          image: product.images?.[0] || product.thumbnail || product.img || '/images/placeholder.png',
          price: product.price,
          category: product.category,
          subCategory: product.subCategory,
          selectedSizes: selectedSizes.length > 0 ? selectedSizes : ['3'],
          quantity: quantity,
          addedAt: new Date().toISOString(),
        };
        
        const newCart = [...cart, cartItem];
        set({ cart: newCart });
        console.log('✅ Added new cart item:', cartItem);
      }
    },

    // Remove item from cart
    removeFromCart: (cartItemId) => {
      const { cart } = get();
      
      console.log('➖ Removing from cart:', cartItemId);
      
      const newCart = cart.filter(item => item.id !== cartItemId);
      set({ cart: newCart });
      console.log('✅ Cart updated to:', newCart);
    },

    // Update cart item quantity
    updateQuantity: (cartItemId, newQuantity) => {
      const { cart } = get();
      
      if (newQuantity <= 0) {
        get().removeFromCart(cartItemId);
        return;
      }
      
      const newCart = cart.map(item => 
        item.id === cartItemId 
          ? { ...item, quantity: newQuantity }
          : item
      );
      
      set({ cart: newCart });
      console.log('✅ Cart quantity updated:', newCart);
    },

    // Update cart item sizes
    updateSizes: (cartItemId, newSizes) => {
      const { cart } = get();
      
      const newCart = cart.map(item => 
        item.id === cartItemId 
          ? { ...item, selectedSizes: newSizes.length > 0 ? newSizes : ['3'] }
          : item
      );
      
      set({ cart: newCart });
      console.log('✅ Cart sizes updated:', newCart);
    },

    // Clear entire cart
    clearCart: () => {
      set({ cart: [] });
      console.log('🗑️ Cart cleared');
    },

    // Get cart count
    getCartCount: () => {
      const { cart } = get();
      return cart.length;
    },

    // Get total items (sum of quantities)
    getTotalItems: () => {
      const { cart } = get();
      return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Get all cart items
    getCart: () => {
      const { cart } = get();
      return cart;
    },

    // Check if product is in cart (any variant)
    isInCart: (productId) => {
      const { cart } = get();
      return cart.some(item => item.productId === productId);
    },

    // Get cart items for a specific product
    getProductCartItems: (productId) => {
      const { cart } = get();
      return cart.filter(item => item.productId === productId);
    },

    // Prepare cart data for inquiry submission
    prepareInquiryData: (userDetails) => {
      const { cart } = get();
      
      return {
        userDetails,
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.productName,
          category: item.category,
          subCategory: item.subCategory,
          selectedSizes: item.selectedSizes,
          quantity: item.quantity,
          estimatedPrice: item.productPrice * item.quantity,
        })),
        totalItems: cart.length,
        totalQuantity: cart.reduce((total, item) => total + item.quantity, 0),
        submittedAt: new Date().toISOString(),
      };
    },
  }))
);

/**
 * Hook for initializing cart on mount
 */
export const useInitializeInquiryCart = () => {
  const { initialize } = useInquiryCartStore();
  
  React.useEffect(() => {
    initialize();
  }, [initialize]);
};