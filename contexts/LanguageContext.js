"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getLanguageTranslations } from '@/lib/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Available languages
  const languages = [
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/us.png' },
    { code: 'hi', name: 'हिन्दी', flag: 'https://flagcdn.com/w20/in.png' },
    { code: 'es', name: 'Español', flag: 'https://flagcdn.com/w20/es.png' },
    { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/w20/de.png' },
    { code: 'zh', name: '中文', flag: 'https://flagcdn.com/w20/cn.png' }
  ];

  // Initialize language from cookie or browser
  useEffect(() => {
    const initializeLanguage = () => {
      try {
        // Check for saved language in cookie
        const savedLanguage = Cookies.get('language');
        
        // Check browser language as fallback
        const browserLanguage = navigator.language.split('-')[0];
        
        // Determine which language to use
        const languageToUse = savedLanguage || 
          (languages.find(lang => lang.code === browserLanguage) ? browserLanguage : 'en');
        
        setCurrentLanguage(languageToUse);
        loadTranslations(languageToUse);
      } catch (error) {
        console.error('Error initializing language:', error);
        setCurrentLanguage('en');
        loadTranslations('en');
      }
    };

    initializeLanguage();
  }, []);

  // Load translations for current language
  const loadTranslations = (languageCode) => {
    try {
      setIsLoading(true);
      const languageTranslations = getLanguageTranslations(languageCode);
      setTranslations(languageTranslations);
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to English
      const englishTranslations = getLanguageTranslations('en');
      setTranslations(englishTranslations);
    } finally {
      setIsLoading(false);
    }
  };

  // Change language
  const changeLanguage = (languageCode) => {
    try {
      setCurrentLanguage(languageCode);
      loadTranslations(languageCode);
      
      // Save to cookie
      Cookies.set('language', languageCode, { expires: 365 });
      
      // Optional: Reload page to ensure all components update
      // window.location.reload();
      
      console.log(`Language changed to: ${languageCode}`);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Get translation for a key
  const t = (key, fallback = null) => {
    if (isLoading) return fallback || key;
    return translations[key] || fallback || key;
  };

  // Get current language info
  const getCurrentLanguageInfo = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  // Check if RTL language
  const isRTL = () => {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(currentLanguage);
  };

  const value = {
    currentLanguage,
    translations,
    languages,
    isLoading,
    changeLanguage,
    t,
    getCurrentLanguageInfo,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};