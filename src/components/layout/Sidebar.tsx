"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { ROUTES } from "@/lib/constants/routes";
import {
  HiOutlineSquares2X2,
  HiOutlineBanknotes,
  HiOutlinePlus,
  HiOutlineTrophy,
  HiOutlineChartPie,
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineAcademicCap,
  HiOutlineCog6Tooth,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi2";
import clsx from "clsx";

const navItems = [
  { href: ROUTES.DASHBOARD, icon: HiOutlineSquares2X2, label: "Dashboard" },
  { href: ROUTES.TRANSACTIONS, icon: HiOutlineBanknotes, label: "Transactions" },
  { href: ROUTES.BUDGET, icon: HiOutlineChartPie, label: "Budget" },
  { href: ROUTES.BILLS, icon: HiOutlineDocumentText, label: "Bills & EMI" },
  { href: ROUTES.CHALLENGES, icon: HiOutlineTrophy, label: "Challenges" },
  { href: ROUTES.ASSISTANT, icon: HiOutlineSparkles, label: "AI Assistant" },
  { href: ROUTES.LEARN, icon: HiOutlineAcademicCap, label: "Learn" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const name = profile?.displayName || user?.displayName || "User";
  const initial = name.charAt(0).toUpperCase();

  const isActive = (href: string) => {
    if (href === ROUTES.DASHBOARD) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen fixed left-0 top-0 bg-surface border-r border-border-subtle z-40 transition-colors duration-300">
      {/* Brand */}
      <div className="px-7 py-6 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
            <span className="text-lg font-extrabold text-white">F</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">FinWell</h1>
            <p className="text-[11px] text-muted font-medium">Financial Wellbeing</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted hover:bg-surface-overlay hover:text-foreground"
              )}
            >
              <item.icon className={clsx("w-5 h-5", active ? "text-primary" : "text-muted")} />
              {item.label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}

        <Link
          href={ROUTES.ADD_TRANSACTION}
          className="flex items-center gap-3 px-4 py-3 mt-4 rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary-dark transition-all"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Transaction
        </Link>
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-border-subtle space-y-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-muted hover:bg-surface-overlay hover:text-foreground transition-all"
        >
          {theme === "dark" ? (
            <HiOutlineSun className="w-5 h-5 text-accent" />
          ) : (
            <HiOutlineMoon className="w-5 h-5 text-muted" />
          )}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        <Link
          href={ROUTES.SETTINGS}
          className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
            pathname === ROUTES.SETTINGS
              ? "bg-primary/10 text-primary"
              : "text-muted hover:bg-surface-overlay hover:text-foreground"
          )}
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-border-subtle flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{initial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{name}</p>
            <p className="text-[11px] text-muted truncate">{user?.email}</p>
          </div>
          <HiOutlineCog6Tooth className="w-4 h-4 text-muted" />
        </Link>
      </div>
    </aside>
  );
}
