import connectDB from "@/lib/db";
import Product from "@/models/Product";

const BASE_URL = "https://www.ratoomals.com";

const staticRoutes = [
  { url: "/", changeFrequency: "daily", priority: 1.0 },
  { url: "/about", changeFrequency: "monthly", priority: 0.8 },
  { url: "/category", changeFrequency: "daily", priority: 0.9 },
  { url: "/animal", changeFrequency: "weekly", priority: 0.8 },
  { url: "/god-figure", changeFrequency: "weekly", priority: 0.8 },
  { url: "/utility-decor", changeFrequency: "weekly", priority: 0.8 },
  { url: "/exhibitions", changeFrequency: "weekly", priority: 0.7 },
  { url: "/contact-us", changeFrequency: "monthly", priority: 0.8 },
  { url: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { url: "/testimonials", changeFrequency: "weekly", priority: 0.6 },
];

export default async function sitemap() {
  const lastModified = new Date();

  // Static pages
  const staticEntries = staticRoutes.map(({ url, changeFrequency, priority }) => ({
    url: `${BASE_URL}${url}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  // Dynamic product pages
  let productEntries = [];
  try {
    await connectDB();
    const products = await Product.find({}, "_id updatedAt").lean();
    productEntries = products.map((product) => ({
      url: `${BASE_URL}/product/${product._id}`,
      lastModified: product.updatedAt || lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Sitemap: failed to fetch products", err);
  }

  return [...staticEntries, ...productEntries];
}
