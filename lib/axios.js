import axios from 'axios';

// Dynamically determine base URL
const getBaseURL = () => {
  // In browser, use current origin (works for both dev and production)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // On server side
  if (process.env.NODE_ENV === 'production') {
    // In production, use the environment variable or construct from Render URL
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ratoomal.onrender.com';
  }
  
  // In development, use localhost
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
};

console.log('🔧 Axios Base URL:', getBaseURL());

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;
