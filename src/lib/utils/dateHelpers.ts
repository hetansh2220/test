import { format, startOfMonth, endOfMonth, isAfter, isBefore, addDays } from "date-fns";

export function getCurrentMonth(): string {
  return format(new Date(), "yyyy-MM");
}

export function getMonthLabel(month: string): string {
  const [year, mo] = month.split("-").map(Number);
  return format(new Date(year, mo - 1), "MMMM yyyy");
}

export function getMonthStart(month: string): Date {
  const [year, mo] = month.split("-").map(Number);
  return startOfMonth(new Date(year, mo - 1));
}

export function getMonthEnd(month: string): Date {
  const [year, mo] = month.split("-").map(Number);
  return endOfMonth(new Date(year, mo - 1));
}

export function isDueSoon(dueDay: number, daysAhead: number = 7): boolean {
  const today = new Date();
  const dueDate = new Date(today.getFullYear(), today.getMonth(), dueDay);
  if (isBefore(dueDate, today)) return false;
  return isBefore(dueDate, addDays(today, daysAhead));
}

export function isOverdue(dueDay: number, isPaid: boolean): boolean {
  if (isPaid) return false;
  const today = new Date();
  const dueDate = new Date(today.getFullYear(), today.getMonth(), dueDay);
  return isAfter(today, dueDate);
}

export function getDaysUntilDue(dueDay: number): number {
  const today = new Date();
  const dueDate = new Date(today.getFullYear(), today.getMonth(), dueDay);
  if (isBefore(dueDate, today)) {
    // next month
    dueDate.setMonth(dueDate.getMonth() + 1);
  }
  return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDate(date: Date): string {
  return format(date, "dd MMM yyyy");
}

export function getPreviousMonth(month: string): string {
  const [year, mo] = month.split("-").map(Number);
  const d = new Date(year, mo - 2, 1);
  return format(d, "yyyy-MM");
}

export function getNextMonth(month: string): string {
  const [year, mo] = month.split("-").map(Number);
  const d = new Date(year, mo, 1);
  return format(d, "yyyy-MM");
}
