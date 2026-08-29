"use client"
import React, { useEffect, useState } from 'react';
import { Users, UserCheck, ShoppingBag, DollarSign, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#ec4899', '#3b82f6', '#eab308', '#22c55e', '#a855f7', '#06b6d4'];

const AdminAnalyticsPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtists: 0,
    totalArtworksSold: 0,
    totalRevenue: 0,
    categoryData: [],
    salesData: []
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
      });
  }, []);

  return (
    <div className="p-6 md:p-10 text-white bg-[#070913] min-h-screen text-left">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-wide">Analytics Overview</h2>
        <p className="text-gray-400 text-sm mt-1">Monitor platform users, artists, sales, total revenue, and category performance.</p>
      </div>

      {/* 4 Cards Grid (As per screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        {/* Total Users */}
        <div className="bg-[#0b0f19] border border-gray-800 p-6 rounded-xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Users</p>
            <h3 className="text-3xl font-extrabold">{stats.totalUsers}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-950/50 border border-purple-800/40 flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Artists */}
        <div className="bg-[#0b0f19] border border-gray-800 p-6 rounded-xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Artists</p>
            <h3 className="text-3xl font-extrabold">{stats.totalArtists}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-950/50 border border-blue-800/40 flex items-center justify-center text-blue-400">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Total Artworks Sold */}
        <div className="bg-[#0b0f19] border border-gray-800 p-6 rounded-xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Artworks Sold</p>
            <h3 className="text-3xl font-extrabold">{stats.totalArtworksSold}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-yellow-950/50 border border-yellow-800/40 flex items-center justify-center text-yellow-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#0b0f19] border border-gray-800 p-6 rounded-xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Revenue</p>
            <h3 className="text-3xl font-extrabold">${Number(stats.totalRevenue).toFixed(2)}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-950/50 border border-green-800/40 flex items-center justify-center text-green-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Charts Section: Sales Chart & Category Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Sales Chart (Line Chart) */}
        <div className="bg-[#0b0f19] border border-gray-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-bold">Sales Chart</h3>
          </div>
          <div className="h-72 w-full">
            {stats.salesData && stats.salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#121826', borderColor: '#374151', borderRadius: '8px', color: '#fff' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">No sales data found</div>
            )}
          </div>
        </div>

        {/* Artworks by Category Pie Chart */}
        <div className="bg-[#0b0f19] border border-gray-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold">Artworks by Category</h3>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            {stats.categoryData && stats.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#121826', borderColor: '#374151', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">No category data found</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalyticsPage;