"use client";
import React, { useState } from "react";
import { X, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";

const InquiryStatusModal = ({ inquiry, isOpen, onClose, onUpdate }) => {
  const [status, setStatus] = useState(inquiry?.status || 'pending');
  const [adminNotes, setAdminNotes] = useState(inquiry?.adminNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !inquiry) return null;

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
    { value: 'reviewed', label: 'Reviewed', icon: MessageSquare, color: 'text-blue-600' },
    { value: 'responded', label: 'Responded', icon: CheckCircle, color: 'text-green-600' },
    { value: 'closed', label: 'Closed', icon: XCircle, color: 'text-gray-600' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdate(inquiry._id, status, adminNotes);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Update Inquiry Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Inquiry Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Inquiry Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Company:</span> {inquiry.user?.companyName || 'N/A'}</p>
              <p><span className="font-medium">Contact:</span> {inquiry.user?.contactName || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {inquiry.user?.businessEmail || 'N/A'}</p>
              <p><span className="font-medium">Type:</span> {inquiry.inquiryType?.replace(/_/g, ' ') || 'N/A'}</p>
            </div>
          </div>

          {/* Status Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Update Status
            </label>
            <div className="space-y-2">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      status === option.value
                        ? 'border-[#C08237] bg-[#FFF8F0]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={status === option.value}
                      onChange={(e) => setStatus(e.target.value)}
                      className="sr-only"
                    />
                    <Icon className={`w-5 h-5 mr-3 ${option.color}`} />
                    <span className="text-sm font-medium text-gray-900">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="mb-6">
            <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes (Optional)
            </label>
            <textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C08237] focus:border-transparent resize-none"
              placeholder="Add any internal notes about this inquiry..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#C08237] rounded-lg hover:bg-[#A56B2C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InquiryStatusModal;