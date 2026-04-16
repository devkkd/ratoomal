import BlogClient from "./BlogClient";

export const metadata = {
  title: "Blog | Ratoomal's - Stories of Craft & Culture",
  description:
    "Explore stories about Indian craftsmanship, cultural heritage, decor tips, and the artisans behind Ratoomal's exquisite handcrafted pieces.",
  openGraph: {
    title: "Blog | Ratoomal's",
    description: "Stories of craft, culture, and heritage from Ratoomal's.",
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
