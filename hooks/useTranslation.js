"use client";
import { useState, useEffect } from 'react';
import { googleTranslateService } from '@/lib/googleTranslate';
import '@/lib/translationDebug'; // Import debug utilities

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  // Available languages with Google Translate codes
  const [languages, setLanguages] = useState([
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/us.png', googleCode: 'en' },
    { code: 'hi', name: 'हिन्दी', flag: 'https://flagcdn.com/w20/in.png', googleCode: 'hi' },
    { code: 'es', name: 'Español', flag: 'https://flagcdn.com/w20/es.png', googleCode: 'es' },
    { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w20/fr.png', googleCode: 'fr' },
    { code: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/w20/de.png', googleCode: 'de' },
    { code: 'zh', name: '中文', flag: 'https://flagcdn.com/w20/cn.png', googleCode: 'zh' },
    { code: 'ar', name: 'العربية', flag: 'https://flagcdn.com/w20/sa.png', googleCode: 'ar' },
    { code: 'ja', name: '日本語', flag: 'https://flagcdn.com/w20/jp.png', googleCode: 'ja' },
    { code: 'ko', name: '한국어', flag: 'https://flagcdn.com/w20/kr.png', googleCode: 'ko' },
    { code: 'pt', name: 'Português', flag: 'https://flagcdn.com/w20/pt.png', googleCode: 'pt' },
    { code: 'ru', name: 'Русский', flag: 'https://flagcdn.com/w20/ru.png', googleCode: 'ru' },
    { code: 'it', name: 'Italiano', flag: 'https://flagcdn.com/w20/it.png', googleCode: 'it' },
    { code: 'nl', name: 'Nederlands', flag: 'https://flagcdn.com/w20/nl.png', googleCode: 'nl' },
    { code: 'tr', name: 'Türkçe', flag: 'https://flagcdn.com/w20/tr.png', googleCode: 'tr' },
    { code: 'vi', name: 'Tiếng Việt', flag: 'https://flagcdn.com/w20/vn.png', googleCode: 'vi' },
    { code: 'th', name: 'ไทย', flag: 'https://flagcdn.com/w20/th.png', googleCode: 'th' },
    { code: 'id', name: 'Bahasa Indonesia', flag: 'https://flagcdn.com/w20/id.png', googleCode: 'id' }
  ]);

  // Initialize Google Translate
  useEffect(() => {
    // Poll for Google Translate loaded languages
    const checkLanguagesInterval = setInterval(() => {
      const availableLangs = googleTranslateService.getAvailableLanguages();
      if (availableLangs && availableLangs.length > 0) {
        const completeLangs = [
          { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/us.png', googleCode: 'en' },
          ...availableLangs.map(l => ({
            code: l.code,
            name: l.name,
            flag: l.flag,
            googleCode: l.code
          }))
        ];
        // Remove duplicates based on language code
        const uniqueLangs = Array.from(new Map(completeLangs.map(item => [item.code, item])).values());
        setLanguages(uniqueLangs);
        clearInterval(checkLanguagesInterval);
      }
    }, 1000);

    // Stop interval after 20 seconds
    setTimeout(() => clearInterval(checkLanguagesInterval), 20000);

    const initializeTranslation = async () => {
      try {
        setIsLoading(true);
        console.log('🚀 Starting translation system initialization...');
        
        // Check if we're returning from a translation reload
        const savedLanguage = googleTranslateService.getCurrentLanguage();
        console.log('📱 Detected language:', savedLanguage);
        
        if (savedLanguage !== 'en') {
          setCurrentLanguage(savedLanguage);
          // Show loading briefly for the reload case
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
        
        // Wait a bit for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Initialize Google Translate service
        const initialized = await googleTranslateService.initialize();
        
        if (initialized) {
          console.log('🌐 Translation system initialized successfully');
          
          // Hide Google's default UI
          setTimeout(() => {
            googleTranslateService.hideGoogleUI();
          }, 1000);
          
          // If we haven't set loading to false yet (English case)
          if (savedLanguage === 'en') {
            setIsLoading(false);
          }
          
        } else {
          console.error('❌ Failed to initialize Google Translate');
          setIsLoading(false);
        }
        
      } catch (error) {
        console.error('❌ Error initializing translation:', error);
        setIsLoading(false);
      }
    };

    // Only initialize on client side
    if (typeof window !== 'undefined') {
      initializeTranslation();
    } else {
      setIsLoading(false);
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

      // Don't show loading if already in the same language
      if (currentLanguage === languageCode) {
        console.log('✅ Already in the selected language:', languageCode);
        return;
      }

      console.log('🔄 Changing language from', currentLanguage, 'to', languageCode);
      setCurrentLanguage(languageCode);
      
      // Show loading indicator
      setIsLoading(true);
      
      // Wait for Google Translate to be ready
      console.log('⏳ Waiting for Google Translate to be ready...');
      const isReady = await googleTranslateService.waitForReady(10000); // 10 second timeout
      
      if (!isReady) {
        console.error('❌ Google Translate not ready after timeout');
        setCurrentLanguage(googleTranslateService.getCurrentLanguage());
        setIsLoading(false);
        return;
      }
      
      // Use Google Translate to change language
      const success = await googleTranslateService.changeLanguage(language.googleCode);
      
      if (success) {
        console.log(`✅ Website language change initiated for: ${language.name}`);
        // Note: If using cookie method, page will reload automatically
        // Loading state will be handled by the reload
      } else {
        console.error('❌ Failed to change language to:', language.name);
        // Revert the language state if failed
        setCurrentLanguage(googleTranslateService.getCurrentLanguage());
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('❌ Error changing language:', error);
      setIsLoading(false);
      // Revert the language state if error occurred
      setCurrentLanguage(googleTranslateService.getCurrentLanguage());
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
    changeLanguage,
    getCurrentLanguageInfo,
    isRTL
  };
};