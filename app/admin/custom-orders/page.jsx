// "use client";
// import React, { useState, useEffect } from 'react';
// import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

// const CustomOrdersPanel = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [filters, setFilters] = useState({
//     status: 'all',
//     search: '',
//     page: 1,
//     limit: 10
//   });

//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 1
//   });

//   useEffect(() => {
//     fetchOrders();
//   }, [filters]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const queryParams = new URLSearchParams({
//         status: filters.status,
//         page: filters.page,
//         limit: filters.limit
//       });

//       const response = await fetch(`/api/admin/custom-orders?${queryParams}`);
//       const data = await response.json();

//       if (data.success) {
//         setOrders(data.orders);
//         setPagination(data.pagination);
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       const response = await fetch(`/api/admin/custom-orders/${orderId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status })
//       });

//       if (response.ok) {
//         fetchOrders();
//         if (selectedOrder && selectedOrder._id === orderId) {
//           setSelectedOrder({ ...selectedOrder, status });
//         }
//       }
//     } catch (error) {
//       console.error('Error updating order:', error);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'contacted': return 'bg-blue-100 text-blue-800';
//       case 'in_progress': return 'bg-purple-100 text-purple-800';
//       case 'completed': return 'bg-green-100 text-green-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'pending': return <Clock className="h-4 w-4" />;
//       case 'contacted': return <Eye className="h-4 w-4" />;
//       case 'completed': return <CheckCircle className="h-4 w-4" />;
//       case 'rejected': return <XCircle className="h-4 w-4" />;
//       default: return null;
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Orders</h1>
//           <p className="text-gray-600">Manage and track all custom order inquiries</p>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by company, contact person, or email..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C18E4D] focus:border-transparent"
//                   value={filters.search}
//                   onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//                 />
//               </div>
//             </div>
//             <div className="flex gap-4">
//               <div className="relative">
//                 <select
//                   className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#C18E4D] focus:border-transparent"
//                   value={filters.status}
//                   onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//                 >
//                   <option value="all">All Status</option>
//                   <option value="pending">Pending</option>
//                   <option value="contacted">Contacted</option>
//                   <option value="in_progress">In Progress</option>
//                   <option value="completed">Completed</option>
//                   <option value="rejected">Rejected</option>
//                 </select>
//                 <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//               </div>
//               <button className="flex items-center gap-2 px-4 py-2 bg-[#C18E4D] text-white rounded-md hover:bg-[#A67B42] transition">
//                 <Download className="h-4 w-4" />
//                 Export
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
//             <div className="text-sm text-gray-600">Total Orders</div>
//           </div>
//           <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
//             <div className="text-2xl font-bold text-yellow-800">
//               {orders.filter(o => o.status === 'pending').length}
//             </div>
//             <div className="text-sm text-yellow-600">Pending</div>
//           </div>
//           <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
//             <div className="text-2xl font-bold text-blue-800">
//               {orders.filter(o => o.status === 'contacted').length}
//             </div>
//             <div className="text-sm text-blue-600">Contacted</div>
//           </div>
//           <div className="bg-green-50 p-4 rounded-lg shadow-sm">
//             <div className="text-2xl font-bold text-green-800">
//               {orders.filter(o => o.status === 'completed').length}
//             </div>
//             <div className="text-sm text-green-600">Completed</div>
//           </div>
//           <div className="bg-red-50 p-4 rounded-lg shadow-sm">
//             <div className="text-2xl font-bold text-red-800">
//               {orders.filter(o => o.status === 'rejected').length}
//             </div>
//             <div className="text-sm text-red-600">Rejected</div>
//           </div>
//         </div>

//         {/* Orders Table */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           {loading ? (
//             <div className="p-8 text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C18E4D] mx-auto"></div>
//               <p className="mt-2 text-gray-600">Loading orders...</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Company
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Contact
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Inquiry Type
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {orders.map((order) => (
//                     <tr key={order._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {new Date(order.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">{order.companyName}</div>
//                         <div className="text-sm text-gray-500">{order.email}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{order.contactPerson}</div>
//                         <div className="text-sm text-gray-500">{order.phone}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {order.inquiryType}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                           {getStatusIcon(order.status)}
//                           {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           onClick={() => setSelectedOrder(order)}
//                           className="text-[#C18E4D] hover:text-[#A67B42] mr-4"
//                         >
//                           View Details
//                         </button>
//                         {order.status === 'pending' && (
//                           <button
//                             onClick={() => updateOrderStatus(order._id, 'contacted')}
//                             className="text-green-600 hover:text-green-900"
//                           >
//                             Mark Contacted
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Pagination */}
//           {orders.length > 0 && (
//             <div className="px-6 py-4 border-t border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm text-gray-700">
//                   Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
//                   <span className="font-medium">
//                     {Math.min(pagination.page * pagination.limit, pagination.total)}
//                   </span>{' '}
//                   of <span className="font-medium">{pagination.total}</span> results
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
//                     disabled={filters.page === 1}
//                     className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Previous
//                   </button>
//                   <button
//                     onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
//                     disabled={filters.page >= pagination.pages}
//                     className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Order Details Modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-6">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
//                   <p className="text-gray-600">ID: {selectedOrder._id}</p>
//                 </div>
//                 <button
//                   onClick={() => setSelectedOrder(null)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Company Name</label>
//                       <p className="text-gray-900">{selectedOrder.companyName}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Contact Person</label>
//                       <p className="text-gray-900">{selectedOrder.contactPerson}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Email</label>
//                       <p className="text-gray-900">{selectedOrder.email}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Phone</label>
//                       <p className="text-gray-900">{selectedOrder.phone}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Country</label>
//                       <p className="text-gray-900">{selectedOrder.country}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Inquiry Type</label>
//                       <p className="text-gray-900">{selectedOrder.inquiryType}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Product Category</label>
//                       <p className="text-gray-900">{selectedOrder.productCategory}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Order Quantity</label>
//                       <p className="text-gray-900">{selectedOrder.orderQuantity}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Customization</label>
//                       <p className="text-gray-900">{selectedOrder.customizationRequired}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Status</label>
//                       <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
//                         {getStatusIcon(selectedOrder.status)}
//                         {selectedOrder.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Message</h3>
//                 <div className="bg-gray-50 p-4 rounded-md">
//                   <p className="text-gray-700">{selectedOrder.message}</p>
//                 </div>
//               </div>

//               {selectedOrder.files && selectedOrder.files.length > 0 && (
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Attached Files</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedOrder.files.map((file, index) => (
//                       <a
//                         key={index}
//                         href={file.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 flex items-center gap-2"
//                       >
//                         📎 {file.name || `File ${index + 1}`}
//                       </a>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
//                 <button
//                   onClick={() => setSelectedOrder(null)}
//                   className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                 >
//                   Close
//                 </button>
//                 <div className="flex gap-2">
//                   {selectedOrder.status === 'pending' && (
//                     <button
//                       onClick={() => updateOrderStatus(selectedOrder._id, 'contacted')}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                     >
//                       Mark as Contacted
//                     </button>
//                   )}
//                   <button
//                     onClick={() => updateOrderStatus(selectedOrder._id, 'completed')}
//                     className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//                   >
//                     Mark as Completed
//                   </button>
//                   <button
//                     onClick={() => updateOrderStatus(selectedOrder._id, 'rejected')}
//                     className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                   >
//                     Reject
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomOrdersPanel;

// "use client";
// import React, { useState, useEffect } from "react";
// import { Search, Filter, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

// const THEME = "#C08237";

// const CustomOrdersPanel = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const [filters, setFilters] = useState({
//     status: "all",
//     search: "",
//     page: 1,
//     limit: 10,
//   });

//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 1,
//   });

//   useEffect(() => {
//     fetchOrders();
//   }, [filters.page, filters.limit, filters.status]);

//   useEffect(() => {
//     const t = setTimeout(fetchOrders, 400);
//     return () => clearTimeout(t);
//   }, [filters.search]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams({
//         page: filters.page,
//         limit: filters.limit,
//       });

//       if (filters.status !== "all") params.append("status", filters.status);
//       if (filters.search.trim()) params.append("search", filters.search.trim());

//       const res = await fetch(`/api/admin/custom-orders?${params}`);
//       const data = await res.json();

//       if (data.success) {
//         setOrders(data.orders);
//         setPagination(data.pagination);
//       }
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateOrderStatus = async (id, status) => {
//     await fetch(`/api/admin/custom-orders/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status }),
//     });
//     fetchOrders();
//     if (selectedOrder?._id === id)
//       setSelectedOrder({ ...selectedOrder, status });
//   };

