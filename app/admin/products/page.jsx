"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Upload, 
  Image as ImageIcon, 
  Video,
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Save, 
  X, 
  Check,
  Package,
  IndianRupee,
  Hash,
  Tag,
  Palette,
  Users,
  Target,
  Layout,
  Layers,
  Brush,
  Star,
  Shield,
  Settings,
  FileText,
  Loader2,
  AlertCircle,
  Eye,
  Play,
  FileVideo
} from "lucide-react";

const INITIAL_FORM = {
  name: "",
  code: "",
  price: "",
  moq: "",
  category: "",
  subCategory: "",
  godName: "",
  color: "",
  suitableFor: "",
  usage: "",
  posture: "",
  baseShape: "",
  finish: "",
  material: "",
  sizes: "", // Comma-separated sizes
  appearance: "",
  careInstruction: "",
  assemblyRequired: "",
  availability: "In Stock",
  productType: "",
  services: "",
  shortDescription: "",
  longDescription: "",
  features: "",
};

export default function ProductAdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [isStock, setIsStock] = useState(true);
  
  // Media states
  const [thumbnail, setThumbnail] = useState("");
  const [images, setImages] = useState([]);
  const [video360, setVideo360] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [isVideoUploading, setIsVideoUploading] = useState(false);

  // ---------------- FETCH ----------------
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/admin/products");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      showMessage("Failed to load products", "error");
    }
  };

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    try {
      const res = await axios.get("/api/admin/subcategories");
      const filtered = res.data.data.filter((s) => s.category?._id === categoryId);
      setSubcategories(filtered);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    axios.get("/api/admin/categories")
      .then((res) => setCategories(res.data.data || []))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // ---------------- UPLOAD FUNCTIONS ----------------
  const uploadImage = async (file) => {
    if (!file) return null;
    
    try {
      // Step 1 — get presigned URL
      const presignRes = await axios.post("/api/admin/upload-presigned", {
        fileName: file.name,
        fileType: file.type,
        folder: "products",
      });

      if (!presignRes.data.success) {
        throw new Error(presignRes.data.error || "Failed to get upload URL");
      }

      const { presignedUrl, publicUrl } = presignRes.data;

      // Step 2 — upload directly to R2 from browser
      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
      });

      return publicUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      showMessage(`Failed to upload image: ${error.response?.data?.error || error.message}`, "error");
      return null;
    }
  };

  const uploadVideo = async (file) => {
    if (!file) return null;
    
    if (!file.type.startsWith('video/')) {
      showMessage("Please select a video file (MP4, MOV, AVI, WEBM)", "error");
      return null;
    }

    // 200MB client-side guard
    if (file.size > 200 * 1024 * 1024) {
      showMessage("Video size must be less than 200MB", "error");
      return null;
    }

    try {
      setIsVideoUploading(true);

      // Step 1 — get a presigned URL from our API (tiny JSON request, no file data)
      const presignRes = await axios.post("/api/admin/upload-presigned", {
        fileName: file.name,
        fileType: file.type,
        folder: "products/videos",
      });

      if (!presignRes.data.success) {
        throw new Error(presignRes.data.error || "Failed to get upload URL");
      }

      const { presignedUrl, publicUrl } = presignRes.data;

      // Step 2 — upload directly from browser to R2 (bypasses server/Render limits)
      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📹 Video upload progress: ${pct}%`);
        },
      });

      showMessage("Video uploaded successfully!", "success");
      return publicUrl;

    } catch (error) {
      console.error("Video upload error:", error);
      const msg = error.response?.data?.error || error.message || "Video upload failed";
      showMessage(`Video upload failed: ${msg}`, "error");
      return null;
    } finally {
      setIsVideoUploading(false);
    }
  };

  // ---------------- SUBMIT ----------------
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!thumbnail && !thumbnailFile) {
    showMessage("Thumbnail image is required", "error");
    return;
  }

  try {
    setLoading(true);

    let uploadedThumbnail = thumbnail;
    let uploadedImages = images;
    let uploadedVideo = video360;

    /* 📤 Upload Thumbnail */
    if (thumbnailFile) {
      const thumbUrl = await uploadImage(thumbnailFile);
      if (!thumbUrl) return;
      uploadedThumbnail = thumbUrl;
    }

    /* 📤 Upload Gallery Images */
    if (imageFiles.length > 0) {
      setUploading(true);
      const uploaded = await Promise.all(
        imageFiles.map((file) => uploadImage(file))
      );
      setUploading(false);
      uploadedImages = uploaded.filter(Boolean);
    }

    /* 📤 Upload Video */
    if (videoFile) {
      const videoUrl = await uploadVideo(videoFile);
      if (!videoUrl) return;
      uploadedVideo = videoUrl;
    }

    const payload = {
      ...form,
      price: Number(form.price) || 0,
      moq: Number(form.moq) || 1,
      thumbnail: uploadedThumbnail,
      images: uploadedImages,
      video360: uploadedVideo || "",
      services: form.services
        ? form.services.split(",").map(s => s.trim()).filter(Boolean)
        : [],
      features: form.features
        ? form.features.split(",").map(f => f.trim()).filter(Boolean)
        : [],
      sizes: form.sizes
        ? form.sizes.split(/[,/]/).map(s => s.trim()).filter(Boolean)
        : [],
      availability: isStock ? "In Stock" : "Out of Stock",
    };

    if (!payload.subCategory) delete payload.subCategory;

    if (editId) {
      await axios.patch(`/api/admin/products/${editId}`, payload);
      showMessage("Product updated successfully", "success");
    } else {
      await axios.post("/api/admin/products", payload);
      showMessage("Product created successfully", "success");
    }

    resetForm();
    fetchProducts();

  } catch (error) {
    console.error(error);
    showMessage(
      error.response?.data?.message || "Product save failed",
      "error"
    );
  } finally {
    setLoading(false);
    setUploading(false);
  }
};


  // ---------------- EDIT ----------------
  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      ...INITIAL_FORM,
      ...product,
      price: product.price?.toString() || "",
      moq: product.moq?.toString() || "1",
      category: product.category?._id || product.category || "",
      subCategory: product.subCategory?._id || product.subCategory || "",
      services: product.services?.join(", ") || "",
      features: product.features?.join(", ") || "",
      sizes: product.sizes?.join(", ") || "",
    });
    
    // Set existing media
    setThumbnail(product.thumbnail || "");
    setImages(product.images || []);
    
    // Only set video if it's a proper URL, not data URL
    if (product.video360 && (product.video360.startsWith('/') || product.video360.startsWith('http'))) {
      setVideo360(product.video360);
    } else {
      setVideo360("");
    }
    
    setIsStock(product.availability === "In Stock");
    
    // Clear file inputs
    setThumbnailFile(null);
    setImageFiles([]);
    setVideoFile(null);
    
    fetchSubCategories(product.category?._id || product.category);
    setActiveTab("basic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;
    
    try {
      await axios.delete(`/api/admin/products/${id}`);
      showMessage("Product deleted successfully!", "success");
      fetchProducts();
    } catch (err) {
      showMessage("Error deleting product", "error");
      console.error("Delete error:", err);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm(INITIAL_FORM);
    setThumbnail("");
    setImages([]);
    setVideo360("");
    setSubcategories([]);
    setThumbnailFile(null);
    setImageFiles([]);
    setVideoFile(null);
    setIsStock(true);
    setActiveTab("basic");
    setIsVideoUploading(false);
  };

  // ---------------- MEDIA HANDLING ----------------
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      showMessage("Please select an image file", "error");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showMessage("File size should be less than 5MB", "error");
      return;
    }
    
    setThumbnailFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnail(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        showMessage(`${file.name} is not an image file`, "error");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        showMessage(`${file.name} is too large (max 5MB)`, "error");
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    setImageFiles(prev => [...prev, ...validFiles]);
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset previous video
    setVideo360("");
    setVideoFile(null);
    
    if (!file.type.startsWith('video/')) {
      showMessage("Please select a video file (MP4, MOV, AVI, WEBM)", "error");
      return;
    }
    
    // Check size
    if (file.size > 200 * 1024 * 1024) {
      showMessage("Video size must be less than 200MB", "error");
      return;
    }
    
    setVideoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setVideo360(e.target.result); // This is data URL for preview
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (imageFiles[index]) {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const removeVideo = () => {
    setVideo360("");
    setVideoFile(null);
  };

  // ---------------- UI HELPERS ----------------
  const showMessage = (message, type) => {
    if (type === "success") {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category?._id === selectedCategory;
    const matchesMinPrice = !priceRange.min || product.price >= Number(priceRange.min);
    const matchesMaxPrice = !priceRange.max || product.price <= Number(priceRange.max);
    
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg shadow-lg animate-slide-in">
          <div className="flex items-center">
            <div className="mr-3 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Success</p>
              <p className="text-sm text-gray-600">{successMessage}</p>
            </div>
          </div>
          <button onClick={() => setSuccessMessage("")} className="ml-4 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg shadow-lg animate-slide-in">
          <div className="flex items-center">
            <div className="mr-3 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Error</p>
              <p className="text-sm text-gray-600">{errorMessage}</p>
            </div>
          </div>
          <button onClick={() => setErrorMessage("")} className="ml-4 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-[#C08237] to-[#E0A75E] rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Product Management</h1>
                  <p className="text-gray-600 mt-1">Create and manage your product catalog</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent bg-white"
                />
              </div>
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Product
              </button>
            </div>
          </div>
        </div>

        {/* Product Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editId ? "Edit Product" : "Create New Product"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {editId ? "Update product details" : "Fill in the product information below"}
              </p>
            </div>
            {editId && (
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2 text-sm"
              >
                <X className="h-4 w-4" />
                Cancel Edit
              </button>
            )}
          </div>

          {/* Form Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-6 overflow-x-auto">
              {["basic", "details", "media", "description"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "border-[#C08237] text-[#C08237]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab === "basic" && "Basic Info"}
                  {tab === "details" && "Specifications"}
                  {tab === "media" && "Media"}
                  {tab === "description" && "Description"}
                </button>
              ))}
            </nav>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {/* Media Tab */}
            {activeTab === "media" && (
              <div className="space-y-8">
                {/* Thumbnail Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#C08237] transition-colors cursor-pointer group">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3 group-hover:text-[#C08237]" />
                      <p className="text-sm text-gray-600 mb-2">Click to upload thumbnail</p>
                      <p className="text-xs text-gray-500">JPG, PNG, WEBP up to 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    {thumbnail && (
                      <div className="w-48 h-48 relative">
                        <img
                          src={thumbnail}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => {
                            setThumbnail("");
                            setThumbnailFile(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
                          {thumbnailFile?.name || "Current thumbnail"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    360° Product Video (Optional)
                  </label>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#C08237] transition-colors cursor-pointer group">
                      <FileVideo className="h-12 w-12 text-gray-400 mx-auto mb-3 group-hover:text-[#C08237]" />
                      <p className="text-sm text-gray-600 mb-2">Click to upload 360° video</p>
                      <p className="text-xs text-gray-500">MP4, MOV, AVI, WEBM up to 200MB</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    
                    {video360 && (
                      <div className="w-48 h-48 relative bg-black rounded-lg overflow-hidden">
                        {video360.startsWith('data:video') ? (
                          <>
                            <video
                              src={video360}
                              className="w-full h-full object-cover"
                              controls
                              muted
                            />
                            <div className="absolute top-2 left-2 bg-[#C08237] text-white px-2 py-1 rounded-full text-xs font-medium">
                              <Play className="inline h-3 w-3 mr-1" /> PREVIEW
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-full h-full flex items-center justify-center bg-gray-900">
                              <FileVideo className="h-12 w-12 text-gray-400" />
                            </div>
                            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                              <Play className="inline h-3 w-3 mr-1" /> VIDEO
                            </div>
                          </>
                        )}
                        <button
                          onClick={removeVideo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white text-xs p-1.5 rounded truncate">
                          {videoFile?.name || "Uploaded Video"}
                        </div>
                      </div>
                    )}
                  </div>
                  {isVideoUploading && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Uploading video...</p>
                          <p className="text-xs text-blue-600">Please wait, this may take a moment</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gallery Images Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery Images
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#C08237] transition-colors cursor-pointer group mb-4">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3 group-hover:text-[#C08237]" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload multiple images</p>
                    <p className="text-xs text-gray-500">JPG, PNG, WEBP up to 5MB each</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  {uploading && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 text-[#C08237] animate-spin mr-2" />
                      <span className="text-gray-600">Uploading images...</span>
                    </div>
                  )}

                  {images.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700">
                          Uploaded Images ({images.length})
                        </p>
                        <button
                          onClick={() => {
                            setImages([]);
                            setImageFiles([]);
                          }}
                          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Clear All
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer"
                              onClick={() => {
                                setPreviewImage(img);
                                setShowImagePreview(true);
                              }}
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded truncate">
                              {imageFiles[index]?.name || `Image ${index + 1}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter product name"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Code/SKU <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter product code (e.g., SKU001)"
                      value={form.code}
                      onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) => setForm({...form, price: e.target.value})}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MOQ (Minimum Order Quantity)
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="1"
                      value={form.moq}
                      onChange={(e) => setForm({...form, moq: e.target.value})}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={form.category}
                      onChange={(e) => {
                        setForm({...form, category: e.target.value, subCategory: ""});
                        fetchSubCategories(e.target.value);
                      }}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Category
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={form.subCategory}
                      disabled={!form.category}
                      onChange={(e) => setForm({...form, subCategory: e.target.value})}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Select Sub Category</option>
                      {subcategories.map(s => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsStock(true)}
                      className={`flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 transition-colors ${
                        isStock 
                          ? "bg-green-50 border-green-200 text-green-700" 
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                      In Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsStock(false)}
                      className={`flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 transition-colors ${
                        !isStock 
                          ? "bg-red-50 border-red-200 text-red-700" 
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <X className="h-4 w-4" />
                      Out of Stock
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { key: "godName", label: "God Name", icon: <Star className="h-4 w-4" /> },
                  { key: "color", label: "Color", icon: <Palette className="h-4 w-4" /> },
                  { key: "material", label: "Material", icon: <Layers className="h-4 w-4" /> },
                  { key: "suitableFor", label: "Suitable For", icon: <Users className="h-4 w-4" /> },
                  { key: "usage", label: "Usage", icon: <Target className="h-4 w-4" /> },
                  { key: "posture", label: "Posture", icon: <Layout className="h-4 w-4" /> },
                  { key: "baseShape", label: "Base Shape", icon: <Layers className="h-4 w-4" /> },
                  { key: "finish", label: "Finish", icon: <Brush className="h-4 w-4" /> },
                  { key: "appearance", label: "Appearance", icon: <Eye className="h-4 w-4" /> },
                  { key: "careInstruction", label: "Care Instruction", icon: <Shield className="h-4 w-4" /> },
                  { key: "assemblyRequired", label: "Assembly Required", icon: <Settings className="h-4 w-4" /> },
                  { key: "productType", label: "Product Type", icon: <Package className="h-4 w-4" /> },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {field.icon}
                      </div>
                      <input
                        type="text"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        value={form[field.key]}
                        onChange={(e) => setForm({...form, [field.key]: e.target.value})}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
                
                {/* Sizes Field - Full Width - DYNAMIC SIZES FEATURE */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Sizes (comma separated)
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="6, 8, 10, 12"
                      value={form.sizes}
                      onChange={(e) => setForm({...form, sizes: e.target.value})}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter multiple sizes separated by commas (e.g., "6, 8, 10 ")
                  </p>
                  {form.sizes && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.sizes.split(/[,/]/).map((size, idx) => {
                        const trimmedSize = size.trim();
                        return trimmedSize ? (
                          <span key={idx} className="px-3 py-1 bg-[#C08237] bg-opacity-10 text-[white] rounded-full text-sm font-medium">
                            {trimmedSize}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      placeholder="Brief description of the product"
                      value={form.shortDescription}
                      onChange={(e) => setForm({...form, shortDescription: e.target.value})}
                      rows={3}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Long Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      placeholder="Detailed product description with features, benefits, etc."
                      value={form.longDescription}
                      onChange={(e) => setForm({...form, longDescription: e.target.value})}
                      rows={6}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Services (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Service 1, Service 2, Service 3"
                    value={form.services}
                    onChange={(e) => setForm({...form, services: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Feature 1, Feature 2, Feature 3"
                    value={form.features}
                    onChange={(e) => setForm({...form, features: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !form.name || !form.code || !form.category}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 ${
                  loading || !form.name || !form.code || !form.category
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
                    <Save className="h-5 w-5" />
                    {editId ? "Update Product" : "Create Product"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">All Products</h2>
              <div className="text-sm text-gray-500">
                {filteredProducts.length} items
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {searchQuery || selectedCategory !== "all" || priceRange.min || priceRange.max
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first product"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Product</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Code</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Stock</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {product.thumbnail ? (
                              <img
                                src={product.thumbnail}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">MOQ: {product.moq || 1}</p>
                            {/* Fixed video display */}
                            {product.video360 && product.video360.trim() !== "" && (
                              <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                <Video className="h-3 w-3" /> Has Video
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-gray-400" />
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-900">
                            {product.code || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{product.category?.name || "Uncategorized"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{product.price?.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          product.availability === "In Stock"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {product.availability === "In Stock" ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              In Stock
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3 mr-1" />
                              Out of Stock
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
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
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Image Preview</h3>
              <button
                onClick={() => setShowImagePreview(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 flex items-center justify-center">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}