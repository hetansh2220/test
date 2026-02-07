export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface FinancialContext {
  monthlyIncome: number;
  totalExpenses: number;
  budgetLimit: number;
  totalSavings: number;
  healthScore: number;
  upcomingBills: string;
  activeChallenges: string;
}
