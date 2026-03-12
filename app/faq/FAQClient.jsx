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

const FAQClient = () => {
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
    },
    {
      question: "Do you offer customization or private-label products?",
      answer: "Yes, Ratoomals offers customization and labeling of products to foreign customers. Customers have the option of ordering custom designs, sizes, or finishes of handicrafts that fit certain interior ideas in the home."
    },
    {
      question: "What materials are used in your products?",
      answer: "Ratoomals is made of quality wood, metal, marble, and classic materials. Professional craftsmen use these materials to create decorative products, such as intricate art of the elephant and handmade decorative elements."
    },
     {
      question: "How do you ensure quality for international markets?",
      answer: "Quality is ensured by means of the selection of materials, craftsmanship, and inspection. Ratoomals is a reputable handicraft exporter in Jaipur, and therefore, products are of global standards."
    },
     {
      question: "Can I visit your workshop or studio in Jaipur?",
      answer: "Yes, visitors are allowed by prior appointment. Customers and suppliers will be able to learn more about the artistry of our wooden elephant showcase models and traditional decorations."
    },
     {
      question: "How can I request a catalog or quotation?",
      answer: "You may order our catalog or quote by communicating with our team using the site, email, or business inquiry form to get more information about the products and wholesale prices."
    },
     {
      question: "Who should contact Ratoomals?",
      answer: "Ratoomals is open to contact with importers, wholesalers, interior designers, retailers, and gifting companies that are interested in handcrafted decor, elephant art, or authentic Jaipur crafts."
    },
     {
      question: "What does \"Heritage of Jaipur\" mean in your work?",
      answer: "Heritage of Jaipur is a manifestation of our commitment to the art of craftsmanship, royal symbolism, and cultural artistry in the form of handmade decor and unique wooden elephant showpiece designs."
    }
  ];

  return (
    <section className="w-full bg-[#fffcf7] py-10 mt-4 px-6 md:px-12 font-sans relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <h1 className="text-3xl md:text-4xl playfair font-bold text-center text-[#1a1a1a] mb-12">
          Frequently Asked Questions
        </h1>

        {/* FAQ List */}
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQClient;
