import { notFound, redirect } from "next/navigation";
import BlogDetailClient from "./BlogDetailClient";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

// Force dynamic rendering — blog content can be updated anytime
export const dynamic = "force-dynamic";

// Helper: find published blog by slug first, fallback to ObjectId
async function getBlog(id) {
  await connectDB();

  // Try slug lookup first (canonical URL format)
  let blog = await Blog.findOne({ slug: id, status: "published" })
    .select("title slug excerpt coverImage metaTitle metaDescription")
    .lean();

  // Fallback to ObjectId if slug not found
  if (!blog && /^[0-9a-fA-F]{24}$/.test(id)) {
    blog = await Blog.findOne({ _id: id, status: "published" })
      .select("title slug excerpt coverImage metaTitle metaDescription")
      .lean();
  }

  return blog;
}

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const blog = await getBlog(id);

    if (!blog) {
      return {
        title: "Blog Not Found | Ratoomal's",
        description: "Read our latest articles on craftsmanship and culture.",
        robots: { index: false },
      };
    }

    // Always canonical to slug URL — prevents duplicate if someone visits /blog/<objectId>
    const canonicalSlug = blog.slug;

    return {
      title: blog.metaTitle || `${blog.title} | Ratoomal's Blog`,
      description: blog.metaDescription || blog.excerpt,
      alternates: {
        canonical: `https://www.ratoomals.com/blog/${canonicalSlug}`,
      },
      openGraph: {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.excerpt,
        type: "article",
        url: `https://www.ratoomals.com/blog/${canonicalSlug}`,
        siteName: "Ratoomals",
        images: blog.coverImage
          ? [{ url: blog.coverImage, width: 1200, height: 630, alt: blog.title }]
          : [],
      },
    };
  } catch {
    return {
      title: "Blog | Ratoomal's",
      description: "Read our latest articles on craftsmanship and culture.",
    };
  }
}

export default async function BlogDetailPage({ params }) {
  const { id } = await params;

  try {
    const blog = await getBlog(id);

    // Genuine 404 — prevents soft 404 that Google flags
    if (!blog) {
      notFound();
    }

    // If visited via ObjectId URL, 301 redirect to slug URL.
    // Consolidates duplicate URLs — fixes GSC "Duplicate without user-selected canonical".
    if (blog.slug && id !== blog.slug) {
      redirect(`/blog/${blog.slug}`);
    }
  } catch {
    // DB error — let client component handle gracefully, don't 404
  }

  return <BlogDetailClient />;
}
