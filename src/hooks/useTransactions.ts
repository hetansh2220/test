"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactions, addTransaction, deleteTransaction } from "@/lib/firebase/firestore";
import { useAuth } from "@/providers/AuthProvider";
import type { Transaction } from "@/types/transaction";

export function useTransactions(month: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["transactions", user?.uid, month],
    queryFn: () => getTransactions(user!.uid, month),
    enabled: !!user,
  });
}

export function useAddTransaction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Transaction, "id" | "createdAt">) =>
      addTransaction(user!.uid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.uid] });
      queryClient.invalidateQueries({ queryKey: ["budget", user?.uid] });
    },
  });
}

export function useDeleteTransaction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) => deleteTransaction(user!.uid, transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.uid] });
    },
  });
}
