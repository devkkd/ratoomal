import React from 'react';
import { Upload, ChevronDown } from 'lucide-react';

const ContactComponent = () => {
  return (
    <div className="bg-[#FFFBF2] py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Content */}
        <div className="space-y-6 lg:sticky lg:top-10">
          <h2 className="text-3xl font-serif text-[#2D2D2D] flex items-center gap-2">
            Custom <span className="italic font-serif">&</span> Bulk Solutions
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight">
            Tailored Craftsmanship <br /> for Your Business
          </h1>
          <p className="text-gray-600 text-lg max-w-lg leading-relaxed">
            Whether you need branded designs, exclusive finishes, or private collections 
            for showrooms and boutiques, our artisans can collaborate on bespoke 
            concepts suited for your market.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="space-y-8">
          <h2 className="text-3xl font-serif font-semibold text-[#2D2D2D]">
            Contact Our Design Team
          </h2>

          <form className="space-y-8">
            {/* Business Details Section */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A] mb-6">
                Business Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Company Name</label>
                  <input type="text" placeholder="Enter your registered business name" className="w-full p-3 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#C18E4D]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Contact Person Name</label>
                  <input type="text" placeholder="Enter your full name" className="w-full p-3 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#C18E4D]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Business Email</label>
                  <input type="email" placeholder="Enter your business email" className="w-full p-3 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#C18E4D]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Country</label>
                  <div className="relative">
                    <select className="w-full p-3 bg-white border border-gray-200 rounded text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#C18E4D] text-gray-400">
                      <option>Select your country</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Phone / WhatsApp</label>
                  <input type="text" placeholder="Enter your Phone / WhatsApp" className="w-full p-3 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#C18E4D]" />
                </div>
              </div>
            </div>

            {/* Order Details Section */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A] mb-6">
                Order & Requirement Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Type of Inquiry</label>
                  <div className="relative">
                    <select className="w-full p-3 bg-white border border-gray-200 rounded text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#C18E4D] text-gray-400">
                      <option>Select Type of Inquiry</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Product Category Interested In</label>
                  <div className="relative">
                    <select className="w-full p-3 bg-white border border-gray-200 rounded text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#C18E4D] text-gray-400">
                      <option>Select Product Category Interested In</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Estimated Order Quantity</label>
                  <div className="relative">
                    <select className="w-full p-3 bg-white border border-gray-200 rounded text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#C18E4D] text-gray-400">
                      <option>Select Estimated Order Quantity</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase">Customization Required</label>
                  <div className="relative">
                    <select className="w-full p-3 bg-white border border-gray-200 rounded text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#C18E4D] text-gray-400">
                      <option>Select Customization Required</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 uppercase">Message</label>
                <textarea 
                  rows="4" 
                  placeholder="Share design references, market preferences, timelines, or any special requirements"
                  className="w-full p-3 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#C18E4D] resize-none"
                ></textarea>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 uppercase">Upload Reference Files</label>
                <div className="relative">
                  <div className="w-full p-3 bg-white border border-gray-200 rounded text-sm text-gray-400 flex justify-between items-center cursor-pointer">
                    <span>Upload</span>
                    <Upload className="h-4 w-4" />
                  </div>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              
              <button className="w-full bg-[#C18E4D] hover:bg-[#A67B42] text-white font-medium py-3.5 rounded transition duration-300 flex items-center justify-center gap-2">
                Submit Inquiry <span>→</span>
              </button>
            </div>

            <p className="text-[11px] text-gray-500 leading-tight">
              Our team typically responds within 24–48 business hours with next steps, catalogs, or quotations.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactComponent;