'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, DocumentIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

export default function CustomerDetailModal({ customer, isOpen, onClose, onReview }) {
  if (!customer) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-gray-900">
                      Customer Details
                    </Dialog.Title>
                    <p className="text-sm text-gray-500">
                      Registration ID: {customer._id}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Company Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">Company Name</label>
                        <p className="text-sm font-medium">{customer.companyName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Business Type</label>
                        <p className="text-sm font-medium">{customer.businessType}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Purpose</label>
                        <p className="text-sm font-medium">{customer.purpose}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Registration Date</label>
                        <p className="text-sm font-medium">
                          {format(parseISO(customer.createdAt), 'PPpp')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">Contact Person</label>
                        <p className="text-sm font-medium">{customer.contactName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Email</label>
                        <p className="text-sm font-medium">{customer.businessEmail}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Phone</label>
                        <p className="text-sm font-medium">{customer.phone}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Country</label>
                        <p className="text-sm font-medium">{customer.country}</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Verification Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">Verification Proof Type</label>
                        <p className="text-sm font-medium">{customer.verificationProof}</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Image */}
                  {customer.verificationImage && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Verification Image</h3>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col gap-4">
                          {/* Image Preview */}
                          <div className="bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center h-48">
                            <img 
                              src={customer.verificationImage} 
                              alt="Verification" 
                              className="h-full w-full object-contain"
                            />
                          </div>
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <a
                              href={customer.verificationImage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-4 py-2 text-sm text-center bg-[#C08237] text-white rounded-lg hover:bg-[#A56B2C] transition-colors"
                            >
                              View Image
                            </a>
                            <a
                              href={customer.verificationImage}
                              download={`verification_${customer.companyName.replace(/\s+/g, '_')}`}
                              className="flex-1 px-4 py-2 text-sm text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Current Status */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Current Status</h4>
                        <div className="flex items-center mt-1">
                          <CheckCircleIcon className={`h-5 w-5 mr-2 ${
                            customer.status === 'approved' ? 'text-green-500' :
                            customer.status === 'rejected' ? 'text-red-500' :
                            'text-yellow-500'
                          }`} />
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                            customer.status === 'approved' ? 'bg-green-100 text-green-800' :
                            customer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      {customer.status === 'pending' && (
                        <button
                          onClick={onReview}
                          className="px-4 py-2 bg-[#C08237] text-white rounded-lg hover:bg-[#A56B2C] transition-colors"
                        >
                          Review Application
                        </button>
                      )}
                    </div>
                    {customer.status === 'rejected' && customer.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs font-medium text-red-800 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-red-700">{customer.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}