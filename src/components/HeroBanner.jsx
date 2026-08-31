"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const bannerImages = [
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80",
];

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[520px] md:h-[600px] bg-[#030712] overflow-hidden border-b border-slate-800/60">
      {bannerImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={image}
            alt={`Digital Artwork ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-[#030712]/40 z-10" />
        </div>
      ))}

      <div className="relative z-20 h-full max-w-4xl mx-auto px-6 flex flex-col justify-center items-center text-center">
        {/* 60fps Ultra Smooth Clip-Path Typewriter Animation (Responsive font size added) */}
        <div className="relative overflow-hidden py-2 w-full">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight flex flex-wrap justify-center items-center gap-x-2"
            initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
            animate={{
              clipPath: [
                "polygon(0 0, 0 0, 0 100%, 0 100%)",
                "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                "polygon(0 0, 0 0, 0 100%, 0 100%)",
              ],
            }}
            transition={{
              duration: 7, 
              repeat: Infinity, 
              ease: "easeInOut", 
              times: [0, 0.45, 0.75, 1],
            }}
          >
            <span>Discover & Buy</span>{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent">
              Original Art
            </span>
          </motion.h1>
        </div>

        <p className="mt-4 text-slate-300 text-sm sm:text-base md:text-xl max-w-2xl">
          Explore unique masterworks created by independent artists worldwide.
        </p>

        <div className="mt-8">
          <Link href={"/artworks"}>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-xl shadow-purple-950/50 transition duration-300 transform hover:-translate-y-0.5">
              Browse Artworks
            </button>
          </Link>
        </div>
      </div>

      {/* Arrow positions adjusted for mobile (top-[62%] on mobile, top-1/2 on desktop) */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1))}
        className="absolute left-4 top-[62%] md:top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/60 text-slate-300 hover:text-white hover:bg-purple-600/80 backdrop-blur-md border border-slate-700/50 transition duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % bannerImages.length)}
        className="absolute right-4 top-[62%] md:top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/60 text-slate-300 hover:text-white hover:bg-purple-600/80 backdrop-blur-md border border-slate-700/50 transition duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {bannerImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-8 bg-gradient-to-r from-purple-500 to-pink-500"
                : "w-2.5 bg-slate-600/60 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;