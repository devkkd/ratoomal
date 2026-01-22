// Translation debugging utilities

export const translationDebug = {
  // Check if Google Translate is loaded
  isGoogleTranslateLoaded() {
    return !!(window.google && window.google.translate);
  },

  // Check if Google Translate element exists
  hasTranslateElement() {
    return !!document.getElementById('google_translate_element');
  },

  // Check if Google Translate combo box exists
  hasComboBox() {
    return !!document.querySelector('.goog-te-combo');
  },

  // Get all Google Translate related elements
  getGoogleElements() {
    return {
      translateElement: document.getElementById('google_translate_element'),
      comboBox: document.querySelector('.goog-te-combo'),
      allGoogElements: document.querySelectorAll('[class*="goog-te"]'),
      bannerFrame: document.querySelector('.goog-te-banner-frame'),
      menuFrame: document.querySelector('.goog-te-menu-frame')
    };
  },

  // Get current Google Translate status
  getStatus() {
    const elements = this.getGoogleElements();
    return {
      scriptLoaded: this.isGoogleTranslateLoaded(),
      elementExists: this.hasTranslateElement(),
      comboBoxExists: this.hasComboBox(),
      currentLanguage: localStorage.getItem('selectedLanguage') || 'en',
      googtrans: localStorage.getItem('googtrans'),
      elementsCount: elements.allGoogElements.length,
      comboBoxValue: elements.comboBox?.value || 'not found',
      comboBoxOptions: elements.comboBox ? Array.from(elements.comboBox.options).map(opt => opt.value) : []
    };
  },

  // Log current status
  logStatus() {
    const status = this.getStatus();
    console.log('🔍 Translation Debug Status:', status);
    return status;
  },

  // Test language change
  async testLanguageChange(languageCode = 'hi') {
    console.log(`🧪 Testing language change to: ${languageCode}`);
    
    const comboBox = document.querySelector('.goog-te-combo');
    if (!comboBox) {
      console.error('❌ Combo box not found');
      return false;
    }

    console.log('📋 Available options:', Array.from(comboBox.options).map(opt => `${opt.value}: ${opt.text}`));
    
    comboBox.value = languageCode;
    const event = new Event('change', { bubbles: true });
    comboBox.dispatchEvent(event);
    
    console.log('✅ Language change event dispatched');
    return true;
  },

  // Force reinitialize Google Translate
  async forceReinit() {
    console.log('🔄 Force reinitializing Google Translate...');
    
    // Remove existing script
    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Clear existing element
    const existingElement = document.getElementById('google_translate_element');
    if (existingElement) {
      existingElement.innerHTML = '';
    }

    // Clear global variables
    if (window.google) {
      delete window.google;
    }
    if (window.googleTranslateElementInit) {
      delete window.googleTranslateElementInit;
    }

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('✅ Cleared existing Google Translate, ready for reinit');
  }
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.translationDebug = translationDebug;
}