// Client-side translation service using Google Translate API
// This approach is more reliable than the widget

class ClientTranslationService {
  constructor() {
    this.currentLanguage = 'en';
    this.translatedContent = new Map();
    this.isTranslating = false;
    this.observer = null;
  }

  // Initialize the translation service
  async initialize() {
    console.log('🚀 Initializing Client Translation Service...');
    
    // Get saved language
    this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    
    // Set up mutation observer to translate new content
    this.setupMutationObserver();
    
    console.log('✅ Client Translation Service initialized');
    return true;
  }

  // Set up mutation observer to translate dynamically added content
  setupMutationObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver((mutations) => {
      if (this.currentLanguage !== 'en' && !this.isTranslating) {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                this.translateElement(node);
              }
            });
          }
        });
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Change language
  async changeLanguage(targetLanguage) {
    if (this.currentLanguage === targetLanguage) {
      console.log(`✅ Already in ${targetLanguage} language`);
      return true;
    }

    console.log(`🌐 Changing language to: ${targetLanguage}`);
    this.isTranslating = true;
    this.currentLanguage = targetLanguage;
    
    // Save language preference
    localStorage.setItem('selectedLanguage', targetLanguage);

    try {
      if (targetLanguage === 'en') {
        // Restore original English content
        this.restoreOriginalContent();
      } else {
        // Translate all text content
        await this.translatePage(targetLanguage);
      }
      
      console.log(`✅ Language changed to: ${targetLanguage}`);
      this.isTranslating = false;
      return true;
    } catch (error) {
      console.error('❌ Error changing language:', error);
      this.isTranslating = false;
      return false;
    }
  }

  // Translate the entire page
  async translatePage(targetLanguage) {
    const textNodes = this.getAllTextNodes(document.body);
    const textsToTranslate = [];
    
    // Collect all text content
    textNodes.forEach(node => {
      const text = node.textContent.trim();
      if (text && text.length > 0 && !this.shouldSkipElement(node.parentElement)) {
        textsToTranslate.push({
          node: node,
          originalText: text
        });
      }
    });

    // Translate in batches
    const batchSize = 50;
    for (let i = 0; i < textsToTranslate.length; i += batchSize) {
      const batch = textsToTranslate.slice(i, i + batchSize);
      await this.translateBatch(batch, targetLanguage);
      
      // Small delay between batches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Translate a batch of text nodes
  async translateBatch(batch, targetLanguage) {
    const texts = batch.map(item => item.originalText);
    
    try {
      const translations = await this.translateTexts(texts, targetLanguage);
      
      batch.forEach((item, index) => {
        if (translations[index] && translations[index] !== item.originalText) {
          // Store original text if not already stored
          if (!item.node.parentElement.dataset.originalText) {
            item.node.parentElement.dataset.originalText = item.originalText;
          }
          
          // Apply translation
          item.node.textContent = translations[index];
        }
      });
    } catch (error) {
      console.error('❌ Error translating batch:', error);
    }
  }

  // Translate texts using Google Translate API (free endpoint)
  async translateTexts(texts, targetLanguage) {
    try {
      // Use a more reliable translation approach
      // First try the direct Google Translate endpoint
      const textToTranslate = texts.join('|||'); // Use separator to maintain text boundaries
      
      // Try multiple endpoints for better reliability
      const endpoints = [
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(textToTranslate)}`,
        `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=${targetLanguage}&q=${encodeURIComponent(textToTranslate)}`
      ];
      
      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            
            if (data && data[0]) {
              const translatedText = data[0].map(item => item[0]).join('');
              const translatedTexts = translatedText.split('|||');
              
              // Ensure we have the same number of translations as inputs
              if (translatedTexts.length === texts.length) {
                return translatedTexts;
              }
            }
          }
        } catch (endpointError) {
          console.warn('⚠️ Translation endpoint failed:', endpointError);
          continue;
        }
      }
      
      // If all endpoints fail, use fallback translations
      return this.getFallbackTranslations(texts, targetLanguage);
      
    } catch (error) {
      console.error('❌ Translation API error:', error);
      return this.getFallbackTranslations(texts, targetLanguage);
    }
  }

  // Get fallback translations for common terms
  getFallbackTranslations(texts, targetLanguage) {
    const fallbackTranslations = {
      hi: {
        'Home': 'होम',
        'About': 'हमारे बारे में',
        'Contact': 'संपर्क',
        'Products': 'उत्पाद',
        'Categories': 'श्रेणियां',
        'Animal': 'पशु',
        'God Figure': 'भगवान की मूर्ति',
        'Utility': 'उपयोगिता',
        'Decor': 'सजावट',
        'Custom Orders': 'कस्टम ऑर्डर',
        'Welcome': 'स्वागत है',
        'Price': 'मूल्य',
        'Quality': 'गुणवत्ता',
        'Handcrafted': 'हस्तनिर्मित',
        'Beautiful': 'सुंदर',
        'Traditional': 'पारंपरिक'
      },
      es: {
        'Home': 'Inicio',
        'About': 'Acerca de',
        'Contact': 'Contacto',
        'Products': 'Productos',
        'Categories': 'Categorías',
        'Animal': 'Animal',
        'God Figure': 'Figura de Dios',
        'Utility': 'Utilidad',
        'Decor': 'Decoración',
        'Custom Orders': 'Pedidos Personalizados',
        'Welcome': 'Bienvenido',
        'Price': 'Precio',
        'Quality': 'Calidad',
        'Handcrafted': 'Hecho a mano',
        'Beautiful': 'Hermoso',
        'Traditional': 'Tradicional'
      },
      fr: {
        'Home': 'Accueil',
        'About': 'À propos',
        'Contact': 'Contact',
        'Products': 'Produits',
        'Categories': 'Catégories',
        'Animal': 'Animal',
        'God Figure': 'Figure de Dieu',
        'Utility': 'Utilité',
        'Decor': 'Décoration',
        'Custom Orders': 'Commandes Personnalisées',
        'Welcome': 'Bienvenue',
        'Price': 'Prix',
        'Quality': 'Qualité',
        'Handcrafted': 'Fait main',
        'Beautiful': 'Beau',
        'Traditional': 'Traditionnel'
      }
    };

    const languageDict = fallbackTranslations[targetLanguage] || {};
    
    return texts.map(text => {
      // Try exact match first
      if (languageDict[text]) {
        return languageDict[text];
      }
      
      // Try partial matches for common words
      let translatedText = text;
      Object.keys(languageDict).forEach(key => {
        if (text.includes(key)) {
          translatedText = translatedText.replace(new RegExp(key, 'gi'), languageDict[key]);
        }
      });
      
      return translatedText;
    });
  }

  // Get all text nodes in an element
  getAllTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip empty text nodes and whitespace-only nodes
          if (!node.textContent.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    return textNodes;
  }

  // Check if element should be skipped for translation
  shouldSkipElement(element) {
    if (!element) return true;
    
    const skipTags = ['SCRIPT', 'STYLE', 'CODE', 'PRE'];
    const skipClasses = ['notranslate', 'no-translate'];
    
    // Skip certain HTML tags
    if (skipTags.includes(element.tagName)) {
      return true;
    }
    
    // Skip elements with certain classes
    if (element.className && skipClasses.some(cls => element.className.includes(cls))) {
      return true;
    }
    
    // Skip if parent has notranslate
    let parent = element.parentElement;
    while (parent) {
      if (parent.className && skipClasses.some(cls => parent.className.includes(cls))) {
        return true;
      }
      parent = parent.parentElement;
    }
    
    return false;
  }

  // Restore original English content
  restoreOriginalContent() {
    const elementsWithOriginal = document.querySelectorAll('[data-original-text]');
    elementsWithOriginal.forEach(element => {
      const textNode = this.getFirstTextNode(element);
      if (textNode) {
        textNode.textContent = element.dataset.originalText;
      }
      delete element.dataset.originalText;
    });
  }

  // Get first text node of an element
  getFirstTextNode(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    return walker.nextNode();
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Check if currently translating
  isCurrentlyTranslating() {
    return this.isTranslating;
  }

  // Translate a single element (for dynamic content)
  async translateElement(element) {
    if (this.currentLanguage === 'en' || this.shouldSkipElement(element)) {
      return;
    }

    const textNodes = this.getAllTextNodes(element);
    const batch = textNodes.map(node => ({
      node: node,
      originalText: node.textContent.trim()
    })).filter(item => item.originalText.length > 0);

    if (batch.length > 0) {
      await this.translateBatch(batch, this.currentLanguage);
    }
  }
}

export const clientTranslationService = new ClientTranslationService();