import { HiOutlineHome, HiOutlineShoppingBag, HiOutlineCreditCard } from "react-icons/hi2";
import type { ExpenseCategory } from "@/types/transaction";

export const EXPENSE_CATEGORIES: {
  value: ExpenseCategory;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}[] = [
  {
    value: "needs",
    label: "Needs",
    description: "Rent, groceries, utilities, transport",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.12)",
  },
  {
    value: "wants",
    label: "Wants",
    description: "Entertainment, dining out, shopping",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.12)",
  },
  {
    value: "emi",
    label: "EMI",
    description: "Loan & EMI payments",
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.12)",
  },
];

export function getCategoryInfo(category: ExpenseCategory) {
  return EXPENSE_CATEGORIES.find((c) => c.value === category) || EXPENSE_CATEGORIES[0];
}
