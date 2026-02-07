"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBudget, setBudget, updateBudget } from "@/lib/firebase/firestore";
import { useAuth } from "@/providers/AuthProvider";
import type { Budget } from "@/types/budget";

export function useBudget(month: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["budget", user?.uid, month],
    queryFn: () => getBudget(user!.uid, month),
    enabled: !!user,
  });
}

export function useSetBudget() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ month, data }: { month: string; data: Omit<Budget, "id" | "createdAt" | "updatedAt"> }) =>
      setBudget(user!.uid, month, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", user?.uid] });
    },
  });
}

export function useUpdateBudget() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ month, data }: { month: string; data: Partial<Budget> }) =>
      updateBudget(user!.uid, month, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", user?.uid] });
    },
  });
}
