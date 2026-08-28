import Image from 'next/image';
import Link from 'next/link';

async function getBoughtArtworks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchases`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch bought artworks');
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export default async function UserBoughtArtworksPage() {
  const purchases = await getBoughtArtworks();

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white p-3 sm:p-6 lg:p-8 selection:bg-pink-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-6 border-b border-gray-800/80 pb-4">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-1">
            Bought Artworks
          </h1>
          <p className="text-gray-400 text-xs">
            Here is the collection of all the artworks you have successfully purchased.
          </p>
        </div>

        {/* Empty State */}
        {purchases.length === 0 ? (
          <div className="bg-[#121217] border border-gray-800/80 rounded-2xl p-10 text-center max-w-md mx-auto shadow-xl">
            <div className="w-12 h-12 bg-pink-500/15 border border-pink-500/20 text-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 className="text-base font-bold text-white mb-1">No Artworks Found</h3>
            <p className="text-gray-400 text-xs mb-4">You haven't purchased any artworks yet.</p>
            <Link
              href="/gallery"
              className="inline-block py-2 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white transition-all shadow-md shadow-pink-600/20"
            >
              Explore Gallery
            </Link>
          </div>
        ) : (
          /* Artworks Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {purchases.map((item, index) => {
              const artworkImg = item.metadata?.image || item.metadata?.imageUrl;

              return (
                <div 
                  key={item._id || index}
                  className="bg-[#121217] border border-gray-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-pink-500/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Artwork Image */}
                    <div className="relative w-full h-32 sm:h-40 bg-[#181822] overflow-hidden">
                      {artworkImg ? (
                        <img 
                          src={artworkImg} 
                          alt={item.metadata?.title || 'Artwork'} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-[10px] sm:text-xs text-center p-1">
                          No Image
                        </div>
                      )}
                      {/* Price Badge on image */}
                      <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/10 z-10">
                        ${item.amountTotal} {item.currency?.toUpperCase()}
                      </span>
                    </div>

                    {/* Artwork Details Content */}
                    <div className="p-3 sm:p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {item.status || 'Complete'}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-xs sm:text-sm font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-1">
                          {item.metadata?.title || 'Untitled Artwork'}
                        </h2>
                        <p className="text-gray-400 text-[10px] sm:text-[11px] mt-0.5 truncate">
                          {item.customerEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="p-3 sm:p-4 pt-0">
                    <Link
                      href={`/dashboard/user/reviews`}
                      className="block w-full py-2 px-2 rounded-xl font-semibold text-[10px] sm:text-[11px] text-center bg-gray-800 hover:bg-gray-700 text-gray-200 transition-all border border-gray-700/60 truncate"
                    >
                      Leave a Review
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}