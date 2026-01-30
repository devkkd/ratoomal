"use client";
import React, { useState } from 'react';
import { ChevronDown, Upload, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPersonName: '',
    businessEmail: '',
    country: '',
    phone: '',
    inquiryType: '',
    productCategory: '',
    estimatedQuantity: '',
    customizationRequired: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [submitMessage, setSubmitMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'India', 'UAE', 'Saudi Arabia', 'Other'
  ];

  const inquiryTypes = [
    { value: 'bulk_order', label: 'Bulk Order (50+ pieces)' },
    { value: 'custom_design', label: 'Custom Design & Manufacturing' },
    { value: 'wholesale', label: 'Wholesale Partnership' },
    { value: 'private_label', label: 'Private Label/OEM' },
    { value: 'corporate_project', label: 'Corporate Gifting Project' },
    { value: 'other', label: 'Other Requirements' }
  ];

  const productCategories = [
    { value: 'elephant_figurines', label: 'Elephant Figurines' },
    { value: 'god_figurines', label: 'God Figurines' },
    { value: 'utility_decor', label: 'Utility & Decor Items' },
    { value: 'animal_figurines', label: 'Animal Figurines' },
    { value: 'all_categories', label: 'All Categories' },
    { value: 'other', label: 'Other/Custom Category' }
  ];

  const quantities = [
    { value: '1-50', label: '1-50 pieces' },
    { value: '51-100', label: '51-100 pieces' },
    { value: '101-500', label: '101-500 pieces' },
    { value: '501-1000', label: '501-1000 pieces' },
    { value: '1000+', label: '1000+ pieces' },
    { value: 'not_sure', label: 'Not sure yet' }
  ];

  const customizations = [
    { value: 'finish_color', label: 'Finish & Color Customization' },
    { value: 'material_change', label: 'Material Modification' },
    { value: 'size_modification', label: 'Size Modification' },
    { value: 'branding_logo', label: 'Branding & Logo Addition' },
    { value: 'packaging', label: 'Custom Packaging' },
    { value: 'none', label: 'No Customization Needed' },
    { value: 'other', label: 'Other Requirements' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/contact/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        
        if (data.success) {
          return {
            filename: data.data.publicId,
            originalName: data.data.originalName,
            url: data.data.url,
            size: data.data.size,
            format: data.data.format
          };
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      });

      const uploadedFileData = await Promise.all(uploadPromises);
      setUploadedFiles(prev => [...prev, ...uploadedFileData]);
      
      // Clear the file input
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading files:', error);
      setSubmitStatus('error');
      setSubmitMessage('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'home_page_bulk_section',
          referenceFiles: uploadedFiles
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setSubmitMessage(data.message);
        // Reset form
        setFormData({
          companyName: '',
          contactPersonName: '',
          businessEmail: '',
          country: '',
          phone: '',
          inquiryType: '',
          productCategory: '',
          estimatedQuantity: '',
          customizationRequired: '',
          message: ''
        });
        setUploadedFiles([]);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="bg-[#FDF6EB] min-h-screen py-8 sm:py-16 font-sans text-[#1A1A1A]">
      {/* Success/Error Messages */}
      {submitStatus && (
        <div className={`max-w-7xl mx-auto mb-8 p-4 rounded-lg flex items-center space-x-3 ${
          submitStatus === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {submitStatus === 'success' ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <p className="font-medium">{submitMessage}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 px-6  ">
        
        {/* Left Column: Content */}
        <div className="space-y-6">
          <h3 className="text-2xl md:text-3xl playfair font-bold text-gray-800">
            Custom & Bulk Solutions
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold mona">
            Tailored Craftsmanship <br /> for Your Business
          </h2>
          <p className="text-gray-600 text-md max-w-md  mona">
            Whether you need branded designs, exclusive finishes, or private 
            collections for showrooms and boutiques, our artisans can 
            collaborate on bespoke concepts suited for your market.
          </p>
        </div>

        {/* Right Column: Form */}
        <div>
          <h2 className="text-2xl md:text-3xl playfair font-bold mb-8">
            Contact Our Design Team
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Business Details Section */}
            <div>
              <h4 className="font-bold mona text-md mb-4">Business Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs mona font-semibold text-gray-500 ">Company Name *</label>
                  <input 
                    type="text" 
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter your registered business name" 
                    className="w-full p-3 rounded-md border border-gray-200 focus:outline-none text-sm bg-white focus:ring-1 focus:ring-[#C08237]" 
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs mona font-semibold text-gray-500 ">Contact Person Name *</label>
                  <input 
                    type="text" 
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name" 
                    className="w-full p-3 rounded-md border border-gray-200 focus:outline-none text-sm bg-white focus:ring-1 focus:ring-[#C08237]" 
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs mona font-semibold text-gray-500 ">Business Email *</label>
                  <input 
                    type="email" 
                    name="businessEmail"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                    placeholder="Enter your business email" 
                    className="w-full p-3 rounded-md border border-gray-200 focus:outline-none text-sm bg-white focus:ring-1 focus:ring-[#C08237]" 
                    required
                  />
                </div>
                <div className="space-y-1 relative">
                  <label className="text-xs mona font-semibold text-gray-500 ">Country *</label>
                  <select 
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md border border-gray-200 appearance-none focus:outline-none text-sm bg-white pr-10 focus:ring-1 focus:ring-[#C08237]"
                    required
                  >
                    <option value="">Select your country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 bottom-3 text-gray-400" size={18} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs mona font-semibold text-gray-500 ">Phone / WhatsApp *</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your Phone / WhatsApp" 
                    className="w-full p-3 rounded-md border border-gray-200 focus:outline-none text-sm bg-white focus:ring-1 focus:ring-[#C08237]" 
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order & Requirement Details Section */}
            <div>
              <h4 className="font-bold mona text-md mb-4">Order & Requirement Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 relative">
                  <label className="text-xs mona font-semibold text-gray-500 ">Type of Inquiry *</label>
                  <select 
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md border border-gray-200 appearance-none focus:outline-none text-sm bg-white pr-10 focus:ring-1 focus:ring-[#C08237]"
                    required
                  >
                    <option value="">Select Type of Inquiry</option>
                    {inquiryTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 bottom-3 text-gray-400" size={18} />
                </div>
                <div className="space-y-1 relative">
                  <label className="text-xs mona font-semibold text-gray-500 ">Product Category Interested In *</label>
                  <select 
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md border border-gray-200 appearance-none focus:outline-none text-sm bg-white pr-10 focus:ring-1 focus:ring-[#C08237]"
                    required
                  >
                    <option value="">Select Product Category</option>
                    {productCategories.map(category => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 bottom-3 text-gray-400" size={18} />
                </div>
                <div className="space-y-1 relative">
                  <label className="text-xs mona font-semibold text-gray-500 ">Estimated Order Quantity *</label>
                  <select 
                    name="estimatedQuantity"
                    value={formData.estimatedQuantity}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md border border-gray-200 appearance-none focus:outline-none text-sm bg-white pr-10 focus:ring-1 focus:ring-[#C08237]"
                    required
                  >
                    <option value="">Select Estimated Quantity</option>
                    {quantities.map(qty => (
                      <option key={qty.value} value={qty.value}>{qty.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 bottom-3 text-gray-400" size={18} />
                </div>
                <div className="space-y-1 relative">
                  <label className="text-xs mona font-semibold text-gray-500 ">Customization Required *</label>
                  <select 
                    name="customizationRequired"
                    value={formData.customizationRequired}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md border border-gray-200 appearance-none focus:outline-none text-sm bg-white pr-10 focus:ring-1 focus:ring-[#C08237]"
                    required
                  >
                    <option value="">Select Customization Required</option>
                    {customizations.map(custom => (
                      <option key={custom.value} value={custom.value}>{custom.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 bottom-3 text-gray-400" size={18} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs mona font-semibold text-gray-500 ">Message *</label>
                  <textarea 
                    rows="4" 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Share design references, market preferences, timelines, or any special requirements" 
                    className="w-full p-3 rounded-md border border-gray-200 focus:outline-none text-sm bg-white resize-none focus:ring-1 focus:ring-[#C08237]"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Upload and Submit Section */}
            <div className="flex flex-col md:flex-row items-end gap-4">
              <div className="w-full md:w-1/2 space-y-1">
                <label className="text-xs font-semibold text-gray-500 mona">Upload Reference Files</label>
                <div className="relative">
                  <input 
                    type="file" 
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <div className={`w-full p-3 rounded-md border border-gray-200 focus:outline-none text-sm bg-white cursor-pointer hover:bg-gray-50 flex justify-between items-center ${isUploading ? 'opacity-50' : ''}`}>
                    <span className="text-gray-700">
                      {isUploading ? 'Uploading...' : 'Choose files (JPG, PNG, PDF, DOC, XLS)'}
                    </span>
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#C08237]"></div>
                    ) : (
                      <Upload className="text-gray-600" size={18} />
                    )}
                  </div>
                </div>
                
                {/* Uploaded Files Display */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-800 font-medium truncate max-w-[150px]">
                            {file.originalName}
                          </span>
                          <span className="text-green-600">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full text-sm mona md:w-1/2 bg-[#B58544] text-white py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[#a3763a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Inquiry <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
            
            <p className="text-[11px] mona text-gray-500 text-center md:text-left">
              Our team typically responds within 24-48 business hours with next steps, catalogs, or quotations.
            </p>
          </form>
        </div>

      </div>
    </section>
  );
};

export default ContactForm;