//   const statusStyle = (s) => {
//     const map = {
//       pending: "bg-yellow-100 text-yellow-800",
//       contacted: "bg-blue-100 text-blue-800",
//       completed: "bg-green-100 text-green-800",
//       rejected: "bg-red-100 text-red-800",
//     };
//     return map[s] || "bg-gray-100 text-gray-700";
//   };

//   const statusIcon = (s) => {
//     if (s === "pending") return <Clock size={14} />;
//     if (s === "contacted") return <Eye size={14} />;
//     if (s === "completed") return <CheckCircle size={14} />;
//     if (s === "rejected") return <XCircle size={14} />;
//   };

//   return (
//     <div className="p-4 md:p-6  min-h-screen">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="mb-6">
//           <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
//             Custom Orders
//           </h1>
//           <p className="text-sm text-gray-600">
//             Manage all custom order inquiries
//           </p>
//         </div>

//         {/* FILTER BAR */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//               <input
//                 className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:border-transparent"
//                 style={{ "--tw-ring-color": THEME }}
//                 placeholder="Search company / contact / email"
//                 value={filters.search}
//                 onChange={(e) =>
//                   setFilters({ ...filters, search: e.target.value, page: 1 })
//                 }
//               />
//             </div>

//             <div className="relative">
//               <select
//                 className="border rounded-md px-4 py-2 pr-10 focus:ring-2"
//                 style={{ "--tw-ring-color": THEME }}
//                 value={filters.status}
//                 onChange={(e) =>
//                   setFilters({ ...filters, status: e.target.value, page: 1 })
//                 }
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="contacted">Contacted</option>
//                 <option value="completed">Completed</option>
//                 <option value="rejected">Rejected</option>
//               </select>
//               {/* <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} /> */}
//             </div>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
//           {loading ? (
//             <div className="p-8 text-center text-gray-500">Loading...</div>
//           ) : (
//             <table className="min-w-full text-sm">
//               <thead className="bg-gray-50 text-gray-600">
//                 <tr>
//                   {["Date", "Company", "Contact", "Inquiry", "Status", ""].map(h => (
//                     <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map(o => (
//                   <tr key={o._id} className="border-t hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       {new Date(o.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="font-medium">{o.companyName}</div>
//                       <div className="text-gray-500 text-xs">{o.email}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div>{o.contactPerson}</div>
//                       <div className="text-gray-500 text-xs">{o.phone}</div>
//                     </td>
//                     <td className="px-6 py-4">{o.inquiryType}</td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusStyle(o.status)}`}>
//                         {statusIcon(o.status)} {o.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => setSelectedOrder(o)}
//                         className="text-sm font-medium"
//                         style={{ color: THEME }}
//                       >
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* MODAL */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-semibold">Order Details</h2>
//                 <p className="text-sm text-gray-500">{selectedOrder._id}</p>
//               </div>
//               <button onClick={() => setSelectedOrder(null)}>✕</button>
//             </div>

