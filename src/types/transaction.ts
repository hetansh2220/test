import { Timestamp } from "firebase/firestore";

export type TransactionType = "income" | "expense" | "savings";
export type ExpenseCategory = "needs" | "wants" | "emi";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category?: ExpenseCategory;
  description: string;
  date: Timestamp;
  createdAt: Timestamp;
}
