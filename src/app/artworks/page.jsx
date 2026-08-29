"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';

const ArtWorksPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');

  // Fetch Artworks based on filters
  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (category && category !== 'All') queryParams.append('category', category);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (sort) queryParams.append('sort', sort);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks/search-filter-sort?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setArtworks(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch artworks:', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchArtworks();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search, category, minPrice, maxPrice, sort]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 md:p-12">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-slate-100 tracking-tight">
        Art Gallery
      </h1>

      {/* Search, Filter & Sort Controls Section */}
      <div className="max-w-7xl mx-auto mb-10 bg-[#111726]/60 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-slate-800/80 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#cf38a4] transition-colors"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter (Updated with 'sketch' instead of 'photography') */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#cf38a4] transition-colors"
          >
            <option value="All">All Categories</option>
            <option value="painting">Painting</option>
            <option value="digital">Digital</option>
            <option value="sculpture">Sculpture</option>
            <option value="sketch">Sketch</option>
          </select>

          {/* Min Price */}
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min $"
            className="w-24 bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#cf38a4]"
          />

          {/* Max Price */}
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max $"
            className="w-24 bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#cf38a4]"
          />

          {/* Sorting */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#cf38a4] transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 text-[#cf38a4] animate-spin" />
          <p className="text-slate-400 text-sm animate-pulse">Loading artworks...</p>
        </div>
      ) : artworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {artworks.map((art) => (
            <div
              key={art._id}
              className="group relative bg-[#111726]/85 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#831867]/20 hover:border-[#831867]/40 transition-all duration-300 ease-out hover:-translate-y-1.5 flex flex-col justify-between p-5"
            >
              <div>
                <div className="relative w-full h-64 overflow-hidden rounded-xl bg-slate-950">
                  <Image
                    src={art.imageUrl}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md text-slate-300 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-slate-700/50">
                    {art.category}
                  </span>
                </div>

                <div className="mt-4 mb-2 flex justify-between items-baseline gap-2">
                  <h2 className="text-xl font-bold text-slate-100 group-hover:text-[#cf38a4] transition-colors duration-300 line-clamp-1">
                    {art.title}
                  </h2>
                  <span className="text-xl font-extrabold text-[#cf38a4] tracking-tight shrink-0">
                    ${art.price}
                  </span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                  {art.description}
                </p>
              </div>

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
      ) : (
        <div className="text-center py-32 text-slate-500 text-sm">
          No artworks found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default ArtWorksPage;