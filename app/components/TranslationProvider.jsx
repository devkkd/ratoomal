"use client";
import { useEffect } from 'react';

const TranslationProvider = ({ children }) => {
  useEffect(() => {
    // Add Google Translate element to DOM
    if (typeof window !== 'undefined' && !document.getElementById('google_translate_element')) {
      const translateDiv = document.createElement('div');
      translateDiv.id = 'google_translate_element';
      translateDiv.style.display = 'none';
      document.body.appendChild(translateDiv);
      
      console.log('🌐 Translation Provider: Google Translate element added to DOM');
    }
  }, []);

  return (
    <>
      {children}
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
    </>
  );
};

export default TranslationProvider;