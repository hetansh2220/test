"use client";

import { useState, useMemo } from "react";
import { useBudget, useSetBudget } from "@/hooks/useBudget";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { getCurrentMonth, getMonthLabel } from "@/lib/utils/dateHelpers";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import clsx from "clsx";

const COLORS = {
  needs: "#3b82f6",
  wants: "#f59e0b",
  emi: "#8b5cf6",
  remaining: "#1e2d3d",
};

export default function BudgetPage() {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const month = getCurrentMonth();
  const { data: budget, isLoading } = useBudget(month);
  const { data: transactions = [] } = useTransactions(month);
  const setBudgetMutation = useSetBudget();

  const [budgetLimit, setBudgetLimit] = useState("");
  const [savingGoal, setSavingGoal] = useState("");
  const [showSetup, setShowSetup] = useState(false);

  const spending = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    return {
      needs: expenses.filter((t) => t.category === "needs").reduce((s, t) => s + t.amount, 0),
      wants: expenses.filter((t) => t.category === "wants").reduce((s, t) => s + t.amount, 0),
      emi: expenses.filter((t) => t.category === "emi").reduce((s, t) => s + t.amount, 0),
      total: expenses.reduce((s, t) => s + t.amount, 0),
    };
  }, [transactions]);

  const totalSavings = transactions.filter((t) => t.type === "savings").reduce((s, t) => s + t.amount, 0);

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const limit = Number(budgetLimit);
    if (limit <= 0) return;
    try {
      await setBudgetMutation.mutateAsync({
        month,
        data: {
          monthlyLimit: limit,
          savingGoal: Number(savingGoal) || 0,
          needsLimit: Math.round(limit * 0.5),
          wantsLimit: Math.round(limit * 0.3),
          emiLimit: Math.round(limit * 0.2),
        },
      });
      showToast("Budget set!", "success");
      setShowSetup(false);
    } catch {
      showToast("Failed to set budget", "error");
    }
  };

  if (isLoading) {
    return <div className="py-4 space-y-4">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-24" />)}</div>;
  }

  if (!budget || showSetup) {
    return (
      <div className="py-4 animate-fade-in">
        <h1 className="text-lg font-bold font-[family-name:var(--font-display)] mb-1">Set Budget</h1>
        <p className="text-sm text-muted mb-8">{getMonthLabel(month)}</p>

        <form onSubmit={handleSetBudget} className="space-y-6 lg:max-w-xl">
          <div>
            <label className="text-[10px] font-semibold text-muted uppercase tracking-widest block mb-2">Monthly Budget</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted/50">₹</span>
              <input
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                placeholder={String(profile?.monthlyIncome || 50000)}
                className="w-full h-14 pl-10 pr-4 rounded-2xl bg-surface border border-border-subtle text-xl font-bold text-foreground font-[family-name:var(--font-mono)] placeholder:text-muted/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
            <p className="text-[10px] text-muted mt-2">We suggest 50% Needs, 30% Wants, 20% EMI</p>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-muted uppercase tracking-widest block mb-2">Saving Goal (optional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted/50">₹</span>
              <input
                type="number"
                value={savingGoal}
                onChange={(e) => setSavingGoal(e.target.value)}
                placeholder="0"
                className="w-full h-14 pl-10 pr-4 rounded-2xl bg-surface border border-border-subtle text-xl font-bold text-foreground font-[family-name:var(--font-mono)] placeholder:text-muted/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={setBudgetMutation.isPending || !budgetLimit}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
          >
            {setBudgetMutation.isPending ? "Setting..." : "Set Budget"}
          </button>
        </form>
      </div>
    );
  }

  const remaining = Math.max(0, budget.monthlyLimit - spending.total);
  const chartData = [
    { name: "Needs", value: spending.needs, color: COLORS.needs },
    { name: "Wants", value: spending.wants, color: COLORS.wants },
    { name: "EMI", value: spending.emi, color: COLORS.emi },
    { name: "Remaining", value: remaining, color: COLORS.remaining },
  ].filter((d) => d.value > 0);

  const usagePercent = budget.monthlyLimit > 0 ? Math.round((spending.total / budget.monthlyLimit) * 100) : 0;
  const savingsPercent = budget.savingGoal > 0 ? Math.min(100, Math.round((totalSavings / budget.savingGoal) * 100)) : 0;

  return (
    <div className="py-4 animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg lg:text-xl font-bold font-[family-name:var(--font-display)]">Budget</h1>
          <p className="text-xs text-muted">{getMonthLabel(month)}</p>
        </div>
        <button
          onClick={() => {
            setBudgetLimit(String(budget.monthlyLimit));
            setSavingGoal(String(budget.savingGoal || ""));
            setShowSetup(true);
          }}
          className="text-xs text-primary font-semibold hover:text-primary-light transition-colors"
        >
          Edit
        </button>
      </div>

      {/* Donut chart + Saving goal: side-by-side on desktop */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
      <div className="card card-glow p-5">
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 lg:w-40 lg:h-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={56}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1">
            <p className="text-3xl font-extrabold font-[family-name:var(--font-display)]">
              {usagePercent}<span className="text-sm text-muted">%</span>
            </p>
            <p className="text-[10px] text-muted">of {formatCurrency(budget.monthlyLimit)} used</p>
            <div className="mt-3 space-y-2.5">
              {[
                { label: "Needs", value: spending.needs, limit: budget.needsLimit, color: COLORS.needs },
                { label: "Wants", value: spending.wants, limit: budget.wantsLimit, color: COLORS.wants },
                { label: "EMI", value: spending.emi, limit: budget.emiLimit, color: COLORS.emi },
              ].map((item) => {
                const pct = item.limit > 0 ? Math.min(100, (item.value / item.limit) * 100) : 0;
                return (
                  <div key={item.label}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] text-muted flex-1">{item.label}</span>
                      <span className="text-[10px] font-bold text-foreground font-[family-name:var(--font-mono)]">
                        {formatCurrency(item.value)} <span className="text-muted font-normal">/ {formatCurrency(item.limit)}</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-overlay overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: pct > 90 ? "#ef4444" : item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Saving goal */}
      {budget.savingGoal > 0 && (
        <div className="card card-glow p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-widest">Saving Goal</h3>
            <span className="text-xs font-bold text-savings">{savingsPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-surface-overlay overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-savings to-savings-light transition-all duration-700"
              style={{ width: `${savingsPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-muted">{formatCurrency(totalSavings)} saved</span>
            <span className="text-[10px] text-muted">Goal: {formatCurrency(budget.savingGoal)}</span>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
