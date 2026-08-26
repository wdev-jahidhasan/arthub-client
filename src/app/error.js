"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-8xl font-extrabold text-red-500 tracking-widest">Oops!</h1>
      <h2 className="text-2xl font-bold mt-4">Something Went Wrong</h2>
      <p className="text-neutral-400 mt-2 max-w-md">
        An unexpected error occurred. Please try again, or come back later.
      </p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => reset()}
          className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors font-semibold text-white"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 transition-colors font-semibold"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}