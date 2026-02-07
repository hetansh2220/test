"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChallenges, useCheckIn, useUpdateChallenge } from "@/hooks/useChallenges";
import { useAddTransaction } from "@/hooks/useTransactions";
import { useToast } from "@/providers/ToastProvider";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import clsx from "clsx";

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { data: challenges = [], isLoading } = useChallenges();
  const checkInMutation = useCheckIn();
  const updateChallenge = useUpdateChallenge();
  const addTransaction = useAddTransaction();

  const [checkInAmount, setCheckInAmount] = useState("");

  const challenge = challenges.find((c) => c.id === params.id);

  const progress = useMemo(() => {
    if (!challenge || challenge.targetAmount === 0) return 0;
    return Math.min(100, (challenge.savedAmount / challenge.targetAmount) * 100);
  }, [challenge]);

  if (isLoading) {
    return <div className="py-4 space-y-4">{[1, 2].map((i) => <div key={i} className="skeleton h-32" />)}</div>;
  }

  if (!challenge) {
    return (
      <div className="py-4 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-sm text-muted">Challenge not found</p>
        <button onClick={() => router.back()} className="mt-4 text-primary text-sm font-semibold">Go back</button>
      </div>
    );
  }

  const handleCheckIn = async () => {
    const amount = Number(checkInAmount) || challenge.perPeriodTarget;
    const newSaved = challenge.savedAmount + amount;
    try {
      // Create a savings transaction
      await addTransaction.mutateAsync({
        type: "savings",
        amount,
        description: `${challenge.title} (Challenge)`,
        date: Timestamp.now(),
      });

      // Record the check-in
      await checkInMutation.mutateAsync({
        challengeId: challenge.id,
        checkIn: {
          date: format(new Date(), "yyyy-MM-dd"),
          amount,
          completed: true,
        },
        newSavedAmount: newSaved,
      });
      setCheckInAmount("");
      showToast(`Saved ${formatCurrency(amount)}!`, "success");
    } catch {
      showToast("Check-in failed", "error");
    }
  };

  const handleAbandon = async () => {
    try {
      await updateChallenge.mutateAsync({
        challengeId: challenge.id,
        data: { status: "abandoned" },
      });
      showToast("Challenge abandoned", "info");
      router.back();
    } catch {
      showToast("Failed to update", "error");
    }
  };

  const r = 56;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <div className="py-4 animate-fade-in lg:max-w-2xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted text-sm font-medium mb-6 hover:text-foreground transition-colors"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Progress ring */}
      <div className="card card-glow p-8 flex flex-col items-center mb-4">
        <div className="relative w-36 h-36 mb-4">
          <svg className="circular-progress w-36 h-36" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r={r} fill="none" stroke="var(--color-border-subtle)" strokeWidth="6" />
            <circle
              cx="64" cy="64" r={r} fill="none"
              stroke={progress >= 100 ? "var(--color-success)" : "var(--color-savings)"} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold font-[family-name:var(--font-display)] text-savings">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-display)] text-center">{challenge.title}</h2>
        <p className="text-xs text-muted text-center mt-1 max-w-xs">{challenge.description}</p>

        <div className="flex items-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-sm font-bold text-savings font-[family-name:var(--font-mono)]">{formatCurrency(challenge.savedAmount)}</p>
            <p className="text-[10px] text-muted">Saved</p>
          </div>
          <div className="w-px h-8 bg-border-subtle" />
          <div className="text-center">
            <p className="text-sm font-bold text-foreground font-[family-name:var(--font-mono)]">{formatCurrency(challenge.targetAmount)}</p>
            <p className="text-[10px] text-muted">Target</p>
          </div>
          <div className="w-px h-8 bg-border-subtle" />
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">{challenge.checkIns.length}</p>
            <p className="text-[10px] text-muted">Check-ins</p>
          </div>
        </div>
      </div>

      {/* Check-in section */}
      {challenge.status === "active" && (
        <div className="card p-5 mb-4">
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Daily Check-in</h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted/50">₹</span>
              <input
                type="number"
                value={checkInAmount}
                onChange={(e) => setCheckInAmount(e.target.value)}
                placeholder={String(challenge.perPeriodTarget)}
                className="w-full h-12 pl-8 pr-3 rounded-xl bg-surface border border-border-subtle text-sm font-bold text-foreground font-[family-name:var(--font-mono)] placeholder:text-muted/30 focus:outline-none focus:border-savings/50 transition-all"
              />
            </div>
            <button
              onClick={handleCheckIn}
              disabled={checkInMutation.isPending}
              className="px-6 h-12 rounded-xl bg-gradient-to-r from-savings to-savings-light text-white font-semibold text-sm hover:shadow-lg hover:shadow-savings/25 transition-all disabled:opacity-50"
            >
              {checkInMutation.isPending ? "..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* Check-in history */}
      {challenge.checkIns.length > 0 && (
        <div className="card p-5 mb-4">
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-3">History</h3>
          <div className="grid grid-cols-7 lg:grid-cols-14 gap-1">
            {challenge.checkIns.map((ci, i) => (
              <div
                key={i}
                className={clsx(
                  "aspect-square rounded-lg flex items-center justify-center text-[9px] font-bold",
                  ci.completed ? "bg-savings/25 text-savings" : "bg-surface-overlay text-muted"
                )}
                title={`${ci.date}: ${formatCurrency(ci.amount)}`}
              >
                {ci.completed ? "✓" : "·"}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Abandon */}
      {challenge.status === "active" && (
        <button
          onClick={handleAbandon}
          className="w-full py-3 text-xs text-danger/60 font-medium hover:text-danger transition-colors"
        >
          Abandon Challenge
        </button>
      )}
    </div>
  );
}
