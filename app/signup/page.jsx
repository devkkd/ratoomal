"use client";
import React, { useState } from "react";
import { Camera, AlertCircle, CheckCircle, X } from "lucide-react";
import PhoneInput from "@/app/components/PhoneInput";

// Allowed file types for client-side validation
const ALLOWED_TYPES = [
  "image/jpeg", "image/jpg", "image/png", "image/webp",
  "image/heic", "image/heif", "image/gif", "image/bmp", "application/pdf",
];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".gif", ".bmp", ".pdf"];
const MAX_SIZE_MB = 20;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

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

  // Inline error/success states
  const [imageError, setImageError] = useState("");   // image-specific error
  const [formError, setFormError] = useState("");     // general form/server error
  const [uploadStatus, setUploadStatus] = useState(""); // "uploading" | "done" | ""

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (formError) setFormError("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageError("");

    // Size check
    if (file.size > MAX_SIZE_BYTES) {
      setImageError(
        `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is ${MAX_SIZE_MB} MB.`
      );
      e.target.value = "";
      return;
    }

    // Type check — by MIME or extension
    const ext = "." + file.name.split(".").pop().toLowerCase();
    const validType = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);
    if (!validType) {
      setImageError(
        `"${file.name}" is not a supported format. Please upload a JPG, PNG, WEBP, HEIC, or PDF file.`
      );
      e.target.value = "";
      return;
    }

    setVerificationImage(file);

    // Generate preview (skip for PDF)
    if (file.type === "application/pdf" || ext === ".pdf") {
      setImagePreview("pdf");
    } else {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.onerror = () => setImageError("Could not read the file. Please try a different file.");
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setVerificationImage(null);
    setImagePreview(null);
    setImageError("");
    // Reset the file input
    const input = document.getElementById("file-upload");
    if (input) input.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setImageError("");

    // Client-side image validation before submit
    if (!verificationImage) {
      setImageError("Please upload your business verification proof image or PDF.");
      return;
    }

    setIsSubmitting(true);
    setUploadStatus("uploading");

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      formData.append("verificationImage", verificationImage);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server error (${res.status}). Please try again.`);
      }

      if (res.ok) {
        setUploadStatus("done");
        setShowSuccess(true);
        setForm({
          companyName: "", contactName: "", businessEmail: "",
          country: "", phone: "", businessType: "", purpose: "", verificationProof: "",
        });
        setVerificationImage(null);
        setImagePreview(null);
      } else {
        setUploadStatus("");
        // Show image-specific errors near the upload field
        const msg = data.message || "Something went wrong. Please try again.";
        if (
          msg.toLowerCase().includes("file") ||
          msg.toLowerCase().includes("image") ||
          msg.toLowerCase().includes("upload") ||
          msg.toLowerCase().includes("format") ||
          msg.toLowerCase().includes("size")
        ) {
          setImageError(msg);
        } else {
          setFormError(msg);
        }
      }
    } catch (err) {
      setUploadStatus("");
      setFormError(err.message || "Something went wrong. Please try again.");
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
                <PhoneInput
                  name="phone"
                  value={form.phone}
                  onChange={(val) => setForm((prev) => ({ ...prev, phone: val }))}
                  placeholder="Enter your phone number"
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
                <label htmlFor="file-upload" className={`cursor-pointer block ${imageError ? 'pointer-events-none opacity-60' : ''}`}>
                  <div className={`w-full border rounded-lg flex items-center px-4 py-3 hover:border-gray-300 transition-colors bg-white ${
                    imageError ? 'border-red-300 bg-red-50' : verificationImage ? 'border-green-300 bg-green-50' : 'border-gray-200'
                  }`}>
                    <Camera className={`w-5 h-5 mr-3 flex-shrink-0 ${imageError ? 'text-red-400' : verificationImage ? 'text-green-500' : 'text-gray-400'}`} />
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm mona truncate block ${verificationImage ? 'text-gray-700 font-medium' : 'text-gray-300'}`}>
                        {verificationImage ? verificationImage.name : "Click to upload image or PDF"}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        JPG, PNG, WEBP, HEIC, PDF — Max {MAX_SIZE_MB}MB
                      </p>
                    </div>
                    {verificationImage && (
                      <span className="text-xs text-green-600 mona ml-2 shrink-0">
                        {(verificationImage.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    )}
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleImageUpload}
                  />
                </label>

                {/* Image error message */}
                {imageError && (
                  <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-red-700 mona font-medium">Upload Error</p>
                      <p className="text-xs text-red-600 mona mt-0.5">{imageError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setImageError(""); }}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Success indicator */}
                {verificationImage && !imageError && (
                  <div className="mt-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <p className="text-xs text-green-600 mona">
                      File ready: {verificationImage.name}
                    </p>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="ml-auto text-xs text-gray-400 hover:text-red-500 mona underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Image Preview */}
              {imagePreview && !imageError && (
                <div className="w-full md:w-48 shrink-0">
                  <p className="text-[13px] mona font-medium text-gray-500 mb-2">Preview:</p>
                  <div className="border border-gray-200 rounded-lg overflow-hidden relative group">
                    {imagePreview === "pdf" ? (
                      <div className="bg-gray-50 p-4 text-center h-32 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-red-600 font-bold text-xs">PDF</span>
                        </div>
                        <p className="text-xs text-gray-600 truncate w-full px-2">{verificationImage?.name}</p>
                      </div>
                    ) : (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* General form error banner */}
          {formError && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700 mona font-medium">Submission Failed</p>
                <p className="text-sm text-red-600 mona mt-0.5">{formError}</p>
              </div>
              <button type="button" onClick={() => setFormError("")} className="text-red-400 hover:text-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

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