"use client";
import React, { useEffect, useState } from "react";
import { Eye, MessageSquare, Clock, CheckCircle, XCircle, Package, User, Mail, Phone, Building, Calendar, Filter, Search, Download } from "lucide-react";

const AdminInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/inquiry");
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInquiryReport = async (inquiryId, companyName) => {
    try {
      const response = await fetch(`/api/admin/inquiry?inquiryId=${inquiryId}&downloadExcel=true`);
      
      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Ratoomal_Inquiry_${companyName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Unknown_Company'}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    }
  };

  const debugInquiry = async (inquiryId) => {
    try {
      console.log(`🔍 Starting debug for inquiry: ${inquiryId}`);
      const response = await fetch(`/api/admin/inquiry?inquiryId=${inquiryId}&debug=true`);
      const data = await response.json();
      
      if (data.success) {
        console.log('🔍 DEBUG RESULTS FOR INQUIRY:', inquiryId);
        console.log('📋 Company:', data.debug.companyName);
        console.log('📊 Expected Products:', data.debug.summary.expectedProducts);
        console.log('📊 Processed Products:', data.debug.summary.processedProducts);
        console.log('✅ Found Products:', data.debug.summary.foundProducts);
        console.log('❌ Not Found Products:', data.debug.summary.productsNotFound);
        console.log('🎯 All Products Found:', data.debug.summary.allProductsFound);
        console.log('');
        console.log('📦 RAW CART PRODUCTS:', data.debug.rawCartProducts);
        console.log('');
        console.log('🔍 DETAILED PRODUCT ANALYSIS:');
        data.debug.productsWithDetails.forEach((product, index) => {
          console.log(`Product ${product.index}:`);
          console.log(`  - ID: ${product.cartProduct.productId}`);
          console.log(`  - Quantity: ${product.cartProduct.quantity}`);
          console.log(`  - Sizes: ${JSON.stringify(product.cartProduct.selectedSizes)}`);
          console.log(`  - Found: ${product.found ? '✅' : '❌'}`);
          console.log(`  - Name: ${product.productName}`);
          console.log(`  - Code: ${product.productCode}`);
          if (product.error) {
            console.log(`  - Error: ${product.error}`);
          }
          console.log('');
        });
        
        alert(`Debug completed! Check console for details.\n\nSummary:\n- Expected: ${data.debug.summary.expectedProducts} products\n- Found: ${data.debug.summary.foundProducts} products\n- Missing: ${data.debug.summary.productsNotFound} products\n- All Found: ${data.debug.summary.allProductsFound ? 'Yes' : 'No'}`);
      } else {
        console.error('❌ Debug failed:', data.error);
        alert('Failed to get debug info: ' + data.error);
      }
    } catch (error) {
      console.error('❌ Error getting debug info:', error);
      alert('Error getting debug info: ' + error.message);
    }
  };

  const updateInquiryStatus = async (inquiryId, newStatus, adminNotes = '') => {
    try {
      setUpdatingStatus(true);
      const res = await fetch("/api/admin/inquiry", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inquiryId,
          status: newStatus,
          adminNotes
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        setInquiries(prev => prev.map(inq => 
          inq._id === inquiryId ? { ...inq, status: newStatus, adminNotes } : inq
        ));
        setShowModal(false);
        setSelectedInquiry(null);
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'responded': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'responded': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    const matchesSearch = !searchTerm || 
      inquiry.user?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.user?.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.user?.businessEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const InquiryModal = () => {
    if (!selectedInquiry) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl playfair font-bold text-gray-900">Inquiry Details</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Submitted on {new Date(selectedInquiry.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - User Details */}
              <div className="space-y-6">
                {/* User Information */}
                <div className="bg-[#FFF6EB] p-4 rounded-lg">
                  <h3 className="text-lg mona font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-[#bf8e44]" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Company:</span>
                      <span className="text-sm text-gray-900 ml-2">{selectedInquiry.user?.companyName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Contact:</span>
                      <span className="text-sm text-gray-900 ml-2">{selectedInquiry.user?.contactName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Email:</span>
                      <span className="text-sm text-gray-900 ml-2">{selectedInquiry.user?.businessEmail || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Phone:</span>
                      <span className="text-sm text-gray-900 ml-2">{selectedInquiry.user?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700">Country:</span>
                      <span className="text-sm text-gray-900 ml-2">{selectedInquiry.user?.country || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700">Business Type:</span>
                      <span className="text-sm text-gray-900 ml-2">{selectedInquiry.user?.businessType || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Inquiry Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg mona font-semibold text-gray-900 mb-4">Inquiry Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Inquiry For:</span>
                      <span className="text-sm text-gray-900 ml-2 capitalize">{selectedInquiry.inquiryFor?.replace('_', ' ') || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Customization:</span>
                      <span className="text-sm text-gray-900 ml-2 capitalize">{selectedInquiry.customizationNeeded?.replace('_', ' ') || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Total Products:</span>
                      <span className="text-sm text-gray-900 ml-2">{selectedInquiry.totalProducts || 0}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Total Quantity:</span>
                      <span className="text-sm text-gray-900 ml-2">{selectedInquiry.totalQuantity || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Products & Message */}
              <div className="space-y-6">
                {/* Cart Products */}
                {selectedInquiry.cartProducts && selectedInquiry.cartProducts.length > 0 && (
                  <div className="bg-white border border-gray-200 p-4 rounded-lg">
                    <h3 className="text-lg mona font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-[#bf8e44]" />
                      Requested Products ({selectedInquiry.cartProducts.length})
                    </h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {selectedInquiry.cartProducts.map((product, index) => (
                        <div key={index} className="border border-gray-100 p-4 rounded-lg">
                          <div className="flex space-x-4">
                            {/* Product Image */}
                            <div className="shrink-0">
                              <img
                                src={product.productDetails?.images?.[0] || product.productDetails?.thumbnail || '/images/placeholder.png'}
                                alt={product.productDetails?.name || 'Product'}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  e.target.src = '/images/placeholder.png';
                                }}
                              />
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {product.productDetails?.name || 'Product not found'}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Code: {product.productDetails?.code || product.productId}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Category: {product.productDetails?.category?.name || 'N/A'}
                                  </p>
                                  {product.productDetails?.subCategory?.name && (
                                    <p className="text-xs text-gray-500">
                                      Sub Category: {product.productDetails.subCategory.name}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-600 mt-1">
                                    Quantity: <span className="font-medium">{product.quantity}</span>
                                  </p>
                                </div>
                              </div>
                              
                              {/* Sizes - Enhanced Display with Better Visibility */}
                              {product.selectedSizes && product.selectedSizes.length > 0 ? (
                                <div className="mt-3 p-3 bg-[#FFF6EB] rounded-lg border border-[#bf8e44]/20">
                                  <div className="flex items-center mb-2">
                                    <Package className="h-4 w-4 mr-2 text-[#bf8e44]" />
                                    <p className="text-sm font-semibold text-[#bf8e44]">
                                      Selected Sizes ({product.selectedSizes.length})
                                    </p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {product.selectedSizes.map((size, sizeIndex) => (
                                      <span 
                                        key={sizeIndex} 
                                        className="inline-flex items-center px-3 py-1.5 bg-[#bf8e44] text-white text-sm font-medium rounded-full shadow-sm hover:bg-[#a67a38] transition-colors duration-200 border border-[#a67a38]"
                                      >
                                        {size}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-xs text-gray-600 mt-2 italic">
                                    Total {product.selectedSizes.length} size{product.selectedSizes.length !== 1 ? 's' : ''} selected
                                  </p>
                                </div>
                              ) : (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <div className="flex items-center">
                                    <Package className="h-4 w-4 mr-2 text-gray-500" />
                                    <p className="text-sm text-gray-600 font-medium">
                                      Standard Size
                                    </p>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    No specific size requirements
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <h3 className="text-lg mona font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-[#bf8e44]" />
                    Customer Message
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedInquiry.message || 'No message provided'}
                  </p>
                </div>

                {/* Admin Notes */}
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h3 className="text-lg mona font-semibold text-gray-900 mb-4">Admin Notes</h3>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={3}
                    placeholder="Add internal notes about this inquiry..."
                    defaultValue={selectedInquiry.adminNotes || ''}
                    id="adminNotes"
                  />
                </div>
              </div>
            </div>

            {/* Status Update Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Current Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedInquiry.status)} flex items-center space-x-1`}>
                    {getStatusIcon(selectedInquiry.status)}
                    <span className="capitalize">{selectedInquiry.status}</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  
                
                  
                  {/* Download Button */}
                  <button
                    onClick={() => downloadInquiryReport(selectedInquiry._id, selectedInquiry.user?.companyName)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download CSV</span>
                  </button>
                  
                  {/* Status Update Buttons */}
                  {selectedInquiry.status !== 'reviewed' && (
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry._id, 'reviewed', document.getElementById('adminNotes')?.value)}
                      disabled={updatingStatus}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      Mark as Reviewed
                    </button>
                  )}
                  {selectedInquiry.status !== 'responded' && (
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry._id, 'responded', document.getElementById('adminNotes')?.value)}
                      disabled={updatingStatus}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                    >
                      Mark as Responded
                    </button>
                  )}
                  {selectedInquiry.status !== 'closed' && (
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry._id, 'closed', document.getElementById('adminNotes')?.value)}
                      disabled={updatingStatus}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 text-sm"
                    >
                      Close Inquiry
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf8e44]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[white] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl playfair font-bold text-gray-900 mb-2">Product Inquiries</h1>
          <p className="text-gray-600 mona">Manage customer inquiries and cart-based requests</p>
        </div>
           {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {inquiries.filter(inq => inq.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Reviewed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {inquiries.filter(inq => inq.status === 'reviewed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Responded</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {inquiries.filter(inq => inq.status === 'responded').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-gray-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Closed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {inquiries.filter(inq => inq.status === 'closed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#bf8e44]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="responded">Responded</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by company, contact, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#bf8e44] w-64"
              />
            </div>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquiry Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No inquiries found
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inquiry) => (
                    <tr key={inquiry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {inquiry.user?.companyName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {inquiry.user?.contactName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {inquiry.user?.businessEmail || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 capitalize">
                          {inquiry.inquiryFor?.replace('_', ' ') || inquiry.inquiryType || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {inquiry.totalProducts || inquiry.cartProducts?.length || 0} products
                        </div>
                        {inquiry.cartProducts && inquiry.cartProducts.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {inquiry.cartProducts.slice(0, 2).map((product, idx) => (
                              <div key={idx} className="truncate">
                                {product.productDetails?.name || `Product ${product.productId}`}
                                {product.selectedSizes && product.selectedSizes.length > 0 && (
                                  <span className="ml-1 text-[#bf8e44] font-medium">
                                    ({product.selectedSizes.length} size{product.selectedSizes.length !== 1 ? 's' : ''})
                                  </span>
                                )}
                              </div>
                            ))}
                            {inquiry.cartProducts.length > 2 && (
                              <div className="text-gray-400">
                                +{inquiry.cartProducts.length - 2} more...
                              </div>
                            )}
                          </div>
                        )}
                        {inquiry.product && (
                          <div className="text-sm text-gray-500">
                            {inquiry.product.name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {inquiry.totalQuantity || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(inquiry.status)} flex items-center space-x-1 w-fit`}>
                          {getStatusIcon(inquiry.status)}
                          <span className="capitalize">{inquiry.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(inquiry.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setShowModal(true);
                            }}
                            className="text-[#bf8e44] hover:text-[#a67a38] text-sm font-medium flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => downloadInquiryReport(inquiry._id, inquiry.user?.companyName)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1"
                          >
                            <Download className="h-4 w-4" />
                            <span>CSV</span>
                          </button>
                         
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

     
      </div>

      {/* Modal */}
      {showModal && <InquiryModal />}
    </div>
  );
};

export default AdminInquiry;
