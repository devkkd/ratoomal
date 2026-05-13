"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Clock, Eye, Tag, Share2, Calendar, ChevronRight, BookOpen,
} from "lucide-react";
import NotificationToast, { useNotification } from "../../components/NotificationToast";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function BlogDetailClient() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/blogs/${params.id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();

        if (data.success) {
          setBlog(data.data);
          setRelated(data.related || []);
        } else {
          showNotification("Blog not found", "error");
          router.push("/blog");
        }
      } catch {
        showNotification("Error loading blog", "error");
        router.push("/blog");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchBlog();
  }, [params.id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: blog.title, text: blog.excerpt, url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        showNotification("Link copied to clipboard!", "success");
      } catch {
        showNotification("Failed to copy link", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF6EB] animate-pulse">
        <div className="h-80 bg-gray-200" />
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-[#FFF6EB]">
      <NotificationToast notification={notification} onClose={hideNotification} />

      {/* Hero */}
      <div className="relative h-72 md:h-[420px] overflow-hidden">
        <Image
          src={blog.coverImage || "/images/placeholder.png"}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />

        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleShare}
          className="absolute top-6 right-6 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block bg-[#C08237] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {blog.category}
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white playfair leading-tight">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Article */}
          <div className="lg:col-span-2">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#C08237] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {blog.author?.name?.charAt(0) || "R"}
                </div>
                <span className="font-medium text-gray-700">{blog.author?.name || "Ratoomal's Team"}</span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.publishedAt || blog.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {blog.readTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {blog.views} views
              </span>
            </div>

            {/* Excerpt */}
            <p className="text-lg text-gray-700 leading-relaxed mb-8 font-medium border-l-4 border-[#C08237] pl-5 italic">
              {blog.excerpt}
            </p>

            {/* Content */}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-gray-500" />
                  {blog.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-[#FFF8F0] hover:text-[#C08237] transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-4">
              <span className="text-gray-600 font-medium">Share this article:</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-[#C08237] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#a66f2e] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 playfair mb-4">About the Author</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#C08237] to-[#E0A75E] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {blog.author?.name?.charAt(0) || "R"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{blog.author?.name || "Ratoomal's Team"}</p>
                  <p className="text-sm text-gray-500">Ratoomal's Editorial</p>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 playfair mb-4">Category</h3>
              <span className="inline-block bg-[#FFF8F0] text-[#C08237] px-4 py-2 rounded-full text-sm font-medium">
                {blog.category}
              </span>
            </div>

            {/* Related Posts */}
            {related.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 playfair mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link key={r._id} href={`/blog/${r.slug || r._id}`} className="group flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={r.coverImage || "/images/placeholder.png"}
                          alt={r.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-[#C08237] transition-colors line-clamp-2">
                          {r.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {r.readTime} min read
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Blog */}
            <Link
              href="/blog"
              className="flex items-center justify-center gap-2 w-full bg-[#C08237] text-white py-3 px-6 rounded-full hover:bg-[#A66D2E] transition-colors font-medium"
            >
              <BookOpen className="w-4 h-4" />
              View All Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
