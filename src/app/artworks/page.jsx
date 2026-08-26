import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ArtWorksPage = async () => {
  let artworks = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks`, {
      cache: 'no-store',
    });
    const data = await res.json();
    if (data.success) {
      artworks = data.data;
    }
  } catch (error) {
    console.error('Failed to fetch artworks:', error);
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 md:p-12">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-center text-slate-100 tracking-tight">
        Art Gallery
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {artworks.map((art) => (
          <div
            key={art._id}
            className="group relative bg-[#111726]/80 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#831867]/20 hover:border-[#831867]/40 transition-all duration-300 ease-out hover:-translate-y-1.5 flex flex-col justify-between p-5"
          >
            <div>
              {/* Image Container */}
              <div className="relative w-full h-64 overflow-hidden rounded-xl bg-slate-950">
                <Image
                  src={art.imageUrl}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                
                {/* Floating Category Badge */}
                <span className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md text-slate-300 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-slate-700/50">
                  {art.category}
                </span>
              </div>

              {/* Title & Price */}
              <div className="mt-4 mb-2 flex justify-between items-baseline gap-2">
                <h2 className="text-xl font-bold text-slate-100 group-hover:text-[#cf38a4] transition-colors duration-300 line-clamp-1">
                  {art.title}
                </h2>
                <span className="text-xl font-extrabold text-[#cf38a4] tracking-tight shrink-0">
                  ${art.price}
                </span>
              </div>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                {art.description}
              </p>
            </div>

            {/* View Details Link */}
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex justify-end">
              <Link
                href={`/artworks/${art._id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#cf38a4] hover:text-[#e255bc] transition-colors duration-200 group/link"
              >
                <span>View Details</span>
                <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtWorksPage;