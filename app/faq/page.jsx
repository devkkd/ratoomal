import React from 'react';
import FAQClient from './FAQClient';

export const metadata = {
  title: 'FAQ - Ratoomal\'s | Wooden Handicraft & Elephant Showpiece Questions',
  description: 'Find answers to common questions about Ratoomal\'s handcrafted wooden products carved from wood, bulk orders, customization, international shipping, and our heritage craftsmanship from Jaipur.',
  keywords: 'Ratoomal FAQ, wooden handicraft questions,carved from wood,home interior, bulk order queries, custom wooden products, Jaipur handicrafts, elephant showpiece information, wooden home design',
  alternates: {
    canonical: 'https://www.ratoomals.com/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions - Ratoomal\'s',
    description: 'Get answers about our handcrafted products, B2B services, customization options, and export capabilities.',
    type: 'website',
    url: 'https://www.ratoomals.com/faq',
    siteName: 'Ratoomals',
    images: [
      {
        url: 'https://www.ratoomals.com/images/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Ratoomals FAQ - Handcrafted Wooden Handicrafts',
      },
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What kind of company is Ratoomals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ratoomals is a Jaipur-based B2B handicraft manufacturer and exporter specializing in handcrafted statues, sculptures, and decorative products."
      }
    },
    {
      "@type": "Question",
      "name": "What makes Ratoomals products unique?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Every Ratoomals product is handcrafted by skilled artisans in Rajasthan, combining traditional craftsmanship with modern global design."
      }
    },
    {
      "@type": "Question",
      "name": "Are Ratoomals products suitable for home interior design?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Ratoomals offers a wide range of handcrafted wooden products perfect for home interior decoration, including sculptures, figurines, and decorative pieces that add elegance and cultural charm to any space."
      }
    }
  ]
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQClient />
    </>
  );
}
