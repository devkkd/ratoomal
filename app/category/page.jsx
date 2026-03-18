import { Suspense } from "react";
import CategoryClient from "./CategoryClient";

export const metadata = {
  title: "All Categories - Ratoomal's | Handcrafted Wooden Handicrafts from Jaipur",
  description: "Explore all categories of handcrafted wooden handicrafts by Ratoomals — animal figures, god statues, utility decor, and more. B2B manufacturer and exporter from Jaipur, India.",
  keywords: "handicraft categories, wooden handicrafts, animal figures, god statues, utility decor, Jaipur exporter, B2B handicrafts",
  alternates: {
    canonical: "https://www.ratoomals.com/category",
  },
  openGraph: {
    title: "All Categories - Ratoomal's Handcrafted Wooden Handicrafts",
    description: "Browse all product categories — animal sculptures, god figures, utility decor and more. Premium B2B handicraft manufacturer from Jaipur, India.",
    type: "website",
    url: "https://www.ratoomals.com/category",
    siteName: "Ratoomals",
    images: [
      {
        url: "https://www.ratoomals.com/images/og-category.jpg",
        width: 1200,
        height: 630,
        alt: "Ratoomals Handicraft Categories",
      },
    ],
  },
};

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading category…</div>}>
      <CategoryClient />
    </Suspense>
  );
}
