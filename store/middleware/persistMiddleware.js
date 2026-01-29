/**
 * Zustand localStorage persistence middleware
 * Auto-saves inquiry cart state to localStorage for reliable persistence
 */

export const persistMiddleware = (config) => (set, get, api) =>
  config(
    (...args) => {
      set(...args);
      // Save to localStorage after state update
      if (typeof window !== 'undefined') {
        const state = get();
        try {
          // Save inquiry cart data
          if (state.cart !== undefined) {
            console.log('💾 Saving inquiry cart to localStorage:', state.cart);
            localStorage.setItem('inquiry_cart_store', JSON.stringify({
              cart: state.cart,
              lastUpdated: new Date().toISOString()
            }));
          }
          // Save wishlist data (for backward compatibility)
          else if (state.wishlist !== undefined) {
            console.log('💾 Saving wishlist to localStorage:', state.wishlist);
            localStorage.setItem('wishlist_store', JSON.stringify({
              wishlist: state.wishlist,
            }));
          }
        } catch (error) {
          console.error('❌ Error saving to localStorage:', error);
        }
      }
    },
    get,
    api
  );
