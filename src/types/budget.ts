import { Timestamp } from "firebase/firestore";

export interface Budget {
  id: string;
  monthlyLimit: number;
  savingGoal: number;
  needsLimit: number;
  wantsLimit: number;
  emiLimit: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
