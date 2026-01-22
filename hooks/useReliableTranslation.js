"use client";
import { useState, useEffect } from 'react';
import { advancedTranslationService } from '@/lib/simpleTranslation';

export const useReliableTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  // Available languages
  const languages = [
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/us.png' },
    { code: 'hi', name: 'हिन्दी', flag: 'https://flagcdn.com/w20/in.png' },
    { code: 'es', name: 'Español', flag: 'https://flagcdn.com/w20/es.png' },
    { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/w20/de.png' },
    { code: 'zh', name: '中文', flag: 'https://flagcdn.com/w20/cn.png' },
    { code: 'ar', name: 'العربية', flag: 'https://flagcdn.com/w20/sa.png' },
    { code: 'ja', name: '日本語', flag: 'https://flagcdn.com/w20/jp.png' },
    { code: 'ko', name: '한국어', flag: 'https://flagcdn.com/w20/kr.png' },
    { code: 'pt', name: 'Português', flag: 'https://flagcdn.com/w20/pt.png' },
    { code: 'ru', name: 'Русский', flag: 'https://flagcdn.com/w20/ru.png' },
    { code: 'it', name: 'Italiano', flag: 'https://flagcdn.com/w20/it.png' }
  ];

  // Initialize translation service
  useEffect(() => {
    const initializeTranslation = async () => {
      try {
        console.log('🚀 Starting advanced translation system initialization...');
        
        // Get saved language
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
        console.log('📱 Detected saved language:', savedLanguage);
        
        // Initialize the translation service
        await advancedTranslationService.initialize();
        
        // Set current language
        setCurrentLanguage(savedLanguage);
        
        // Apply saved language if not English
        if (savedLanguage !== 'en') {
          console.log('🔄 Applying saved language:', savedLanguage);
          setIsLoading(true);
          
          setTimeout(async () => {
            await advancedTranslationService.changeLanguage(savedLanguage);
            setIsLoading(false);
          }, 1000);
        }
        
        console.log('✅ Advanced translation system initialized');
        
      } catch (error) {
        console.error('❌ Error initializing translation:', error);
        setIsLoading(false);
      }
    };

    // Only initialize on client side
    if (typeof window !== 'undefined') {
      initializeTranslation();
    }
  }, []);

  // Change language function
  const changeLanguage = async (languageCode) => {
    try {
      const language = languages.find(lang => lang.code === languageCode);
      if (!language) {
        console.error('❌ Language not found:', languageCode);
        return;
      }

      // Don't process if already in the same language
      if (currentLanguage === languageCode) {
        console.log('✅ Already in the selected language:', languageCode);
        return;
      }

      console.log('🔄 Changing language from', currentLanguage, 'to', languageCode);
      
      // Show loading
      setIsLoading(true);
      
      // Change language using advanced translation service
      const success = await advancedTranslationService.changeLanguage(languageCode);
      
      if (success) {
        setCurrentLanguage(languageCode);
        console.log(`✅ Website language changed to: ${language.name}`);
      } else {
        console.error('❌ Failed to change language to:', language.name);
      }
      
      // Hide loading
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Give more time for API translations
      
    } catch (error) {
      console.error('❌ Error changing language:', error);
      setIsLoading(false);
    }
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

  return {
    currentLanguage,
    languages,
    isLoading,
    translationMethod: 'advanced',
    changeLanguage,
    getCurrentLanguageInfo,
    isRTL
  };
};