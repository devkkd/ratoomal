// Simple and reliable auto-translation system using Google Translate Widget

class AutoTranslateService {
  constructor() {
    this.isInitialized = false;
    this.currentLanguage = 'en';
    this.supportedLanguages = {
      'en': 'English',
      'hi': 'Hindi',
      'es': 'Spanish', 
      'fr': 'French',
      'de': 'German',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'ja': 'Japanese',
      'ko': 'Korean',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'it': 'Italian'
    };
  }

  // Initialize Google Translate
  async initialize() {
    if (typeof window === 'undefined') return false;
    
    try {
      // Check if already initialized
      if (this.isInitialized) return true;

      // Create the translate element container
      this.createTranslateElement();
      
      // Load Google Translate script
      await this.loadGoogleTranslateScript();
      
      // Initialize the widget
      this.initializeWidget();
      
      this.isInitialized = true;
      console.log('✅ Auto-translate initialized successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to initialize auto-translate:', error);
      return false;
    }
  }

  // Create translate element
  createTranslateElement() {
    if (document.getElementById('google_translate_element')) return;
    
    const translateDiv = document.createElement('div');
    translateDiv.id = 'google_translate_element';
    translateDiv.style.cssText = `
      position: fixed;
      top: -1000px;
      left: -1000px;
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(translateDiv);
  }

  // Load Google Translate script
  loadGoogleTranslateScript() {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector('script[src*="translate.google.com"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => reject(new Error('Failed to load Google Translate script'));
      
      // Set up global callback
      window.googleTranslateElementInit = () => {
        resolve();
      };
      
      document.head.appendChild(script);
    });
  }

  // Initialize the widget
  initializeWidget() {
    if (!window.google || !window.google.translate) {
      throw new Error('Google Translate not available');
    }

    new window.google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: Object.keys(this.supportedLanguages).join(','),
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false,
      multilanguagePage: true
    }, 'google_translate_element');

    // Hide Google's UI elements
    setTimeout(() => {
      this.hideGoogleUI();
    }, 500);
  }

  // Hide Google's default UI
  hideGoogleUI() {
    const style = document.createElement('style');
    style.id = 'hide-google-translate-ui';
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
      
      .goog-te-spinner-pos {
        display: none !important;
      }
      
      .goog-te-ftab {
        display: none !important;
      }
    `;
    
    if (!document.getElementById('hide-google-translate-ui')) {
      document.head.appendChild(style);
    }
  }

  // Change language
  changeLanguage(languageCode) {
    return new Promise((resolve) => {
      try {
        if (!this.isInitialized) {
          console.warn('Auto-translate not initialized');
          resolve(false);
          return;
        }

        // Store current language
        this.currentLanguage = languageCode;
        localStorage.setItem('selectedLanguage', languageCode);

        // If English, restore original
        if (languageCode === 'en') {
          this.restoreOriginal();
          resolve(true);
          return;
        }

        // Find and trigger Google Translate
        const selectElement = document.querySelector('.goog-te-combo');
        if (selectElement) {
          selectElement.value = languageCode;
          selectElement.dispatchEvent(new Event('change'));
          
          // Wait for translation to complete
          setTimeout(() => {
            resolve(true);
          }, 1500);
        } else {
          console.warn('Google Translate select element not found');
          resolve(false);
        }
        
      } catch (error) {
        console.error('Error changing language:', error);
        resolve(false);
      }
    });
  }

  // Restore original language
  restoreOriginal() {
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = '';
      selectElement.dispatchEvent(new Event('change'));
    }
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Check if language is supported
  isLanguageSupported(languageCode) {
    return languageCode in this.supportedLanguages;
  }
}

// Export singleton instance
export const autoTranslateService = new AutoTranslateService();