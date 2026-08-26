import React from 'react';
import Image from 'next/image';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

const ArtistArtworksPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id || session?.user?._id;

  let artworks = [];
  if (userId) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/artworks/user/${userId}`,
        { cache: 'no-store' }
      );
      const data = await res.json();
      if (data.success) {
        artworks = data.data;
      }
    } catch (error) {
      console.error('Failed to fetch artworks:', error);
    }
  }

  return (
    <div className="min-h-full w-full bg-[#05050d] text-white p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">My Artworks</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and showcase your collection</p>
        </div>
      </div>

      {artworks.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No artworks found.</div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((item) => (
            <div
              key={item._id}
              className="bg-[#0b0b18] border border-gray-800/80 rounded-2xl overflow-hidden hover:border-pink-500/60 transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Next Image wrapper */}
              <div className="relative aspect-4/3 overflow-hidden bg-[#120e24]">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Details */}
              <div className="p-4 flex flex-col gap-2">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.category}</span>
                <h3 className="font-semibold text-lg text-gray-100 truncate group-hover:text-pink-400 transition-colors">
                  {item.title}
                </h3>
                
                <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-800/60">
                  <span className="text-xl font-bold text-pink-400">${item.price}</span>
                  
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium bg-gray-800/60 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg transition-colors border border-rose-800/30">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistArtworksPage;