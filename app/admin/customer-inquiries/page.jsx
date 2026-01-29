"use client";
import React, { useEffect, useState } from "react";
import { 
  Eye, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Building, 
  Calendar, 
  Search, 
  Download, 
  Package,
  AlertCircle,
  RefreshCw,
  Phone,
  Mail,
  Globe,
  FileText,
  Users
} from "lucide-react";

const AdminCustomerInquiries = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Fetch contact inquiries
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/contact');
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch contact inquiries');
      }
    } catch (error) {
      console.error('Error fetching contact inquiries:', error);
      setError('Failed to fetch contact inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter contact inquiries
  const filteredContacts = contacts.filter(contact => {
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesType = typeFilter === 'all' || contact.inquiryType === typeFilter;
    const matchesSource = sourceFilter === 'all' || contact.source === sourceFilter;
    const matchesSearch = !searchTerm || 
      contact.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.contactPersonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.businessEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.country?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSource && matchesSearch;
  });

  // Handle status update
  const handleStatusUpdate = async (contactId, status, adminNotes) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId,
          status,
          adminNotes
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the contact in the list
        setContacts(prev => prev.map(contact => 
          contact._id === contactId 
            ? { ...contact, status, adminNotes, respondedAt: data.data.respondedAt }
            : contact
        ));
        setShowStatusModal(false);
        setSelectedContact(null);
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  // Handle CSV download
  const handleDownloadCSV = async (contact) => {
    try {
      // Create CSV content
      const csvContent = [
        // Headers
        ['Field', 'Value'],
        ['Company Name', contact.companyName || ''],
        ['Contact Person', contact.contactPersonName || ''],
        ['Business Email', contact.businessEmail || ''],
        ['Phone', contact.phone || ''],
        ['Country', contact.country || ''],
        ['Inquiry Type', contact.inquiryType?.replace('_', ' ') || ''],
        ['Product Category', contact.productCategory?.replace('_', ' ') || ''],
        ['Estimated Quantity', contact.estimatedQuantity || ''],
        ['Customization Required', contact.customizationRequired?.replace('_', ' ') || ''],
        ['Message', contact.message || ''],
        ['Status', contact.status || ''],
        ['Source', contact.source || ''],
        ['Created At', new Date(contact.createdAt).toLocaleString()],
        ['Admin Notes', contact.adminNotes || ''],
        ['Responded At', contact.respondedAt ? new Date(contact.respondedAt).toLocaleString() : '']
      ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Contact_${contact.companyName || 'Unknown'}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV');
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      reviewed: { color: 'bg-blue-100 text-blue-800', icon: Eye },
      responded: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      closed: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };
    
    // Handle undefined/null status
    const safeStatus = status || 'pending';
    const config = statusConfig[safeStatus] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
      </span>
    );
  };

  // Get inquiry type badge
  const getTypeBadge = (type) => {
    const typeConfig = {
      bulk_order: { color: 'bg-blue-100 text-blue-800', label: 'Bulk Order' },
      custom_design: { color: 'bg-purple-100 text-purple-800', label: 'Custom Design' },
      wholesale: { color: 'bg-green-100 text-green-800', label: 'Wholesale' },
      private_label: { color: 'bg-pink-100 text-pink-800', label: 'Private Label' },
      corporate_project: { color: 'bg-indigo-100 text-indigo-800', label: 'Corporate Project' },
      other: { color: 'bg-gray-100 text-gray-800', label: 'Other' }
    };
    
    const config = typeConfig[type] || typeConfig.other;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Get product category badge
  const getCategoryBadge = (category) => {
    const categoryConfig = {
      elephant_figurines: { color: 'bg-amber-100 text-amber-800', label: 'Elephant Figurines' },
      god_figurines: { color: 'bg-orange-100 text-orange-800', label: 'God Figurines' },
      utility_decor: { color: 'bg-teal-100 text-teal-800', label: 'Utility Decor' },
      animal_figurines: { color: 'bg-emerald-100 text-emerald-800', label: 'Animal Figurines' },
      all_categories: { color: 'bg-violet-100 text-violet-800', label: 'All Categories' },
      other: { color: 'bg-gray-100 text-gray-800', label: 'Other' }
    };
    
    const config = categoryConfig[category] || categoryConfig.other;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Get source badge
  const getSourceBadge = (source) => {
    const sourceConfig = {
      contact_page: { color: 'bg-blue-100 text-blue-800', label: 'Contact Page' },
      home_page_bulk_section: { color: 'bg-green-100 text-green-800', label: 'Home Bulk Section' }
    };
    
    const config = sourceConfig[source] || sourceConfig.contact_page;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-[#C08237]" />
          <span className="text-lg text-gray-600">Loading contact inquiries...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Customer Contact Inquiries</h1>
            <p className="text-[#A49C93] text-lg">Manage and respond to customer contact inquiries and business requests</p>
          </div>
          <button
            onClick={fetchContacts}
            className="flex items-center px-6 py-3 bg-[#C08237] text-white rounded-lg hover:bg-[#A56B2C] transition-colors shadow-md"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-[#D7CEC2] p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#A49C93]">Pending</p>
              <p className="text-2xl font-bold text-[#8B4513]">
                {contacts.filter(c => c.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-[#D7CEC2] p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#A49C93]">Reviewed</p>
              <p className="text-2xl font-bold text-[#8B4513]">
                {contacts.filter(c => c.status === 'reviewed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-[#D7CEC2] p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#A49C93]">Responded</p>
              <p className="text-2xl font-bold text-[#8B4513]">
                {contacts.filter(c => c.status === 'responded').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-[#D7CEC2] p-6">
          <div className="flex items-center">
            <div className="p-3 bg-[#FFF8F0] rounded-lg">
              <MessageSquare className="w-6 h-6 text-[#C08237]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#A49C93]">Total</p>
              <p className="text-2xl font-bold text-[#8B4513]">{contacts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D7CEC2] p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A49C93] w-4 h-4" />
            <input
              type="text"
              placeholder="Search by company, contact, email, country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#D7CEC2] rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-[#C08237] transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-[#D7CEC2] rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-[#C08237] transition-colors"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-3 border border-[#D7CEC2] rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-[#C08237] transition-colors"
            >
              <option value="all">All Types</option>
              <option value="bulk_order">Bulk Order</option>
              <option value="custom_design">Custom Design</option>
              <option value="wholesale">Wholesale</option>
              <option value="private_label">Private Label</option>
              <option value="corporate_project">Corporate Project</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-4 py-3 border border-[#D7CEC2] rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-[#C08237] transition-colors"
            >
              <option value="all">All Sources</option>
              <option value="contact_page">Contact Page</option>
              <option value="home_page_bulk_section">Home Bulk Section</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-end">
            <div className="bg-[#FFF8F0] px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-[#C08237]">
                {filteredContacts.length} of {contacts.length} contacts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Inquiries List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredContacts.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contact inquiries found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || sourceFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Customer contact inquiries will appear here when they are submitted.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inquiry Type & Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requirements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    {/* Customer Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-[#C08237] flex items-center justify-center">
                            <Building className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.companyName || 'Unknown Company'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {contact.contactPersonName || 'Unknown Contact'}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {contact.businessEmail || 'No email'}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {contact.phone || 'No phone'}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            {contact.country || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Inquiry Type & Category */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {getTypeBadge(contact.inquiryType)}
                        {getCategoryBadge(contact.productCategory)}
                      </div>
                    </td>

                    {/* Requirements */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">Qty:</span> {contact.estimatedQuantity || 'Not specified'}
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Customization:</span> {contact.customizationRequired?.replace(/_/g, ' ') || 'None'}
                        </div>
                        {contact.referenceFiles && contact.referenceFiles.length > 0 && (
                          <div className="text-xs text-blue-600 flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {contact.referenceFiles.length} file(s) attached
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status & Source */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        {getStatusBadge(contact.status)}
                        {getSourceBadge(contact.source)}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(contact.createdAt).toLocaleTimeString()}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* View Details */}
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowDetailModal(true);
                          }}
                          className="text-[#C08237] hover:text-[#A56B2C] p-1 rounded"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Update Status */}
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowStatusModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="Update Status"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>

                        {/* Download CSV */}
                        <button
                          onClick={() => handleDownloadCSV(contact)}
                          className="text-green-600 hover:text-green-800 p-1 rounded"
                          title="Download CSV Report"
                        >
                          <Download className="h-4 w-4" />
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

      {/* Contact Detail Modal - Simple for now */}
      {selectedContact && showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#8B4513]">Contact Inquiry Details</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedContact(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Information */}
              <div className="bg-[#FFF6EB] p-4 rounded-lg">
                <h3 className="font-semibold text-[#8B4513] mb-3 flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Business Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Company:</span> {selectedContact.companyName}</p>
                  <p><span className="font-medium">Contact Person:</span> {selectedContact.contactPersonName}</p>
                  <p><span className="font-medium">Email:</span> {selectedContact.businessEmail}</p>
                  <p><span className="font-medium">Phone:</span> {selectedContact.phone}</p>
                  <p><span className="font-medium">Country:</span> {selectedContact.country}</p>
                </div>
              </div>

              {/* Inquiry Details */}
              <div className="bg-[#F0F9FF] p-4 rounded-lg">
                <h3 className="font-semibold text-[#8B4513] mb-3 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Inquiry Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Type:</span> {selectedContact.inquiryType?.replace('_', ' ')}</p>
                  <p><span className="font-medium">Category:</span> {selectedContact.productCategory?.replace('_', ' ')}</p>
                  <p><span className="font-medium">Quantity:</span> {selectedContact.estimatedQuantity}</p>
                  <p><span className="font-medium">Customization:</span> {selectedContact.customizationRequired?.replace('_', ' ')}</p>
                  <p><span className="font-medium">Source:</span> {selectedContact.source?.replace('_', ' ')}</p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-[#8B4513] mb-3">Customer Message</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
            </div>

            {/* Reference Files */}
            {selectedContact.referenceFiles && selectedContact.referenceFiles.length > 0 && (
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#8B4513] mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Reference Files ({selectedContact.referenceFiles.length})
                </h3>
                <div className="space-y-2">
                  {selectedContact.referenceFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                      <span className="text-sm">{file.originalName}</span>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#C08237] hover:text-[#A56B2C] text-sm"
                      >
                        View File
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {selectedContact.adminNotes && (
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#8B4513] mb-3">Admin Notes</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedContact.adminNotes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => handleDownloadCSV(selectedContact)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setShowStatusModal(true);
                }}
                className="px-4 py-2 bg-[#C08237] text-white rounded-lg hover:bg-[#A56B2C] flex items-center"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal - Simple for now */}
      {selectedContact && showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#8B4513]">Update Status</h2>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedContact(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const status = formData.get('status');
              const adminNotes = formData.get('adminNotes');
              handleStatusUpdate(selectedContact._id, status, adminNotes);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    defaultValue={selectedContact.status}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-[#C08237]"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="responded">Responded</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <textarea
                    name="adminNotes"
                    defaultValue={selectedContact.adminNotes || ''}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-[#C08237]"
                    placeholder="Add notes about this inquiry..."
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedContact(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C08237] text-white rounded-lg hover:bg-[#A56B2C]"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomerInquiries;