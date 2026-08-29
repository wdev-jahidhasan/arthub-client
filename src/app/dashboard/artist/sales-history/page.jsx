'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';

export default function ArtistSalesHistoryPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id || session?.user?._id;

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch sales history for this artist
  useEffect(() => {
    async function fetchSalesHistory() {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/sales/artist/${userId}`,
          { cache: 'no-store' }
        );
        const data = await res.json();
        if (data.success) {
          setSales(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch sales history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSalesHistory();
  }, [userId]);

  // Calculate total earnings
  const totalEarnings = sales.reduce((acc, item) => acc + (item.totalAmount || item.price || 0), 0);

  return (
    <div className="min-h-full w-full bg-[#05050d] text-white p-6 md:p-8 relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Sales History</h1>
          <p className="text-gray-400 text-sm mt-1">Track your sold artworks and earnings overview</p>
        </div>
        
        {/* Total Earnings Summary Card */}
        <div className="bg-[#0b0b18] border border-gray-800/80 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-lg">
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">Total Earnings</p>
            <p className="text-xl font-bold text-pink-400">${totalEarnings.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="text-center text-gray-500 py-16 animate-pulse">Loading sales history...</div>
      ) : sales.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-[#0b0b18]/40 border border-gray-800/50 rounded-2xl">
          <p className="text-base font-medium">No sales recorded yet.</p>
          <p className="text-xs text-gray-600 mt-1">When buyers purchase your artworks, they will appear here.</p>
        </div>
      ) : (
        /* Sales Table / List Grid */
        <div className="bg-[#0b0b18] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-[#101022] text-xs uppercase tracking-wider text-gray-400">
                  <th className="py-4 px-6">Artwork</th>
                  <th className="py-4 px-6">Buyer</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-sm">
                {sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-900/40 transition-colors">
                    {/* Artwork Info */}
                    <td className="py-4 px-6 flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#120e24] shrink-0 border border-gray-800">
                        <Image
                          src={sale.artwork?.imageUrl || sale.imageUrl || '/placeholder.png'}
                          alt={sale.artwork?.title || 'Artwork'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-200">{sale.artwork?.title || sale.title || 'Untitled'}</p>
                        <p className="text-xs text-gray-500 uppercase">{sale.artwork?.category || 'Art'}</p>
                      </div>
                    </td>

                    {/* Buyer Info */}
                    <td className="py-4 px-6 text-gray-300">
                      {sale.buyer?.name || sale.customerEmail || 'Anonymous Buyer'}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-gray-400 text-xs">
                      {new Date(sale.createdAt || sale.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-block ${
                        sale.status === 'complete' || sale.status === 'Paid' 
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' 
                          : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                      }`}>
                        {sale.status || 'Completed'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 text-right font-bold text-pink-400">
                      ${sale.totalAmount || sale.price || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}