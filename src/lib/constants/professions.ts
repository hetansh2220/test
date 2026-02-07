import type { Profession } from "@/types/user";

export const PROFESSIONS: { value: Profession; label: string; icon: string }[] = [
  { value: "employee", label: "Salaried Employee", icon: "💼" },
  { value: "freelancer", label: "Freelancer", icon: "💻" },
  { value: "student", label: "Student", icon: "🎓" },
  { value: "business_owner", label: "Business Owner", icon: "🏪" },
  { value: "other", label: "Other", icon: "👤" },
];
