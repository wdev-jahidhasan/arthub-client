'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';

const UserPurchaseHistoryPage = () => {
  const { data: session, isPending } = useSession();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id;

  useEffect(() => {
    if (isPending) return;

    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPurchaseHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchases/user-safe/${userId}`);
        const data = await res.json();

        if (data.success) {
          setPurchases(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching purchase history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [userId, isPending]);

  // গ্লোবাল স্টাইলের সাথে মিলিয়ে লোডিং স্টেট
  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 text-sm tracking-wide animate-pulse">Loading purchase history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6 sm:p-12 relative">
      <div className="max-w-4xl mx-auto">
        {/* পেজের হেডার */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Purchase History
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            View all the artworks and items you have successfully purchased.
          </p>
        </div>

        {/* যদি কোনো পার্চেজ না থাকে */}
        {purchases.length === 0 ? (
          <div className="bg-[#111726] border border-gray-800 rounded-2xl shadow-xl p-10 sm:p-14 text-center max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-2">No Purchase History Found</h3>
            <p className="text-gray-400 text-sm mb-8">
              You haven't bought any artworks yet. Explore our gallery and find something you love!
            </p>
            <Link
              href="/artworks"
              className="inline-block w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md bg-pink-600 hover:bg-pink-700 text-white text-center"
            >
              Explore Artworks
            </Link>
          </div>
        ) : (
          /* পার্চেজ লিস্ট */
          <div className="space-y-6">
            {purchases.map((item, index) => {
              const artwork = item.artworkDetails || {};
              const title = artwork.title || item.metadata?.artworkTitle || item.metadata?.title || 'Untitled Artwork';
              
              let rawImage = artwork.image || item.metadata?.artworkImage || item.metadata?.imageUrl || '/placeholder.png';
              const image = rawImage.startsWith('http') 
                ? rawImage 
                : `${process.env.NEXT_PUBLIC_API_URL || ''}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

              const artworkId = artwork._id || item.artworkId || item.metadata?.artworkId;
              const purchaseDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent';
              const price = item.price || item.amount || artwork.price || 'N/A';

              return (
                <div
                  key={item._id || index}
                  className="bg-[#111726] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row gap-6 items-center sm:items-start transition hover:border-gray-700"
                >
                  {/* আর্টওয়ার্ক ছবি */}
                  <div className="relative w-full sm:w-36 h-48 sm:h-36 rounded-xl overflow-hidden border border-gray-800 flex-shrink-0 bg-[#0b0f19]">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 144px"
                      className="object-cover"
                    />
                  </div>

                  {/* ডিটেইলস সেকশন */}
                  <div className="w-full flex flex-col justify-between flex-grow h-full">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                        <span className="inline-block px-3 py-1 bg-pink-950/40 border border-pink-900/50 text-pink-400 text-xs font-semibold rounded-full w-fit">
                          Paid • ${price}
                        </span>
                      </div>

                      <div className="text-xs text-gray-400 space-y-1 mb-4">
                        <p>Purchase Date: <span className="text-gray-300">{purchaseDate}</span></p>
                        <p>Transaction ID: <span className="font-mono text-gray-500">{item._id}</span></p>
                      </div>
                    </div>

                    {/* ফুটর বাটন */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-800/60">
                      {artworkId ? (
                        <Link
                          href={`/artworks/${artworkId}`}
                          className="text-xs font-semibold text-pink-500 hover:text-pink-400 transition flex items-center gap-1"
                        >
                          View Artwork Details →
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-600">Details unavailable</span>
                      )}

                      <span className="text-xs text-emerald-400 font-medium bg-emerald-950/30 px-2.5 py-1 rounded-md border border-emerald-900/40">
                        Successful
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPurchaseHistoryPage;