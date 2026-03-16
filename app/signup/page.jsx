"use client";
import React, { useState } from "react";
import { Camera } from "lucide-react";

const VerifyBusiness = () => {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    businessEmail: "",
    country: "",
    phone: "",
    businessType: "",
    purpose: "",
    verificationProof: "",
  });

  const [verificationImage, setVerificationImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVerificationImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare form data
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });
      
      // Add image if exists
      if (verificationImage) {
        formData.append("verificationImage", verificationImage);
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        setShowSuccess(true);
        // Reset form
        setForm({
          companyName: "",
          contactName: "",
          businessEmail: "",
          country: "",
          phone: "",
          businessType: "",
          purpose: "",
          verificationProof: "",
        });
        setVerificationImage(null);
        setImagePreview(null);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Component
  const SuccessMessage = () => (
    <div className="min-h-screen bg-[#FBF7F0] flex flex-col items-center justify-center py-16 px-4 font-sans">
      <div className="max-w-lg text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl playfair font-semibold text-[#1A1A1A] mb-4">
            Request Submitted Successfully
          </h2>
          <p className="text-sm mona text-gray-600">
            Thank you for submitting your business verification request. 
            Our team will review your application and get back to you shortly.
            You will receive an email notification once your account is approved.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-xs mona text-gray-500">
            What happens next?
          </p>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <ul className="text-sm mona text-gray-600 space-y-3 text-left">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Our admin team will verify your business details</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>You'll receive an email notification within 1-2 business days</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Once approved, you'll have full access to protected product information</span>
              </li>
            </ul>
          </div>
          
          <button
            onClick={() => setShowSuccess(false)}
            className="mt-8 bg-[#C18C46] mona text-white px-8 py-3 rounded-full font-medium hover:bg-[#a6773a] transition-all shadow-sm"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    </div>
  );

  if (showSuccess) {
    return <SuccessMessage />;
  }

  return (
    <div className="min-h-screen bg-[#FBF7F0] flex flex-col items-center py-16 px-4 font-sans relative">
      {/* Header */}
      <div className="max-w-3xl text-center mb-10">
        <h1 className="text-3xl md:text-3xl playfair font-semibold text-[#1A1A1A] mb-5">
          Verify Your Business Identity
        </h1>
        <p className="text-sm mona text-gray-600 max-w-2xl mx-auto">
          Please share your business details to access protected product information. 
          This process helps us ensure genuine trade relationships and preserve design exclusivity.
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-3xl">
        <h2 className="text-center text-lg mona font-bold text-gray-800 mb-8">
          Business Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[13px] mona font-medium text-gray-500">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Enter your registered business name"
                  className="w-full px-4 py-3 rounded-lg mona border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-300 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] mona font-medium text-gray-500">Contact Person Name *</label>
                <input
                  type="text"
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg mona border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-300 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] mona font-medium text-gray-500">Business Email *</label>
                <input
                  type="email"
                  name="businessEmail"
                  value={form.businessEmail}
                  onChange={handleChange}
                  placeholder="Enter your business email"
                  className="w-full px-4 py-3 rounded-lg mona border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-300 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] mona font-medium text-gray-500">Phone / WhatsApp *</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your Phone / WhatsApp"
                  className="w-full px-4 py-3 mona rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-300 text-sm"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[13px] mona font-medium text-gray-500">Country *</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg mona border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-400 text-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select your country</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="India">India</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Japan">Japan</option>
                  <option value="China">China</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] mona font-medium text-gray-500">Business Type *</label>
                <select
                  name="businessType"
                  value={form.businessType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg mona border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-400 text-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select your business type</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Interior Designer">Interior Designer</option>
                  <option value="Architecture Firm">Architecture Firm</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Startup">Startup</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] mona font-medium text-gray-500">Purpose of Viewing This Product *</label>
                <select
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  className="w-full px-4 py-3 mona rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-400 text-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select your purpose</option>
                  <option value="Browse">Browse</option>
                  <option value="Wholesaler / Distributor">Wholesaler / Distributor</option>
                  <option value="Interior / Hospitality">Interior / Hospitality</option>
                  <option value="Corporate Buyer">Corporate Buyer</option>
                  <option value="Bulk / Wholesale Order">Bulk / Wholesale Order</option>
                  <option value="Custom Design Development">Custom Design Development</option>
                  <option value="Private Label / Branding">Private Label / Branding</option>
                  <option value="Corporate / Hospitality Project">Corporate / Hospitality Project</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] mona font-medium text-gray-500">Business Verification Proof *</label>
                <select
                  name="verificationProof"
                  value={form.verificationProof}
                  onChange={handleChange}
                  className="w-full px-4 py-3 mona rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-400 text-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select proof type</option>
                  <option value="Business Card">Business Card</option>
                  <option value="Shop/Store Photo">Shop/Store Photo</option>
                  <option value="Google Address Listing">Google Address Listing</option>
                  <option value="Business License">Business License</option>
                  <option value="Tax Certificate">Tax Certificate</option>
                  <option value="Website URL">Website URL</option>
                  <option value="Social Media Page">Social Media Page</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Full Width Upload Section */}
          <div className="space-y-1.5 pt-2">
            <label className="text-[13px] mona font-medium text-gray-500">
              Upload Image Business Verification Proof *
            </label>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Upload Button */}
              <div className="flex-1">
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <div className="w-full border border-gray-200 bg-white rounded-lg flex items-center px-4 py-3 hover:border-gray-300 transition-colors h-full">
                    <Camera className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm text-gray-300 mona">
                        {verificationImage ? verificationImage.name : "Click to upload image"}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        Supported formats: JPG, PNG, PDF (Max 5MB)
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleImageUpload}
                      required
                    />
                  </div>
                </label>
                {verificationImage && (
                  <p className="text-xs text-green-600 mona mt-2">
                    ✓ File selected: {verificationImage.name} ({(verificationImage.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="w-full md:w-48">
                  <p className="text-[13px] mona font-medium text-gray-500 mb-2">Preview:</p>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {verificationImage.type === "application/pdf" ? (
                      <div className="bg-gray-50 p-4 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-red-600 font-bold">PDF</span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{verificationImage.name}</p>
                      </div>
                    ) : (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-32 object-cover"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#C18C46] mona text-white px-12 py-3.5 rounded-full font-medium flex items-center gap-2 hover:bg-[#a6773a] transition-all shadow-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit & Review <span>→</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-[11px] mona text-gray-500 mt-12">
          We respect your privacy. Your details are used solely for verification and trade communication.
        </p>
      </div>
    </div>
  );
};

export default VerifyBusiness;