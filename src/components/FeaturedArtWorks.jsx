import React from "react";
import Image from "next/image";
import Link from "next/link";

async function getFeaturedArtworks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks/featured`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error loading featured artworks:", error);
    return [];
  }
}

const FeaturedArtworks = async () => {
  const artworks = await getFeaturedArtworks();

  return (
    <section className="py-20 px-6 bg-[#030712] border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-2">Featured Artworks</h2>
        <p className="text-slate-400 text-center mb-12">Handpicked pieces from our top creators</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map((art) => (
            <div
              key={art._id || art.id}
              className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl overflow-hidden hover:border-purple-500/50 transition duration-300 group flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-[4/3] w-full">
                <Image
                  src={art.image || art.imageUrl}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition">
                    {art.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {art.artist || art.artistName}
                  </p>
                  
                  {/* Details with Ellipsis (...) */}
                  <p className="text-slate-400 text-sm mt-3 line-clamp-2 leading-relaxed">
                    {art.details || art.description || "No details available for this artwork."}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-lg font-bold text-pink-500">${art.price}</span>
                  <Link
                    href={`/artworks/${art._id || art.id}`}
                    className="bg-slate-800/80 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-slate-200 hover:text-white px-4 py-2 rounded-lg text-sm transition duration-300 inline-block text-center"
                  >
                    View Details
                  </Link>
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