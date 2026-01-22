"use client";

import { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { uploadMultipleToCloudinary } from '@/utils/cloudinaryUpload';

export default function ProductUploadPage() {
  // States for media upload
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  
  // States for bulk upload
  const [excelFile, setExcelFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  
  // States for products export
  const [exportLoading, setExportLoading] = useState(false);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('media'); // 'media', 'bulk', 'export'

  // Refs
  const fileInputRef = useRef(null);
  const bulkFileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= (isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024); // 100MB for video, 10MB for images
      return (isImage || isVideo) && isValidSize;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload files to Cloudinary
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: selectedFiles.length, percent: 0 });

    try {
      const results = await uploadMultipleToCloudinary(
        selectedFiles,
        'products',
        (progress) => {
          setUploadProgress(progress);
        }
      );

      setUploadedMedia(prev => [...prev, ...results]);
      setSelectedFiles([]);
      alert(`✅ ${results.length} file(s) uploaded successfully!`);
      
      // Auto-download Excel after upload
      if (results.length > 0) {
        downloadMediaExcel(results);
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(`❌ Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  // Download Excel with uploaded media URLs
  const downloadMediaExcel = (mediaData = uploadedMedia) => {
    if (mediaData.length === 0) {
      alert('No media files to export');
      return;
    }

    // Format data for Excel
    const excelData = mediaData.map((item, index) => ({
      'S.No': index + 1,
      'File Name': item.originalName,
      'Type': item.type.toUpperCase(),
      'Cloudinary URL': item.url,
      'Public ID': item.publicId,
      'Folder': item.folder,
      'Upload Time': new Date().toLocaleString()
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Auto-size columns
    const maxWidth = excelData.reduce((w, r) => Math.max(w, r['File Name']?.length || 0), 10);
    worksheet['!cols'] = [
      { wch: 5 },  // S.No
      { wch: maxWidth + 5 },  // File Name
      { wch: 10 }, // Type
      { wch: 50 }, // Cloudinary URL
      { wch: 30 }, // Public ID
      { wch: 20 }, // Folder
      { wch: 20 }  // Upload Time
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Uploaded Media');
    
    // Download
    const fileName = `media_upload_${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Export existing products to Excel
  const exportProductsToExcel = async () => {
    setExportLoading(true);
    
    try {
      const response = await fetch('/api/admin/products/export');
      if (!response.ok) throw new Error('Failed to export products');
      
      const data = await response.json();
      
      if (data.success && data.products) {
        // Format products for Excel
        const excelData = data.products.map((product, index) => ({
          'S.No': index + 1,
          'Product Name': product.name,
          'Price': product.price,
          'MOQ': product.moq,
          'Category': product.category?.name || '',
          'Sub Category': product.subCategory?.name || '',
          'Thumbnail URL': product.thumbnail,
          'Image URLs': Array.isArray(product.images) ? product.images.join(', ') : '',
          'Video URL': product.video360 || '',
          'Services': Array.isArray(product.services) ? product.services.join(', ') : '',
          'Features': Array.isArray(product.features) ? product.features.join(', ') : '',
          'Availability': product.availability,
          'Description': product.description || '',
          'Created At': new Date(product.createdAt).toLocaleString()
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        
        // Auto-size columns
        const columnWidths = {
          'Product Name': 30,
          'Thumbnail URL': 50,
          'Image URLs': 60,
          'Video URL': 50,
          'Description': 40
        };
        
        const cols = Object.keys(excelData[0] || {}).map(key => ({
          wch: columnWidths[key] || 15
        }));
        worksheet['!cols'] = cols;

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        
        // Download
        const fileName = `products_export_${Date.now()}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        
        alert(`✅ Exported ${data.products.length} products successfully!`);
      } else {
        throw new Error(data.message || 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`❌ Export failed: ${error.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  // Handle bulk Excel upload
  const handleBulkUpload = async (e) => {
    e.preventDefault();
    
    if (!excelFile) {
      alert('Please select an Excel file');
      return;
    }

    setBulkLoading(true);
    setBulkResult(null); // Clear previous results
    
    try {
      const formData = new FormData();
      formData.append('file', excelFile);

      console.log('📤 Uploading Excel file:', excelFile.name);
      
      const response = await fetch('/api/admin/products/upload', {
        method: 'POST',
        body: formData,
      }); 

      console.log('📨 Response status:', response.status, response.statusText);
      
      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      // Try to parse JSON
      let data;
      try {
        const text = await response.text();
        console.log('📄 Raw response:', text.substring(0, 500));
        
        if (!text || text.trim() === '') {
          throw new Error('Empty response from server');
        }
        
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }

      setBulkResult(data);
      
      if (data.success) {
        alert(`✅ Successfully created ${data.created} products`);
        setExcelFile(null);
        if (bulkFileInputRef.current) {
          bulkFileInputRef.current.value = '';
        }
      } else {
        alert(`⚠️ ${data.message || 'Some products failed to upload'}`);
      }
    } catch (error) {
      console.error('❌ Bulk upload error:', error);
      alert(`❌ Failed to upload Excel file: ${error.message}`);
    } finally {
      setBulkLoading(false);
    }
  };

  // Download Excel template
  const downloadTemplate = () => {
    const templateData = [
      {
        'Product Name*': 'Sample Product',
        'Price*': '999.00',
        'MOQ': '1',
        'Category*': 'Furniture',
        'Sub Category': 'Chairs',
        'Thumbnail URL*': 'https://res.cloudinary.com/your-cloud/image/upload/v123/thumb.jpg',
        'Image URLs (comma separated)': 'https://res.cloudinary.com/your-cloud/image/upload/v123/img1.jpg,https://res.cloudinary.com/your-cloud/image/upload/v123/img2.jpg',
        'Video URL': 'https://res.cloudinary.com/your-cloud/video/upload/v123/video.mp4',
        'Services (comma separated)': 'Delivery,Installation',
        'Features (comma separated)': 'Durable,Water Resistant',
        'Availability': 'In Stock',
        'Description': 'Product description here',
        'Short Description': 'Short description',
        'God Name': 'Ganesha',
        'Color': 'Black',
        'Suitable For': 'Indoor',
        'Usage': 'Commercial',
        'Posture': 'Sitting',
        'Base Shape': 'Round',
        'Finish': 'Matte',
        'Appearance': 'Modern',
        'Care Instruction': 'Wipe clean',
        'Assembly Required': 'Yes',
        'Product Type': 'Furniture'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    
    // Auto-size columns
    const cols = Array(Object.keys(templateData[0]).length).fill({ wch: 25 });
    worksheet['!cols'] = cols;
    
    XLSX.writeFile(workbook, "product_upload_template.xlsx");
  };

  // Remove file from selection
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Remove uploaded media
  const removeUploadedMedia = (index) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all
  const clearAll = () => {
    setSelectedFiles([]);
    setUploadedMedia([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📦 Product Management Dashboard</h1>
          <p className="text-gray-600">Upload media, export products, or bulk upload via Excel</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {['media', 'bulk'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab === 'media' && '📤 Upload Media'}
              {tab === 'bulk' && '📊 Bulk Upload'}
            </button>
          ))}
        </div>

        {/* Media Upload Section */}
        {activeTab === 'media' && (
          <div className="space-y-8">
            {/* Upload Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Upload Media Files</h2>
                <div className="flex gap-3">
                  {selectedFiles.length > 0 && (
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload to Cloudinary'}
                    </button>
                  )}
                  {(selectedFiles.length > 0 || uploadedMedia.length > 0) && (
                    <button
                      onClick={clearAll}
                      className="px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {uploadProgress && (
                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">
                      Uploading {uploadProgress.fileName}...
                    </span>
                    <span className="text-sm font-medium text-blue-700">
                      {uploadProgress.current}/{uploadProgress.total} ({uploadProgress.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.percent}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* File Upload Area */}
              <div className="border-3 border-dashed border-blue-300 rounded-2xl p-8 text-center bg-blue-50 mb-8">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer block">
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    Drag & drop files or click to browse
                  </p>
                  <p className="text-gray-500 mb-4">
                    Supports images (JPG, PNG, GIF) and videos (MP4, MOV)
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-lg font-medium hover:bg-blue-50">
                    <span>Choose Files</span>
                  </div>
                </label>
              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-white hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {file.type.startsWith('image/') ? '🖼️' : '🎥'}
                          </div>
                          <div className="truncate">
                            <p className="font-medium text-sm truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded Media */}
              {uploadedMedia.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Uploaded Media ({uploadedMedia.length})
                    </h3>
                    <button
                      onClick={() => downloadMediaExcel()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    >
                      📥 Download Excel
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">File</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">URL</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {uploadedMedia.map((media, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="text-xl">
                                  {media.type === 'image' ? '🖼️' : '🎥'}
                                </div>
                                <span className="text-sm font-medium truncate max-w-xs">
                                  {media.originalName}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                media.type === 'image' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {media.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                readOnly
                                value={media.url}
                                className="w-full px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded truncate"
                                onClick={(e) => e.target.select()}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => removeUploadedMedia(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Remove"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 How to Use</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-3xl mb-2">1️⃣</div>
                  <h4 className="font-medium text-blue-800 mb-2">Select Files</h4>
                  <p className="text-sm text-blue-700">Choose images/videos from your computer</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-3xl mb-2">2️⃣</div>
                  <h4 className="font-medium text-green-800 mb-2">Upload to Cloudinary</h4>
                  <p className="text-sm text-green-700">Files automatically upload to your Cloudinary account</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-3xl mb-2">3️⃣</div>
                  <h4 className="font-medium text-purple-800 mb-2">Get Excel Sheet</h4>
                  <p className="text-sm text-purple-700">Download Excel with all Cloudinary URLs</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Upload Section */}
        {activeTab === 'bulk' && (
          <div className="space-y-8">
            {/* Template Download Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Excel Template</h2>
              <p className="text-gray-600 mb-6">
                Download our pre-formatted Excel template with all required columns.
                Fill in your product data and upload back.
              </p>
              <button
                onClick={downloadTemplate}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium shadow-lg"
              >
                <span className="text-xl">📥</span>
                <span>Download Excel Template</span>
              </button>
            </div>

            {/* Upload Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Upload Excel File</h2>
              
              <form onSubmit={handleBulkUpload} className="space-y-6">
                <div className="border-3 border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  <input
                    ref={bulkFileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => setExcelFile(e.target.files[0])}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label htmlFor="excel-upload" className="cursor-pointer block">
                    <div className="text-6xl mb-4">📄</div>
                    {excelFile ? (
                      <>
                        <p className="text-xl font-semibold text-gray-800 mb-2">
                          {excelFile.name}
                        </p>
                        <p className="text-gray-500 mb-4">
                          {(excelFile.size / 1024).toFixed(2)} KB • Ready to upload
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xl font-semibold text-gray-800 mb-2">
                          Drag & drop your Excel file here
                        </p>
                        <p className="text-gray-500 mb-4">
                          or click to browse files
                        </p>
                      </>
                    )}
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-400 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                      <span>Choose File</span>
                    </div>
                  </label>
                </div>

                {excelFile && (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-medium">{excelFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(excelFile.size / 1024).toFixed(2)} KB • Ready for upload
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setExcelFile(null);
                        if (bulkFileInputRef.current) {
                          bulkFileInputRef.current.value = '';
                        }
                      }}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bulkLoading || !excelFile}
                  className={`w-full py-3 rounded-lg font-medium text-lg ${
                    bulkLoading || !excelFile
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg'
                  } text-white transition-all`}
                >
                  {bulkLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                      Processing Excel File...
                    </span>
                  ) : '📤 Upload & Create Products'}
                </button>
              </form>

              {/* Results Display */}
              {bulkResult && (
                <div className="mt-8 border-t pt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Upload Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6 text-center">
                      <div className="text-4xl font-bold text-green-700 mb-2">{bulkResult.created}</div>
                      <div className="text-green-800 font-medium">Products Created</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-50 to-pink-100 border border-red-200 rounded-xl p-6 text-center">
                      <div className="text-4xl font-bold text-red-700 mb-2">{bulkResult.failed?.length || 0}</div>
                      <div className="text-red-800 font-medium">Failed</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 border border-blue-200 rounded-xl p-6 text-center">
                      <div className="text-4xl font-bold text-blue-700 mb-2">{bulkResult.total}</div>
                      <div className="text-blue-800 font-medium">Total Processed</div>
                    </div>
                  </div>
                  
                  {/* Error Details */}
                  {bulkResult.failed?.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <h4 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
                        <span>⚠️</span>
                        <span>Errors Found ({bulkResult.failed.length})</span>
                      </h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {bulkResult.failed.map((error, index) => (
                          <div key={index} className="bg-white border border-red-100 rounded-lg p-4">
                            <p className="text-red-700 font-medium">{error}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <span>💡</span>
                <span>Quick Tips for Bulk Upload</span>
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">✓</span>
                  <span className="text-amber-700">All image/video URLs must be publicly accessible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">✓</span>
                  <span className="text-amber-700">Thumbnail URL is required for every product</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">✓</span>
                  <span className="text-amber-700">Category names must match existing categories exactly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">✓</span>
                  <span className="text-amber-700">Use comma-separated values for arrays (images, services, features)</span>
                </li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}