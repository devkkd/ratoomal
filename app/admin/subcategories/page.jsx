"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, Search, Filter, ChevronDown, ChevronUp, Loader2, X, Check, FolderTree } from "lucide-react";

const SubCategoryAdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/admin/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      showMessage("Failed to load categories", "error");
    }
  };

  // Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      const res = await axios.get("/api/admin/subcategories");
      const data = res.data.data || [];
      setSubCategories(data);
      setFilteredSubCategories(data);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      showMessage("Failed to load subcategories", "error");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = subcategories;

    // Apply search
    if (searchQuery) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategoryFilter !== "all") {
      result = result.filter(item => item.category?._id === selectedCategoryFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        if (sortConfig.key === 'name') {
          return sortConfig.direction === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortConfig.key === 'category') {
          const catA = a.category?.name || "";
          const catB = b.category?.name || "";
          return sortConfig.direction === 'asc' 
            ? catA.localeCompare(catB)
            : catB.localeCompare(catA);
        }
        return 0;
      });
    }

    setFilteredSubCategories(result);
  }, [subcategories, searchQuery, selectedCategoryFilter, sortConfig]);

  // Create / update
  const handleSubmit = async () => {
    if (!name.trim()) {
      showMessage("Sub-category name is required", "error");
      return;
    }
    
    if (!category) {
      showMessage("Please select a category", "error");
      return;
    }

    try {
      setLoading(true);
      setActionLoading(true);

      if (editId) {
        // UPDATE
        await axios.patch(`/api/admin/subcategories/${editId}`, {
          name,
          category,
        });
        showMessage("Sub-category updated successfully!", "success");
      } else {
        // CREATE
        await axios.post("/api/admin/subcategories", {
          name,
          category,
        });
        showMessage("Sub-category created successfully!", "success");
      }

      setName("");
      setCategory("");
      setEditId(null);
      fetchSubCategories();
    } catch (err) {
      showMessage(err.response?.data?.message || "Error saving sub-category", "error");
      console.error("Save error:", err);
    } finally {
      setLoading(false);
      setActionLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id, subcatName) => {
    if (!confirm(`Are you sure you want to delete "${subcatName}"?`)) return;

    try {
      setActionLoading(true);
      await axios.delete(`/api/admin/subcategories/${id}`);
      showMessage("Sub-category deleted successfully!", "success");
      fetchSubCategories();
    } catch (err) {
      showMessage("Error deleting sub-category", "error");
      console.error("Delete error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Edit
  const handleEdit = (item) => {
    setName(item.name);
    setCategory(item.category?._id || "");
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel edit
  const cancelEdit = () => {
    setName("");
    setCategory("");
    setEditId(null);
  };

  // Show message
  const showMessage = (message, type) => {
    setSuccessMessage({ text: message, type });
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Toggle row expansion
  const toggleRowExpand = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c._id === categoryId);
    return cat ? cat.name : "Unknown Category";
  };

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

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-[#C08237] to-[#E0A75E] rounded-lg flex items-center justify-center">
                  <FolderTree className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Sub-Category Management</h1>
                  <p className="text-gray-600 mt-1">Manage sub-categories and their parent categories</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sub-categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sub-Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{subcategories.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FolderTree className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <FolderTree className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Filtered Items</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{filteredSubCategories.length}</p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Filter className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Edit Mode</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{editId ? "1" : "0"}</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Pencil className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editId ? "Edit Sub-Category" : "Create New Sub-Category"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {editId ? "Update existing sub-category details" : "Add a new sub-category to your catalog"}
              </p>
            </div>
            {editId && (
              <button
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2 text-sm"
              >
                <X className="h-4 w-4" />
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              {category && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Selected: {getCategoryName(category)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter sub-category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading || !name.trim() || !category}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 ${
                loading || !name.trim() || !category
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
                  {editId ? "Update Sub-Category" : "Create Sub-Category"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                <div className="relative">
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              {selectedCategoryFilter !== "all" && (
                <button
                  onClick={() => setSelectedCategoryFilter("all")}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mt-6"
                >
                  <X className="h-4 w-4" />
                  Clear Filter
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredSubCategories.length} of {subcategories.length} sub-categories
            </div>
          </div>
        </div>

        {/* Sub-Categories List Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">All Sub-Categories</h2>
              {actionLoading && (
                <div className="flex items-center gap-2 text-sm text-[#C08237]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </div>
              )}
            </div>
          </div>

          {filteredSubCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <FolderTree className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sub-categories found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {searchQuery || selectedCategoryFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first sub-category"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-left">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#C08237]"
                      >
                        Sub-Category Name
                        {sortConfig.key === 'name' && (
                          sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <button
                        onClick={() => handleSort('category')}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#C08237]"
                      >
                        Parent Category
                        {sortConfig.key === 'category' && (
                          sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubCategories.map((item) => (
                    <React.Fragment key={item._id}>
                      <tr className={`hover:bg-gray-50 transition-colors ${editId === item._id ? "bg-yellow-50" : ""}`}>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleRowExpand(item._id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              {expandedRows[item._id] ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-[#FFF8F0] to-[#FFEED9] text-[#C08237] rounded-lg font-medium">
                                {item.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500">ID: {item._id.substring(0, 8)}...</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                              <FolderTree className="h-3 w-3 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">{item.category?.name || "Uncategorized"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id, item.name)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows[item._id] && (
                        <tr className="bg-gray-50">
                          <td colSpan="4" className="px-6 py-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500">Sub-Category ID</p>
                                  <p className="text-sm font-mono text-gray-900">{item._id}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Parent Category ID</p>
                                  <p className="text-sm font-mono text-gray-900">{item.category?._id || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Created</p>
                                  <p className="text-sm text-gray-900">
                                    {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Last Updated</p>
                                  <p className="text-sm text-gray-900">
                                    {new Date(item.updatedAt || Date.now()).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {filteredSubCategories.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing {filteredSubCategories.length} of {subcategories.length} sub-categories
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

        {/* Category Relationship Visualization */}
        {categories.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Relationships</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.slice(0, 6).map((cat) => {
                const subcats = subcategories.filter(sc => sc.category?._id === cat._id);
                return (
                  <div key={cat._id} className="border border-gray-200 rounded-lg p-4 hover:border-[#C08237] transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                          <FolderTree className="h-4 w-4 text-blue-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">{cat.name}</h4>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {subcats.length} sub
                      </span>
                    </div>
                    {subcats.length > 0 ? (
                      <div className="space-y-1">
                        {subcats.slice(0, 3).map((sc) => (
                          <div key={sc._id} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-[#C08237] rounded-full"></div>
                            <span>{sc.name}</span>
                          </div>
                        ))}
                        {subcats.length > 3 && (
                          <p className="text-xs text-gray-500 mt-2">
                            +{subcats.length - 3} more sub-categories
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No sub-categories yet</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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

export default SubCategoryAdminPage;