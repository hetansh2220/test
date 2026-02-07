"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChallenges, addChallenge, updateChallenge, addCheckIn } from "@/lib/firebase/firestore";
import { useAuth } from "@/providers/AuthProvider";
import type { Challenge, CheckIn } from "@/types/challenge";

export function useChallenges() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["challenges", user?.uid],
    queryFn: () => getChallenges(user!.uid),
    enabled: !!user,
  });
}

export function useAddChallenge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Challenge, "id" | "createdAt">) => addChallenge(user!.uid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges", user?.uid] });
    },
  });
}

export function useUpdateChallenge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ challengeId, data }: { challengeId: string; data: Partial<Challenge> }) =>
      updateChallenge(user!.uid, challengeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges", user?.uid] });
    },
  });
}

export function useCheckIn() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      challengeId,
      checkIn,
      newSavedAmount,
    }: {
      challengeId: string;
      checkIn: CheckIn;
      newSavedAmount: number;
    }) => addCheckIn(user!.uid, challengeId, checkIn, newSavedAmount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges", user?.uid] });
    },
  });
}
