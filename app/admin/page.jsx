'use client';

import StatsCard from './dashboard/StatsCard';
import RecentOrders from './dashboard/RecentOrders';
// import TopProducts from '@/components/dashboard/TopProducts';
// import ActivityChart from '@/components/dashboard/ActivityChart';

export default function DashboardPage() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6">
        <StatsCard />
      </div>

      {/* Charts and Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart */}
        <div className="lg:col-span-2">
          {/* <ActivityChart /> */}
        </div>

        {/* Right Column - Top Products */}
        <div>
          {/* <TopProducts /> */}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-6">
        <RecentOrders />
      </div>
    </>
  );
}
