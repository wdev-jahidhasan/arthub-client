'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { DollarSign, ShoppingBag, Image as ImageIcon, TrendingUp, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ArtistAnalyticsPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id || session?.user?._id;

  const [analytics, setAnalytics] = useState({
    totalEarnings: 0,
    totalSalesCount: 0,
    totalArtworks: 0,
    purchases: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!userId) return;
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/analytics/artist/${userId}`, { cache: 'no-store' });
        const data = await res.json();
        
        if (data.success) {
          setAnalytics(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [userId]);

  const chartData = analytics.purchases.map((item) => {
    const dateStr = new Date(item.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const amount = item.amountTotal || Number(item.metadata?.price) || 0;
    return {
      date: dateStr,
      earnings: amount,
    };
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full w-full bg-[#05050d] text-white py-28 gap-4">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
        <p className="text-gray-400 text-sm font-medium tracking-wide animate-pulse">Loading analytics overview...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-[#05050d] text-white p-6 md:p-8 relative">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-wide">Artist Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Monitor your performance, earnings, and marketplace reach</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Earnings Card */}
        <div className="bg-[#0b0b18] border border-gray-800/80 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium tracking-wider">Total Earnings</p>
            <p className="text-3xl font-bold text-pink-400 mt-2">${analytics.totalEarnings.toFixed(2)}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Total Sales Card */}
        <div className="bg-[#0b0b18] border border-gray-800/80 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium tracking-wider">Total Sales</p>
            <p className="text-3xl font-bold text-purple-400 mt-2">{analytics.totalSalesCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Total Artworks Card */}
        <div className="bg-[#0b0b18] border border-gray-800/80 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium tracking-wider">Published Artworks</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">{analytics.totalArtworks}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ImageIcon size={24} />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-[#0b0b18] border border-gray-800/80 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-200">Earnings Overview</h3>
            <p className="text-xs text-gray-400 mt-0.5">Visual representation of your revenue over time</p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
            Not enough data to display chart yet.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="date" stroke="#9ca3af" textAnchor="end" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#101022', borderColor: '#374151', borderRadius: '12px', color: '#fff' }} 
                />
                <Area type="monotone" dataKey="earnings" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Footer Banner */}
      <div className="bg-[#0b0b18] border border-gray-800/80 rounded-2xl p-6 shadow-xl flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <TrendingUp size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-200">Keep growing your portfolio!</h3>
          <p className="text-xs text-gray-400 mt-0.5">Uploading more unique artworks increases your chances of getting noticed and making sales.</p>
        </div>
      </div>
    </div>
  );
}