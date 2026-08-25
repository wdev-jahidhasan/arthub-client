'use client';

import { useSession } from '@/lib/auth-client';
import NavLinks from './NavLinks';
import { navConfig } from '@/app/config/navConfig';

export default function DashboardSidebar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-4 text-gray-400 text-sm hidden md:block w-64">Loading menu...</div>;
  }

  const userRole = session?.user?.role || 'user';
  const currentNavItems = navConfig[userRole] || navConfig.user;

  return (
    <aside className="hidden md:block w-64 bg-black p-4 border-r border-white/10 h-full">
      <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-4 px-2">
        {userRole} Menu
      </h2>
      <NavLinks items={currentNavItems} />
    </aside>
  );
}