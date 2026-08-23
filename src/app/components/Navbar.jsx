"use client";

import Link from "next/link";
import { useRef } from "react";

export default function Navbar() {
  const detailsRef = useRef(null);

  const closeMenu = () => {
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open");
    }
  };

  return (
    <nav className="bg-slate-950 text-slate-100 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* MOBILE VIEW (Screen < sm) */}
        <div className="flex sm:hidden items-center justify-between w-full">
          
          {/* 1. Hamburger Menu (Left) */}
          <details ref={detailsRef} className="relative">
            <summary className="list-none cursor-pointer p-2 border border-slate-800 rounded-lg text-slate-300 hover:text-[#E641B2] select-none transition-colors">
              ☰
            </summary>
            
            {/* Backdrop Overlay */}
            <div 
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={closeMenu}
            ></div>

            {/* Mobile Dropdown Content */}
            <div className="absolute left-0 mt-2 w-48 bg-slate-900 rounded-xl p-4 flex flex-col space-y-3 z-50 border border-slate-800 shadow-2xl">
              <Link href="/" onClick={closeMenu} className="text-slate-300 hover:text-[#E641B2] transition-colors font-medium">
                Home
              </Link>
              <Link href="/artworks" onClick={closeMenu} className="text-slate-300 hover:text-[#E641B2] transition-colors font-medium">
                Explore Artworks
              </Link>
            </div>
          </details>

          {/* 2. Logo (Center) */}
          <Link href="/" className="text-xl font-black tracking-wider text-slate-100">
            Art<span className="text-[#E641B2]">Hub</span>
          </Link>

          {/* 3. Sign In Button (Right - Highlighted) */}
          <Link 
            href="/login" 
            className="bg-[#7A156E] hover:bg-[#A31D93] text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-all shadow-md shadow-[#7A156E]/40 border border-[#A31D93]"
          >
            Sign In
          </Link>

        </div>

        {/* DESKTOP VIEW (Screen >= sm) */}
        <div className="hidden sm:flex items-center justify-between w-full">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-wider text-slate-100">
            Art<span className="text-[#E641B2]">Hub</span>
          </Link>

          {/* Nav Links + Sign In */}
          <div className="flex items-center space-x-8 text-sm font-semibold text-slate-300">
            <Link href="/" className="hover:text-[#E641B2] transition-colors">
              Home
            </Link>
            <Link href="/artworks" className="hover:text-[#E641B2] transition-colors">
              Explore Artworks
            </Link>
            <Link 
              href="/login" 
              className="bg-[#7A156E] hover:bg-[#A31D93] text-white font-bold px-6 py-2 rounded-lg transition-all transform active:scale-95 shadow-md shadow-[#7A156E]/40 border border-[#A31D93]"
            >
              Sign In
            </Link>
          </div>

        </div>

      </div>
    </nav>
  );
}