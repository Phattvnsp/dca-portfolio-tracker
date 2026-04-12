'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, History, TrendingUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/add-record', label: 'Add Record', icon: PlusCircle },
  { href: '/history', label: 'History', icon: History },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* ─── Logo / Title ─── */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/15">
          <TrendingUp className="h-5 w-5 text-mint-dark" />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight text-sidebar-foreground">
            DCA Tracker
          </h1>
          <p className="text-xs text-muted-foreground">Portfolio Manager</p>
        </div>
      </div>

      <Separator className="mx-4 w-auto" />

      {/* ─── Navigation ─── */}
      <nav className="flex-1 px-3 py-4">
        <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-mint/12 text-mint-dark shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] transition-colors ${
                      isActive ? 'text-mint-dark' : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  />
                  {item.label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-mint-dark" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ─── Footer ─── */}
      <div className="px-6 py-4">
        <div className="rounded-lg bg-mint/8 px-4 py-3">
          <p className="text-xs font-medium text-mint-dark">DCA Portfolio Tracker</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