//             <div className="p-6 grid md:grid-cols-2 gap-6 text-sm">
//               <div className="space-y-2">
//                 <p><b>Company:</b> {selectedOrder.companyName}</p>
//                 <p><b>Contact:</b> {selectedOrder.contactPerson}</p>
//                 <p><b>Email:</b> {selectedOrder.email}</p>
//                 <p><b>Phone:</b> {selectedOrder.phone}</p>
//                 <p><b>Country:</b> {selectedOrder.country}</p>
//               </div>

//               <div className="space-y-2">
//                 <p><b>Inquiry:</b> {selectedOrder.inquiryType}</p>
//                 <p><b>Category:</b> {selectedOrder.productCategory}</p>
//                 <p><b>Quantity:</b> {selectedOrder.orderQuantity}</p>
//                 <p><b>Customization:</b> {selectedOrder.customizationRequired}</p>
//                 <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusStyle(selectedOrder.status)}`}>
//                   {statusIcon(selectedOrder.status)} {selectedOrder.status}
//                 </span>
//               </div>
//             </div>

//             <div className="px-6 pb-6">
//               <p className="font-medium mb-2">Message</p>
//               <div className="bg-gray-50 p-3 rounded">
//                 {selectedOrder.message || "—"}
//               </div>
//             </div>

