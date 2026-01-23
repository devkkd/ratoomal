import axios from 'axios';

// Simplified base URL determination
const getBaseURL = () => {
  // During build time, return empty string to use relative URLs
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    return '';
  }
  
  // In browser, use current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // In development, use localhost
  return 'http://localhost:3000';
};

const baseURL = getBaseURL();
console.log('🔧 Axios Base URL:', baseURL || 'relative URLs');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;
