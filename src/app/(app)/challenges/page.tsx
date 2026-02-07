"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useChallenges, useAddChallenge } from "@/hooks/useChallenges";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { getCurrentMonth } from "@/lib/utils/dateHelpers";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { generateChallengeSuggestions } from "@/lib/utils/challengeEngine";
import { Timestamp } from "firebase/firestore";
import { HiOutlineTrophy, HiOutlinePlus, HiOutlineSparkles } from "react-icons/hi2";
import clsx from "clsx";

export default function ChallengesPage() {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const { data: challenges = [], isLoading } = useChallenges();
  const { data: transactions = [] } = useTransactions(getCurrentMonth());
  const addChallenge = useAddChallenge();

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const suggestions = useMemo(() => {
    if (!profile) return [];
    const all = generateChallengeSuggestions(
      profile.monthlyIncome,
      totalExpenses,
      profile.profession,
      profile.incomeType
    );
    // Filter out suggestions that are already active or completed
    const existingTitles = new Set(challenges.map((c) => c.title));
    return all.filter((s) => !existingTitles.has(s.title));
  }, [profile, totalExpenses, challenges]);

  const activeChallenges = challenges.filter((c) => c.status === "active");
  const completedChallenges = challenges.filter((c) => c.status === "completed");

  const handleStartChallenge = async (suggestion: typeof suggestions[0]) => {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + suggestion.durationDays);

    try {
      await addChallenge.mutateAsync({
        title: suggestion.title,
        description: suggestion.description,
        targetAmount: suggestion.targetAmount,
        savedAmount: 0,
        frequency: suggestion.frequency,
        perPeriodTarget: suggestion.perPeriodTarget,
        durationDays: suggestion.durationDays,
        startDate: Timestamp.fromDate(now),
        endDate: Timestamp.fromDate(endDate),
        status: "active",
        checkIns: [],
      });
      showToast("Challenge started!", "success");
    } catch {
      showToast("Failed to start challenge", "error");
    }
  };

  if (isLoading) {
    return <div className="py-4 space-y-4">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-28" />)}</div>;
  }

  return (
    <div className="py-4 animate-fade-in space-y-6">
      <h1 className="text-lg lg:text-xl font-bold font-[family-name:var(--font-display)]">Saving Challenges</h1>

      {/* Active challenges */}
      {activeChallenges.length > 0 && (
        <div>
          <h2 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">Active</h2>
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {activeChallenges.map((ch) => {
              const progress = ch.targetAmount > 0 ? Math.min(100, (ch.savedAmount / ch.targetAmount) * 100) : 0;
              const r = 40;
              const circ = 2 * Math.PI * r;
              const offset = circ - (progress / 100) * circ;
              return (
                <Link
                  key={ch.id}
                  href={`/challenges/${ch.id}`}
                  className="card card-glow p-5 flex items-center gap-4 block"
                >
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="circular-progress w-20 h-20" viewBox="0 0 96 96">
                      <circle cx="48" cy="48" r={r} fill="none" stroke="var(--color-border-subtle)" strokeWidth="5" />
                      <circle
                        cx="48" cy="48" r={r} fill="none"
                        stroke="var(--color-savings)" strokeWidth="5" strokeLinecap="round"
                        strokeDasharray={circ} strokeDashoffset={offset}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-savings">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{ch.title}</p>
                    <p className="text-[10px] text-muted mt-1 line-clamp-2">{ch.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-bold text-savings font-[family-name:var(--font-mono)]">
                        {formatCurrency(ch.savedAmount)}
                      </span>
                      <span className="text-[10px] text-muted">/ {formatCurrency(ch.targetAmount)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedChallenges.length > 0 && (
        <div>
          <h2 className="text-[10px] font-bold text-success uppercase tracking-widest mb-3">
            Completed ({completedChallenges.length})
          </h2>
          <div className="space-y-2">
            {completedChallenges.map((ch) => (
              <div key={ch.id} className="card p-4 flex items-center gap-3 opacity-75">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <HiOutlineTrophy className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{ch.title}</p>
                  <p className="text-[10px] text-muted">Saved {formatCurrency(ch.savedAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <HiOutlineSparkles className="w-4 h-4 text-warning" />
          <h2 className="text-[10px] font-bold text-muted uppercase tracking-widest">Suggested For You</h2>
        </div>
        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {suggestions.map((s, i) => (
            <div key={i} className="card p-5">
              <p className="text-sm font-bold text-foreground mb-1">{s.title}</p>
              <p className="text-xs text-muted leading-relaxed mb-3">{s.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-savings font-[family-name:var(--font-mono)]">
                    {formatCurrency(s.targetAmount)}
                  </span>
                  <span className="text-[10px] text-muted">{s.durationDays} days &middot; {s.frequency}</span>
                </div>
                <button
                  onClick={() => handleStartChallenge(s)}
                  disabled={addChallenge.isPending}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-savings/10 text-savings text-xs font-bold hover:bg-savings/20 transition-colors"
                >
                  <HiOutlinePlus className="w-3.5 h-3.5" />
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
