"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Optional: using lucide-react for the arrow icon
import Link from 'next/link';

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
      answer: "Ratoomals is a heritage handicraft exporter in Jaipur, Specializing in handcrafted décor and artistic creations that celebrate the timeless heritage and craftsmanship of Rajasthan, which are aimed at international customers and high-end home interior collections."
    },
    {
      question: "What makes Ratoomals' products unique?",
      answer: "Ratoomal’s products are a blend of traditional craftsmanship, heritage designs, and artistry. All the pieces are genuine elephant art and cultural inspiration, which makes them unique to the collector and beautiful in interior spaces."
    },
    {
      question: "Why are elephants a signature product at Ratoomals?",
      answer: "In Rajasthan, the elephants are associated with power, wealth, and royalty. Ratoomals honors this tradition by producing exquisitely made elephant art and wooden elephant showpiece collections that are appreciated all over the world."
    },
    {
      question: "Do you sell only in India or internationally as well?",
      answer: "Ratoomals has domestic and foreign markets. The company is a leading exporter of handicrafts in Jaipur and provides home decor, gifting, and home interior products to international customers."
    },
    {
      question: "Can I place bulk or wholesale orders?",
      answer: "Yes, Ratoomals accepts bulk and wholesale orders by retailers, importers, and interior brands in need of high-quality handmade decor, such as wooden elephant showpiece collections and heritage-inspired crafts."
    }
  ];

  return (
    <section className="bg-[#FCF8F1]  py-16 px-7 sm:px-16 ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        
        {/* Left Sidebar Title */}
        <div className="md:w-1/3">
          <h2 className="text-3xl md:text-4xl mona font-bold text-gray-900 leading-[1.1]">
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
          <Link href="/faq">
          <div className="mt-12">
            <button className="bg-[#121212] text-white px-8 py-3 rounded-full text-sm font-semibold flex items-center hover:bg-gray-800 transition-colors">
              See All FAQ's <span className="ml-2">→</span>
            </button>
          </div>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;