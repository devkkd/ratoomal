/**
 * Zustand localStorage persistence middleware
 * Auto-saves wishlist state to localStorage for reliable persistence
 */

export const persistMiddleware = (config) => (set, get, api) =>
  config(
    (...args) => {
      set(...args);
      // Save to localStorage after state update
      if (typeof window !== 'undefined') {
        const state = get();
        try {
          console.log('💾 Saving to localStorage:', state.wishlist);
          localStorage.setItem('wishlist_store', JSON.stringify({
            wishlist: state.wishlist,
          }));
        } catch (error) {
          console.error('❌ Error saving to localStorage:', error);
        }
      }
    },
    get,
    api
  );
