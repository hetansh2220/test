"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useTransactions, useAddTransaction } from "@/hooks/useTransactions";
import { getCurrentMonth } from "@/lib/utils/dateHelpers";
import { Timestamp } from "firebase/firestore";

/**
 * Auto-adds a salary income transaction on the user's salary date each month.
 * Only runs for fixed-income users who have set a salaryDate.
 */
export function useAutoSalary() {
  const { profile, user } = useAuth();
  const month = getCurrentMonth();
  const { data: transactions = [] } = useTransactions(month);
  const addTransaction = useAddTransaction();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    if (!user || !profile) return;
    if (profile.incomeType !== "fixed" || !profile.salaryDate || !profile.monthlyIncome) return;

    const now = new Date();
    const today = now.getDate();

    // Only add salary if today is on or after the salary date
    if (today < profile.salaryDate) return;

    // Check if salary was already added this month
    const salaryExists = transactions.some(
      (t) =>
        t.type === "income" &&
        t.description === "Monthly Salary" &&
        t.amount === profile.monthlyIncome
    );

    if (salaryExists) return;

    // Add the salary transaction
    hasRun.current = true;
    addTransaction.mutate({
      type: "income",
      amount: profile.monthlyIncome,
      description: "Monthly Salary",
      date: Timestamp.fromDate(
        new Date(now.getFullYear(), now.getMonth(), profile.salaryDate)
      ),
    });
  }, [user, profile, transactions, addTransaction, month]);
}
