"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { createUserProfile } from "@/lib/firebase/firestore";
import { PROFESSIONS } from "@/lib/constants/professions";
import { ROUTES } from "@/lib/constants/routes";
import type { Profession, IncomeType } from "@/types/user";
import clsx from "clsx";

export default function OnboardingPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [profession, setProfession] = useState<Profession | "">("");
  const [incomeType, setIncomeType] = useState<IncomeType | "">("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [salaryDate, setSalaryDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace(ROUTES.LOGIN);
    if (!loading && profile?.onboardingComplete) router.replace(ROUTES.DASHBOARD);
  }, [user, profile, loading, router]);

  const handleComplete = async () => {
    if (!user || !profession || !incomeType) return;
    setSaving(true);
    try {
      await createUserProfile(user.uid, {
        email: user.email || "",
        displayName: user.displayName || "User",
        profession: profession as Profession,
        incomeType: incomeType as IncomeType,
        monthlyIncome: Number(monthlyIncome) || 0,
        ...(incomeType === "fixed" && salaryDate ? { salaryDate: Number(salaryDate) } : {}),
        currency: "INR",
        onboardingComplete: true,
      });
      await refreshProfile();
      showToast("Welcome to FinWell!", "success");
      router.push(ROUTES.DASHBOARD);
    } catch (err: any) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12 bg-background">
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-100 h-100 rounded-full bg-savings/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm lg:max-w-md animate-fade-in">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {(incomeType === "fixed" ? [0, 1, 2, 3] : [0, 1, 2]).map((i) => (
            <div
              key={i}
              className={clsx(
                "h-1.5 rounded-full transition-all duration-300",
                i === step
                  ? "w-8 bg-primary shadow-[0_0_8px_rgba(0,208,156,0.5)]"
                  : i < step
                    ? "w-4 bg-primary/40"
                    : "w-4 bg-border"
              )}
            />
          ))}
        </div>

        {/* Step 0: Profession */}
        {step === 0 && (
          <div className="animate-scale-in">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-center text-foreground mb-2">What do you do?</h2>
            <p className="text-sm text-muted text-center mb-8">This helps us personalize your experience</p>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {PROFESSIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setProfession(p.value)}
                  className={clsx(
                    "relative flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all",
                    profession === p.value
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                      : "border-border-subtle bg-surface-raised hover:border-border hover:bg-surface-overlay"
                  )}
                >
                  {profession === p.value && (
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 to-savings/5 pointer-events-none" />
                  )}
                  <span className="text-3xl relative">{p.icon}</span>
                  <span className="text-xs font-semibold text-foreground relative">{p.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              disabled={!profession}
              className="w-full h-12 mt-8 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm disabled:opacity-40 transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 1: Income Type */}
        {step === 1 && (
          <div className="animate-scale-in">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-center text-foreground mb-2">Income type</h2>
            <p className="text-sm text-muted text-center mb-8">How do you earn your income?</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIncomeType("fixed")}
                className={clsx(
                  "relative flex items-start gap-4 p-5 rounded-2xl border transition-all text-left",
                  incomeType === "fixed"
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                    : "border-border-subtle bg-surface-raised hover:border-border hover:bg-surface-overlay"
                )}
              >
                {incomeType === "fixed" && (
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 to-savings/5 pointer-events-none" />
                )}
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0 mt-0.5 relative">
                  <span className="text-lg">📅</span>
                </div>
                <div className="relative">
                  <p className="font-semibold text-sm text-foreground">Fixed Income</p>
                  <p className="text-xs text-muted mt-0.5">Regular monthly salary or pension</p>
                </div>
              </button>
              <button
                onClick={() => setIncomeType("variable")}
                className={clsx(
                  "relative flex items-start gap-4 p-5 rounded-2xl border transition-all text-left",
                  incomeType === "variable"
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                    : "border-border-subtle bg-surface-raised hover:border-border hover:bg-surface-overlay"
                )}
              >
                {incomeType === "variable" && (
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 to-savings/5 pointer-events-none" />
                )}
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0 mt-0.5 relative">
                  <span className="text-lg">📈</span>
                </div>
                <div className="relative">
                  <p className="font-semibold text-sm text-foreground">Variable Income</p>
                  <p className="text-xs text-muted mt-0.5">Freelance, business, or irregular earnings</p>
                </div>
              </button>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(0)}
                className="flex-1 h-12 rounded-2xl border border-border-subtle text-sm font-semibold text-muted hover:text-foreground hover:border-border transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!incomeType}
                className="flex-[2] h-12 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm disabled:opacity-40 transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Monthly Income */}
        {step === 2 && (
          <div className="animate-scale-in">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-center text-foreground mb-2">Monthly income</h2>
            <p className="text-sm text-muted text-center mb-8">
              {incomeType === "variable" ? "Enter your average monthly income" : "Enter your monthly salary"}
            </p>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted">₹</span>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="50,000"
                className="w-full h-16 pl-10 pr-4 rounded-2xl bg-surface border border-border-subtle text-2xl font-bold text-foreground font-[family-name:var(--font-mono)] placeholder:text-muted/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
              {[10000, 25000, 50000, 75000, 100000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setMonthlyIncome(String(amt))}
                  className={clsx(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border",
                    Number(monthlyIncome) === amt
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-surface-raised border-border-subtle text-muted hover:text-foreground hover:border-border"
                  )}
                >
                  ₹{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}K`}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 h-12 rounded-2xl border border-border-subtle text-sm font-semibold text-muted hover:text-foreground hover:border-border transition-all"
              >
                Back
              </button>
              {incomeType === "fixed" ? (
                <button
                  onClick={() => setStep(3)}
                  disabled={!monthlyIncome}
                  className="flex-[2] h-12 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm disabled:opacity-40 transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={saving || !monthlyIncome}
                  className="flex-[2] h-12 rounded-2xl bg-gradient-to-r from-success to-savings text-white font-semibold text-sm disabled:opacity-40 transition-all hover:shadow-lg hover:shadow-success/25"
                >
                  {saving ? "Setting up..." : "Get Started"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Salary Date (fixed income only) */}
        {step === 3 && incomeType === "fixed" && (
          <div className="animate-scale-in">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-center text-foreground mb-2">Salary date</h2>
            <p className="text-sm text-muted text-center mb-8">
              Which day of the month do you receive your salary?
            </p>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  onClick={() => setSalaryDate(String(day))}
                  className={clsx(
                    "h-11 rounded-xl text-sm font-bold transition-all",
                    Number(salaryDate) === day
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "bg-surface-raised border border-border-subtle text-muted hover:text-foreground hover:border-border hover:bg-surface-overlay"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>

            <p className="text-[10px] text-muted text-center mt-4">
              Your salary will be automatically added as income on this date every month
            </p>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(2)}
                className="flex-1 h-12 rounded-2xl border border-border-subtle text-sm font-semibold text-muted hover:text-foreground hover:border-border transition-all"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={saving || !salaryDate}
                className="flex-[2] h-12 rounded-2xl bg-gradient-to-r from-success to-savings text-white font-semibold text-sm disabled:opacity-40 transition-all hover:shadow-lg hover:shadow-success/25"
              >
                {saving ? "Setting up..." : "Get Started"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
