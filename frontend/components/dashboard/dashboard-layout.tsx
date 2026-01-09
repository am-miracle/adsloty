"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Calendar,
  DollarSign,
  User,
  Bell,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import Logo from "../ui/logo";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/requests", label: "Ad Requests", icon: Mail },
  { href: "/dashboard/schedule", label: "Schedule", icon: Calendar },
  { href: "/dashboard/payouts", label: "Payouts", icon: DollarSign },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background-dark">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-surface-dark border-r border-border
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 border-b border-border flex items-center justify-between px-4">
            <Link href="/dashboard">
              <Logo />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-border transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          <nav className="px-4 py-4 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                    transition-colors
                    ${
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "text-text-secondary hover:bg-surface-border hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto px-4 py-4 border-t border-border">
            <button
              onClick={() => {
                setSidebarOpen(false);
                // handle logout here
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                text-sm font-medium text-red-400
                hover:bg-red-500/10 transition-colors"
            >
              <X className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1 lg:ml-64">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-surface-dark">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-border"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-lg hover:bg-surface-border">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>

            <ProfileDropdown />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current) return;

    if (open) {
      gsap.fromTo(
        menuRef.current,
        {
          opacity: 0,
          y: -8,
          scale: 0.98,
          pointerEvents: "none",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          pointerEvents: "auto",
          duration: 0.25,
          ease: "power3.out",
        },
      );
    } else {
      gsap.to(menuRef.current, {
        opacity: 0,
        y: -8,
        scale: 0.98,
        pointerEvents: "none",
        duration: 0.2,
        ease: "power3.in",
      });
    }
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg
          text-text-secondary hover:text-white hover:bg-surface-border transition"
      >
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-purple-600 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        ref={menuRef}
        className="absolute right-0 mt-2 w-52 rounded-xl
          bg-surface-dark border border-border shadow-xl
          opacity-0 pointer-events-none z-10"
      >
        <div className="py-2">
          <Link
            href="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-text-secondary
              hover:bg-surface-border hover:text-white transition"
          >
            Profile
          </Link>

          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-text-secondary
              hover:bg-surface-border hover:text-white transition"
          >
            Account Settings
          </Link>

          <div className="my-2 h-px bg-border" />

          <button
            onClick={() => {
              setOpen(false);
              // handle logout
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-400
              hover:bg-red-500/10 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
