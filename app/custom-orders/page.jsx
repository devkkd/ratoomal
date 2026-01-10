"use client";
import React from 'react';
import { Upload, ChevronDown } from 'lucide-react';
import FAQSection from '../components/FAQSection';

const CustomOrderForm = () => {
  return (
    <div className="bg-[#FFFBF2] min-h-screen py-16 px-4 font-sans">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#2D2D2D] mb-4">
          Custom Orders
        </h2>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-6">
          Tailored Craftsmanship for Your Business
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Whether you need branded designs, exclusive finishes, or private collections for showrooms and boutiques, 
          our artisans can collaborate on bespoke concepts suited for your market.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto bg-[#FEF7E7] rounded-3xl p-8 md:p-12 shadow-sm border border-[#F3EAD3]">
        <h3 className="text-2xl font-serif font-semibold text-center text-[#2D2D2D] mb-10">
          Custom Orders
        </h3>

        <form className="space-y-8">
          {/* Section 1: Business Details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] mb-6 border-b border-gray-200 pb-2">
              Business Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Company Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your registered business name" 
                  className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C18E4D]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Contact Person Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C18E4D]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Business Email</label>
                <input 
                  type="email" 
                  placeholder="Enter your business email" 
                  className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C18E4D]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Country</label>
                <div className="relative">
                  <select className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#C18E4D]">
                    <option>Select your country</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-1">
                <label className="text-xs font-medium text-gray-700">Phone / WhatsApp</label>
                <input 
                  type="text" 
                  placeholder="Enter your Phone / WhatsApp" 
                  className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C18E4D]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Order & Requirement Details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] mb-6 border-b border-gray-200 pb-2">
              Order & Requirement Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Type of Inquiry</label>
                <div className="relative">
                  <select className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#C18E4D]">
                    <option>Select Type of Inquiry</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Product Category Interested In</label>
                <div className="relative">
                  <select className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#C18E4D]">
                    <option>Select Product Category Interested In</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Estimated Order Quantity</label>
                <div className="relative">
                  <select className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#C18E4D]">
                    <option>Select Estimated Order Quantity</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Customization Required</label>
                <div className="relative">
                  <select className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#C18E4D]">
                    <option>Select Customization Required</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="text-xs font-medium text-gray-700">Message</label>
              <textarea 
                rows="4"
                placeholder="Share design references, market preferences, timelines, or any special requirements"
                className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C18E4D] resize-none"
              ></textarea>
            </div>
          </div>

          {/* Section 3: Upload and Submit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Upload Reference Files</label>
              <div className="relative">
                <button type="button" className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm text-gray-400 flex justify-between items-center">
                  <span>Upload</span>
                  <Upload className="h-4 w-4" />
                </button>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-[#C18E4D] hover:bg-[#A67B42] text-white font-medium py-3 rounded-md transition duration-300 flex items-center justify-center gap-2"
            >
              Submit Inquiry <span className="text-lg">→</span>
            </button>
          </div>

          <p className="text-center text-[10px] text-gray-500 mt-4">
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