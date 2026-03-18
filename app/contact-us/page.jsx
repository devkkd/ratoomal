import React from 'react';
import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us - Ratoomal\'s | B2B Wooden Handicraft Manufacturer & handicraft export business in india',
  description: 'Get in touch with Ratoomal\'s for bulk orders, custom designs, and wholesale partnerships. Handcrafted wooden products carved from wood for home interior from Jaipur, India.',
  keywords: 'contact Ratoomals,handicraft export business in india,handicraft export from india to usa,jaipur handicrafts jaipur, B2B handicraft inquiry, bulk order wooden products, custom handicraft manufacturer, wholesale wooden decor, carved from wood, home interior, Jaipur exporter',
  alternates: {
    canonical: 'https://www.ratoomals.com/contact-us',
  },
  openGraph: {
    title: 'Contact Ratoomal\'s - Custom & Bulk Handicraft Solutions',
    description: 'Connect with our design team for tailored craftsmanship, bulk orders, and custom wooden handicraft solutions.',
    type: 'website',
    url: 'https://www.ratoomals.com/contact-us',
    siteName: 'Ratoomals',
    images: [
      {
        url: 'https://www.ratoomals.com/images/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Ratoomals - B2B Handicraft Manufacturer from Jaipur',
      },
    ],
  },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "mainEntity": {
    "@type": "Organization",
    "name": "Ratoomals",
    "description": "B2B handicraft manufacturer and exporter specializing in handcrafted wooden statues, sculptures, and decorative products for home interior",
    "url": "https://www.ratoomals.com",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "areaServed": "Worldwide",
      "availableLanguage": ["English", "Hindi"]
    }
  }
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactClient />
    </>
  );
}
