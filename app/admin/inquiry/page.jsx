"use client";
import React, { useEffect, useState } from "react";

const AdminInquiry = () => {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    const res = await fetch("/api/admin/inquiry");
    const data = await res.json();
    if (data.success) setInquiries(data.data);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Product Inquiries</h2>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Company</th>
              <th className="p-2 border">Contact</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq._id}>
                <td className="p-2 border">
                  {inq.product?.name}
                </td>
                <td className="p-2 border">{inq.companyName}</td>
                <td className="p-2 border">{inq.contactName}</td>
                <td className="p-2 border">{inq.email}</td>
                <td className="p-2 border">{inq.phone}</td>
                <td className="p-2 border">
                  {new Date(inq.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInquiry;
