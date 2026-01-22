// Google Translate Widget integration for automatic website translation

class GoogleTranslateService {
  constructor() {
    this.isInitialized = false;
    this.currentLanguage = 'en';
    this.isTranslating = false;
    this.translateElement = null;
  }

  // Initialize Google Translate Widget
  async initialize() {
    return new Promise((resolve) => {
      if (this.isInitialized) {
        console.log('✅ Google Translate already initialized');
        resolve(true);
        return;
      }

      console.log('🚀 Initializing Google Translate...');

      // Create global callback function
      window.googleTranslateElementInit = () => {
        try {
          console.log('🔧 Creating Google Translate Element...');
          
          // Store reference to the translate element
          this.translateElement = new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,hi,es,fr,de,zh,ar,ja,ko,pt,ru,it',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          }, 'google_translate_element');
          
          // Mark as initialized immediately since we have the API
          this.isInitialized = true;
          this.hideGoogleUI();
          console.log('✅ Google Translate initialized successfully');
          resolve(true);
          
        } catch (error) {
          console.error('❌ Error initializing Google Translate:', error);
          resolve(false);
        }
      };

      // Load Google Translate script
      if (!document.querySelector('script[src*="translate.google.com"]')) {
        console.log('📥 Loading Google Translate script...');
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        script.onerror = () => {
          console.error('❌ Failed to load Google Translate script');
          resolve(false);
        };
        document.head.appendChild(script);
      } else {
        console.log('📜 Google Translate script already loaded');
        // Script already loaded, just initialize
        if (window.google && window.google.translate) {
          window.googleTranslateElementInit();
        } else {
          // Wait for script to load
          setTimeout(() => {
            if (window.google && window.google.translate) {
              window.googleTranslateElementInit();
            } else {
              console.error('❌ Google Translate API not available after timeout');
              resolve(false);
            }
          }, 2000);
        }
      }
    });
  }

  // Change language using direct API calls instead of select element
  changeLanguage(targetLanguage) {
    return new Promise((resolve) => {
      if (!this.isInitialized) {
        console.warn('⚠️ Google Translate not initialized');
        resolve(false);
        return;
      }

      try {
        // If already in target language, resolve immediately
        if (this.currentLanguage === targetLanguage) {
          console.log(`✅ Already in ${targetLanguage} language`);
          resolve(true);
          return;
        }

        this.isTranslating = true;
        console.log(`🌐 Changing language to: ${targetLanguage}`);

        // Method 1: Try using the select element if it exists
        const selectElement = document.querySelector('.goog-te-combo');
        if (selectElement) {
          console.log('📋 Using select element method');
          selectElement.value = targetLanguage;
          const event = new Event('change', { bubbles: true });
          selectElement.dispatchEvent(event);
          
          this.currentLanguage = targetLanguage;
          localStorage.setItem('googtrans', `/en/${targetLanguage}`);
          localStorage.setItem('selectedLanguage', targetLanguage);
          
          setTimeout(() => {
            this.hideGoogleUI();
            this.isTranslating = false;
            console.log(`✅ Language changed to: ${targetLanguage}`);
            resolve(true);
          }, 1000);
          return;
        }

        // Method 2: Use direct cookie manipulation (Google Translate's method)
        // Only reload if we're not already in a translated state
        const currentGoogtrans = localStorage.getItem('googtrans');
        const targetGoogtrans = `/en/${targetLanguage}`;
        
        if (currentGoogtrans === targetGoogtrans) {
          console.log('✅ Already in target language state, no reload needed');
          this.currentLanguage = targetLanguage;
          this.isTranslating = false;
          resolve(true);
          return;
        }

        console.log('🍪 Using cookie method');
        
        // Set the Google Translate cookie
        document.cookie = `googtrans=${targetGoogtrans}; path=/; domain=${window.location.hostname}`;
        localStorage.setItem('googtrans', targetGoogtrans);
        localStorage.setItem('selectedLanguage', targetLanguage);
        
        // Store current language
        this.currentLanguage = targetLanguage;
        
        // Set a flag to prevent reload loops
        sessionStorage.setItem('translationReload', 'true');
        
        // Reload the page to apply translation
        setTimeout(() => {
          console.log('🔄 Reloading page to apply translation...');
          window.location.reload();
        }, 500);
        
        // Don't resolve immediately since we're reloading
        setTimeout(() => {
          this.isTranslating = false;
          resolve(true);
        }, 1000);

      } catch (error) {
        console.error('❌ Error changing language:', error);
        this.isTranslating = false;
        resolve(false);
      }
    });
  }

  // Get current language
  getCurrentLanguage() {
    // Check cookie first
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'googtrans') {
        const match = value.match(/\/en\/(.+)/);
        if (match) return match[1];
      }
    }
    
    // Fallback to localStorage
    const googtrans = localStorage.getItem('googtrans');
    if (googtrans) {
      const match = googtrans.match(/\/en\/(.+)/);
      return match ? match[1] : 'en';
    }
    return localStorage.getItem('selectedLanguage') || 'en';
  }

  // Check if currently translating
  isCurrentlyTranslating() {
    return this.isTranslating;
  }

  // Check if Google Translate is ready for language changes
  isReady() {
    return this.isInitialized && !!(window.google && window.google.translate);
  }

  // Wait for Google Translate to be ready
  async waitForReady(maxWaitTime = 10000) {
    const startTime = Date.now();
    
    while (!this.isReady() && (Date.now() - startTime) < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return this.isReady();
  }

  // Hide Google Translate default UI
  hideGoogleUI() {
    // Add CSS to hide Google's UI elements
    const style = document.createElement('style');
    style.innerHTML = `
      .goog-te-banner-frame,
      .goog-te-menu-frame {
        display: none !important;
      }
      
      .goog-te-combo {
        display: none !important;
      }
      
      body {
        top: 0 !important;
      }
      
      #google_translate_element {
        display: none !important;
      }
      
      .skiptranslate {
        display: none !important;
      }
      
      .goog-tooltip {
        display: none !important;
      }
      
      .goog-tooltip:hover {
        display: none !important;
      }
      
      .goog-text-highlight {
        background-color: transparent !important;
        box-shadow: none !important;
      }
      
      .goog-te-spinner-pos {
        display: none !important;
      }
      
      .goog-te-spinner {
        display: none !important;
      }
      
      /* Hide the Google Translate frame */
      iframe[src*="translate.google.com"] {
        display: none !important;
      }
    `;
    
    if (!document.querySelector('#google-translate-styles')) {
      style.id = 'google-translate-styles';
      document.head.appendChild(style);
    }
  }

  // Reset to English
  resetToEnglish() {
    return this.changeLanguage('en');
  }
}

export const googleTranslateService = new GoogleTranslateService();