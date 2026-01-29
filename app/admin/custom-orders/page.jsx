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
