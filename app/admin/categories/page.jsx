"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, Search, Filter, MoreVertical, Loader2, X, Check } from "lucide-react";

const CategoryAdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/admin/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create or update category
  const handleSubmit = async () => {
    if (!name.trim()) {
      showMessage("Category name is required", "error");
      return;
    }

    try {
      setLoading(true);
      setActionLoading(true);

      if (editId) {
        // UPDATE
        await axios.patch(`/api/admin/categories/${editId}`, { name });
        showMessage("Category updated successfully!", "success");
      } else {
        // CREATE
        await axios.post("/api/admin/categories", { name });
        showMessage("Category added successfully!", "success");
      }

      setName("");
      setEditId(null);
      fetchCategories();
    } catch (err) {
      showMessage(err.response?.data?.message || "Error saving category", "error");
      console.error("Save error", err.response?.data || err.message);
    } finally {
      setLoading(false);
      setActionLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id, categoryName) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) return;

    try {
      setActionLoading(true);
      await axios.delete(`/api/admin/categories/${id}`);
      showMessage("Category deleted successfully!", "success");
      fetchCategories();
    } catch (err) {
      showMessage("Error deleting category", "error");
      console.error("Delete error", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Edit category
  const handleEdit = (cat) => {
    setName(cat.name);
    setEditId(cat._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel edit
  const cancelEdit = () => {
    setName("");
    setEditId(null);
  };

  // Show success/error message
  const showMessage = (message, type) => {
    setSuccessMessage({ text: message, type });
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Success/Error Message Toast */}
      {successMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center justify-between p-4 rounded-lg shadow-lg animate-slide-in ${successMessage.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div className="flex items-center">
            <div className={`mr-3 h-8 w-8 rounded-full flex items-center justify-center ${successMessage.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
              {successMessage.type === "success" ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <X className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{successMessage.type === "success" ? "Success" : "Error"}</p>
              <p className="text-sm text-gray-600">{successMessage.text}</p>
            </div>
          </div>
          <button onClick={() => setSuccessMessage("")} className="ml-4 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Category Management</h1>
              <p className="text-gray-600 mt-2">Create, edit, and manage your product categories</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent bg-white"
                />
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Create/Edit Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editId ? "Edit Category" : "Create New Category"}
            </h2>
            {editId && (
              <button
                onClick={cancelEdit}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Cancel Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={loading || !name.trim()}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 ${
                  loading || !name.trim()
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#C08237] to-[#E0A75E] text-white hover:shadow-lg hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {editId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    {editId ? "Update Category" : "Add Category"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Categories List Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"} found
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Total: {categories.length}
            </div>
          </div>

          {actionLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-[#C08237] animate-spin" />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {searchQuery
                  ? `No categories matching "${searchQuery}"`
                  : "Get started by creating your first category above."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Category Name</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Created Date</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCategories.map((cat, index) => (
                    <tr
                      key={cat._id}
                      className={`hover:bg-gray-50 transition-colors ${editId === cat._id ? "bg-yellow-50" : ""}`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-[#FFF8F0] text-[#C08237] rounded-full font-medium">
                            {cat.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{cat.name}</p>
                            <p className="text-sm text-gray-500">ID: {cat._id.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(cat.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="p-2 text-[#C08237] hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id, cat.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {filteredCategories.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing {filteredCategories.length} of {categories.length} categories
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm bg-[#C08237] text-white rounded-lg">1</span>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#C08237] font-medium">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-[#C08237]" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Active</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-white border border-amber-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 font-medium">In Edit Mode</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{editId ? "1" : "0"}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Pencil className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CategoryAdminPage;