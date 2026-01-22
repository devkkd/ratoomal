"use client";
import { useState, useEffect } from 'react';
import { googleTranslateService } from '@/lib/googleTranslate';
import { clientTranslationService } from '@/lib/clientTranslation';
import '@/lib/translationDebug'; // Import debug utilities

export const useHybridTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [translationMethod, setTranslationMethod] = useState('google'); // 'google' or 'client'

  // Available languages with Google Translate codes
  const languages = [
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
    { code: 'it', name: 'Italiano', flag: 'https://flagcdn.com/w20/it.png', googleCode: 'it' }
  ];

  // Initialize translation services
  useEffect(() => {
    const initializeTranslation = async () => {
      try {
        setIsLoading(true);
        console.log('🚀 Starting hybrid translation system initialization...');
        
        // Check if we just reloaded from a translation
        const wasReloaded = sessionStorage.getItem('translationReload');
        if (wasReloaded) {
          sessionStorage.removeItem('translationReload');
          console.log('🔄 Detected translation reload, skipping auto-apply');
        }
        
        // Get saved language and method
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
        const savedMethod = localStorage.getItem('translationMethod') || 'client'; // Default to client to avoid reloads
        
        console.log('📱 Detected language:', savedLanguage, 'Method:', savedMethod);
        setCurrentLanguage(savedLanguage);
        setTranslationMethod(savedMethod);
        
        // Initialize client-side translation first (more reliable, no reloads)
        console.log('🔄 Initializing client-side translation...');
        await clientTranslationService.initialize();
        setTranslationMethod('client');
        localStorage.setItem('translationMethod', 'client');
        console.log('✅ Client-side translation initialized');

        // Try Google Translate as secondary option
        let googleInitialized = false;
        try {
          console.log('🔄 Attempting Google Translate initialization...');
          googleInitialized = await googleTranslateService.initialize();
          
          if (googleInitialized) {
            console.log('✅ Google Translate also available as backup');
            
            // Hide Google UI
            setTimeout(() => {
              googleTranslateService.hideGoogleUI();
            }, 1000);
          }
        } catch (error) {
          console.warn('⚠️ Google Translate initialization failed:', error);
        }

        // Apply saved language if not English and not just reloaded
        if (savedLanguage !== 'en' && !wasReloaded) {
          console.log('🔄 Applying saved language:', savedLanguage);
          setTimeout(async () => {
            await changeLanguageInternal(savedLanguage, false);
            setIsLoading(false);
          }, 1000);
        } else {
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

  // Internal change language function
  const changeLanguageInternal = async (languageCode, showLoading = true) => {
    try {
      const language = languages.find(lang => lang.code === languageCode);
      if (!language) {
        console.error('❌ Language not found:', languageCode);
        return false;
      }

      // Don't process if already in the same language
      if (currentLanguage === languageCode) {
        console.log('✅ Already in the selected language:', languageCode);
        return true;
      }

      console.log('🔄 Changing language from', currentLanguage, 'to', languageCode, 'using client-side translation');
      
      if (showLoading) {
        setIsLoading(true);
      }

      let success = false;

      // Always use client-side translation first (no reloads)
      try {
        success = await clientTranslationService.changeLanguage(language.googleCode);
        if (success) {
          setTranslationMethod('client');
          localStorage.setItem('translationMethod', 'client');
        }
      } catch (error) {
        console.warn('⚠️ Client-side translation failed:', error);
      }

      // Only fall back to Google Translate if client-side fails AND user explicitly requests it
      if (!success && translationMethod === 'google') {
        try {
          const isReady = await googleTranslateService.waitForReady(5000);
          if (isReady) {
            success = await googleTranslateService.changeLanguage(language.googleCode);
          }
        } catch (error) {
          console.warn('⚠️ Google Translate failed:', error);
        }
      }

      if (success) {
        setCurrentLanguage(languageCode);
        console.log(`✅ Website language changed to: ${language.name} (${translationMethod})`);
      } else {
        console.error('❌ Failed to change language to:', language.name);
        return false;
      }

      if (showLoading) {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000); // Client-side needs time to translate
      }

      return true;
      
    } catch (error) {
      console.error('❌ Error changing language:', error);
      if (showLoading) {
        setIsLoading(false);
      }
      return false;
    }
  };

  // Public change language function
  const changeLanguage = async (languageCode) => {
    const success = await changeLanguageInternal(languageCode, true);
    if (!success) {
      // Revert the language state if failed
      const actualLanguage = translationMethod === 'google' 
        ? googleTranslateService.getCurrentLanguage()
        : clientTranslationService.getCurrentLanguage();
      setCurrentLanguage(actualLanguage);
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
    translationMethod,
    changeLanguage,
    getCurrentLanguageInfo,
    isRTL
  };
};