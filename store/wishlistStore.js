'use client';

import React from 'react';
import { create } from 'zustand';
import Cookies from 'js-cookie';
import { persistMiddleware } from './middleware/persistMiddleware';

/**
 * Zustand Wishlist Store
 * 
 * Features:
 * - Manages wishlist state globally
 * - Auto-persists to cookies
 * - Syncs with server API for authenticated users
 * - Optimistic UI updates
 */

export const useWishlistStore = create(
  persistMiddleware((set, get) => ({
    // State
    wishlist: [],
    loading: false,
    error: null,
    isLoggedIn: false,

    // Initialization
    initializeWishlist: () => {
      if (typeof window !== 'undefined') {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        set({ isLoggedIn: !!token });

        // Load from cookies
        const saved = Cookies.get('wishlist_store');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            set({ wishlist: parsed.wishlist || [] });
          } catch (e) {
            console.error('Error loading wishlist:', e);
          }
        }

        // Sync with server if logged in
        if (token) {
          get().syncWithServer(token);
        }
      }
    },

    // Add product to wishlist
    addToWishlist: async (productId) => {
      const { wishlist, isLoggedIn } = get();
      
      // Optimistic update
      if (!wishlist.includes(productId)) {
        set({ wishlist: [...wishlist, productId] });
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
      
      // Optimistic update
      set({ wishlist: wishlist.filter(id => id !== productId) });

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
      const { wishlist, isInWishlist } = get();
      
      if (isInWishlist(productId)) {
        await get().removeFromWishlist(productId);
      } else {
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
  const { initializeWishlist } = useWishlistStore();
  
  React.useEffect(() => {
    initializeWishlist();
  }, [initializeWishlist]);
};
