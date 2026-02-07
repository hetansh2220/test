"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTransactions, useDeleteTransaction } from "@/hooks/useTransactions";
import { getCurrentMonth, getMonthLabel, getPreviousMonth, getNextMonth } from "@/lib/utils/dateHelpers";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { getCategoryInfo } from "@/lib/constants/categories";
import { ROUTES } from "@/lib/constants/routes";
import { format } from "date-fns";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineBanknotes,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi2";
import clsx from "clsx";

export default function TransactionsPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const { data: transactions = [], isLoading } = useTransactions(month);
  const deleteMutation = useDeleteTransaction();

  // Monthly totals
  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const savings = transactions.filter((t) => t.type === "savings").reduce((s, t) => s + t.amount, 0);
    return { income, expenses, savings };
  }, [transactions]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof transactions>();
    transactions.forEach((t) => {
      const dateKey = format(t.date.toDate(), "yyyy-MM-dd");
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(t);
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [transactions]);

  const typeConfig = {
    income: { icon: HiOutlineArrowTrendingUp, color: "text-success", prefix: "+" },
    expense: { icon: HiOutlineArrowTrendingDown, color: "text-danger", prefix: "-" },
    savings: { icon: HiOutlineBanknotes, color: "text-savings", prefix: "+" },
  };

  return (
    <div className="py-4 animate-fade-in">
      {/* Month picker */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setMonth(getPreviousMonth(month))}
          className="w-10 h-10 rounded-xl bg-surface-overlay border border-border-subtle flex items-center justify-center hover:border-border transition-colors"
        >
          <HiOutlineChevronLeft className="w-5 h-5 text-muted" />
        </button>
        <h2 className="text-sm lg:text-base font-bold font-[family-name:var(--font-display)] text-foreground">
          {getMonthLabel(month)}
        </h2>
        <button
          onClick={() => setMonth(getNextMonth(month))}
          disabled={month >= getCurrentMonth()}
          className="w-10 h-10 rounded-xl bg-surface-overlay border border-border-subtle flex items-center justify-center hover:border-border transition-colors disabled:opacity-30"
        >
          <HiOutlineChevronRight className="w-5 h-5 text-muted" />
        </button>
      </div>

      {/* Monthly summary */}
      {!isLoading && transactions.length > 0 && (
        <div className="card p-4 mb-6 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-[10px] text-muted font-semibold uppercase tracking-widest">Income</p>
            <p className="text-sm font-bold text-success font-[family-name:var(--font-mono)]">{formatCurrency(totals.income)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted font-semibold uppercase tracking-widest">Expenses</p>
            <p className="text-sm font-bold text-danger font-[family-name:var(--font-mono)]">{formatCurrency(totals.expenses)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted font-semibold uppercase tracking-widest">Savings</p>
            <p className="text-sm font-bold text-savings font-[family-name:var(--font-mono)]">{formatCurrency(totals.savings)}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-surface-overlay flex items-center justify-center mb-4">
            <HiOutlineBanknotes className="w-8 h-8 text-muted" />
          </div>
          <p className="text-sm text-muted font-medium">No transactions yet</p>
          <Link
            href={ROUTES.ADD_TRANSACTION}
            className="mt-4 px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
          >
            Add your first transaction
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([dateKey, items]) => (
            <div key={dateKey}>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-2 px-1">
                {format(new Date(dateKey), "EEEE, dd MMM")}
              </p>
              <div className="space-y-2">
                {items.map((t) => {
                  const cfg = typeConfig[t.type];
                  const Icon = cfg.icon;
                  const catInfo = t.category ? getCategoryInfo(t.category) : null;
                  return (
                    <div
                      key={t.id}
                      className="card p-4 flex items-center gap-3 group"
                    >
                      <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", {
                        "bg-success/15": t.type === "income",
                        "bg-danger/15": t.type === "expense",
                        "bg-savings/15": t.type === "savings",
                      })}>
                        <Icon className={clsx("w-5 h-5", cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{t.description || t.type}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {catInfo && (
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                              style={{ color: catInfo.color, backgroundColor: catInfo.bgColor }}
                            >
                              {catInfo.label}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={clsx("text-sm font-bold font-[family-name:var(--font-mono)]", cfg.color)}>
                        {cfg.prefix}{formatCurrency(t.amount)}
                      </p>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${t.description || t.type}"?`)) {
                            deleteMutation.mutate(t.id);
                          }
                        }}
                        className="ml-1 p-1.5 rounded-lg hover:bg-danger/10 transition-all text-danger/50 hover:text-danger/80"
                      >
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAB - mobile only */}
      <Link
        href={ROUTES.ADD_TRANSACTION}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/30 flex items-center justify-center z-30 hover:scale-105 active:scale-95 transition-transform lg:hidden"
      >
        <HiOutlinePlus className="w-7 h-7 text-white" strokeWidth={2.5} />
      </Link>
    </div>
  );
}
