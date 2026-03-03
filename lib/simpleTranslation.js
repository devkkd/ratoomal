// Advanced translation service using Google Translate API without page reloads
// This translates ALL text content on the website

class AdvancedTranslationService {
  constructor() {
    this.currentLanguage = 'en';
    this.isTranslating = false;
    this.observer = null;
    this.translatedElements = new Map();
    this.translationCache = new Map();
  }

  // Initialize the translation service
  async initialize() {
    
    
    // Get saved language
    this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    
    // Set up mutation observer to translate new content
    this.setupMutationObserver();
    
    
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
      
      return true;
    }

    
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
          originalText: text,
          element: node.parentElement
        });
      }
    });

    

    // Translate in batches to avoid overwhelming the API
    const batchSize = 20;
    for (let i = 0; i < textsToTranslate.length; i += batchSize) {
      const batch = textsToTranslate.slice(i, i + batchSize);
      await this.translateBatch(batch, targetLanguage);
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  // Translate a batch of text nodes
  async translateBatch(batch, targetLanguage) {
    const texts = batch.map(item => item.originalText);
    
    try {
      const translations = await this.translateTexts(texts, targetLanguage);
      
      batch.forEach((item, index) => {
        if (translations[index] && translations[index] !== item.originalText) {
          // Store original text
          if (!this.translatedElements.has(item.element)) {
            this.translatedElements.set(item.element, item.originalText);
          }
          
          // Apply translation
          item.node.textContent = translations[index];
        }
      });
    } catch (error) {
      console.error('❌ Error translating batch:', error);
    }
  }

  // Translate texts using multiple Google Translate endpoints
  async translateTexts(texts, targetLanguage) {
    try {
      // Check cache first
      const cacheKey = `${texts.join('|||')}:${targetLanguage}`;
      if (this.translationCache.has(cacheKey)) {
        return this.translationCache.get(cacheKey);
      }

      const translations = [];
      
      // Translate each text individually for better accuracy
      for (const text of texts) {
        const translation = await this.translateSingleText(text, targetLanguage);
        translations.push(translation);
      }
      
      // Cache the results
      this.translationCache.set(cacheKey, translations);
      
      return translations;
      
    } catch (error) {
      console.error('❌ Translation API error:', error);
      return texts; // Return original if translation fails
    }
  }

  // Translate a single text using Google Translate API
  async translateSingleText(text, targetLanguage) {
    try {
      // Skip very short or numeric-only text
      if (text.length < 2 || /^\d+$/.test(text.trim())) {
        return text;
      }

      // Try internal API first (avoids CORS issues)
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            targetLanguage: targetLanguage
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.translatedText) {
            
            return data.translatedText;
          }
        }
      } catch (apiError) {
        console.warn('⚠️ Internal API failed:', apiError.message);
      }

      // Fallback to direct Google Translate endpoints
      const endpoints = [
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`,
        `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=${targetLanguage}&q=${encodeURIComponent(text)}`,
        `https://translate.google.com/translate_a/single?client=webapp&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`
      ];
      
      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            
            if (data && data[0] && data[0][0] && data[0][0][0]) {
              const translatedText = data[0][0][0];
              
              return translatedText;
            }
          }
        } catch (endpointError) {
          console.warn('⚠️ Translation endpoint failed:', endpointError.message);
          continue;
        }
      }
      
      // If all endpoints fail, try fallback translation
      return this.getFallbackTranslation(text, targetLanguage);
      
    } catch (error) {
      console.error('❌ Single text translation error:', error);
      return text;
    }
  }

  // Get fallback translation for common terms
  getFallbackTranslation(text, targetLanguage) {
    const fallbackTranslations = {
      hi: {
        'Home': 'होम', 'About': 'हमारे बारे में', 'Contact': 'संपर्क', 'Products': 'उत्पाद',
        'Categories': 'श्रेणियां', 'Animal': 'पशु', 'God Figure': 'भगवान की मूर्ति',
        'Utility': 'उपयोगिता', 'Decor': 'सजावट', 'Custom Orders': 'कस्टम ऑर्डर',
        'Welcome': 'स्वागत है', 'Price': 'मूल्य', 'Quality': 'गुणवत्ता',
        'Handcrafted': 'हस्तनिर्मित', 'Beautiful': 'सुंदर', 'Traditional': 'पारंपरिक',
        'Search': 'खोजें', 'Login': 'लॉगिन', 'Profile': 'प्रोफाइल',
        'Wishlist': 'विशलिस्ट', 'Loading': 'लोड हो रहा है', 'Success': 'सफलता',
        'Error': 'त्रुटि', 'Name': 'नाम', 'Email': 'ईमेल', 'Phone': 'फोन',
        'Message': 'संदेश', 'Submit': 'भेजें', 'View Details': 'विवरण देखें',
        'Add to Cart': 'कार्ट में जोड़ें', 'Buy Now': 'अभी खरीदें',
        'Our Products': 'हमारे उत्पाद', 'Featured': 'विशेष', 'New': 'नया',
        'Sale': 'बिक्री', 'Discount': 'छूट', 'Free Shipping': 'मुफ्त शिपिंग',
        'Customer Reviews': 'ग्राहक समीक्षा', 'Rating': 'रेटिंग',
        'Description': 'विवरण', 'Specifications': 'विशेषताएं',
        'Available': 'उपलब्ध', 'Out of Stock': 'स्टॉक में नहीं',
        'Order Now': 'अभी ऑर्डर करें', 'Quick View': 'त्वरित दृश्य'
      },
      es: {
        'Home': 'Inicio', 'About': 'Acerca de', 'Contact': 'Contacto', 'Products': 'Productos',
        'Categories': 'Categorías', 'Animal': 'Animal', 'God Figure': 'Figura de Dios',
        'Utility': 'Utilidad', 'Decor': 'Decoración', 'Custom Orders': 'Pedidos Personalizados',
        'Welcome': 'Bienvenido', 'Price': 'Precio', 'Quality': 'Calidad',
        'Handcrafted': 'Hecho a mano', 'Beautiful': 'Hermoso', 'Traditional': 'Tradicional',
        'Search': 'Buscar', 'Login': 'Iniciar Sesión', 'Profile': 'Perfil',
        'Wishlist': 'Lista de Deseos', 'Loading': 'Cargando', 'Success': 'Éxito',
        'Error': 'Error', 'Name': 'Nombre', 'Email': 'Correo', 'Phone': 'Teléfono',
        'Message': 'Mensaje', 'Submit': 'Enviar', 'View Details': 'Ver Detalles',
        'Add to Cart': 'Agregar al Carrito', 'Buy Now': 'Comprar Ahora',
        'Our Products': 'Nuestros Productos', 'Featured': 'Destacado', 'New': 'Nuevo',
        'Sale': 'Venta', 'Discount': 'Descuento', 'Free Shipping': 'Envío Gratis',
        'Customer Reviews': 'Reseñas de Clientes', 'Rating': 'Calificación',
        'Description': 'Descripción', 'Specifications': 'Especificaciones',
        'Available': 'Disponible', 'Out of Stock': 'Agotado',
        'Order Now': 'Ordenar Ahora', 'Quick View': 'Vista Rápida'
      },
      fr: {
        'Home': 'Accueil', 'About': 'À propos', 'Contact': 'Contact', 'Products': 'Produits',
        'Categories': 'Catégories', 'Animal': 'Animal', 'God Figure': 'Figure de Dieu',
        'Utility': 'Utilité', 'Decor': 'Décoration', 'Custom Orders': 'Commandes Personnalisées',
        'Welcome': 'Bienvenue', 'Price': 'Prix', 'Quality': 'Qualité',
        'Handcrafted': 'Fait main', 'Beautiful': 'Beau', 'Traditional': 'Traditionnel',
        'Search': 'Rechercher', 'Login': 'Connexion', 'Profile': 'Profil',
        'Wishlist': 'Liste de Souhaits', 'Loading': 'Chargement', 'Success': 'Succès',
        'Error': 'Erreur', 'Name': 'Nom', 'Email': 'Email', 'Phone': 'Téléphone',
        'Message': 'Message', 'Submit': 'Soumettre', 'View Details': 'Voir Détails',
        'Add to Cart': 'Ajouter au Panier', 'Buy Now': 'Acheter Maintenant',
        'Our Products': 'Nos Produits', 'Featured': 'En Vedette', 'New': 'Nouveau',
        'Sale': 'Vente', 'Discount': 'Remise', 'Free Shipping': 'Livraison Gratuite',
        'Customer Reviews': 'Avis Clients', 'Rating': 'Note',
        'Description': 'Description', 'Specifications': 'Spécifications',
        'Available': 'Disponible', 'Out of Stock': 'Rupture de Stock',
        'Order Now': 'Commander Maintenant', 'Quick View': 'Aperçu Rapide'
      }
    };

    const languageDict = fallbackTranslations[targetLanguage] || {};
    
    // Try exact match first
    if (languageDict[text]) {
      return languageDict[text];
    }
    
    // Try partial matches for common words
    let translatedText = text;
    Object.keys(languageDict).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      if (regex.test(text)) {
        translatedText = translatedText.replace(regex, languageDict[key]);
      }
    });
    
    return translatedText;
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
    
    const skipTags = ['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT'];
    const skipClasses = ['notranslate', 'no-translate', 'translate-no'];
    const skipIds = ['google_translate_element'];
    
    // Skip certain HTML tags
    if (skipTags.includes(element.tagName)) {
      return true;
    }
    
    // Skip elements with certain IDs
    if (element.id && skipIds.includes(element.id)) {
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
      if (parent.id && skipIds.includes(parent.id)) {
        return true;
      }
      parent = parent.parentElement;
    }
    
    return false;
  }

  // Restore original English content
  restoreOriginalContent() {
    this.translatedElements.forEach((originalText, element) => {
      const textNode = this.getFirstTextNode(element);
      if (textNode) {
        textNode.textContent = originalText;
      }
    });
    this.translatedElements.clear();
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
      originalText: node.textContent.trim(),
      element: node.parentElement
    })).filter(item => item.originalText.length > 0);

    if (batch.length > 0) {
      await this.translateBatch(batch, this.currentLanguage);
    }
  }
}

export const advancedTranslationService = new AdvancedTranslationService();