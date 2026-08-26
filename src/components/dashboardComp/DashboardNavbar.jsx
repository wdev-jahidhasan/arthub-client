'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button, Drawer } from "@heroui/react";
import { useSession } from '@/lib/auth-client';
import NavLinks from './NavLinks';
import { navConfig } from '@/app/config/navConfig';

const DashboardNavbar = () => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const userName = session?.user?.name || 'Guest User';
  const userRole = session?.user?.role || 'user';
  const userPlan = session?.user?.plan || 'Free';
  const currentNavItems = navConfig[userRole] || navConfig.user;

  if (status === 'loading') {
    return (
      <header className="w-full bg-black border-b border-white/10 p-3 sm:px-6 flex items-center justify-between">
        <div className="h-5 w-36 bg-white/10 rounded animate-pulse" />
        <div className="h-5 w-28 bg-white/10 rounded animate-pulse" />
      </header>
    );
  }

  return (
    <header className="w-full bg-black border-b border-white/10 p-3 sm:px-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger Menu Trigger */}
        <div className="md:hidden shrink-0">
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            className="bg-black text-white border border-white/20 h-9 w-9 min-w-0"
            onPress={() => setIsOpen(true)}
          >
            <Menu className="size-4" />
          </Button>
        </div>

        {/* User Greeting & Badges Container */}
        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-white truncate">
            <span className="text-pink-500 capitalize">{userName}</span>
          </h1>

          {/* Role & Plan Badges in One Line */}
          <div className="flex items-center gap-2 text-[10px] sm:text-xs">
            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
              Role: <strong className="text-white capitalize font-semibold">{userRole}</strong>
            </span>

            <span className="px-2 py-0.5 rounded-md bg-pink-500/10 border border-pink-500/20 text-pink-300">
              Plan: <strong className="text-white font-semibold uppercase">{userPlan}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Backdrop>
          <Drawer.Content placement="left" className={'w-[40%]'}>
            <Drawer.Dialog className="bg-black border-r border-white/10">
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading className="text-white capitalize">
                  {userRole} Menu
                </Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                <NavLinks items={currentNavItems} onItemClick={() => setIsOpen(false)} />
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </header>
  );
};

export default DashboardNavbar;