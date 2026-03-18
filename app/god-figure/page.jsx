import React from 'react';
import GodFigureClient from './GodFigureClient';

export const metadata = {
  title: 'God Figures - Ratoomal\'s | Handcrafted Wooden Religious Statues & handicraft export business in india',
  description: 'Explore our collection of handcrafted wooden god figures and religious statues. B2B manufacturer of Hindu deity sculptures, Buddha statues, and spiritual decor carved from wood for home interior from Jaipur, India.',
  keywords: 'god figures,ganesh handicraft, religious statues, handicraft export business in india, handicraft export from india to usa, jaipur handicrafts jaipur, wooden deity statues, Hindu god sculptures, Buddha statues, spiritual decor, carved from wood, home interior, Jaipur exporter, B2B religious handicrafts',
  alternates: {
    canonical: 'https://www.ratoomals.com/god-figure',
  },
  openGraph: {
    title: 'Handcrafted God Figures & Religious Statues - Ratoomal\'s',
    description: 'Premium wooden god figures and religious statues for bulk orders. Custom designs available for temples, retailers, and spiritual centers.',
    type: 'website',
    url: 'https://www.ratoomals.com/god-figure',
    siteName: 'Ratoomals',
    images: [
      {
        url: 'https://www.ratoomals.com/images/og-god-figure.jpg',
        width: 1200,
        height: 630,
        alt: 'Handcrafted Wooden God Figures & Religious Statues by Ratoomals',
      },
    ],
  },
};

const godFigureSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "God Figures Collection",
  "description": "B2B manufacturer and exporter of handcrafted wooden god figures, religious statues, and spiritual decorative products for home interior ganesh handicraft",
  "url": "https://www.ratoomals.com/god-figure",
  "provider": {
    "@type": "Organization",
    "name": "Ratoomals",
    "url": "https://www.ratoomals.com"
  },
  "about": {
    "@type": "Product",
    "category": "Religious Handicrafts",
    "material": "Wood"
  }
};

export default function GodFigurePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(godFigureSchema) }}
      />
      <GodFigureClient />
    </>
  );
}
