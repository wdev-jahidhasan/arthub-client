"use client";

import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const UserProfileMenu = ({ user, handleSignOut, profileDetailsRef, closeMenu }) => (
  <details ref={profileDetailsRef} className="relative">
    <summary className="list-none cursor-pointer flex items-center select-none">
      {user?.image ? (
        <img
          src={user.image}
          alt={user?.name || "User Avatar"}
          className="w-9 h-9 rounded-full object-cover border-2 border-[#E641B2] hover:scale-105 transition-transform"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-[#7A156E] text-white flex items-center justify-center font-bold text-sm border-2 border-[#E641B2]">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      )}
    </summary>

    <div className="fixed inset-0 z-40 bg-transparent" onClick={closeMenu}></div>

    {/* Dropdown Box */}
    <div className="absolute right-0 mt-2 w-52 bg-slate-900 rounded-xl p-3 flex flex-col space-y-1 z-50 border border-slate-800 shadow-2xl">
      <div className="px-3 py-2 border-b border-slate-800 mb-1">
        <p className="text-sm font-semibold text-slate-100 truncate">{user?.name}</p>
        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
      </div>

      <Link
        href="/profile"
        onClick={closeMenu}
        className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-[#E641B2] hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        My Profile
      </Link>

      <Link
        href="/dashboard"
        onClick={closeMenu}
        className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-[#E641B2] hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Dashboard
      </Link>

      <div className="border-t border-slate-800 my-1 pt-1">
        <button
          onClick={handleSignOut}
          className="w-full text-left px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log Out
        </button>
      </div>
    </div>
  </details>
);

export default function Navbar() {
  const router = useRouter();
  const detailsRef = useRef(null);
  const profileDetailsRef = useRef(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const closeMenu = () => {
    if (detailsRef.current) detailsRef.current.removeAttribute("open");
    if (profileDetailsRef.current) profileDetailsRef.current.removeAttribute("open");
  };

  const handleSignOut = async () => {
    closeMenu();
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  return (
    <nav className="bg-slate-950 text-slate-100 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* MOBILE VIEW (Screen < sm) */}
        <div className="flex sm:hidden items-center justify-between w-full">
          <details ref={detailsRef} className="relative">
            <summary className="list-none cursor-pointer p-2 border border-slate-800 rounded-lg text-slate-300 hover:text-[#E641B2] select-none transition-colors">
              ☰
            </summary>
            
            <div className="fixed inset-0 z-40 bg-transparent" onClick={closeMenu}></div>

            <div className="absolute left-0 mt-2 w-48 bg-slate-900 rounded-xl p-4 flex flex-col space-y-3 z-50 border border-slate-800 shadow-2xl">
              <Link href="/" onClick={closeMenu} className="text-slate-300 hover:text-[#E641B2] transition-colors font-medium">
                Home
              </Link>
              <Link href="/artworks" onClick={closeMenu} className="text-slate-300 hover:text-[#E641B2] transition-colors font-medium">
                Explore Artworks
              </Link>
            </div>
          </details>

          <Link href="/" className="text-xl font-black tracking-wider text-slate-100">
            Art<span className="text-[#E641B2]">Hub</span>
          </Link>

          <div>
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
            ) : session ? (
              <UserProfileMenu 
                user={user} 
                handleSignOut={handleSignOut} 
                profileDetailsRef={profileDetailsRef}
                closeMenu={closeMenu}
              />
            ) : (
              <Link 
                href="/login" 
                className="bg-[#7A156E] hover:bg-[#A31D93] text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-all shadow-md shadow-[#7A156E]/40 border border-[#A31D93]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* DESKTOP VIEW (Screen >= sm) */}
        <div className="hidden sm:flex items-center justify-between w-full">
          <Link href="/" className="text-2xl font-black tracking-wider text-slate-100">
            Art<span className="text-[#E641B2]">Hub</span>
          </Link>

          <div className="flex items-center space-x-8 text-sm font-semibold text-slate-300">
            <Link href="/" className="hover:text-[#E641B2] transition-colors">
              Home
            </Link>
            <Link href="/artworks" className="hover:text-[#E641B2] transition-colors">
              Explore Artworks
            </Link>

            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-slate-800 animate-pulse" />
            ) : session ? (
              <UserProfileMenu 
                user={user} 
                handleSignOut={handleSignOut} 
                profileDetailsRef={profileDetailsRef}
                closeMenu={closeMenu}
              />
            ) : (
              <Link 
                href="/login" 
                className="bg-[#7A156E] hover:bg-[#A31D93] text-white font-bold px-6 py-2 rounded-lg transition-all transform active:scale-95 shadow-md shadow-[#7A156E]/40 border border-[#A31D93]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}