//             <div className="px-6 pb-6 flex flex-wrap gap-2 justify-end">
//               <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 border rounded">
//                 Close
//               </button>
//               {selectedOrder.status === "pending" && (
//                 <button
//                   onClick={() => updateOrderStatus(selectedOrder._id, "contacted")}
//                   className="px-4 py-2 text-white rounded"
//                   style={{ backgroundColor: THEME }}
//                 >
//                   Mark Contacted
//                 </button>
//               )}
//               <button
//                 onClick={() => updateOrderStatus(selectedOrder._id, "completed")}
//                 className="px-4 py-2 bg-green-600 text-white rounded"
//               >
//                 Complete
//               </button>
//               <button
//                 onClick={() => updateOrderStatus(selectedOrder._id, "rejected")}
//                 className="px-4 py-2 bg-red-600 text-white rounded"
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomOrdersPanel;


// "use client";
// import React, { useState, useEffect } from "react";
// import { Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

// const THEME = "#C08237";

// const CustomOrdersPanel = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const [filters, setFilters] = useState({
//     status: "all",
//     search: "",
//     page: 1,
//     limit: 10,
//   });

//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 1,
//   });

//   useEffect(() => {
//     fetchOrders();
//   }, [filters.page, filters.limit, filters.status]);

//   useEffect(() => {
//     const t = setTimeout(fetchOrders, 400);
//     return () => clearTimeout(t);
//   }, [filters.search]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams({
//         page: filters.page,
//         limit: filters.limit,
//       });

//       if (filters.status !== "all") params.append("status", filters.status);
//       if (filters.search.trim()) params.append("search", filters.search.trim());

//       const res = await fetch(`/api/admin/custom-orders?${params}`);
//       const data = await res.json();

