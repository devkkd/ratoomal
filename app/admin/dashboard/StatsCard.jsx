'use client';

import { useState, useEffect } from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function StatsCards() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      const data = await response.json();

      if (data.success) {
        const statsData = [
          {
            name: 'Total Products',
            value: data.data.totalProducts.toLocaleString(),
            change: 'Active',
            changeType: 'neutral',
            icon: ShoppingCartIcon,
            color: 'bg-[#C08237]',
          },
          {
            name: 'Total Inquiries',
            value: data.data.totalInquiries.toLocaleString(),
            change: data.data.inquiryTrend,
            changeType: data.data.inquiryTrendType,
            icon: CurrencyDollarIcon,
            color: 'bg-green-500',
          },
          {
            name: 'Total Customers',
            value: data.data.totalUsers.toLocaleString(),
            change: data.data.userTrend,
            changeType: data.data.userTrendType,
            icon: UserGroupIcon,
            color: 'bg-purple-500',
          },
          {
            name: 'Approval Rate',
            value: data.data.approvalRate,
            change: `${data.data.pendingUsers} Pending`,
            changeType: 'neutral',
            icon: ChartBarIcon,
            color: 'bg-orange-500',
          },
        ];

        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white overflow-hidden rounded-xl border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-center">
              <div className="bg-gray-200 p-3 rounded-lg w-12 h-12" />
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white overflow-hidden rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                {/* {stat.changeType !== 'neutral' && (
                  <div
                    className={`ml-2 flex items-center text-sm font-medium ${
                      stat.changeType === 'increase'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.changeType === 'increase' ? (
                      <ArrowUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                )} */}
                {stat.changeType === 'neutral' && (
                  <span className="ml-2 text-sm text-gray-500">{stat.change}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}