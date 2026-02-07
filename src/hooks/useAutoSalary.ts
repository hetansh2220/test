"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useTransactions, useAddTransaction } from "@/hooks/useTransactions";
import { getCurrentMonth } from "@/lib/utils/dateHelpers";
import { Timestamp } from "firebase/firestore";

export function useAutoSalary() {
  const { profile, user } = useAuth();
  const month = getCurrentMonth();
  const { data: transactions, isSuccess } = useTransactions(month);
  const addTransaction = useAddTransaction();
  const hasRun = useRef(false);
//effect
  useEffect(() => {
    if (hasRun.current) return;
    if (!isSuccess || !transactions) return;
    if (!user || !profile) return;
    if (profile.incomeType !== "fixed" || !profile.salaryDate || !profile.monthlyIncome) return;

    const now = new Date();
    const today = now.getDate();

    if (today < profile.salaryDate) return;

    const salaryExists = transactions.some(
      (t) =>
        t.type === "income" &&
        t.description === "Monthly Salary" &&
        t.amount === profile.monthlyIncome
    );

    if (salaryExists) return;

    hasRun.current = true;
    addTransaction.mutate({
      type: "income",
      amount: profile.monthlyIncome,
      description: "Monthly Salary",
      date: Timestamp.fromDate(
        new Date(now.getFullYear(), now.getMonth(), profile.salaryDate)
      ),
    });
  }, [user, profile, transactions, isSuccess, addTransaction, month]);
}
