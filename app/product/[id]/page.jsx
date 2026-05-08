import ProductDetailClient from "./ProductDetailClient";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function generateMetadata({ params }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id).lean();

    if (!product) {
      return {
        title: "Product - Ratoomal's",
        description: "Handcrafted wooden handicraft from Jaipur, India.",
      };
    }

    const title = `${product.name} - Ratoomal's | Handcrafted Wooden Handicraft`;
    const description =
      product.shortDescription ||
      product.description ||
      `Buy ${product.name} — handcrafted wooden handicraft from Jaipur, India. B2B bulk orders available.`;
    const image = product.thumbnail || "https://www.ratoomals.com/images/og-home.jpg";

    return {
      title,
      description,
      alternates: {
        canonical: `https://www.ratoomals.com/product/${id}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://www.ratoomals.com/product/${id}`,
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

export default function ProductPage() {
  return <ProductDetailClient />;
}
