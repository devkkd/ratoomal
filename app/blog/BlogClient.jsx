"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter, Clock, Eye, Tag, ChevronRight, BookOpen } from "lucide-react";
import NotificationToast, { useNotification } from "../components/NotificationToast";

const CATEGORIES = [
  { value: "all", label: "All Posts" },
  { value: "Craftsmanship", label: "Craftsmanship" },
  { value: "Culture & Heritage", label: "Culture & Heritage" },
  { value: "Decor Tips", label: "Decor Tips" },
  { value: "Behind the Scenes", label: "Behind the Scenes" },
  { value: "Exhibitions", label: "Exhibitions" },
  { value: "News & Updates", label: "News & Updates" },
  { value: "Spiritual", label: "Spiritual" },
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

export default function BlogClient() {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { notification, showNotification, hideNotification } = useNotification();

  const fetchBlogs = async (page = 1, category = selectedCategory, search = searchQuery) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: page.toString(), limit: "9" });
      if (category !== "all") params.append("category", category);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/blogs?${params}`);
      const data = await res.json();

      if (data.success) {
        setBlogs(data.data);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.currentPage);
        setTotalItems(data.pagination.totalItems);
      } else {
        showNotification("Failed to load blogs", "error");
      }
    } catch {
      showNotification("Error loading blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatured = async () => {
    try {
      const res = await fetch("/api/blogs?featured=true&limit=1");
      const data = await res.json();
      if (data.success && data.data.length > 0) setFeaturedBlog(data.data[0]);
    } catch {}
  };

  useEffect(() => {
    fetchFeatured();
    fetchBlogs(1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs(1, selectedCategory, searchQuery);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    fetchBlogs(1, cat, searchQuery);
  };

  return (
    <div className="min-h-screen bg-[#FFF6EB]">
      <NotificationToast notification={notification} onClose={hideNotification} />

      {/* Page Heading */}
      <div className="bg-[#FFF6EB] border-b border-[#D7CEC2]/50 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-widest text-[#C08237] font-semibold mona mb-2">Our Journal</p>
            <h1 className="playfair font-bold text-3xl md:text-4xl text-gray-900 mb-3">
              Stories of Craft & Culture
            </h1>
            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
              Discover the artistry, heritage, and passion behind every piece we create.
            </p>
          </div>
          {/* <form onSubmit={handleSearch} className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-24 py-3 rounded-full text-gray-800 border border-[#A49C93] focus:outline-none focus:border-[#C08237] text-sm bg-white"
            />
            <button
              type="submit"
              className="absolute right-0.5 top-1/2 -translate-y-1/2 bg-[#C08237] text-white px-5 py-1.5 rounded-full text-xs font-semibold hover:bg-[#a66f2e] transition-colors"
            >
              Search
            </button>
          </form> */}
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.value
                    ? "bg-[#C08237] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-[#FFF8F0] hover:text-[#C08237]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {featuredBlog && currentPage === 1 && !searchQuery && selectedCategory === "all" && (
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-[#C08237] font-semibold mb-4 mona">
              Featured Post
            </p>
            <Link href={`/blog/${featuredBlog.slug || featuredBlog._id}`} className="group block">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto min-h-[300px] overflow-hidden">
                  <Image
                    src={featuredBlog.coverImage || "/images/placeholder.png"}
                    alt={featuredBlog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#C08237] text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="inline-block bg-[#FFF8F0] text-[#C08237] text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit">
                    {featuredBlog.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 playfair mb-3 group-hover:text-[#C08237] transition-colors">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-3">{featuredBlog.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredBlog.readTime} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {featuredBlog.views} views
                    </span>
                    <span>{formatDate(featuredBlog.publishedAt || featuredBlog.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#C08237] font-semibold group-hover:gap-3 transition-all">
                    <span>Read Article</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 text-sm">
            {loading ? "Loading..." : `${totalItems} article${totalItems !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== "all"
                ? "Try a different search or category"
                : "Articles will appear here once published"}
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  fetchBlogs(1, "all", "");
                }}
                className="mt-4 text-[#C08237] text-sm font-medium underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link key={blog._id} href={`/blog/${blog.slug || blog._id}`} className="group">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02] h-full flex flex-col">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={blog.coverImage || "/images/placeholder.png"}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {blog.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#C08237] text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="inline-block bg-[#FFF8F0] text-[#C08237] text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
                      {blog.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 playfair mb-2 group-hover:text-[#C08237] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{blog.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                      {/* <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {blog.readTime} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {blog.views}
                        </span>
                      </div> */}
                      <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            <button
              onClick={() => { fetchBlogs(currentPage - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => { fetchBlogs(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    currentPage === p ? "bg-[#C08237] text-white" : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => { fetchBlogs(currentPage + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