//       if (data.success) {
//         setOrders(data.orders);
//         setPagination(data.pagination);
//       }
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateOrderStatus = async (id, status) => {
//     await fetch(`/api/admin/custom-orders/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status }),
//     });

//     fetchOrders();
//     if (selectedOrder?._id === id) {
//       setSelectedOrder({ ...selectedOrder, status });
//     }
//   };

//   const statusStyle = (s) => {
//     const map = {
//       pending: "bg-yellow-100 text-yellow-800",
//       contacted: "bg-blue-100 text-blue-800",
//       completed: "bg-green-100 text-green-800",
//       rejected: "bg-red-100 text-red-800",
//     };
//     return map[s] || "bg-gray-100 text-gray-700";
//   };

//   const statusIcon = (s) => {
//     if (s === "pending") return <Clock size={14} />;
//     if (s === "contacted") return <Eye size={14} />;
//     if (s === "completed") return <CheckCircle size={14} />;
//     if (s === "rejected") return <XCircle size={14} />;
//   };

//   return (
//     <div className="p-4 md:p-6 min-h-screen">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="mb-6">
//           <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
//             Custom Orders
//           </h1>
//           <p className="text-sm text-gray-600">
//             Manage all custom order inquiries
//           </p>
//         </div>

//         {/* FILTER */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 size={16}
//               />
//               <input
//                 className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:border-transparent"
//                 style={{ "--tw-ring-color": THEME }}
//                 placeholder="Search company / phone"
//                 value={filters.search}
//                 onChange={(e) =>
//                   setFilters({ ...filters, search: e.target.value, page: 1 })
//                 }
//               />
//             </div>

//             <select
//               className="border rounded-md px-4 py-2 focus:ring-2"
//               style={{ "--tw-ring-color": THEME }}
//               value={filters.status}
//               onChange={(e) =>
//                 setFilters({ ...filters, status: e.target.value, page: 1 })
//               }
//             >
//               <option value="all">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="contacted">Contacted</option>
//               <option value="completed">Completed</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
//           {loading ? (
//             <div className="p-8 text-center text-gray-500">Loading...</div>
//           ) : (
//             <table className="min-w-full text-sm">
//               <thead className="bg-gray-50 text-gray-600">
//                 <tr>
//                   {["Date", "Company", "Phone", "Inquiry", "Status", ""].map(
//                     (h) => (
//                       <th key={h} className="px-6 py-3 text-left font-medium">
//                         {h}
//                       </th>
//                     )
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((o) => (
//                   <tr key={o._id} className="border-t hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       {new Date(o.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 font-medium">
//                       {o.companyName}
//                     </td>
//                     <td className="px-6 py-4">{o.phone}</td>
//                     <td className="px-6 py-4">{o.inquiryType}</td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusStyle(
//                           o.status
//                         )}`}
//                       >
//                         {statusIcon(o.status)} {o.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => setSelectedOrder(o)}
//                         className="text-sm font-medium"
//                         style={{ color: THEME }}
//                       >
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* MODAL */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-semibold">Order Details</h2>
//                 <p className="text-sm text-gray-500">
//                   {selectedOrder._id}
//                 </p>
//               </div>
//               <button onClick={() => setSelectedOrder(null)}>✕</button>
//             </div>

//             <div className="p-6 grid md:grid-cols-2 gap-6 text-sm">
//               <div className="space-y-2">
//                 <p><b>Company:</b> {selectedOrder.companyName}</p>
//                 <p><b>Phone:</b> {selectedOrder.phone}</p>
//                 <p><b>Country:</b> {selectedOrder.country}</p>
//               </div>

//               <div className="space-y-2">
//                 <p><b>Inquiry:</b> {selectedOrder.inquiryType}</p>
//                 <p><b>Category:</b> {selectedOrder.productCategory}</p>
//                 <p><b>Customization:</b> {selectedOrder.customizationRequired}</p>
//                 <span
//                   className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusStyle(
//                     selectedOrder.status
//                   )}`}
//                 >
//                   {statusIcon(selectedOrder.status)} {selectedOrder.status}
//                 </span>
//               </div>
//             </div>

//             {/* MESSAGE */}
//             <div className="px-6 pb-6">
//               <p className="font-medium mb-2">Message</p>
//               <div className="bg-gray-50 p-3 rounded">
//                 {selectedOrder.message || "—"}
//               </div>
//             </div>

//             {/* 🔥 REFERENCE FILES FIX */}
//             {selectedOrder.referenceFiles &&
//               selectedOrder.referenceFiles.length > 0 && (
//                 <div className="px-6 pb-6">
//                   <p className="font-medium mb-2">Reference Files</p>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedOrder.referenceFiles.map((url, i) => (
//                       <a
//                         key={i}
//                         href={url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
//                         style={{ borderColor: THEME, color: THEME }}
//                       >
//                         📎 Reference {i + 1}
//                       </a>
//                     ))}
//                   </div>
//                 </div>
//               )}

//             {/* ACTIONS */}
//             <div className="px-6 pb-6 flex flex-wrap gap-2 justify-end">
//               <button
//                 onClick={() => setSelectedOrder(null)}
//                 className="px-4 py-2 border rounded"
//               >
//                 Close
//               </button>

//               {selectedOrder.status === "pending" && (
//                 <button
//                   onClick={() =>
//                     updateOrderStatus(selectedOrder._id, "contacted")
//                   }
//                   className="px-4 py-2 text-white rounded"
//                   style={{ backgroundColor: THEME }}
//                 >
//                   Mark Contacted
//                 </button>
//               )}

//               <button
//                 onClick={() =>
//                   updateOrderStatus(selectedOrder._id, "completed")
//                 }
//                 className="px-4 py-2 bg-green-600 text-white rounded"
//               >
//                 Complete
//               </button>

//               <button
//                 onClick={() =>
//                   updateOrderStatus(selectedOrder._id, "rejected")
//                 }
//                 className="px-4 py-2 bg-red-600 text-white rounded"
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomOrdersPanel;


"use client";
import React, { useState, useEffect } from "react";
import { Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

const THEME = "#C08237";

const CustomOrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    fetchOrders();
  }, [filters.page, filters.limit, filters.status, filters.search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
        search: filters.search,
      });

      if (filters.status !== "all") {
        params.append("status", filters.status);
      }

      const res = await fetch(`/api/admin/custom-orders?${params}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    await fetch(`/api/admin/custom-orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchOrders();
    setSelectedOrder((prev) => ({ ...prev, status }));
  };

  const statusStyle = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800",
      contacted: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  const statusIcon = (status) => {
    if (status === "pending") return <Clock size={14} />;
    if (status === "contacted") return <Eye size={14} />;
    if (status === "completed") return <CheckCircle size={14} />;
    if (status === "rejected") return <XCircle size={14} />;
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Custom Orders</h1>
          <p className="text-sm text-gray-600">
            Manage all custom order inquiries
          </p>
        </div>

        {/* FILTER */}
        <div className="bg-white p-4 rounded shadow mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              className="w-full pl-10 pr-4 py-2 border rounded"
              placeholder="Search company / phone / email"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
            />
          </div>

          <select
            className="border rounded px-4 py-2"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Date", "Company", "Contact", "Inquiry", "Status", ""].map(
                    (h) => (
                      <th key={h} className="px-6 py-3 text-left">{h}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{o.companyName}</div>
                      <div className="text-xs text-gray-500">{o.businessEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{o.contactPersonName}</div>
                      <div className="text-xs text-gray-500">{o.phone}</div>
                    </td>
                    <td className="px-6 py-4">{o.inquiryType}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs inline-flex gap-1 ${statusStyle(o.status)}`}>
                        {statusIcon(o.status)} {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        style={{ color: THEME }}
                        onClick={() => setSelectedOrder(o)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-4 text-sm">
              <p><b>Company:</b> {selectedOrder.companyName}</p>
              <p><b>Contact Person:</b> {selectedOrder.contactPersonName}</p>
              <p><b>Email:</b> {selectedOrder.businessEmail}</p>
              <p><b>Phone:</b> {selectedOrder.phone}</p>
              <p><b>Country:</b> {selectedOrder.country}</p>
              <p><b>Inquiry Type:</b> {selectedOrder.inquiryType}</p>
              <p><b>Product Category:</b> {selectedOrder.productCategory}</p>
              <p><b>Estimated Quantity:</b> {selectedOrder.estimatedQuantity}</p>
              <p><b>Customization:</b> {selectedOrder.customizationRequired}</p>
            </div>

            <div className="px-6 pb-4">
              <p className="font-medium mb-1">Message</p>
              <div className="bg-gray-50 p-3 rounded">
                {selectedOrder.message || "—"}
              </div>
            </div>

            {/* Reference Files */}
            {selectedOrder.referenceFiles?.length > 0 && (
              <div className="px-6 pb-6 ">
                <p className="font-medium mb-2">Reference Files</p>
                <div className="flex flex-wrap  gap-2">
                  {selectedOrder.referenceFiles.map((file, i) => (
                    <a
                      key={i}
                      href={file}
                      target="_blank"
                      className="border px-3 py-3 text-center hover:text-white border-[#C08237] hover:bg-[#C08237] rounded text-sm"
                      // style={{ color: THEME, borderColor: THEME }}
                    >
                       Download
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="px-6 pb-6 flex justify-end gap-2">
              <button className="border px-4 py-2 rounded" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => updateOrderStatus(selectedOrder._id, "completed")}
              >
                Complete
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => updateOrderStatus(selectedOrder._id, "rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomOrdersPanel;
