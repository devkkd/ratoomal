import Cookies from 'js-cookie';

/**
 * Zustand localStorage persistence middleware
 * Auto-saves wishlist state to cookies
 */

export const persistMiddleware = (config) => (set, get, api) =>
  config(
    (...args) => {
      set(...args);
      // Save to cookies after state update
      const state = get();
      if (typeof window !== 'undefined') {
        Cookies.set('wishlist_store', JSON.stringify({
          wishlist: state.wishlist,
        }), { expires: 365 }); // Persist for 1 year
      }
    },
    get,
    api
  );
