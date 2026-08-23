"use client";

import Link from "next/link";

export default function Footer() {
  const handleDummyClick = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* MAIN FOOTER CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          {/* 1. Quick Links */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-slate-100 font-bold text-sm tracking-wider uppercase">
              Quick Links
            </h3>
            <Link href="/" onClick={handleDummyClick} className="text-sm text-slate-400 hover:text-[#E641B2] transition-colors cursor-pointer">
              About
            </Link>
            <Link href="/" onClick={handleDummyClick} className="text-sm text-slate-400 hover:text-[#E641B2] transition-colors cursor-pointer">
              Contact
            </Link>
            <Link href="/" onClick={handleDummyClick} className="text-sm text-slate-400 hover:text-[#E641B2] transition-colors cursor-pointer">
              Privacy Policy
            </Link>
          </div>

          {/* 2. Social Media Icons */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-slate-100 font-bold text-sm tracking-wider uppercase">
              Follow Us
            </h3>
            <div className="flex items-center space-x-4">
              {/* Facebook Icon */}
              <Link href="/" onClick={handleDummyClick} aria-label="Facebook" className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-[#E641B2] hover:border-[#7A156E] transition-all cursor-pointer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.6 13.77 5.6c1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 3h-2.33v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </Link>

              {/* Twitter/X Icon */}
              <Link href="/" onClick={handleDummyClick} aria-label="Twitter" className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-[#E641B2] hover:border-[#7A156E] transition-all cursor-pointer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>

              {/* Instagram Icon */}
              <Link href="/" onClick={handleDummyClick} aria-label="Instagram" className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-[#E641B2] hover:border-[#7A156E] transition-all cursor-pointer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* 3. Newsletter Placeholder */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-slate-100 font-bold text-sm tracking-wider uppercase">
              Newsletter
            </h3>
            <p className="text-xs text-slate-400">
              Subscribe to get the latest artwork updates.
            </p>
            <div className="flex items-center space-x-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                readOnly
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#7A156E] w-full cursor-not-allowed"
              />
              <button 
                type="button"
                onClick={handleDummyClick}
                className="bg-[#7A156E] hover:bg-[#A31D93] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-[#A31D93]"
              >
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* 4. Copyright Information */}
        <div className="pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ArtHub. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}