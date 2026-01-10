import React from 'react';
import { ChevronDown, Upload, ArrowRight } from 'lucide-react';

const ContactForm = () => {
  return (
    <section className="bg-[#FDF6EB] min-h-screen py-16 font-sans text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 px-6  ">
        
        {/* Left Column: Content */}
        <div className="space-y-6">
          <h3 className="text-2xl md:text-3xl playfair font-bold text-gray-800">
            Custom & Bulk Solutions
          </h3>
          <h2 className="text-4xl md:text-4xl font-bold mona">
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
          <h2 className="text-3xl md:text-3xl playfair font-bold mb-8">
            Contact Our Design Team
          </h2>

          <form className="space-y-8">
            {/* Business Details Section */}
            <div>
              <h4 className="font-bold mona text-md mb-4">Business Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs mona font-semibold text-gray-500 ">Company Name</label>
                  <input type="text" placeholder="Enter your registered business name" className="w-full p-3 rounded-md border border-gray-200 focus:outline-none text-sm bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs mona font-semibold text-gray-500 ">Contact Person Name</label>
                  <input type="text" placeholder="Enter your full name" className="w-full p-3 rounded-md border border-gray-200 focus:outline-none text-sm bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs mona font-semibold text-gray-500 ">Business Email</label>
                  <input type="email" placeholder="Enter your business email" className="w-full p-3 rounded-md border border-gray-200 focus:outline-none text-sm bg-white" />
                </div>
                <div className="space-y-1 relative">
                  <label className="text-xs mona font-semibold text-gray-500 ">Country</label>
                  <select className="w-full p-3 rounded-md border border-gray-200 appearance-none focus:outline-none text-sm bg-white pr-10">
                    <option>Select your country</option>
                  </select>
                  <ChevronDown className="absolute right-3 bottom-3 text-gray-400" size={18} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs mona font-semibold text-gray-500 ">Phone / WhatsApp</label>
                  <input type="text" placeholder="Enter your Phone / WhatsApp" className="w-full p-3 rounded-md border border-gray-200 focus:outline-none text-sm bg-white" />
                </div>
              </div>
            </div>

            {/* Order & Requirement Details Section */}
            <div>
              <h4 className="font-bold mona text-md mb-4">Order & Requirement Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 relative">
                  <label className="text-xs mona font-semibold text-gray-500 ">Type of Inquiry</label>
                  <select className="w-full p-3 rounded-md border border-gray-200 appearance-none focus:outline-none text-sm bg-white pr-10">
                    <option className='mona'>Select Type of Inquiry</option>
                  </select>
                  <ChevronDown className="absolute right-3 bottom-3 text-gray-400" size={18} />
                </div>
                <div className="space-y-1 relative">
                  <label className="text-xs mona font-semibold text-gray-500 ">Product Category Interested In</label>
                  <select className="w-full p-3 rounded-md border border-gray-200 appearance-none focus:outline-none text-sm bg-white pr-10">
                    <option className='mona'>Select Product Category Interested In</option>
                  </select>
                  <ChevronDown className="absolute right-3 bottom-3 text-gray-400" size={18} />
                </div>
                <div className="space-y-1 relative">
                  <label className="text-xs mona font-semibold text-gray-500 ">Estimated Order Quantity</label>
                  <select className="w-full p-3 rounded-md border border-gray-200 appearance-none focus:outline-none text-sm bg-white pr-10">
                    <option className='mona'>Select Estimated Order Quantity</option>
                  </select>
                  <ChevronDown className="absolute right-3 bottom-3 text-gray-400" size={18} />
                </div>
                <div className="space-y-1 relative">
                  <label className="text-xs mona font-semibold text-gray-500 ">Customization Required</label>
                  <select className="w-full p-3 rounded-md border border-gray-200 appearance-none focus:outline-none text-sm bg-white pr-10">
                    <option className='mona'>Select Customization Required</option>
                  </select>
                  <ChevronDown className="absolute right-3 bottom-3 text-gray-400" size={18} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs mona font-semibold text-gray-500 ">Message</label>
                  <textarea rows="4" placeholder="Share design references, market preferences, timelines, or any special requirements" className="w-full p-3 rounded-md border border-gray-200 focus:outline-none text-sm bg-white resize-none"></textarea>
                </div>
              </div>
            </div>

            {/* Upload and Submit Section */}
            <div className="flex flex-col md:flex-row items-end gap-4">
              <div className="w-full md:w-1/2 space-y-1">
                <label className="text-xs font-semibold text-gray-500 mona">Upload Reference Files</label>
                <div className="relative cursor-pointer">
                  <input type="text" readOnly placeholder="Upload" className="w-full p-3 rounded-md border border-gray-200 focus:outline-none text-sm bg-white cursor-pointer" />
                  <Upload className="absolute right-3 bottom-3 text-gray-600" size={18} />
                </div>
              </div>
              <button className="w-full text-sm mona md:w-1/2 bg-[#B58544] text-white py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[#a3763a] transition-colors">
                Submit Inquiry <ArrowRight size={16} />
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