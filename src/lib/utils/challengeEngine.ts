import type { Profession, IncomeType } from "@/types/user";

export interface ChallengeSuggestion {
  title: string;
  description: string;
  targetAmount: number;
  frequency: "daily" | "weekly";
  perPeriodTarget: number;
  durationDays: number;
}

export function generateChallengeSuggestions(
  monthlyIncome: number,
  totalExpenses: number,
  profession: Profession,
  incomeType: IncomeType
): ChallengeSuggestion[] {
  const suggestions: ChallengeSuggestion[] = [];
  const disposable = monthlyIncome - totalExpenses;
  const dailySaveBase = Math.max(50, Math.round((monthlyIncome * 0.01) / 10) * 10);

  // 30-day daily savings challenge
  suggestions.push({
    title: "30-Day Savings Sprint",
    description: `Save ₹${dailySaveBase} every day for 30 days. Small steps lead to big savings!`,
    targetAmount: dailySaveBase * 30,
    frequency: "daily",
    perPeriodTarget: dailySaveBase,
    durationDays: 30,
  });

  // Weekly challenge
  const weeklySave = Math.max(200, Math.round((monthlyIncome * 0.05) / 100) * 100);
  suggestions.push({
    title: "Weekly Wealth Builder",
    description: `Set aside ₹${weeklySave} each week. In 4 weeks you'll have ₹${weeklySave * 4}!`,
    targetAmount: weeklySave * 4,
    frequency: "weekly",
    perPeriodTarget: weeklySave,
    durationDays: 28,
  });

  // No-spend challenge
  if (totalExpenses > monthlyIncome * 0.6) {
    suggestions.push({
      title: "Wants-Free Week",
      description: "Avoid all 'wants' spending for 7 days. Only spend on needs and EMIs.",
      targetAmount: Math.round(totalExpenses * 0.1),
      frequency: "daily",
      perPeriodTarget: Math.round((totalExpenses * 0.1) / 7),
      durationDays: 7,
    });
  }

  // Student-friendly micro-save
  if (profession === "student") {
    suggestions.push({
      title: "Micro Saver",
      description: "Save just ₹20 per day. It adds up to ₹600 in a month!",
      targetAmount: 600,
      frequency: "daily",
      perPeriodTarget: 20,
      durationDays: 30,
    });
  }

  // Variable income saver
  if (incomeType === "variable") {
    const savePct = Math.max(500, Math.round(disposable * 0.15 / 100) * 100);
    suggestions.push({
      title: "Income Boost Saver",
      description: `Save ₹${savePct} from each payment you receive this month.`,
      targetAmount: savePct * 4,
      frequency: "weekly",
      perPeriodTarget: savePct,
      durationDays: 28,
    });
  }

  // High-income challenge
  if (monthlyIncome >= 50000) {
    const bigSave = Math.round((monthlyIncome * 0.1) / 1000) * 1000;
    suggestions.push({
      title: "Power Saver Challenge",
      description: `Save ₹${bigSave} this month by cutting discretionary spending.`,
      targetAmount: bigSave,
      frequency: "weekly",
      perPeriodTarget: Math.round(bigSave / 4),
      durationDays: 30,
    });
  }

  return suggestions.slice(0, 4);
}
