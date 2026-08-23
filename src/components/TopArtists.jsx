import React from "react";
import Image from "next/image";

const topArtists = [
  {
    id: 1,
    name: "Tanvir Hasan",
    country: "Bangladesh",
    flag: "https://flagcdn.com/w160/bd.png",
    sales: "78+ Sales",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Lukas Weber",
    country: "Germany",
    flag: "https://flagcdn.com/w160/de.png",
    sales: "53+ Sales",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Eren Yılmaz",
    country: "Turkey",
    flag: "https://flagcdn.com/w160/tr.png",
    sales: "44+ Sales",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
  },
];

const TopArtists = () => {
  return (
    <section className="py-20 px-6 bg-[#030712] border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">Top Artists</h2>
        <p className="text-slate-400 mb-14 text-sm md:text-base">Meet our highest selling creators worldwide</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topArtists.map((artist) => (
            <div
              key={artist.id}
              className="group relative p-8 rounded-3xl bg-gradient-to-b from-[#0e1322] to-[#070b14] border border-slate-800/80 hover:border-purple-500/60 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-950/30 hover:-translate-y-1.5 flex flex-col items-center overflow-hidden"
            >
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition duration-500" />

              <div className="absolute top-4 right-4 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 shadow-inner">
                <Image
                  src={artist.flag}
                  alt={artist.country}
                  width={28}
                  height={18}
                  className="object-cover rounded shadow-sm"
                />
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{artist.country}</span>
              </div>

              <div className="relative mt-4 mb-5">
                <div className="p-1 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 shadow-xl shadow-purple-950/40 group-hover:scale-105 transition duration-500">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#0b0f19]">
                    <Image
                      src={artist.avatar}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                {artist.name}
              </h3>

              <div className="mt-5 w-full bg-slate-900/60 border border-slate-800 group-hover:border-purple-500/40 py-2.5 rounded-2xl transition duration-300">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium block mb-0.5">Total Volume</span>
                <span className="text-base text-pink-400 font-extrabold tracking-wide">{artist.sales}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopArtists;