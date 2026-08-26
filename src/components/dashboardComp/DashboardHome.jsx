'use client';

import { useSession } from '@/lib/auth-client';

export default function DashboardHome() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl p-8 min-h-[160px] flex items-center">
        <div className="h-6 w-48 bg-zinc-900 animate-pulse rounded-md" />
      </div>
    );
  }

  const name = session?.user?.name || 'User 01';
  const role = session?.user?.role || 'user';

  return (
    <div className="w-full min-h-screen bg-black border border-zinc-900 rounded-lg p-8 md:p-10 shadow-2xl">
      <div className="space-y-4">
        {/* Main Title */}
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Hello, <span className="text-pink-500">{name}</span> 👋
        </h1>

        {/* Dynamic Context Sentence */}
        <div className="text-base md:text-xl text-zinc-300 font-medium leading-relaxed">
          Welcome to your{' '}
          <span className="inline-block font-semibold text-pink-400 capitalize px-2.5 py-0.5 rounded-md bg-pink-500/10 border border-pink-500/20">
            {role}
          </span>{' '}
          dashboard.
        </div>

        {/* Secondary Subtitle */}
        <p className="text-sm md:text-base text-zinc-400 font-normal leading-relaxed max-w-2xl">
          Use the sidebar menu to navigate and manage your account details.
        </p>
      </div>
    </div>
  );
}