'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition, RadioGroup } from '@headlessui/react';
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function StatusUpdateModal({ customer, isOpen, onClose, onUpdate }) {
  const [status, setStatus] = useState('approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!customer) return;
    
    setLoading(true);
    try {
      await onUpdate(customer._id, status, rejectionReason);
      onClose();
    } finally {
      setLoading(false);
    }
  };

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Update Status
                  </Dialog.Title>
                  <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-500">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900">{customer?.companyName}</p>
                    <p className="text-sm text-gray-500">{customer?.contactName} • {customer?.email}</p>
                  </div>

                  {/* Status Selection */}
                  <RadioGroup value={status} onChange={setStatus} className="space-y-4">
                    <RadioGroup.Label className="text-sm font-medium text-gray-900">
                      Select Status
                    </RadioGroup.Label>
                    
                    <RadioGroup.Option value="approved">
                      {({ checked }) => (
                        <div className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                          checked ? 'border-[#C08237] bg-[#FFF8F0]' : 'border-gray-200'
                        }`}>
                          <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                            checked ? 'border-[#C08237] bg-[#C08237]' : 'border-gray-300'
                          }`}>
                            {checked && <CheckCircleIcon className="h-3 w-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Approve</p>
                            <p className="text-xs text-gray-500">Customer will get access to their account</p>
                          </div>
                        </div>
                      )}
                    </RadioGroup.Option>

                    <RadioGroup.Option value="rejected">
                      {({ checked }) => (
                        <div className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                          checked ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}>
                          <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                            checked ? 'border-red-500 bg-red-500' : 'border-gray-300'
                          }`}>
                            {checked && <XCircleIcon className="h-3 w-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Reject</p>
                            <p className="text-xs text-gray-500">Customer will not get access</p>
                          </div>
                        </div>
                      )}
                    </RadioGroup.Option>
                  </RadioGroup>

                  {/* Rejection Reason */}
                  {status === 'rejected' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Reason for Rejection (Optional)
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows="3"
                        placeholder="Provide reason for rejection..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                        status === 'approved' 
                          ? 'bg-[#C08237] hover:bg-[#A56B2C]' 
                          : 'bg-red-600 hover:bg-red-700'
                      } disabled:opacity-50`}
                    >
                      {loading ? 'Updating...' : `Mark as ${status}`}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}