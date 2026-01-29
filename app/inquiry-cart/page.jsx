"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingCart, Send, X, Edit3, Package, ChevronDown, Upload } from 'lucide-react';
import { useInquiryCartStore } from '@/store/inquiryCartStore';
import { useAuth } from '@/hooks/useAuth';
import Cookies from 'js-cookie';

const InquiryCartPage = () => {
  const router = useRouter();
  const { isLoggedIn, isClient } = useAuth();
  
  const {
    cart,
    removeFromCart,
    updateQuantity,
    updateSizes,
    clearCart,
    getCartCount,
    getTotalItems,
    initialize
  } = useInquiryCartStore();

  const [customSize, setCustomSize] = useState('');
  const [inquiryData, setInquiryData] = useState({
    inquiryFor: '',
    customizationNeeded: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false); // Track if inquiry was just submitted

  // Play success sound
  const playSuccessSound = () => {
    if (typeof window !== 'undefined') {
      try {
        // Create a simple success sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.log('Could not play success sound:', error);
      }
    }
  };

  // Initialize cart on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initialize();
    }
  }, [initialize]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isClient && !isLoggedIn) {
      router.push('/login?redirect=/inquiry-cart');
    }
  }, [isLoggedIn, isClient, router]);

  const handleQuantityChange = (cartItemId, change) => {
    const item = cart.find(item => item.id === cartItemId);
    if (item) {
      let newQuantity = item.quantity + change;
      // Ensure minimum quantity is 1 and changes are in multiples of 6
      if (change < 0 && newQuantity < 1) {
        newQuantity = 1;
      }
      updateQuantity(cartItemId, newQuantity);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!inquiryData.inquiryFor) {
      newErrors.inquiryFor = "Please select inquiry purpose";
    }
    
    if (!inquiryData.customizationNeeded) {
      newErrors.customizationNeeded = "Please select customization option";
    }
    
    if (!inquiryData.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Get user email from localStorage as fallback
      const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
      
      const inquiryPayload = {
        cartProducts: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedSizes: item.selectedSizes
        })),
        inquiryFor: inquiryData.inquiryFor,
        customizationNeeded: inquiryData.customizationNeeded,
        message: inquiryData.message,
        userEmail // Add userEmail as fallback
      };

      const response = await fetch('/api/admin/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: Include cookies for JWT
        body: JSON.stringify(inquiryPayload),
      });

      const data = await response.json();

      if (data.success) {
        playSuccessSound(); // Play success sound
        setInquirySubmitted(true); // Mark inquiry as submitted
        setShowSuccessModal(true);
        clearCart();
        setInquiryData({
          inquiryFor: '',
          customizationNeeded: '',
          message: ''
        });
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInquiryData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    setInquiryData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  // Show loading or redirect message if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#bf8e44] mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    // Show success message if inquiry was just submitted
    if (inquirySubmitted) {
      return (
        <div className="min-h-screen bg-[#FFF6EB] py-8">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl playfair font-bold text-gray-900 mb-8 text-center">Inquiry Submitted Successfully!</h1>
            <div className="text-center py-16">
              {/* Success Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">🎉 Your Inquiry Has Been Placed Successfully!</h2>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Thank you for your interest in our products. Your inquiry has been received and our team will review it shortly.
              </p>
              
              {/* <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 max-w-lg mx-auto">
                <h3 className="text-lg font-semibold text-green-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-green-700 space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Our team will review your requirements within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>You'll receive a detailed quote with pricing and availability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Our representative will contact you to discuss next steps</span>
                  </li>
                </ul>
              </div> */}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setInquirySubmitted(false);
                    router.push('/category');
                  }}
                  className="bg-[#bf8e44] text-white px-8 py-3 rounded-full hover:bg-[#a67a38] transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
                  </svg>
                  Browse More Products
                </button>
                <button
                  onClick={() => {
                    setInquirySubmitted(false);
                    router.push('/');
                  }}
                  className="bg-white text-[#bf8e44] border-2 border-[#bf8e44] px-8 py-3 rounded-full hover:bg-[#bf8e44] hover:text-white transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Show empty cart message if no inquiry was submitted
    return (
      <div className="min-h-screen bg-[#FFF6EB] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl playfair font-bold text-gray-900 mb-8">Inquiry Cart</h1>
          <div className="text-center py-16">
            <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your inquiry cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to your inquiry cart to get started</p>
            <button
              onClick={() => router.push('/category')}
              className="bg-[#bf8e44] text-white px-6 py-3 rounded-full hover:bg-[#a67a38] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const SuccessModal = () => {
    if (!showSuccessModal) return null;

    // Auto-close modal after 10 seconds
    React.useEffect(() => {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 10000);

      return () => clearTimeout(timer);
    }, []);

    return (
      <>
        {/* Confetti Effect */}
        <div className="fixed inset-0 z-40 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div className={`w-2 h-2 rounded-full ${
                ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-red-400', 'bg-purple-400'][Math.floor(Math.random() * 5)]
              }`} />
            </div>
          ))}
        </div>

        {/* Modal */}
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div 
            className="bg-[#FFF6EB] rounded-xl max-w-md w-full p-8 relative 
                       shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] 
                       border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-300"
          >
            {/* Close button */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setInquirySubmitted(false);
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
            
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Title */}
            <h3 className="text-2xl playfair font-bold text-center text-gray-800 mb-4">
              🎉 Inquiry Successfully Submitted!
            </h3>
            
            {/* Message */}
            <p className="text-gray-600 text-center mona mb-4">
              <strong>Thank you for your interest!</strong> Your inquiry has been received by our team.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-center text-sm mona">
                ✅ Our representatives will review your requirements and contact you within <strong>24-48 hours</strong> with pricing, availability, and next steps.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setInquirySubmitted(false);
                  router.push('/category');
                }}
                className="w-full px-6 py-3 bg-[#bf8e44] text-white font-semibold rounded-full hover:bg-[#a67a38] transition shadow-sm flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
                </svg>
                Continue Browsing Products
              </button>
              
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setInquirySubmitted(false);
                  router.push('/');
                }}
                className="w-full px-6 py-3 bg-white text-[#bf8e44] font-semibold border-2 border-[#bf8e44] rounded-full hover:bg-[#bf8e44] hover:text-white transition shadow-sm flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Homepage
              </button>
            </div>
            
            {/* Auto-close indicator with countdown */}
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-gray-500">
                  Auto-closing in <span className="font-bold text-[#bf8e44]">10</span> seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#FFF6EB] py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-3xl playfair font-bold text-center text-gray-900 mb-8">Inquiry Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Products */}
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl mona font-bold text-gray-900">Selected Products</h2>
                <div className="text-sm text-gray-600">
                  {isClient ? `${getCartCount()} items • ${getTotalItems()} total pieces` : 'Loading...'}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                {cart.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 last:border-b-0 p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.image || '/images/placeholder.png'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="text-md mona font-semibold text-gray-900 mb-2">{item.name}</h3>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center  ">
                            <button
                              onClick={() => handleQuantityChange(item.id, -6)}
                              className="p-1 rounded-full  items-center flex justify-center hover:bg-gray-100"
                              disabled={item.quantity <= 6}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3  py-2 bg-gray-100 rounded-md text-sm font-medium min-w-[60px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 6)}
                              className="p-1 rounded-full items-center flex justify-center hover:bg-gray-100"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="text-xs text-gray-600">
                            Total: {item.quantity} pieces
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs mona font-medium text-gray-700">Selected Sizes:</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {item.selectedSizes.map((size, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-[#bf8e44] bg-opacity-10 text-white text-xs rounded-full"
                              >
                                {size} inch
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => clearCart()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Right Side - Inquiry Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl mona font-bold text-gray-900 mb-6">Submit Inquiry</h2>
              
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {/* Order Summary */}
                <div className="bg-[#FFF6EB] p-4 rounded-lg mb-6">
                  <h3 className="text-md mona font-bold text-[#1a1a1a] mb-3">
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Products:</span>
                      <span className="font-medium">{isClient ? getCartCount() : 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Pieces:</span>
                      <span className="font-medium">{isClient ? getTotalItems() : 0}</span>
                    </div>
                  </div>
                </div>

                {/* Inquiry Purpose */}
                <div className="space-y-2">
                  <label className="text-[12px] mona font-medium">
                    What is this inquiry for? <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="inquiryFor"
                      value={inquiryData.inquiryFor}
                      onChange={handleInputChange}
                      className={`w-full p-3 bg-white border rounded-lg text-[12px] appearance-none focus:outline-none focus:ring-1 ${
                        errors.inquiryFor 
                          ? "border-red-500 focus:ring-red-500 text-red-500" 
                          : "border-gray-200 focus:ring-[#bf8e44] text-gray-700"
                      }`}
                    >
                      <option value="">Select inquiry purpose</option>
                      <option value="bulk_order">Bulk Order</option>
                      <option value="wholesale">Wholesale Purchase</option>
                      <option value="custom_design">Custom Design Development</option>
                      <option value="private_label">Private Label / Branding</option>
                      <option value="corporate_project">Corporate / Hospitality Project</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        errors.inquiryFor ? "text-red-500" : "text-gray-400"
                      }`}
                      size={18}
                    />
                  </div>
                  {errors.inquiryFor && (
                    <p className="text-red-500 text-[10px]">{errors.inquiryFor}</p>
                  )}
                </div>

                {/* Customization Needed */}
                <div className="space-y-2">
                  <label className="text-[12px] mona font-medium">
                    Customization Required <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="customizationNeeded"
                      value={inquiryData.customizationNeeded}
                      onChange={handleInputChange}
                      className={`w-full p-3 bg-white border rounded-lg text-[12px] appearance-none focus:outline-none focus:ring-1 ${
                        errors.customizationNeeded 
                          ? "border-red-500 focus:ring-red-500 text-red-500" 
                          : "border-gray-200 focus:ring-[#bf8e44] text-gray-700"
                      }`}
                    >
                      <option value="">Select customization needed</option>
                      <option value="finish_color">Finish / Color</option>
                      <option value="material">Material</option>
                      <option value="packaging">Packaging</option>
                      <option value="branding_logo">Branding / Logo</option>
                      <option value="none">No customization needed</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        errors.customizationNeeded ? "text-red-500" : "text-gray-400"
                      }`}
                      size={18}
                    />
                  </div>
                  {errors.customizationNeeded && (
                    <p className="text-red-500 text-[10px]">{errors.customizationNeeded}</p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label className="text-[12px] mona font-medium">
                    Message / Special Requirements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    value={inquiryData.message}
                    onChange={handleInputChange}
                    placeholder="Please describe your requirements, preferred timeline, budget range, or any other details..."
                    className={`w-full p-3 bg-white border rounded-lg text-[12px] focus:outline-none focus:ring-1 resize-none ${
                      errors.message 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-200 focus:ring-[#bf8e44]"
                    }`}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-[10px]">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-[#bf8e44] text-white font-semibold rounded-full hover:bg-[#a67a38] transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Inquiry →"}
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    <strong>Note:</strong> Your business details will be automatically fetched from your account. 
                    Our team will contact you within 24-48 hours with pricing, availability, and next steps.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal />
    </>
  );
};

export default InquiryCartPage;