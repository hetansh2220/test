"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  HiOutlineSquares2X2,
  HiOutlineBanknotes,
  HiOutlinePlus,
  HiOutlineTrophy,
  HiOutlineBars3,
} from "react-icons/hi2";
import clsx from "clsx";
import { ROUTES } from "@/lib/constants/routes";
import Link from "next/link";

const mainTabs = [
  { href: ROUTES.DASHBOARD, icon: HiOutlineSquares2X2, label: "Home" },
  { href: ROUTES.TRANSACTIONS, icon: HiOutlineBanknotes, label: "Money" },
  { href: ROUTES.ADD_TRANSACTION, icon: HiOutlinePlus, label: "Add", isFab: true },
  { href: ROUTES.CHALLENGES, icon: HiOutlineTrophy, label: "Goals" },
  { href: "__more__", icon: HiOutlineBars3, label: "More" },
];

const moreItems = [
  { href: ROUTES.BUDGET, label: "Budget" },
  { href: ROUTES.BILLS, label: "Bills & EMI" },
  { href: ROUTES.ASSISTANT, label: "AI Assistant" },
  { href: ROUTES.LEARN, label: "Learn" },
  { href: ROUTES.SETTINGS, label: "Settings" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);

  const isActive = (href: string) => {
    if (href === ROUTES.DASHBOARD) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {showMore && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-20 left-4 right-4 bg-surface-raised border border-border-subtle rounded-2xl p-2 animate-scale-in origin-bottom-right shadow-xl">
            {moreItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setShowMore(false);
                }}
                className={clsx(
                  "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname.startsWith(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:bg-surface-overlay hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong pb-safe lg:hidden">
        <div className="flex items-center justify-around px-2 h-16 max-w-lg mx-auto">
          {mainTabs.map((tab) => {
            if (tab.isFab) {
              return (
                <Link
                  key="fab"
                  href={tab.href}
                  className="relative -mt-5 flex items-center justify-center w-13 h-13 rounded-2xl bg-primary shadow-lg shadow-primary/25 hover:bg-primary-dark active:scale-95 transition-all"
                >
                  <HiOutlinePlus className="w-6 h-6 text-white" strokeWidth={2.5} />
                </Link>
              );
            }

            const active = tab.href === "__more__" ? showMore : isActive(tab.href);

            return (
              <button
                key={tab.href}
                onClick={() => {
                  if (tab.href === "__more__") {
                    setShowMore(!showMore);
                  } else {
                    setShowMore(false);
                    router.push(tab.href);
                  }
                }}
                className={clsx(
                  "flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all",
                  active ? "text-primary" : "text-muted"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold tracking-wide">{tab.label}</span>
                {active && (
                  <div className="absolute bottom-1 w-4 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
