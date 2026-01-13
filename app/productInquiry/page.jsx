// "use client";
// import React from 'react';
// import { ChevronDown, Upload } from 'lucide-react';

// const ProductInquiry = () => {
//   return (
//     <div className="w-full bg-[#FFF6EB] py-8 px-6 md:px-12 font-sans text-[#333]">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Main Heading - Playfair Display or similar serif font recommended */}
//         <h3 className="playfair text-2xl font-bold text-center mb-12 text-[#1a1a1a]">
//           Product Inquiry
//         </h3>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
          
//           {/* Left Side: Business Details */}
//           <div className="space-y-3">
//             <h3 className="text-md mona font-bold text-[#1a1a1a] mb-4">Business Details</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label className="text-[12px] mona font-medium">Company Name</label>
//                 <input 
//                   type="text" 
//                   placeholder="Enter your registered business name" 
//                   className="w-full p-2 bg-white border border-gray-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-[#bf8e44]"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[12px] mona font-medium">Contact Person Name</label>
//                 <input 
//                   type="text" 
//                   placeholder="Enter your full name" 
//                   className="w-full p-2 bg-white border border-gray-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-[#bf8e44]"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label className="text-[12px] mona font-medium">Business Email</label>
//                 <input 
//                   type="email" 
//                   placeholder="Enter your business email" 
//                   className="w-full p-2 bg-white border border-gray-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-[#bf8e44]"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[12px] mona font-medium">Country</label>
//                 <div className="relative">
//                   <select className="w-full p-2 bg-white border border-gray-200 rounded-lg text-[10px] appearance-none focus:outline-none text-gray-400">
//                     <option>Select your country</option>
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2 w-full md:w-1/2 pr-2">
//               <label className="text-[12px] mona font-medium">Phone / WhatsApp</label>
//               <input 
//                 type="text" 
//                 placeholder="Enter your Phone / WhatsApp" 
//                 className="w-full p-2 bg-white border border-gray-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-[#bf8e44]"
//               />
//             </div>

//             <p className="text-[13px] text-gray-600 mt-4 leading-relaxed">
//               Our team typically responds within 24–48 business hours with next steps, catalogs, or quotations.
//             </p>
//           </div>

//           {/* Right Side: Order & Requirement Details */}
//           <div className="space-y-3">
//             <h3 className="text-md mona font-bold text-[#1a1a1a] mb-4">Order & Requirement Details</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label className="text-[12px] mona font-medium">Type of Inquiry</label>
//                 <div className="relative">
//                   <select className="w-full p-2 bg-white border border-gray-200 rounded-lg text-[10px] appearance-none focus:outline-none text-gray-400">
//                     <option>Select Type of Inquiry</option>
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[12px] mona font-medium">Estimated Order Quantity</label>
//                 <div className="relative">
//                   <select className="w-full p-2 bg-white border border-gray-200 rounded-lg text-[10px] appearance-none focus:outline-none text-gray-400">
//                     <option>Select Estimated Order Quantity</option>
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label className="text-[12px] mona font-medium">Customization Required</label>
//                 <div className="relative">
//                   <select className="w-full p-2 bg-white border border-gray-200 rounded-lg text-[10px] appearance-none focus:outline-none text-gray-400">
//                     <option>Select Customization Required</option>
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[12px] mona font-medium">Upload Reference Files</label>
//                 <div className="w-full p-2 bg-white border border-gray-200 rounded-lg text-[10px] flex justify-between items-center text-gray-400 cursor-pointer">
//                   <span>Upload</span>
//                   <Upload size={18} />
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-[12px] mona font-medium">Message</label>
//               <textarea 
//                 rows={3}
//                 placeholder="Share design references, market preferences, timelines, or any special requirements" 
//                 className="w-full p-2 bg-white border border-gray-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-[#bf8e44] resize-none"
//               ></textarea>
//             </div>
//           </div>
//         </div>

//         {/* Horizontal Divider */}
//         <div className="w-full h-[1px] bg-gray-200 my-10"></div>

//         {/* Submit Button */}
//         <div className="flex justify-center">
//           <button className="px-10 py-2 bg-[#bf8e44] text-white font-semibold rounded-full hover:bg-[#a67a38] transition shadow-sm flex items-center gap-2">
//             Submit Inquiry →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductInquiry;

"use client";
import React, { useState } from "react";
import { ChevronDown, Upload } from "lucide-react";
import { useSearchParams } from "next/navigation";

const ProductInquiry = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const [loading, setLoading] = useState(false);

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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!productId) {
      alert("Product not found");
      return;
    }

    setLoading(true);

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
      alert("Inquiry submitted successfully");
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
      });
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <div className="w-full bg-[#FFF6EB] py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-12">
          Product Inquiry
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT */}
          <div className="space-y-3">
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full p-2 border rounded"
            />
            <input
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Contact Name"
              className="w-full p-2 border rounded"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="w-full p-2 border rounded"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone / WhatsApp"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-3">
            <input
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              placeholder="Inquiry Type"
              className="w-full p-2 border rounded"
            />
            <input
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Estimated Quantity"
              className="w-full p-2 border rounded"
            />
            <input
              name="customization"
              value={formData.customization}
              onChange={handleChange}
              placeholder="Customization Required"
              className="w-full p-2 border rounded"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-2 bg-[#bf8e44] text-white rounded-full"
          >
            {loading ? "Submitting..." : "Submit Inquiry →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInquiry;
