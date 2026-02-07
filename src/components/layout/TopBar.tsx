"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { HiOutlineBell, HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function TopBar() {
  const { profile, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const name = profile?.displayName || user?.displayName || "there";
  const firstName = name.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 glass-strong">
      <div className="flex items-center justify-between px-5 py-4 max-w-lg mx-auto lg:max-w-5xl lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.SETTINGS}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-border-subtle lg:hidden"
          >
            <span className="text-sm font-bold text-primary">{initial}</span>
          </Link>
          <div>
            <p className="text-xs text-muted font-medium">{getGreeting()}</p>
            <p className="text-base font-semibold text-foreground">
              {firstName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-raised border border-border-subtle transition-all hover:border-primary/30"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <HiOutlineSun className="w-[18px] h-[18px] text-accent" />
            ) : (
              <HiOutlineMoon className="w-[18px] h-[18px] text-muted" />
            )}
          </button>
          <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-surface-raised border border-border-subtle transition-all hover:border-primary/30">
            <HiOutlineBell className="w-[18px] h-[18px] text-muted" />
          </button>
        </div>
      </div>
    </header>
  );
}
