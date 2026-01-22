'use client';

import React, { useEffect } from 'react';
import { create } from 'zustand';
import { persistMiddleware } from './middleware/persistMiddleware';

/**
 * Zustand Wishlist Store with proper localStorage persistence
 */

export const useWishlistStore = create(
  persistMiddleware((set, get) => ({
    // State
    wishlist: [],
    loading: false,
    error: null,
    isLoggedIn: false,

    // Initialize store - load from localStorage on mount
    initialize: () => {
      if (typeof window === 'undefined') {
        console.log('🔧 Initialize: Server-side, skipping');
        return;
      }

      console.log('🔧 Initialize: Client-side - loading from localStorage');
      
      try {
        // Load wishlist from localStorage
        const savedWishlist = localStorage.getItem('wishlist_store');
        console.log('📦 Retrieved from localStorage:', savedWishlist);
        
        if (savedWishlist) {
          const parsed = JSON.parse(savedWishlist);
          console.log('✅ Parsed wishlist:', parsed.wishlist);
          set({ wishlist: parsed.wishlist || [] });
        } else {
          console.log('⚠️  No saved wishlist found in localStorage');
        }

        // Check login status
        const token = localStorage.getItem('token');
        set({ isLoggedIn: !!token });
        
      } catch (error) {
        console.error('❌ Error initializing wishlist:', error);
      }
    },

    // Add product to wishlist
    addToWishlist: async (productId) => {
      const { wishlist, isLoggedIn } = get();
      
      console.log('➕ Adding to wishlist:', productId);
      console.log('Current wishlist before add:', wishlist);
      
      // Optimistic update
      if (!wishlist.includes(productId)) {
        const newWishlist = [...wishlist, productId];
        set({ wishlist: newWishlist });
        console.log('✅ Wishlist updated to:', newWishlist);
      }

      // Sync with server if logged in
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const res = await fetch('/api/wishlist', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ productId }),
            });

            if (!res.ok) {
              throw new Error('Failed to add to wishlist');
            }
          }
        } catch (error) {
          console.error('Error adding to wishlist:', error);
          set({ error: error.message });
          // Revert on error
          set({ wishlist: wishlist.filter(id => id !== productId) });
        }
      }
    },

    // Remove product from wishlist
    removeFromWishlist: async (productId) => {
      const { wishlist, isLoggedIn } = get();
      
      console.log('➖ Removing from wishlist:', productId);
      console.log('Current wishlist before remove:', wishlist);
      
      // Optimistic update
      const newWishlist = wishlist.filter(id => id !== productId);
      set({ wishlist: newWishlist });
      console.log('✅ Wishlist updated to:', newWishlist);

      // Sync with server if logged in
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const res = await fetch('/api/wishlist', {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ productId }),
            });

            if (!res.ok) {
              throw new Error('Failed to remove from wishlist');
            }
          }
        } catch (error) {
          console.error('Error removing from wishlist:', error);
          set({ error: error.message });
          // Revert on error
          set({ wishlist: [...wishlist, productId] });
        }
      }
    },

    // Toggle wishlist status
    toggleWishlist: async (productId) => {
      const { isInWishlist } = get();
      
      console.log('🔄 Toggling wishlist for product:', productId);
      console.log('Is currently in wishlist?', isInWishlist(productId));
      
      if (isInWishlist(productId)) {
        console.log('Product is in wishlist, removing...');
        await get().removeFromWishlist(productId);
      } else {
        console.log('Product is NOT in wishlist, adding...');
        await get().addToWishlist(productId);
      }
    },

    // Check if product is in wishlist
    isInWishlist: (productId) => {
      const { wishlist } = get();
      return wishlist.includes(productId);
    },

    // Sync with server
    syncWithServer: async (token) => {
      if (!token) return;

      try {
        set({ loading: true });
        const res = await fetch('/api/wishlist', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const serverWishlist = data.data.map(item => item.product._id);
          
          // Merge server wishlist with local
          const { wishlist } = get();
          const merged = [...new Set([...wishlist, ...serverWishlist])];
          
          set({ 
            wishlist: merged,
            isLoggedIn: true,
            error: null 
          });
        }
      } catch (error) {
        console.error('Error syncing wishlist:', error);
        set({ error: error.message });
      } finally {
        set({ loading: false });
      }
    },

    // Clear wishlist
    clearWishlist: () => {
      set({ wishlist: [] });
    },

    // Logout handler - clear but keep cookies
    handleLogout: () => {
      set({ isLoggedIn: false });
      // Wishlist stays in cookies for next login
    },

    // Get wishlist count
    getWishlistCount: () => {
      const { wishlist } = get();
      return wishlist.length;
    },

    // Get all wishlist items
    getWishlist: () => {
      const { wishlist } = get();
      return wishlist;
    },
  }))
);

/**
 * Hook for checking login status and initializing on mount
 * Call this once in your main app layout
 */
export const useInitializeWishlist = () => {
  const { initialize } = useWishlistStore();
  
  React.useEffect(() => {
    initialize();
  }, [initialize]);
};
