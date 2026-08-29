import React from "react";
import { Palette, Monitor, Component, Pencil } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    name: "Painting",
    filter: "painting",
    icon: Palette,
    description: "Classic canvas, acrylics & oil masterworks.",
  },
  {
    name: "Digital Art",
    filter: "digital",
    icon: Monitor,
    description: "Modern 3D render, pixel & vector designs.",
  },
  {
    name: "Sculpture",
    filter: "sculpture",
    icon: Component,
    description: "Handcrafted 3D forms, clay & stone structures.",
  },
  {
    name: "Sketch",
    filter: "sketch",
    icon: Pencil,
    description: "Hand-drawn graphite, charcoal & ink artwork.",
  },
];

const ArtCategories = () => {
  return (
    <section className="py-20 px-6 bg-[#030712]">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
          Art Categories
        </h2>
        <p className="text-slate-400 mb-14 text-sm md:text-base">
          Explore curated collections by your favorite medium
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.filter}
                href={`/artworks?category=${cat.filter}`}
                className="group relative p-7 rounded-3xl bg-gradient-to-b from-[#0e1322] to-[#070b14] border border-slate-800/80 hover:border-purple-500/60 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-950/30 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
              >
                {/* Background Ambient Glow */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/10 rounded-full blur-xl group-hover:bg-purple-600/25 transition duration-500" />

                {/* Icon Container with Gradient Border */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 group-hover:border-pink-500/50 mb-5 group-hover:scale-110 transition duration-300 shadow-inner">
                  <Icon className="w-8 h-8 text-purple-400 group-hover:text-pink-400 transition duration-300" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition duration-300 mb-2">
                  {cat.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ArtCategories;