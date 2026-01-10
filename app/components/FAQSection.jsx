"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Optional: using lucide-react for the arrow icon

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(true); // Defaulting to open to match image layout

  return (
    <div className="border-b border-gray-300 py-6">
      <button
        className="flex w-full items-start justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl mona font-bold text-gray-900 leading-tight pr-4">
          {question}
        </span>
        <div className={`mt-1 p-1 bg-gray-200 rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} className="text-gray-600" />
        </div>
      </button>
      
      {isOpen && (
        <div className="mt-4">
          <p className="text-gray-600 mona leading-relaxed text-[15px] max-w-3xl">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "What kind of company is Ratoomals?",
      answer: "Ratoomals is a Jaipur-based B2B handicrafts manufacturer and exporter, specializing in handcrafted statues, sculptures, and decorative products. We primarily work with international wholesalers, retailers, interior studios, and importers across global markets."
    },
    {
      question: "What makes Ratoomals' products unique?",
      answer: "Every Ratoomals product is handcrafted by skilled artisans in Rajasthan, inspired by royal heritage, traditional symbolism, and refined craftsmanship. Our designs balance authentic Indian artistry with contemporary global appeal, making them suitable for premium retail and décor markets worldwide."
    },
    {
      question: "Why are elephants a signature product at Ratoomals?",
      answer: "In Indian and Rajasthani culture, the elephant represents wisdom, strength, prosperity, and royalty. Jaipur's royal processions and palace art prominently feature elephants, and Ratoomals carries this legacy forward through thoughtfully designed elephant sculptures crafted for global audiences."
    },
    {
      question: "Do you sell only in India or internationally as well?",
      answer: "Ratoomals is an export-focused B2B company. A significant portion of our products are shipped outside India to international buyers, distributors, and décor brands. We are experienced in global trade processes and export compliance."
    },
    {
      question: "Can I place bulk or wholesale orders?",
      answer: "Yes. We specialize in bulk, wholesale, and recurring B2B orders. Whether you are a retailer, distributor, or corporate buyer, our production capabilities are designed to scale while maintaining consistent quality."
    }
  ];

  return (
    <section className="bg-[#fdfbf7] min-h-screen py-16 px-16 ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        
        {/* Left Sidebar Title */}
        <div className="md:w-1/3">
          <h2 className="text-4xl md:text-4xl mona font-bold text-gray-900 leading-[1.1]">
            Frequently<br />Asked Questions
          </h2>
        </div>

        {/* Accordion Column */}
        <div className="md:w-2/3">
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-12">
            <button className="bg-[#121212] text-white px-8 py-3 rounded-full text-sm font-semibold flex items-center hover:bg-gray-800 transition-colors">
              See All FAQ's <span className="ml-2">→</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;