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
    color: "var(--color-needs)",
    bgColor: "color-mix(in srgb, var(--color-needs) 18%, transparent)",
  },
  {
    value: "wants",
    label: "Wants",
    description: "Entertainment, dining out, shopping",
    color: "var(--color-wants)",
    bgColor: "color-mix(in srgb, var(--color-wants) 18%, transparent)",
  },
  {
    value: "emi",
    label: "EMI",
    description: "Loan & EMI payments",
    color: "var(--color-emi)",
    bgColor: "color-mix(in srgb, var(--color-emi) 18%, transparent)",
  },
];

export function getCategoryInfo(category: ExpenseCategory) {
  return EXPENSE_CATEGORIES.find((c) => c.value === category) || EXPENSE_CATEGORIES[0];
}
