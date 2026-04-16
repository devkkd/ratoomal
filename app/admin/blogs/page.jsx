"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Pencil, Trash2, Plus, Search, Loader2, X, Check, Eye, Star,
  BookOpen, FileText, Globe, Archive, Upload, ImageIcon,
} from "lucide-react";
import Image from "next/image";

const CATEGORIES = [
  "Craftsmanship",
  "Culture & Heritage",
  "Decor Tips",
  "Behind the Scenes",
  "Exhibitions",
  "News & Updates",
  "Spiritual",
];

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "News & Updates",
  tags: "",
  status: "published",
  featured: false,
  readTime: 5,
  author: { name: "Ratoomal's Team" },
  metaTitle: "",
  metaDescription: "",
};

// ── Image Upload Component ──────────────────────────────────────────────────
function CoverImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10 MB.");
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "blogs");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => uploadFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    uploadFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cover Image *
      </label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
          <div className="relative w-full h-52">
            <Image src={value} alt="Cover" fill className="object-cover" />
          </div>
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Uploading..." : "Change"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-[#C08237] bg-[#FFF8F0]"
              : "border-gray-300 hover:border-[#C08237] hover:bg-[#FFF8F0]/50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-[#C08237] animate-spin" />
              <p className="text-sm text-gray-600 font-medium">Uploading to Cloudflare R2...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-[#FFF8F0] rounded-full flex items-center justify-center">
                <ImageIcon className="w-7 h-7 text-[#C08237]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Drop image here or <span className="text-[#C08237]">click to browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 10 MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, featured: 0 });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState("basic");

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: "50" });
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      const res = await axios.get(`/api/admin/blogs?${params}`);
      setBlogs(res.data.data || []);
      setStats(res.data.stats || { total: 0, published: 0, draft: 0, featured: 0 });
    } catch {
      showToast("Failed to fetch blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, [statusFilter]);

  const handleSearch = (e) => { e.preventDefault(); fetchBlogs(); };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setActiveTab("basic");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (blog) => {
    setForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      coverImage: blog.coverImage || "",
      category: blog.category || "News & Updates",
      tags: (blog.tags || []).join(", "),
      status: blog.status || "draft",
      featured: blog.featured || false,
      readTime: blog.readTime || 5,
      author: blog.author || { name: "Ratoomal's Team" },
      metaTitle: blog.metaTitle || "",
      metaDescription: blog.metaDescription || "",
    });
    setEditId(blog._id);
    setActiveTab("basic");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim() || !form.coverImage || !form.category) {
      showToast("Please fill all required fields (title, excerpt, content, cover image, category)", "error");
      return;
    }
    try {
      setActionLoading(true);
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      if (editId) {
        await axios.put(`/api/admin/blogs/${editId}`, payload);
        showToast("Blog updated successfully!");
      } else {
        await axios.post("/api/admin/blogs", payload);
        showToast("Blog created successfully!");
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      fetchBlogs();
    } catch (err) {
      showToast(err.response?.data?.error || "Error saving blog", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      setActionLoading(true);
      await axios.delete(`/api/admin/blogs/${id}`);
      showToast("Blog deleted successfully!");
      fetchBlogs();
    } catch {
      showToast("Error deleting blog", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (blog) => {
    const newStatus = blog.status === "published" ? "draft" : "published";
    try {
      await axios.put(`/api/admin/blogs/${blog._id}`, { status: newStatus });
      showToast(`Blog ${newStatus === "published" ? "published" : "moved to draft"}!`);
      fetchBlogs();
    } catch {
      showToast("Error updating status", "error");
    }
  };

  const handleToggleFeatured = async (blog) => {
    try {
      await axios.put(`/api/admin/blogs/${blog._id}`, { featured: !blog.featured });
      showToast(`Blog ${!blog.featured ? "marked as featured" : "removed from featured"}!`);
      fetchBlogs();
    } catch {
      showToast("Error updating featured status", "error");
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg shadow-lg border ${toast.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
            {toast.type === "success" ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-red-600" />}
          </div>
          <p className="text-sm text-gray-800">{toast.text}</p>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-500 mt-1">Create and manage blog articles</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-[#C08237] to-[#E0A75E] text-white px-5 py-2.5 rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            <Plus className="w-5 h-5" />
            New Blog Post
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Posts", value: stats.total, icon: BookOpen, colorClass: "bg-blue-100 text-blue-600" },
            { label: "Published", value: stats.published, icon: Globe, colorClass: "bg-green-100 text-green-600" },
            { label: "Drafts", value: stats.draft, icon: Archive, colorClass: "bg-amber-100 text-amber-600" },
            { label: "Featured", value: stats.featured, icon: Star, colorClass: "bg-yellow-100 text-yellow-600" },
          ].map(({ label, value, icon: Icon, colorClass }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Create / Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                {editId ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>
              <button
                onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-gray-200">
              {["basic", "content", "seo"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-[#C08237] text-[#C08237]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "basic" ? "Basic Info" : tab === "content" ? "Content" : "SEO & Meta"}
                </button>
              ))}
            </div>

            {/* ── Basic Info Tab ── */}
            {activeTab === "basic" && (
              <div className="space-y-5">
                {/* Cover Image Upload */}
                <CoverImageUpload
                  value={form.coverImage}
                  onChange={(url) => setForm({ ...form, coverImage: url })}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Enter blog title"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Excerpt * <span className="text-gray-400 font-normal">(max 300 chars)</span>
                    </label>
                    <textarea
                      value={form.excerpt}
                      onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                      placeholder="Short description shown in blog listing"
                      rows={3}
                      maxLength={300}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{form.excerpt.length}/300</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, status: "published" })}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                          form.status === "published"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        ✓ Published
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, status: "draft" })}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                          form.status === "draft"
                            ? "border-gray-400 bg-gray-50 text-gray-700"
                            : "border-gray-200 text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        Draft
                      </button>
                    </div>
                    {form.status === "draft" && (
                      <p className="text-xs text-amber-600 mt-1">⚠ Draft blogs won't appear on the website</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Read Time (minutes)</label>
                    <input
                      type="number"
                      value={form.readTime}
                      onChange={(e) => setForm({ ...form, readTime: parseInt(e.target.value) || 5 })}
                      min={1}
                      max={60}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                    <input
                      type="text"
                      value={form.author?.name || ""}
                      onChange={(e) => setForm({ ...form, author: { ...form.author, name: e.target.value } })}
                      placeholder="Author name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags <span className="text-gray-400 font-normal">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      placeholder="handicraft, culture, decor"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="w-4 h-4 accent-[#C08237]"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Mark as Featured
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ── Content Tab ── */}
            {activeTab === "content" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content * <span className="text-gray-400 font-normal">(HTML supported)</span>
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder={`Write your blog content here.\nYou can use HTML tags like:\n<h2>Heading</h2>\n<p>Paragraph</p>\n<ul><li>List item</li></ul>\n<strong>Bold</strong>, <em>Italic</em>\n<blockquote>Quote</blockquote>`}
                  rows={22}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent font-mono text-sm resize-y"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Supports: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;blockquote&gt;, &lt;a&gt;, &lt;img&gt;
                </p>
              </div>
            )}

            {/* ── SEO Tab ── */}
            {activeTab === "seo" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={form.metaTitle}
                    onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                    placeholder="SEO title (defaults to blog title)"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    value={form.metaDescription}
                    onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                    placeholder="SEO description (defaults to excerpt)"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent resize-none"
                  />
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); }}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={actionLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-[#C08237] to-[#E0A75E] text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {actionLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />{editId ? "Updating..." : "Creating..."}</>
                ) : (
                  <><Check className="w-4 h-4" />{editId ? "Update Post" : "Create Post"}</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
              />
            </form>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Blog Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">All Blog Posts</h2>
            <span className="text-sm text-gray-500">{blogs.length} posts</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-[#C08237] animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No blog posts found</h3>
              <p className="text-gray-400 text-sm">Create your first blog post above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Post</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Category</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Views</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            {blog.coverImage ? (
                              <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm line-clamp-1">{blog.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{blog.excerpt}</p>
                            {blog.featured && (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-600 mt-0.5">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-[#FFF8F0] text-[#C08237] text-xs px-2 py-1 rounded-full font-medium">
                          {blog.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(blog)}
                          className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                            blog.status === "published"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {blog.status === "published" ? (
                            <><Globe className="w-3 h-3" /> Published</>
                          ) : (
                            <><Archive className="w-3 h-3" /> Draft</>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Eye className="w-3.5 h-3.5" />
                          {blog.views || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleFeatured(blog)}
                            title={blog.featured ? "Remove from featured" : "Mark as featured"}
                            className={`p-1.5 rounded-lg transition-colors ${
                              blog.featured ? "text-amber-500 hover:bg-amber-50" : "text-gray-400 hover:bg-gray-100"
                            }`}
                          >
                            <Star className={`w-4 h-4 ${blog.featured ? "fill-amber-400" : ""}`} />
                          </button>
                          <button
                            onClick={() => openEdit(blog)}
                            className="p-1.5 text-[#C08237] hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id, blog.title)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
