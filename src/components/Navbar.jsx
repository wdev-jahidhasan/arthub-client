"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const UserProfileMenu = ({ user, handleSignOut, isOpen, setIsOpen }) => (
  <div className="relative">
    {/* Profile Avatar Button */}
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center select-none outline-none focus:outline-none"
    >
      {user?.image ? (
        <div className="relative w-9 h-9 min-w-[36px] min-h-[36px] rounded-full overflow-hidden border-2 border-pink-500 hover:scale-105 transition-transform flex-shrink-0">
          <Image
            src={user.image}
            alt={user?.name || "User Avatar"}
            fill
            sizes="36px"
            className="object-cover rounded-full"
            unoptimized={true}
          />
        </div>
      ) : (
        <div className="w-9 h-9 min-w-[36px] min-h-[36px] flex-shrink-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold text-sm border-2 border-pink-500/80 shadow-md">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      )}
    </button>

    {/* Dropdown Menu */}
    {isOpen && (
      <>
        {/* Backdrop for closing dropdown */}
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setIsOpen(false)}
        />

        <div className="absolute right-0 mt-3 w-56 bg-[#070b14] rounded-2xl p-3 flex flex-col space-y-1 z-50 border border-slate-800 shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
          <div className="px-3 py-2.5 border-b border-slate-800/80 mb-1">
            <p className="text-sm font-bold text-slate-100 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-pink-400 hover:bg-slate-800/50 rounded-xl transition flex items-center gap-2.5"
          >
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Profile
          </Link>

          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-pink-400 hover:bg-slate-800/50 rounded-xl transition flex items-center gap-2.5"
          >
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </Link>

          <div className="border-t border-slate-800/80 my-1 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                handleSignOut();
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition flex items-center gap-2.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </>
    )}
  </div>
);

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  if (pathname.includes("dashboard")) {
    return null;
  }

  return (
    <nav className="bg-[#030712] text-slate-100 border-b border-slate-800/60 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* MOBILE VIEW (Screen < sm) */}
        <div className="flex sm:hidden items-center justify-between w-full">
          <div className="relative">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="px-3 py-1.5 border border-slate-800 rounded-xl text-slate-300 hover:text-pink-400 select-none transition bg-slate-900/50"
            >
              ☰
            </button>

            {isNavOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setIsNavOpen(false)}
                />
                <div className="absolute left-0 mt-3 w-52 bg-[#070b14] rounded-2xl p-4 flex flex-col space-y-3 z-50 border border-slate-800 shadow-2xl shadow-purple-950/40">
                  <Link
                    href="/"
                    onClick={() => setIsNavOpen(false)}
                    className="text-slate-300 hover:text-pink-400 transition font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    href="/artworks"
                    onClick={() => setIsNavOpen(false)}
                    className="text-slate-300 hover:text-pink-400 transition font-medium"
                  >
                    Browse Artworks
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsNavOpen(false)}
                    className="text-slate-300 hover:text-pink-400 transition font-medium"
                  >
                    Dashboard
                  </Link>
                </div>
              </>
            )}
          </div>

          <Link href="/" className="text-2xl font-black tracking-wider text-white">
            Art<span className="bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent">Hub</span>
          </Link>

          <div>
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
            ) : session ? (
              <UserProfileMenu
                user={user}
                handleSignOut={handleSignOut}
                isOpen={isProfileOpen}
                setIsOpen={setIsProfileOpen}
              />
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-purple-950/50"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* DESKTOP VIEW (Screen >= sm) */}
        <div className="hidden sm:flex items-center justify-between w-full">
          <Link href="/" className="text-2xl font-black tracking-wider text-white">
            Art<span className="bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent">Hub</span>
          </Link>

          <div className="flex items-center space-x-8 text-sm font-semibold text-slate-300">
            <Link href="/" className="hover:text-pink-400 transition-colors">
              Home
            </Link>
            <Link href="/artworks" className="hover:text-pink-400 transition-colors">
              Browse Artworks
            </Link>
            <Link href="/dashboard" className="hover:text-pink-400 transition-colors">
              Dashboard
            </Link>

            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-slate-800 animate-pulse" />
            ) : session ? (
              <UserProfileMenu
                user={user}
                handleSignOut={handleSignOut}
                isOpen={isProfileOpen}
                setIsOpen={setIsProfileOpen}
              />
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-2.5 rounded-xl transition duration-300 shadow-lg shadow-purple-950/50 transform hover:-translate-y-0.5"
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