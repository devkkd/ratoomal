import React from 'react';
import UtilityDecorClient from './UtilityDecorClient';

export const metadata = {
  title: 'Utility & Decor - Ratoomal\'s | Wooden Handicraft Home Decor & brass buddha incense burner',
  description: 'Discover functional and decorative wooden handicrafts for home and office. B2B manufacturer of utility items and decorative pieces carved from wood for home interior from Jaipur, India.',
  keywords: 'utility decor,santa incense burner,antique brass chinese incense burners, handicraft export business in india, handicraft export from india to usa, jaipur handicrafts jaipur, wooden home decor, decorative handicrafts, functional decor, carved from wood, home interior, office decor, Jaipur exporter, B2B wooden decor',
  alternates: {
    canonical: 'https://www.ratoomals.com/utility-decor',
  },
  openGraph: {
    title: 'Utility & Decorative Wooden Handicrafts - Ratoomal\'s',
    description: 'Premium wooden utility and decorative items for bulk orders. Custom designs available for retailers, hotels, and corporate clients.',
    type: 'website',
    url: 'https://www.ratoomals.com/utility-decor',
    siteName: 'Ratoomals',
    images: [
      {
        url: 'https://www.ratoomals.com/images/og-utility-decor.jpg',
        width: 1200,
        height: 630,
        alt: 'Handcrafted Wooden Utility & Decorative Items by Ratoomals',
      },
    ],
  },
};

const utilityDecorSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Utility & Decor Collection",
  "description": "B2B manufacturer and exporter of handcrafted wooden utility items and decorative products for home interior and office spaces santa incense burner",
  "url": "https://www.ratoomals.com/utility-decor",
  "provider": {
    "@type": "Organization",
    "name": "Ratoomals",
    "url": "https://www.ratoomals.com"
  },
  "about": {
    "@type": "Product",
    "category": "Home Decor & Utility",
    "material": "Wood"
  }
};

export default function UtilityDecorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(utilityDecorSchema) }}
      />
      <UtilityDecorClient />
    </>
  );
}
