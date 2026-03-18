import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.ratoomals.com"}/api/products/${params.id}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    const product = data?.data;

    if (!product) {
      return {
        title: "Product Not Found - Ratoomal's",
        description: "The requested product could not be found.",
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
        canonical: `https://www.ratoomals.com/product/${params.id}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://www.ratoomals.com/product/${params.id}`,
        siteName: "Ratoomals",
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
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
