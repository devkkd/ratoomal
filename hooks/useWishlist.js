import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    // Check isLoggedIn cookie (set by server) instead of localStorage
    const isLoggedInCookie = Cookies.get('isLoggedIn');
    setIsLoggedIn(isLoggedInCookie === 'true');

    // Load wishlist from cookies (SINGLE SOURCE: wishlist_store)
    const savedWishlist = Cookies.get('wishlist_store');
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist);
        setWishlist(parsed.wishlist || []);
      } catch (e) {
        console.error('Error parsing wishlist:', e);
      }
    }

    setInitialized(true);

    // If logged in, sync with server
    if (isLoggedInCookie === 'true') {
      syncWishlistWithServer();
    }
  }, []);

  // Sync wishlist with server
  const syncWishlistWithServer = async () => {
    try {
      const res = await fetch('/api/wishlist', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies (httpOnly token)
      });

      if (res.ok) {
        const data = await res.json();
        const productIds = data.data.map(item => item.product._id);
        setWishlist(productIds);
        // Save to cookies with same format as store
        Cookies.set('wishlist_store', JSON.stringify({ wishlist: productIds }), { expires: 365 });
      }
    } catch (error) {
      console.error('Error syncing wishlist:', error);
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (productId) => {
    const isLoggedInCookie = Cookies.get('isLoggedIn');

    if (isLoggedInCookie !== 'true') {
      // Just use cookies if not logged in
      setWishlist(prev => {
        const updated = prev.includes(productId)
          ? prev.filter(id => id !== productId)
          : [...prev, productId];
        // Save to cookies with same format as store
        Cookies.set('wishlist_store', JSON.stringify({ wishlist: updated }), { expires: 365 });
        return updated;
      });
      return;
    }

    // If logged in, sync with server
    setLoading(true);
    try {
      const isInWishlist = wishlist.includes(productId);
      const method = isInWishlist ? 'DELETE' : 'POST';

      const res = await fetch('/api/wishlist', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies (httpOnly token)
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        setWishlist(prev => {
          const updated = prev.includes(productId)
            ? prev.filter(id => id !== productId)
            : [...prev, productId];
          // Save to cookies with same format as store
          Cookies.set('wishlist_store', JSON.stringify({ wishlist: updated }), { expires: 365 });
          return updated;
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => wishlist.includes(productId);

  return {
    wishlist,
    toggleWishlist,
    isInWishlist,
    loading,
    isLoggedIn,
  };
};
