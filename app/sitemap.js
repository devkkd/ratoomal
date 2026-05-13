import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Blog from "@/models/Blog";

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
  { url: "/blog", changeFrequency: "daily", priority: 0.8 },
];

export default async function sitemap() {
  const lastModified = new Date();

  const staticEntries = staticRoutes.map(({ url, changeFrequency, priority }) => ({
    url: `${BASE_URL}${url}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  let productEntries = [];
  let blogEntries = [];

  try {
    await connectDB();

    // Products — use slug if available for SEO-friendly URLs
    const products = await Product.find({}, "_id slug updatedAt").lean();
    productEntries = products.map((product) => ({
      url: `${BASE_URL}/product/${product.slug || product._id}`,
      lastModified: product.updatedAt || lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    // Blogs — use slug for SEO-friendly URLs
    const blogs = await Blog.find({ status: "published" }, "slug updatedAt").lean();
    blogEntries = blogs.map((blog) => ({
      url: `${BASE_URL}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch (err) {
    console.error("Sitemap: failed to fetch data", err);
  }

  return [...staticEntries, ...productEntries, ...blogEntries];
}
