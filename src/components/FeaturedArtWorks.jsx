import React from "react";
import Image from "next/image";

// Dummy data should be removed and original data should be used
// -----------------------------------------------------------------------

const sampleArtworks = [
  { id: 1, title: "Abstract Horizon", artist: "Elena Rostova", price: "450", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80" },
  { id: 2, title: "Neon Cyberpunk", artist: "Marcus Vance", price: "620", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" },
  { id: 3, title: "Silent Ocean", artist: "Aria Chen", price: "380", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=600&q=80" },
  { id: 4, title: "Golden Splendor", artist: "David Miller", price: "510", image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80" },
  { id: 5, title: "Cosmic Realm", artist: "Sofia Rossi", price: "700", image: "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=600&q=80" },
  { id: 6, title: "Urban Pulse", artist: "Liam Thorne", price: "290", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80" },
];

const FeaturedArtworks = ({ artworks = sampleArtworks }) => {
  const displayArtworks = artworks.length > 0 ? artworks : sampleArtworks;

  return (
    <section className="py-20 px-6 bg-[#030712] border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-2">Featured Artworks</h2>
        <p className="text-slate-400 text-center mb-12">Handpicked pieces from our top creators</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayArtworks.slice(0, 6).map((art) => (
            <div
              key={art.id || art._id}
              className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl overflow-hidden hover:border-purple-500/50 transition duration-300 group flex flex-col justify-between"
            >
              <div className="relative overflow-hidden aspect-[4/3] w-full">
                <Image
                  src={art.image || art.imageUrl}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition">{art.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{art.artist || art.artistName}</p>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-lg font-bold text-pink-500">${art.price}</span>
                  <button className="bg-slate-800/80 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-slate-200 hover:text-white px-4 py-2 rounded-lg text-sm transition duration-300">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtworks;