import type { Transaction } from "@/types/transaction";
import type { Budget } from "@/types/budget";
import type { Bill } from "@/types/bill";
import type { Challenge } from "@/types/challenge";
import { isDueSoon, isOverdue } from "./dateHelpers";

export interface Alert {
  id: string;
  type: "warning" | "danger" | "info" | "success";
  title: string;
  message: string;
}

export function generateAlerts(
  transactions: Transaction[],
  budget: Budget | null,
  bills: Bill[],
  challenges: Challenge[]
): Alert[] {
  const alerts: Alert[] = [];

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Budget alerts
  if (budget && budget.monthlyLimit > 0) {
    const usage = (totalExpenses / budget.monthlyLimit) * 100;
    if (usage >= 100) {
      alerts.push({
        id: "budget-exceeded",
        type: "danger",
        title: "Budget Exceeded",
        message: `You have spent ${Math.round(usage)}% of your monthly budget. Try to limit further spending.`,
      });
    } else if (usage >= 80) {
      alerts.push({
        id: "budget-warning",
        type: "warning",
        title: "Budget Almost Full",
        message: `You have used ${Math.round(usage)}% of your monthly budget. Be mindful of spending.`,
      });
    }
  }

  // Bill alerts
  bills.forEach((bill) => {
    if (isOverdue(bill.dueDate, bill.isPaid)) {
      alerts.push({
        id: `bill-overdue-${bill.id}`,
        type: "danger",
        title: "Bill Overdue",
        message: `${bill.name} (₹${bill.amount}) was due on the ${bill.dueDate}th. Pay it as soon as possible.`,
      });
    } else if (!bill.isPaid && isDueSoon(bill.dueDate, 3)) {
      alerts.push({
        id: `bill-due-${bill.id}`,
        type: "warning",
        title: "Bill Due Soon",
        message: `${bill.name} (₹${bill.amount}) is due on the ${bill.dueDate}th.`,
      });
    }
  });

  // Savings goal alert
  if (budget && budget.savingGoal > 0) {
    const totalSavings = transactions
      .filter((t) => t.type === "savings")
      .reduce((sum, t) => sum + t.amount, 0);
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const expectedPace = (budget.savingGoal / daysInMonth) * today.getDate();

    if (totalSavings < expectedPace * 0.5) {
      alerts.push({
        id: "savings-behind",
        type: "warning",
        title: "Savings Behind Target",
        message: `Save ₹${Math.round(expectedPace - totalSavings)} more to stay on track for your monthly goal.`,
      });
    }
  }

  // Challenge streak
  const activeChallenges = challenges.filter((c) => c.status === "active");
  activeChallenges.forEach((challenge) => {
    if (challenge.checkIns.length >= 5) {
      const recentStreak = challenge.checkIns.slice(-5).every((c) => c.completed);
      if (recentStreak) {
        alerts.push({
          id: `streak-${challenge.id}`,
          type: "success",
          title: "Saving Streak!",
          message: `You're on a ${challenge.checkIns.length}-day streak in "${challenge.title}"! Keep it up!`,
        });
      }
    }
  });

  // No budget set
  if (!budget) {
    alerts.push({
      id: "no-budget",
      type: "info",
      title: "Set Your Budget",
      message: "Set a monthly budget to track your spending and get personalized insights.",
    });
  }

  return alerts;
}
