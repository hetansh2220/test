import { Timestamp } from "firebase/firestore";

export type BillFrequency = "monthly" | "quarterly" | "yearly" | "one_time";

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: number;
  frequency: BillFrequency;
  isEMI: boolean;
  emiTotalMonths?: number;
  emiCompletedMonths?: number;
  isPaid: boolean;
  lastPaidDate?: Timestamp;
  createdAt: Timestamp;
}
