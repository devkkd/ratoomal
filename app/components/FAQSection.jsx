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
      question: "Are you a verified Indian handicraft exporter?",
      answer: "Yes, we are a certified and experienced Indian handicraft exporter globally.  We follow international quality standards and ensure secure worldwide shipping."
    },
    {
      question: "Do you manufacture your own products?",
      answer: "Yes, we are a trusted handicraft manufacturer in India, with in-house production facilities. Our skilled artisans maintain strict quality control at every stage."
    },
    {
      question: "Can you provide bulk home décor handcrafted order services?",
      answer: "Yes, we specialise in bulk home décor handcrafted order services.We ensure consistent quality and timely delivery for international orders."
    },
    {
      question: "Do you export wooden elephant showpiece collections worldwide?",
      answer: "Yes, we export wooden elephant showpiece collections worldwide. Each piece is carefully packed to ensure safe global delivery."
    },
    {
      question: "Do you provide customised product designs?",
      answer: "Yes, we provide customised designs for international B2B clients.Our team works closely with international B2B partners for exclusive collections."
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