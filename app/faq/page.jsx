"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group focus:outline-none"
      >
        <h3 className="text-[15px] md:text-[20px] mona font-bold text-[#1a1a1a] pr-8 group-hover:text-[#C08237] transition-colors">
          {question}
        </h3>
        <div className={`p-1.5 rounded-full bg-[#D7CEC2] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={24} className="text-[#666]" />
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] mt-4' : 'max-h-0'}`}>
        <p className="text-[18px]  mona  text-[#0E0E0E] font-normal">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "What kind of company is Ratoomals?",
      answer: "Ratoomals is a Jaipur-based B2B handicraft manufacturer and exporter, specializing in handcrafted statues, sculptures, and decorative products. We primarily work with international wholesalers, retailers, interior studios, and importers across global markets."
    },
    {
      question: "What makes Ratoomals' products unique?",
      answer: "Every Ratoomals product is handcrafted by skilled artisans in Rajasthan, inspired by royal heritage, traditional symbolism, and refined craftsmanship. Our designs balance authentic Indian artistry with contemporary global appeal."
    },
    {
      question: "Why are elephants a signature product at Ratoomals?",
      answer: "In Indian and Rajasthani culture, the elephant represents wisdom, strength, prosperity, and loyalty. Ratoomals carries this legacy forward through thoughtfully designed elephant sculptures crafted for global audiences."
    },
    {
      question: "Do you sell only in India or internationally as well?",
      answer: "Ratoomals is an export-focused B2B company. A significant portion of our products are shipped outside India to international buyers, distributors, and decor brands. We are experienced in global trade processes."
    },
    {
      question: "Can I place bulk or wholesale orders?",
      answer: "Yes, we specialize in bulk, wholesale, and recurring B2B orders. Whether you are a retailer, distributor, or corporate buyer, our production capabilities are designed to scale while maintaining consistent quality."
    },
    {
      question: "Do you offer customization or private-label products?",
      answer: "Absolutely. We support custom designs, finishes, sizes, and packaging based on order volume and feasibility. Our team works closely with buyers to align products with their brand identity."
    },
    //
    {
      question: "What materials are used in your products?",
      answer: "Our collections include products crafted from wood, metal, resin, and mixed materials, depending on the design and use case. All materials are carefully selected to ensure durability, aesthetic value, and export-grade quality."
    },
     {
      question: "How do you ensure quality for international markets?",
      answer: "Each product goes through multiple quality checks, from raw material selection to final finishing and packaging. Our processes are aligned with international export standards, ensuring consistency, safety, and long-term durability."
    },
     {
      question: "Can I visit your workshop or studio in Jaipur?",
      answer: "Yes, visits can be arranged by prior appointment. Buyers visiting Jaipur are welcome to experience our craftsmanship, product range, and heritage roots firsthand."
    },
     {
      question: "How can I request a catalog or quotation?",
      answer: "You can request our latest B2B catalog or a custom quotation by contacting us through the website, email, or phone. Our team typically responds within one business day."
    },
     {
      question: "Who should contact Ratoomals?",
      answer: "Ratoomals is ideal for: International home décor retailers, Importers & distributors, Interior designers & hospitality buyers, Corporate gifting companies, Boutique & lifestyle brands."
    },
     {
      question: "What does “Heritage of Jaipur” mean in your work?",
      answer: "It means honoring Rajasthan’s royal craftsmanship, palace-inspired detailing, and symbolic storytelling — while adapting designs for modern global interiors. Our heritage is not just visual; it’s embedded in how each piece is crafted."
    }
  ];

  return (
    <section className="w-full bg-[#fffcf7] py-10 mt-4 px-6 md:px-12 font-sans relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl playfair font-bold text-center text-[#1a1a1a] mb-12">
          Frequently Asked Questions
        </h2>

        {/* FAQ List */}
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Floating WhatsApp/Enquiry Button like in Image */}
    
      </div>
    </section>
  );
};

export default FAQSection;