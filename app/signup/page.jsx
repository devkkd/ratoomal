"use client";
import React, { useState } from "react";
import { Camera } from "lucide-react";

const VerifyBusiness = () => {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    businessType: "",
    purpose: "",
    verificationProof: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.message);
      if (res.ok) {
        setForm({
          companyName: "",
          contactName: "",
          email: "",
          password: "",
          phone: "",
          country: "",
          businessType: "",
          purpose: "",
          verificationProof: "",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

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

            <div className="space-y-1.5">
              <label className="text-[13px] mona font-medium text-gray-500">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Enter your registered business name"
                className="w-full px-4 py-3 rounded-lg mona border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-300 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] mona font-medium text-gray-500">Contact Person Name</label>
              <input
                type="text"
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg mona border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-300 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] mona font-medium text-gray-500">Business Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your business email"
                className="w-full px-4 py-3 rounded-lg mona border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-300 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] mona font-medium text-gray-500">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg mona border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-300 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] mona font-medium text-gray-500">Phone / WhatsApp</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your Phone / WhatsApp"
                className="w-full px-4 py-3 mona rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-300 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] mona font-medium text-gray-500">Country</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg mona border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-400 text-sm appearance-none cursor-pointer"
              >
                <option className="mona">Select your country</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] mona font-medium text-gray-500">Business Type</label>
              <select
                name="businessType"
                value={form.businessType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg mona border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-400 text-sm appearance-none cursor-pointer"
              >
                <option className="mona">Select your business type</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] mona font-medium text-gray-500">Purpose of Viewing This Product</label>
              <select
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                className="w-full px-4 py-3 mona rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-400 text-sm appearance-none cursor-pointer"
              >
                <option className="mona">Select your purpose of viewing this product</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] mona font-medium text-gray-500">Business Verification Proof</label>
              <select
                name="verificationProof"
                value={form.verificationProof}
                onChange={handleChange}
                className="w-full px-4 py-3 mona rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-400 text-sm appearance-none cursor-pointer"
              >
                <option className="mona">Select your business verification proof</option>
              </select>
            </div>
          </div>

          {/* Full Width Upload */}
          <div className="space-y-1.5 pt-2">
            <label className="text-[13px] mona font-medium text-gray-500">
              Upload Image Business Verification Proof
            </label>
            <div className="w-full border border-gray-200 bg-white rounded-lg flex items-center px-4 py-3 cursor-pointer">
              <Camera className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-300 mona">
                Upload Image Business Verification Proof
              </span>
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="bg-[#C18C46] mona text-white px-12 py-3.5 rounded-full font-medium flex items-center gap-2 hover:bg-[#a6773a] transition-all shadow-sm"
            >
              Submit & Request Access <span>→</span>
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
