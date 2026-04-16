import BlogDetailClient from "./BlogDetailClient";

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ratoomals.com";
    const res = await fetch(`${baseUrl}/api/blogs/${id}`, { cache: "no-store" });
    const data = await res.json();

    if (data.success && data.data) {
      const blog = data.data;
      return {
        title: blog.metaTitle || `${blog.title} | Ratoomal's Blog`,
        description: blog.metaDescription || blog.excerpt,
        openGraph: {
          title: blog.title,
          description: blog.excerpt,
          images: [{ url: blog.coverImage }],
        },
      };
    }
  } catch {}

  return {
    title: "Blog | Ratoomal's",
    description: "Read our latest articles on craftsmanship and culture.",
  };
}

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}
