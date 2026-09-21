import { notFound, redirect } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

// Force dynamic rendering — product data changes frequently, never cache statically
export const dynamic = "force-dynamic";

// Helper: find product by slug first, then fallback to ObjectId
async function getProduct(id) {
  await connectDB();

  // Try slug first (SEO-friendly URL)
  let product = await Product.findOne({ slug: id }).lean();

  // Fallback to MongoDB ObjectId if slug not found and id looks like ObjectId
  if (!product && /^[0-9a-fA-F]{24}$/.test(id)) {
    product = await Product.findById(id).lean();
  }

  return product;
}

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
      return {
        title: "Product Not Found - Ratoomal's",
        description: "Handcrafted wooden handicraft from Jaipur, India.",
        robots: { index: false },
      };
    }

    // Always use slug for canonical if available — prevents duplicate canonical
    // between /product/some-slug and /product/68abc...objectid
    const canonicalId = product.slug || product._id.toString();

    const title = `${product.name} - Ratoomal's | Handcrafted Wooden Handicraft`;
    const description =
      product.shortDescription ||
      product.description ||
      `Buy ${product.name} — handcrafted wooden handicraft from Jaipur, India. B2B bulk orders available.`;
    const image =
      product.thumbnail || "https://www.ratoomals.com/images/og-home.jpg";

    return {
      title,
      description,
      alternates: {
        canonical: `https://www.ratoomals.com/product/${canonicalId}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://www.ratoomals.com/product/${canonicalId}`,
        siteName: "Ratoomals",
        images: [{ url: image, width: 1200, height: 630, alt: product.name }],
      },
    };
  } catch {
    return {
      title: "Product - Ratoomal's",
      description: "Handcrafted wooden handicraft from Jaipur, India.",
    };
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  try {
    const product = await getProduct(id);

    // Genuine 404 — prevents soft 404 that Google flags
    if (!product) {
      notFound();
    }

    // If visited via ObjectId URL but slug exists, 301 redirect to slug URL.
    // This consolidates duplicate URLs into one canonical — fixes GSC
    // "Duplicate without user-selected canonical" warnings.
    if (product.slug && id !== product.slug) {
      redirect(`/product/${product.slug}`);
    }
  } catch {
    // DB errors — don't 404, let the client component handle gracefully
  }

  return <ProductDetailClient />;
}
