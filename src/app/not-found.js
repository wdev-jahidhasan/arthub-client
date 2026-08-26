import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-8xl font-extrabold text-red-500 tracking-widest">404</h1>
      <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>
      <p className="text-neutral-400 mt-2">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-6 py-2 mt-5 rounded-lg border border-neutral-700 hover:bg-neutral-800 transition-colors font-semibold"
      >
        Go Home
      </Link>
    </div>
  );
}