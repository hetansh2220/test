"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBills, addBill, updateBill, deleteBill } from "@/lib/firebase/firestore";
import { useAuth } from "@/providers/AuthProvider";
import type { Bill } from "@/types/bill";

export function useBills() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["bills", user?.uid],
    queryFn: () => getBills(user!.uid),
    enabled: !!user,
  });
}

export function useAddBill() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Bill, "id" | "createdAt">) => addBill(user!.uid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills", user?.uid] });
    },
  });
}

export function useUpdateBill() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ billId, data }: { billId: string; data: Partial<Bill> }) =>
      updateBill(user!.uid, billId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills", user?.uid] });
    },
  });
}

export function useDeleteBill() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (billId: string) => deleteBill(user!.uid, billId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills", user?.uid] });
    },
  });
}
