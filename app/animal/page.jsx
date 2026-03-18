import React from 'react';
import AnimalClient from './AnimalClient';

export const metadata = {
  title: 'Animal Figures - Ratoomal\'s | wooden elephant showpiece & handicraft export business in india ',
  description: 'Browse our collection of handcrafted wooden animal figures and sculptures. B2B manufacturer of elephant statues, wildlife decor, and animal-themed handicrafts carved from wood for home interior from Jaipur, India hand painted.',
  keywords: 'animal figures,elephant art, handicraft export business in india, handicraft export from india to usa, jaipur handicrafts jaipur, wooden animal sculptures, elephant statues, wildlife decor, carved from wood, home interior, animal handicrafts, Jaipur exporter, B2B animal decor',
  alternates: {
    canonical: 'https://www.ratoomals.com/animal',
  },
  openGraph: {
    title: 'Handcrafted Animal Figures & Sculptures - Ratoomal\'s',
    description: 'Premium wooden animal figures and sculptures for bulk orders. Custom designs available for retailers, zoos, and wildlife centers.',
    type: 'website',
    url: 'https://www.ratoomals.com/animal',
    siteName: 'Ratoomals',
    images: [
      {
        url: 'https://www.ratoomals.com/images/og-animal.jpg',
        width: 1200,
        height: 630,
        alt: 'Handcrafted Wooden Animal Figures & Sculptures by Ratoomals',
      },
    ],
  },
};

const animalSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Animal Figures Collection",
  "description": "B2B manufacturer and exporter of handcrafted wooden animal figures, elephant statues, and wildlife decorative products for home interior elephant art",
  "url": "https://www.ratoomals.com/animal",
  "provider": {
    "@type": "Organization",
    "name": "Ratoomals",
    "url": "https://www.ratoomals.com"
  },
  "about": {
    "@type": "Product",
    "category": "Animal Handicrafts",
    "material": "Wood"
  }
};

export default function AnimalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(animalSchema) }}
      />
      <AnimalClient />
    </>
  );
}
