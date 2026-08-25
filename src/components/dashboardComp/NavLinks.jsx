'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks({ items = [] }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-2">
      {items.map((item, index) => {
        const isActive = pathname === item.href;
        const isHomePage = item.href === '/';
        
        const Icon = item.icon;

        return (
          <Link
            key={item.href || index}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
              isHomePage
                ? 'text-white border-transparent hover:bg-white/10 hover:border-white/20'
                : isActive
                ? 'bg-pink-500/10 text-pink-400 border-pink-500/60 shadow-lg shadow-pink-950/20'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >

            {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}