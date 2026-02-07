import { Timestamp } from "firebase/firestore";

export type Profession = "employee" | "freelancer" | "student" | "business_owner" | "other";
export type IncomeType = "fixed" | "variable";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  profession: Profession;
  incomeType: IncomeType;
  monthlyIncome: number;
  salaryDate?: number; // Day of month (1-31) when salary is credited
  currency: "INR";
  onboardingComplete: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
