"use client";
import React, { useState, useEffect } from 'react';
import { Upload, ChevronDown } from 'lucide-react';
import FAQSection from '../components/FAQSection';
import PhoneInput from '../components/PhoneInput';

const CustomOrderForm = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPersonName: "",
    businessEmail: "",
    country: "",
    phone: "",
    inquiryType: "",
    productCategory: "",
    customizationRequired: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch categories from DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.contactPersonName.trim()) newErrors.contactPersonName = "Contact person name is required";
    if (!formData.businessEmail.trim()) {
      newErrors.businessEmail = "Business email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.businessEmail)) {
      newErrors.businessEmail = "Please enter a valid email";
    }
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.inquiryType) newErrors.inquiryType = "Inquiry type is required";
    if (!formData.productCategory) newErrors.productCategory = "Product category is required";
    if (!formData.customizationRequired) newErrors.customizationRequired = "Customization required field is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = selectedFiles.filter(file => file.size <= maxSize);
    
    if (validFiles.length !== selectedFiles.length) {
      alert("Some files exceed the 10MB size limit and were not selected.");
    }
    
    setFiles(validFiles);
  };

  // Upload files to R2
  const uploadFilesToR2 = async () => {
    if (files.length === 0) return [];

    const uploadedUrls = [];
    
    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        
        if (result.success && result.url) {
          uploadedUrls.push(result.url);
        } else {
          throw new Error(`Failed to upload ${file.name}`);
        }
      } catch (error) {
        console.error("Upload error:", error);
        throw new Error(`Failed to upload ${file.name}`);
      }
    }

    return uploadedUrls;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Upload files to R2
      let r2Urls = [];
      if (files.length > 0) {
        try {
          r2Urls = await uploadFilesToR2();
          console.log("R2 URLs:", r2Urls);
        } catch (uploadError) {
          alert(`File upload failed: ${uploadError.message}`);
          setLoading(false);
          return;
        }
      }

      // Step 2: Prepare data for database
      const orderData = {
        ...formData,
        referenceFiles: r2Urls, // This is the R2 URLs array
      };

      console.log("Submitting to database:", orderData);

      // Step 3: Save to database
      const response = await fetch('/api/admin/custom-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Your inquiry has been submitted successfully! We'll get back to you within 24-48 hours.");
        
        // Reset form
        setFormData({
          companyName: "",
          contactPersonName: "",
          businessEmail: "",
          country: "",
          phone: "",
          inquiryType: "",
          productCategory: "",
          customizationRequired: "",
          message: "",
        });
        setFiles([]);
        setErrors({});
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFBF2] min-h-screen py-12 px-4 font-sans">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl playfair font-bold text-black mb-6">
          Custom Orders
        </h2>
        <h1 className="text-2xl mona md:text-4xl py-2 font-bold text-black mb-6">
          Tailored Craftsmanship for Your Business
        </h1>
        <p className="text-black max-w-4xl mona mx-auto">
          Whether you need branded designs, exclusive finishes, or private collections for showrooms and boutiques, 
          our artisans can collaborate on bespoke concepts suited for your market.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto bg-[#FEF7E7] rounded-3xl p-8 md:p-12 shadow-sm border border-[#F3EAD3]">
        <h3 className="text-3xl playfair font-bold text-center text-black mb-10">
          Custom Orders
        </h3>

        <form className="space-y-6 mona" onSubmit={handleSubmit}>
          {/* Section 1: Business Details */}
          <div>
            <h4 className="text-md font-bold text-[#1A1A1A] mb-3 mona">
              Business Details *
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Company Name *</label>
                <input 
                  type="text" 
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter your registered business name" 
                  className={`w-full p-3 bg-white border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C18E4D] ${
                    errors.companyName ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.companyName && (
                  <p className="text-xs text-red-500">{errors.companyName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Contact Person Name *</label>
                <input 
                  type="text" 
                  name="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={handleChange}
                  placeholder="Enter your full name" 
                  className={`w-full p-3 bg-white border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C18E4D] ${
                    errors.contactPersonName ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.contactPersonName && (
                  <p className="text-xs text-red-500">{errors.contactPersonName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Business Email *</label>
                <input 
                  type="email" 
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  placeholder="Enter your business email" 
                  className={`w-full p-3 bg-white border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C18E4D] ${
                    errors.businessEmail ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.businessEmail && (
                  <p className="text-xs text-red-500">{errors.businessEmail}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Country *</label>
                <div className="relative">
                  <select 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full p-3 mona bg-white border rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#C18E4D] ${
                      errors.country ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select your country</option>
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="UAE">United Arab Emirates</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Austria">Austria</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Norway">Norway</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Finland">Finland</option>
                    <option value="Japan">Japan</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Hong Kong">Hong Kong</option>
                    <option value="China">China</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Oman">Oman</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Argentina">Argentina</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.country && (
                  <p className="text-xs text-red-500">{errors.country}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Phone / WhatsApp *</label>
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
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Order & Requirement Details */}
          <div>
            <h4 className="text-md font-bold text-[#1A1A1A] mb-3 mona">
              Order & Requirement Details *
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Type of Inquiry *</label>
                <div className="relative">
                  <select 
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className={`w-full p-3 bg-white border rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#C18E4D] ${
                      errors.inquiryType ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select Type of Inquiry</option>
                    <option value="Bulk Order">Bulk Order</option>
                    <option value="Private Label">Private Label</option>
                    <option value="Custom Design">Custom Design</option>
                    <option value="Sample Request">Sample Request</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.inquiryType && (
                  <p className="text-xs text-red-500">{errors.inquiryType}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Product Category *</label>
                <div className="relative">
                  <select 
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                    className={`w-full p-3 bg-white border rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#C18E4D] ${
                      errors.productCategory ? 'border-red-500' : 'border-gray-200'
                    }`}
                    disabled={categoriesLoading}
                  >
                    <option value="">
                      {categoriesLoading ? 'Loading categories...' : 'Select Product Category'}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.productCategory && (
                  <p className="text-xs text-red-500">{errors.productCategory}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Customization Required *</label>
                <div className="relative">
                  <select 
                    name="customizationRequired"
                    value={formData.customizationRequired}
                    onChange={handleChange}
                    className={`w-full p-3 bg-white border rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#C18E4D] ${
                      errors.customizationRequired ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select Customization Type</option>
                    <option value="Finish & Color">Finish &amp; Color Customization</option>
                    <option value="Material Modification">Material Modification</option>
                    <option value="Size Modification">Size Modification</option>
                    <option value="Branding & Logo">Branding &amp; Logo Addition</option>
                    <option value="Custom Packaging">Custom Packaging</option>
                    <option value="Full Customization">Full Customization</option>
                    <option value="No Customization">No Customization Needed</option>
                    <option value="Other">Other Requirements</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.customizationRequired && (
                  <p className="text-xs text-red-500">{errors.customizationRequired}</p>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="text-xs font-medium text-gray-700">Additional Message</label>
              <textarea 
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Share design references, market preferences, timelines, or any special requirements"
                className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C18E4D] resize-none"
              ></textarea>
            </div>
          </div>

          {/* Section 3: Upload and Submit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Upload Reference Files (Optional)</label>
              <div className="relative">
                <button 
                  type="button" 
                  className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm text-gray-400 flex justify-between items-center cursor-pointer hover:border-[#C18E4D] transition"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <span>
                    {files.length > 0 ? 
                      `${files.length} file(s) selected` : 
                      "Click to upload (Max 10MB each)"
                    }
                  </span>
                  <Upload className="h-4 w-4" />
                </button>
                <input 
                  id="fileInput"
                  type="file" 
                  multiple 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.rar"
                />
                {files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {files.map((file, index) => (
                      <div key={index} className="text-xs text-gray-600 truncate">
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#C18E4D] hover:bg-[#A67B42] text-white font-medium py-3 rounded-md transition duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Inquiry"}
              {!loading && <span className="text-lg">→</span>}
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            * Required fields<br />
            Our team typically responds within 24–48 business hours with next steps, catalogs, or quotations.
          </p>
        </form>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16">
        <FAQSection/>
      </div>
    </div>
  );
};

export default CustomOrderForm;