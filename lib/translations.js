// Translation data for different languages
export const translations = {
  en: {
    // Header
    language: "English",
    currency: "Currency",
    search_placeholder: "WHAT ARE YOU LOOKING FOR?",
    login: "LOGIN",
    profile: "PROFILE",
    logout: "Logout",
    my_profile: "My Profile",
    my_orders: "My Orders",
    my_wishlist: "My Wishlist",
    
    // Navigation
    home: "HOME",
    about: "ABOUT",
    category: "CATEGORY",
    animal: "ANIMAL",
    god_figure: "GOD FIGURE",
    utility_decor: "UTILITY / DECOR",
    custom_orders: "CUSTOM ORDERS",
    contact_us: "CONTACT US",
    
    // Common
    loading: "Loading...",
    no_results: "No results found",
    search_results: "Search Results",
    
    // Product
    add_to_wishlist: "Add to Wishlist",
    remove_from_wishlist: "Remove from Wishlist",
    view_details: "View Details",
    price: "Price",
    moq: "MOQ",
    
    // Footer
    quick_links: "Quick Links",
    categories: "Categories",
    customer_service: "Customer Service",
    follow_us: "Follow Us",
    
    // Pages
    about_us: "About Us",
    our_story: "Our Story",
    contact_info: "Contact Information",
    
    // Forms
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    submit: "Submit",
    
    // Messages
    success: "Success",
    error: "Error",
    please_wait: "Please wait...",
  },
  
  hi: {
    // Header
    language: "भाषा",
    currency: "मुद्रा",
    search_placeholder: "आप क्या खोज रहे हैं?",
    login: "लॉगिन",
    profile: "प्रोफाइल",
    logout: "लॉगआउट",
    my_profile: "मेरी प्रोफाइल",
    my_orders: "मेरे ऑर्डर",
    my_wishlist: "मेरी विशलिस्ट",
    
    // Navigation
    home: "होम",
    about: "हमारे बारे में",
    category: "श्रेणी",
    animal: "पशु",
    god_figure: "भगवान की मूर्ति",
    utility_decor: "उपयोगिता / सजावट",
    custom_orders: "कस्टम ऑर्डर",
    contact_us: "संपर्क करें",
    
    // Common
    loading: "लोड हो रहा है...",
    no_results: "कोई परिणाम नहीं मिला",
    search_results: "खोज परिणाम",
    
    // Product
    add_to_wishlist: "विशलिस्ट में जोड़ें",
    remove_from_wishlist: "विशलिस्ट से हटाएं",
    view_details: "विवरण देखें",
    price: "मूल्य",
    moq: "न्यूनतम ऑर्डर मात्रा",
    
    // Footer
    quick_links: "त्वरित लिंक",
    categories: "श्रेणियां",
    customer_service: "ग्राहक सेवा",
    follow_us: "हमें फॉलो करें",
    
    // Pages
    about_us: "हमारे बारे में",
    our_story: "हमारी कहानी",
    contact_info: "संपर्क जानकारी",
    
    // Forms
    name: "नाम",
    email: "ईमेल",
    phone: "फोन",
    message: "संदेश",
    submit: "भेजें",
    
    // Messages
    success: "सफलता",
    error: "त्रुटि",
    please_wait: "कृपया प्रतीक्षा करें...",
  },
  
  es: {
    // Header
    language: "Idioma",
    currency: "Moneda",
    search_placeholder: "¿QUÉ ESTÁS BUSCANDO?",
    login: "INICIAR SESIÓN",
    profile: "PERFIL",
    logout: "Cerrar Sesión",
    my_profile: "Mi Perfil",
    my_orders: "Mis Pedidos",
    my_wishlist: "Mi Lista de Deseos",
    
    // Navigation
    home: "INICIO",
    about: "ACERCA DE",
    category: "CATEGORÍA",
    animal: "ANIMAL",
    god_figure: "FIGURA DE DIOS",
    utility_decor: "UTILIDAD / DECORACIÓN",
    custom_orders: "PEDIDOS PERSONALIZADOS",
    contact_us: "CONTÁCTANOS",
    
    // Common
    loading: "Cargando...",
    no_results: "No se encontraron resultados",
    search_results: "Resultados de Búsqueda",
    
    // Product
    add_to_wishlist: "Agregar a Lista de Deseos",
    remove_from_wishlist: "Quitar de Lista de Deseos",
    view_details: "Ver Detalles",
    price: "Precio",
    moq: "Cantidad Mínima de Pedido",
    
    // Footer
    quick_links: "Enlaces Rápidos",
    categories: "Categorías",
    customer_service: "Servicio al Cliente",
    follow_us: "Síguenos",
    
    // Pages
    about_us: "Acerca de Nosotros",
    our_story: "Nuestra Historia",
    contact_info: "Información de Contacto",
    
    // Forms
    name: "Nombre",
    email: "Correo Electrónico",
    phone: "Teléfono",
    message: "Mensaje",
    submit: "Enviar",
    
    // Messages
    success: "Éxito",
    error: "Error",
    please_wait: "Por favor espere...",
  }
};

// Get translation for a key
export const getTranslation = (key, language = 'en') => {
  return translations[language]?.[key] || translations.en[key] || key;
};

// Get all translations for a language
export const getLanguageTranslations = (language = 'en') => {
  return translations[language] || translations.en;
};