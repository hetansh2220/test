"use client";

import { useMemo } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useTransactions } from "@/hooks/useTransactions";
import { useBudget } from "@/hooks/useBudget";
import { useBills } from "@/hooks/useBills";
import { useChallenges } from "@/hooks/useChallenges";
import { getCurrentMonth } from "@/lib/utils/dateHelpers";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { calculateHealthScore } from "@/lib/utils/healthScore";
import { generateAlerts } from "@/lib/utils/budgetAlerts";
import { isOverdue, isDueSoon } from "@/lib/utils/dateHelpers";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import {
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineBanknotes,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import clsx from "clsx";

export default function DashboardPage() {
  const { profile } = useAuth();
  const month = getCurrentMonth();
  const { data: transactions = [] } = useTransactions(month);
  const { data: budget } = useBudget(month);
  const { data: bills = [] } = useBills();
  const { data: challenges = [] } = useChallenges();

  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const savings = transactions.filter((t) => t.type === "savings").reduce((s, t) => s + t.amount, 0);
    return { income, expenses, savings };
  }, [transactions]);

  const health = useMemo(
    () => calculateHealthScore(transactions, budget ?? null, bills, challenges, profile?.monthlyIncome || 0),
    [transactions, budget, bills, challenges, profile]
  );

  const alerts = useMemo(
    () => generateAlerts(transactions, budget ?? null, bills, challenges),
    [transactions, budget, bills, challenges]
  );

  const overdueBills = bills.filter((b) => isOverdue(b.dueDate, b.isPaid));
  const dueSoonBills = bills.filter((b) => !b.isPaid && isDueSoon(b.dueDate, 7) && !isOverdue(b.dueDate, b.isPaid));
  const unpaidBillsTotal = bills.filter((b) => !b.isPaid).reduce((s, b) => s + b.amount, 0);
  const activeChallenges = challenges.filter((c) => c.status === "active");

  const budgetUsage = budget && budget.monthlyLimit > 0 ? Math.min(100, (totals.expenses / budget.monthlyLimit) * 100) : 0;

  // Health gauge SVG
  const gaugeRadius = 52;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeOffset = gaugeCircumference - (health.score / 100) * gaugeCircumference;

  return (
    <div className="py-4 stagger">
      {/* ─── Desktop: 3-column grid / Mobile: stacked ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

      {/* ─── Current Balance ────────────────── */}
      <div className="card card-glow p-5 lg:col-span-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <h3 className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-1">Current Balance</h3>
        <p className={clsx(
          "text-3xl lg:text-4xl font-extrabold font-[family-name:var(--font-display)]",
          totals.income - totals.expenses - totals.savings >= 0 ? "text-foreground" : "text-danger"
        )}>
          {formatCurrency(totals.income - totals.expenses - totals.savings)}
        </p>
        <p className="text-[10px] text-muted mt-1">Income − Expenses − Savings this month</p>
      </div>

      {/* ─── Financial Overview ───────────── */}
      <Link href={ROUTES.TRANSACTIONS} className="card card-glow p-5 lg:col-span-3 block">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-widest">This Month</h3>
          <HiOutlineArrowRight className="w-4 h-4 text-muted" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 lg:p-5 rounded-2xl bg-success/5 border border-success/10">
            <HiOutlineArrowTrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-success mb-1" />
            <p className="text-lg lg:text-2xl font-bold text-success font-[family-name:var(--font-display)]">
              {formatCurrency(totals.income)}
            </p>
            <p className="text-[10px] lg:text-xs text-muted font-medium mt-0.5">Income</p>
          </div>
          <div className="flex flex-col items-center p-3 lg:p-5 rounded-2xl bg-danger/5 border border-danger/10">
            <HiOutlineArrowTrendingDown className="w-5 h-5 lg:w-6 lg:h-6 text-danger mb-1" />
            <p className="text-lg lg:text-2xl font-bold text-danger font-[family-name:var(--font-display)]">
              {formatCurrency(totals.expenses)}
            </p>
            <p className="text-[10px] lg:text-xs text-muted font-medium mt-0.5">Expenses</p>
          </div>
          <div className="flex flex-col items-center p-3 lg:p-5 rounded-2xl bg-savings/5 border border-savings/10">
            <HiOutlineBanknotes className="w-5 h-5 lg:w-6 lg:h-6 text-savings mb-1" />
            <p className="text-lg lg:text-2xl font-bold text-savings font-[family-name:var(--font-display)]">
              {formatCurrency(totals.savings)}
            </p>
            <p className="text-[10px] lg:text-xs text-muted font-medium mt-0.5">Savings</p>
          </div>
        </div>
      </Link>
      </div>

      {/* ─── Health Score + Budget + Bills row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Health Score */}
        <div className="card card-glow p-5 flex flex-col items-center justify-center">
          <div className="relative w-28 h-28">
            <svg className="circular-progress w-28 h-28" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={gaugeRadius} fill="none" stroke="var(--color-border-subtle)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r={gaugeRadius}
                fill="none"
                stroke={health.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={gaugeCircumference}
                strokeDashoffset={gaugeOffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold font-[family-name:var(--font-display)]" style={{ color: health.color }}>
                {health.score}
              </span>
              <span className="text-[10px] font-semibold text-muted">/ 100</span>
            </div>
          </div>
          <p className="text-xs font-bold mt-2" style={{ color: health.color }}>{health.label}</p>
          <p className="text-[10px] text-muted mb-3">Financial Health</p>
          <div className="w-full space-y-1">
            {[
              { label: "Budget", value: health.breakdown.budgetAdherence },
              { label: "Savings", value: health.breakdown.savingsRate },
              { label: "Bills", value: health.breakdown.billsPunctuality },
              { label: "Goals", value: health.breakdown.challengeParticipation },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-[9px] text-muted w-10">{item.label}</span>
                <div className="flex-1 h-1 rounded-full bg-surface-overlay overflow-hidden">
                  <div className="h-full rounded-full bg-primary/60 transition-all duration-500" style={{ width: `${item.value}%` }} />
                </div>
                <span className="text-[9px] text-muted w-6 text-right">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Progress */}
        <Link href={ROUTES.BUDGET} className="card card-glow p-5 flex flex-col">
          <h3 className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3">Budget</h3>
          {budget ? (
            <>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-2xl font-extrabold font-[family-name:var(--font-display)]">
                  {Math.round(budgetUsage)}
                  <span className="text-sm text-muted">%</span>
                </p>
                <p className="text-[10px] text-muted mt-0.5">of {formatCurrency(budget.monthlyLimit)}</p>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-overlay mt-3 overflow-hidden">
                <div
                  className={clsx("h-full rounded-full transition-all duration-700", {
                    "bg-success": budgetUsage < 60,
                    "bg-warning": budgetUsage >= 60 && budgetUsage < 85,
                    "bg-danger": budgetUsage >= 85,
                  })}
                  style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-xs text-muted text-center">No budget set</p>
              <span className="text-xs text-primary font-semibold mt-1">Set up →</span>
            </div>
          )}
        </Link>

      {/* ─── Bills Summary ────────────────── */}
      <Link href={ROUTES.BILLS} className="card card-glow p-5 col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-widest">Bills & EMI</h3>
          <HiOutlineArrowRight className="w-4 h-4 text-muted" />
        </div>
        <div className="flex flex-wrap gap-2">
          {overdueBills.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-danger/10 border border-danger/20">
              <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
              <span className="text-xs font-semibold text-danger">{overdueBills.length} overdue</span>
            </div>
          )}
          {dueSoonBills.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-warning/10 border border-warning/20">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-xs font-semibold text-warning">{dueSoonBills.length} due soon</span>
            </div>
          )}
          {overdueBills.length === 0 && dueSoonBills.length === 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/10 border border-success/20">
              <HiOutlineCheckCircle className="w-4 h-4 text-success" />
              <span className="text-xs font-semibold text-success">All clear</span>
            </div>
          )}
          {unpaidBillsTotal > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-overlay">
              <span className="text-xs font-semibold text-muted">{formatCurrency(unpaidBillsTotal)} due</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-overlay">
            <span className="text-xs font-semibold text-muted">{bills.length} total</span>
          </div>
        </div>
      </Link>
      </div>

      {/* ─── Challenges + Alerts row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* ─── Challenge Progress ───────────── */}
      {activeChallenges.length > 0 && (
        <Link href={ROUTES.CHALLENGES} className="card card-glow p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-widest">Active Challenges</h3>
            <HiOutlineArrowRight className="w-4 h-4 text-muted" />
          </div>
          <div className="space-y-3">
            {activeChallenges.slice(0, 2).map((ch) => {
              const progress = ch.targetAmount > 0 ? Math.min(100, (ch.savedAmount / ch.targetAmount) * 100) : 0;
              return (
                <div key={ch.id} className="flex items-center gap-3">
                  <div className="relative w-10 h-10 shrink-0">
                    <svg className="circular-progress w-10 h-10" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="var(--color-border-subtle)" strokeWidth="3" />
                      <circle
                        cx="20" cy="20" r="16" fill="none"
                        stroke="var(--color-savings)" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 16}`}
                        strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress / 100)}`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-savings">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{ch.title}</p>
                    <p className="text-[10px] text-muted">{formatCurrency(ch.savedAmount)} / {formatCurrency(ch.targetAmount)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Link>
      )}

      {/* ─── Smart Alerts ─────────────────── */}
      {alerts.length > 0 && (
        <div className="card p-5">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Insights</h3>
          <div className="space-y-2">
            {alerts.slice(0, 4).map((alert) => {
              const iconMap = {
                danger: <HiOutlineExclamationTriangle className="w-4 h-4 text-danger shrink-0" />,
                warning: <HiOutlineExclamationTriangle className="w-4 h-4 text-warning shrink-0" />,
                success: <HiOutlineCheckCircle className="w-4 h-4 text-success shrink-0" />,
                info: <HiOutlineInformationCircle className="w-4 h-4 text-primary shrink-0" />,
              };
              const bgMap = {
                danger: "bg-danger/5 border-danger/10",
                warning: "bg-warning/5 border-warning/10",
                success: "bg-success/5 border-success/10",
                info: "bg-primary/5 border-primary/10",
              };
              return (
                <div key={alert.id} className={clsx("flex items-start gap-3 p-3 rounded-xl border", bgMap[alert.type])}>
                  <div className="mt-0.5">{iconMap[alert.type]}</div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{alert.title}</p>
                    <p className="text-[10px] text-muted mt-0.5 leading-relaxed">{alert.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
