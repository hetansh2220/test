import { Timestamp } from "firebase/firestore";

export type ChallengeFrequency = "daily" | "weekly";
export type ChallengeStatus = "active" | "completed" | "abandoned";

export interface CheckIn {
  date: string;
  amount: number;
  completed: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  savedAmount: number;
  frequency: ChallengeFrequency;
  perPeriodTarget: number;
  durationDays: number;
  startDate: Timestamp;
  endDate: Timestamp;
  status: ChallengeStatus;
  checkIns: CheckIn[];
  createdAt: Timestamp;
}
