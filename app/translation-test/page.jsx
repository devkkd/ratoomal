"use client";
import { useReliableTranslation } from '@/hooks/useReliableTranslation';

export default function TranslationTest() {
  const { currentLanguage, languages, changeLanguage, translationMethod, isLoading } = useReliableTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Translation System Test</h1>
        
        {/* Status Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Current Language</div>
              <div className="text-lg font-bold text-blue-900">{currentLanguage}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Translation Method</div>
              <div className="text-lg font-bold text-green-900">{translationMethod}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Status</div>
              <div className="text-lg font-bold text-purple-900">
                {isLoading ? 'Loading...' : 'Ready'}
              </div>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Language Selector</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  currentLanguage === lang.code
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                disabled={isLoading}
              >
                <div className="flex items-center gap-2">
                  <img src={lang.flag} alt={lang.name} className="w-5 h-3" />
                  <span className="text-sm font-medium">{lang.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Test Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Content for Translation</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              Welcome to our website! This is a comprehensive test page to verify that the translation system is working correctly across all text content.
            </p>
            <p className="text-gray-700">
              Our products are handcrafted with care and attention to detail. We offer a wide range of beautiful items including animal statues, god figures, and decorative pieces that will enhance your home.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Product Categories</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Animal Statues - Beautiful handcrafted animal figurines made with traditional techniques</li>
                <li>God Figures - Sacred religious sculptures crafted by skilled artisans</li>
                <li>Utility & Decor - Functional and decorative items for your home and office</li>
                <li>Custom Orders - Personalized creations designed according to your specifications</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Why Choose Our Products?</h3>
              <p className="text-blue-800">
                We are committed to quality, authenticity, and customer satisfaction. Our experienced artisans have years of expertise creating beautiful pieces that will enhance your living space and bring joy to your daily life.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Customer Testimonials</h3>
              <p className="text-green-800">
                "The quality of craftsmanship is exceptional. Every piece tells a story and adds character to our home. Highly recommended for anyone looking for authentic handmade items."
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Special Features</h3>
              <div className="text-yellow-800 space-y-2">
                <p>✓ Free shipping on orders above $50</p>
                <p>✓ 30-day money-back guarantee</p>
                <p>✓ Handcrafted by skilled artisans</p>
                <p>✓ Eco-friendly materials used</p>
                <p>✓ Custom designs available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Panel */}
        <div className="bg-gray-900 text-white rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="text-sm font-mono space-y-2">
            <div>Current Language: {currentLanguage}</div>
            <div>Translation Method: {translationMethod}</div>
            <div>Is Loading: {isLoading ? 'true' : 'false'}</div>
            <div>Available Languages: {languages.length}</div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                if (window.translationDebug) {
                  window.translationDebug.logStatus();
                } else {
                  console.log('Translation debug not available');
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm"
            >
              Log Debug Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}