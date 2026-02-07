import type { Transaction } from "@/types/transaction";
import type { Budget } from "@/types/budget";
import type { Bill } from "@/types/bill";
import type { Challenge } from "@/types/challenge";

export interface HealthResult {
  score: number;
  label: "Good" | "Average" | "Poor";
  color: string;
  breakdown: {
    budgetAdherence: number;
    savingsRate: number;
    billsPunctuality: number;
    challengeParticipation: number;
  };
}

export function calculateHealthScore(
  transactions: Transaction[],
  budget: Budget | null,
  bills: Bill[],
  challenges: Challenge[],
  monthlyIncome: number
): HealthResult {
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavings = transactions
    .filter((t) => t.type === "savings")
    .reduce((sum, t) => sum + t.amount, 0);

  // Budget adherence (30%)
  let budgetAdherence = 100;
  if (budget && budget.monthlyLimit > 0) {
    budgetAdherence = Math.max(0, Math.min(100, ((budget.monthlyLimit - totalExpenses) / budget.monthlyLimit) * 100));
  }

  // Savings rate (30%) - target 20% of income
  let savingsRate = 0;
  if (monthlyIncome > 0) {
    const rate = (totalSavings / monthlyIncome) * 100;
    savingsRate = Math.min(100, (rate / 20) * 100);
  }

  // Bills punctuality (20%)
  let billsPunctuality = 100;
  if (bills.length > 0) {
    const paidOnTime = bills.filter((b) => b.isPaid).length;
    billsPunctuality = (paidOnTime / bills.length) * 100;
  }

  // Challenge participation (20%)
  let challengeParticipation = 0;
  const activeChallenges = challenges.filter((c) => c.status === "active" || c.status === "completed");
  if (activeChallenges.length > 0) {
    const avgProgress = activeChallenges.reduce((sum, c) => {
      return sum + (c.targetAmount > 0 ? Math.min(1, c.savedAmount / c.targetAmount) : 0);
    }, 0) / activeChallenges.length;
    challengeParticipation = avgProgress * 100;
  }

  const score = Math.round(
    budgetAdherence * 0.3 +
    savingsRate * 0.3 +
    billsPunctuality * 0.2 +
    challengeParticipation * 0.2
  );

  let label: HealthResult["label"] = "Poor";
  let color = "#ef4444";
  if (score >= 80) {
    label = "Good";
    color = "#22c55e";
  } else if (score >= 50) {
    label = "Average";
    color = "#f59e0b";
  }

  return {
    score,
    label,
    color,
    breakdown: {
      budgetAdherence: Math.round(budgetAdherence),
      savingsRate: Math.round(savingsRate),
      billsPunctuality: Math.round(billsPunctuality),
      challengeParticipation: Math.round(challengeParticipation),
    },
  };
}
