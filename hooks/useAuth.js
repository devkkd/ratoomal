"use client";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkAuthState = () => {
      try {
        const token = Cookies.get('token');
        const loginFlag = Cookies.get('isLoggedIn');
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
        
        // User is logged in if either loginFlag is true OR userEmail exists
        const isAuthenticated = !!(loginFlag === 'true' || userEmail);
        
        setIsLoggedIn(isAuthenticated);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    };
    
    // Initial check
    checkAuthState();
    
    // Set up periodic checks
    const authCheckInterval = setInterval(checkAuthState, 3000);
    
    // Check on window focus
    const handleFocus = () => checkAuthState();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(authCheckInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const logout = () => {
    try {
      // Clear cookies
      Cookies.remove('token');
      Cookies.remove('isLoggedIn');
      Cookies.remove('user');
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userEmail');
      }
      
      // Update state
      setIsLoggedIn(false);
      
      // Force page reload
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    isLoggedIn,
    isLoading,
    isClient,
    logout
  };
};