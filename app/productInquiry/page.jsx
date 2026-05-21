"use client";
import React, { useState, Suspense } from "react";
import { ChevronDown, Upload, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PhoneInput from "@/app/components/PhoneInput";

const ProductInquiryContent = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    country: "",
    phone: "",
    inquiryType: "",
    quantity: "",
    customization: "",
    message: "",
    file: null,
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    
    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.country) {
      newErrors.country = "Country is required";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }    
    if (!formData.inquiryType) {
      newErrors.inquiryType = "Inquiry type is required";
    }
    
    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    }
    
    if (!formData.customization) {
      newErrors.customization = "Customization option is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async () => {
    if (!productId) {
      alert("Product not found");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productId,
          ...formData,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setShowSuccessModal(true);
        setFormData({
          companyName: "",
          contactName: "",
          email: "",
          country: "",
          phone: "",
          inquiryType: "",
          quantity: "",
          customization: "",
          message: "",
          file: null,
        });
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      setLoading(false);
      alert("Failed to submit inquiry");
    }
  };

  const SuccessModal = () => {
    if (!showSuccessModal) return null;

    return (
<div className="fixed inset-0 z-50 p-4 flex items-center justify-center backdrop-blur-xs">
  <div 
    className="bg-[#FFF6EB] rounded-xl max-w-md w-full p-8 relative 
               shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] 
               border border-gray-200"
  >
    {/* Close button */}
    <button
      onClick={() => setShowSuccessModal(false)}
      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
    >
      <X size={24} />
    </button>
    
    {/* Success Icon */}
    <div className="flex justify-center mb-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <img src="/images/icons/tick-circle.png" alt="Success" />
      </div>
    </div>
    
    {/* Title */}
    <h3 className="text-2xl  font-bold text-center text-gray-800 mb-4">
      Inquiry Successfully Sent
    </h3>
    
    {/* Message */}
    <p className="text-gray-600 text-center mona mb-6">
      Thank you for your interest in our products. Your inquiry has been received by our team.
    </p>
    
    <p className="text-gray-600 text-center mona mb-8">
      One of our representatives will review the details and contact you shortly with pricing, availability, and next steps.
    </p>
    
    
    {/* Continue Browsing Button */}
    <div className="flex justify-center">
      <Link href="/category">
      <button
        onClick={() => setShowSuccessModal(false)}
        className="px-6 py-3 bg-[#bf8e44] text-white font-semibold rounded-full hover:bg-[#a67a38] transition shadow-sm flex items-center gap-2"
      >
        Continue Browsing Products →
      </button>
      </Link>
    </div>
  </div>
</div>
    );
  };

  return (
    <>
      <div className="w-full bg-[#FFF6EB] py-8 px-6 md:px-12 font-sans text-[#333]">
        <div className="max-w-7xl mx-auto">
          <h3 className="playfair text-2xl font-bold text-center mb-12 text-[#1a1a1a]">
            Product Inquiry
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
            {/* Left Side: Business Details */}
            <div className="space-y-3">
              <h3 className="text-md mona font-bold text-[#1a1a1a] mb-4">
                Business Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] mona font-medium">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter your registered business name"
                    className={`w-full p-2 bg-white border rounded-lg text-[12px] focus:outline-none focus:ring-1 ${
                      errors.companyName 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-200 focus:ring-[#bf8e44]"
                    }`}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-[10px]">{errors.companyName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] mona font-medium">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full p-2 bg-white border rounded-lg text-[12px] focus:outline-none focus:ring-1 ${
                      errors.contactName 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-200 focus:ring-[#bf8e44]"
                    }`}
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-[10px]">{errors.contactName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] mona font-medium">
                    Business Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your business email"
                    className={`w-full p-2 bg-white border rounded-lg text-[12px] focus:outline-none focus:ring-1 ${
                      errors.email 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-200 focus:ring-[#bf8e44]"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[10px]">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] mona font-medium">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full p-2 bg-white border rounded-lg text-[12px] appearance-none focus:outline-none focus:ring-1 ${
                        errors.country 
                          ? "border-red-500 focus:ring-red-500 text-red-500" 
                          : "border-gray-200 focus:ring-[#bf8e44] text-gray-400"
                      }`}
                    >
                      <option value="">Select your country</option>
                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="India">India</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        errors.country ? "text-red-500" : "text-gray-400"
                      }`}
                      size={18}
                    />
                  </div>
                  {errors.country && (
                    <p className="text-red-500 text-[10px]">{errors.country}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 w-full md:w-1/2 pr-2">
                <label className="text-[12px] mona font-medium">
                  Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  name="phone"
                  value={formData.phone}
                  onChange={(val) => {
                    setFormData(prev => ({ ...prev, phone: val }));
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
                  }}
                  placeholder="Enter your phone number"
                  error={!!errors.phone}
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-[10px]">{errors.phone}</p>
                )}
              </div>

              <p className="text-[13px] text-gray-600 mt-4 leading-relaxed">
                Our team typically responds within 24–48 business hours with next
                steps, catalogs, or quotations.
              </p>
            </div>

            {/* Right Side: Order & Requirement Details */}
            <div className="space-y-3">
              <h3 className="text-md mona font-bold text-[#1a1a1a] mb-4">
                Order & Requirement Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] mona font-medium">
                    Type of Inquiry <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className={`w-full p-2 bg-white border rounded-lg text-[12px] appearance-none focus:outline-none focus:ring-1 ${
                        errors.inquiryType 
                          ? "border-red-500 focus:ring-red-500 text-red-500" 
                          : "border-gray-200 focus:ring-[#bf8e44] text-gray-400"
                      }`}
                    >
                      <option value="">Select Type of Inquiry</option>
                      <option value="bulk">Bulk / Wholesale Order</option>
                      <option value="custom">Custom Design Development</option>
                      <option value="private">Private Label / Branding</option>
                      <option value="corporate">Corporate / Hospitality Project</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        errors.inquiryType ? "text-red-500" : "text-gray-400"
                      }`}
                      size={18}
                    />
                  </div>
                  {errors.inquiryType && (
                    <p className="text-red-500 text-[10px]">{errors.inquiryType}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] mona font-medium">
                    Estimated Order Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className={`w-full p-2 bg-white border rounded-lg text-[12px] appearance-none focus:outline-none focus:ring-1 ${
                        errors.quantity 
                          ? "border-red-500 focus:ring-red-500 text-red-500" 
                          : "border-gray-200 focus:ring-[#bf8e44] text-gray-400"
                      }`}
                    >
                      <option value="">Select Estimated Order Quantity</option>
                      <option value="50-100">50-100 pcs</option>
                      <option value="100-500">100-500 pcs</option>
                      <option value="500-1000">500-1000 pcs</option>
                      <option value="1000+">1000+ pcs</option>
                      <option value="discuss">To be discussed</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        errors.quantity ? "text-red-500" : "text-gray-400"
                      }`}
                      size={18}
                    />
                  </div>
                  {errors.quantity && (
                    <p className="text-red-500 text-[10px]">{errors.quantity}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] mona font-medium">
                    Customization Required <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="customization"
                      value={formData.customization}
                      onChange={handleChange}
                      className={`w-full p-2 bg-white border rounded-lg text-[12px] appearance-none focus:outline-none focus:ring-1 ${
                        errors.customization 
                          ? "border-red-500 focus:ring-red-500 text-red-500" 
                          : "border-gray-200 focus:ring-[#bf8e44] text-gray-400"
                      }`}
                    >
                      <option value="">Select Customization Required</option>
                      <option value="finish">Finish / Color</option>
                      <option value="material">Material</option>
                      <option value="packaging">Packaging</option>
                      <option value="branding">Branding / Logo</option>
                      <option value="none">No customization</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        errors.customization ? "text-red-500" : "text-gray-400"
                      }`}
                      size={18}
                    />
                  </div>
                  {errors.customization && (
                    <p className="text-red-500 text-[10px]">{errors.customization}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] mona font-medium">
                    Upload Reference Files
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-[12px] flex justify-between items-center text-gray-400 cursor-pointer hover:bg-gray-50"
                  >
                    <span>{formData.file ? formData.file.name : "Upload"}</span>
                    <Upload size={18} />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] mona font-medium">
                  Message
                </label>
                <textarea
                  rows={3}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share design references, market preferences, timelines, or any special requirements"
                  className={`w-full p-2 bg-white border rounded-lg text-[12px] focus:outline-none focus:ring-1 resize-none ${
                    errors.message 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-gray-200 focus:ring-[#bf8e44]"
                  }`}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-[10px]">{errors.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Horizontal Divider */}
          <div className="w-full h-[1px] bg-gray-200 my-10"></div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-10 py-2 bg-[#bf8e44] text-white font-semibold rounded-full hover:bg-[#a67a38] transition shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Inquiry →"}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal />
    </>
  );
};

const ProductInquiry = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductInquiryContent />
    </Suspense>
  );
};

export default ProductInquiry;