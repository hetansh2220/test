"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { signOut } from "@/lib/firebase/auth";
import { updateUserProfile } from "@/lib/firebase/firestore";
import { useToast } from "@/providers/ToastProvider";
import { ROUTES } from "@/lib/constants/routes";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { PROFESSIONS } from "@/lib/constants/professions";
import clsx from "clsx";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineBriefcase,
  HiOutlineCurrencyRupee,
  HiOutlineEnvelope,
  HiOutlinePencilSquare,
  HiOutlineCalendarDays,
  HiOutlineXMark,
  HiOutlineCheck,
} from "react-icons/hi2";

export default function SettingsPage() {
  const { profile, user, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [incomeValue, setIncomeValue] = useState("");
  const [salaryDateValue, setSalaryDateValue] = useState("");
  const [saving, setSaving] = useState(false);

  const openEditor = () => {
    setIncomeValue(String(profile?.monthlyIncome || ""));
    setSalaryDateValue(String(profile?.salaryDate || ""));
    setEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    const newIncome = Number(incomeValue);
    if (!newIncome || newIncome <= 0) {
      showToast("Enter a valid income amount", "error");
      return;
    }
    setSaving(true);
    try {
      const updates: Record<string, any> = { monthlyIncome: newIncome };
      if (profile?.incomeType === "fixed" && salaryDateValue) {
        const day = Number(salaryDateValue);
        if (day >= 1 && day <= 31) updates.salaryDate = day;
      }
      await updateUserProfile(user.uid, updates);
      await refreshProfile();
      showToast("Income updated!", "success");
      setEditing(false);
    } catch {
      showToast("Failed to update", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push(ROUTES.LOGIN);
    } catch {
      showToast("Failed to sign out", "error");
    }
  };

  const professionLabel = PROFESSIONS.find((p) => p.value === profile?.profession)?.label || "—";
  const initial = (profile?.displayName || user?.displayName || "U").charAt(0).toUpperCase();

  return (
    <div className="py-4 animate-fade-in lg:max-w-2xl">
      <h1 className="text-lg lg:text-xl font-bold font-[family-name:var(--font-display)] mb-6">Settings</h1>

      {/* Profile card */}
      <div className="card card-glow p-6 flex flex-col items-center mb-6 lg:flex-row lg:gap-6 lg:items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/25 to-savings/25 border-2 border-border flex items-center justify-center mb-3">
          <span className="text-2xl font-bold text-primary-light font-[family-name:var(--font-display)]">{initial}</span>
        </div>
        <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-display)]">
          {profile?.displayName || user?.displayName || "User"}
        </h2>
        <p className="text-xs text-muted">{user?.email}</p>
      </div>

      {/* Info rows */}
      <div className="card divide-y divide-border-subtle">
        <div className="flex items-center gap-4 p-4">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <HiOutlineEnvelope className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-muted uppercase font-semibold tracking-widest">Email</p>
            <p className="text-sm text-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4">
          <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
            <HiOutlineBriefcase className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-muted uppercase font-semibold tracking-widest">Profession</p>
            <p className="text-sm text-foreground">{professionLabel}</p>
          </div>
        </div>

        {/* Monthly Income — editable */}
        <div className="flex items-center gap-4 p-4">
          <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center">
            <HiOutlineCurrencyRupee className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-muted uppercase font-semibold tracking-widest">Monthly Income</p>
            <p className="text-sm text-foreground">
              {formatCurrency(profile?.monthlyIncome || 0)}
              <span className="text-xs text-muted ml-1">({profile?.incomeType || "—"})</span>
            </p>
          </div>
          <button
            onClick={openEditor}
            className="p-2 rounded-xl hover:bg-primary/10 transition-colors text-primary"
          >
            <HiOutlinePencilSquare className="w-5 h-5" />
          </button>
        </div>

        {/* Salary Date (if fixed income) */}
        {profile?.incomeType === "fixed" && (
          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-xl bg-savings/15 flex items-center justify-center">
              <HiOutlineCalendarDays className="w-5 h-5 text-savings" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-muted uppercase font-semibold tracking-widest">Salary Date</p>
              <p className="text-sm text-foreground">
                {profile?.salaryDate ? `${profile.salaryDate}th of every month` : "Not set"}
              </p>
            </div>
            <button
              onClick={openEditor}
              className="p-2 rounded-xl hover:bg-primary/10 transition-colors text-primary"
            >
              <HiOutlinePencilSquare className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Edit Income Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface border border-border-subtle rounded-t-3xl lg:rounded-3xl p-6 animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold font-[family-name:var(--font-display)]">Edit Income</h3>
              <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg hover:bg-surface-overlay transition-colors">
                <HiOutlineXMark className="w-5 h-5 text-muted" />
              </button>
            </div>

            {/* Income amount */}
            <label className="text-[10px] text-muted uppercase font-semibold tracking-widest mb-2 block">
              Monthly Income (₹)
            </label>
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted">₹</span>
              <input
                type="number"
                value={incomeValue}
                onChange={(e) => setIncomeValue(e.target.value)}
                placeholder="50000"
                className="w-full h-14 pl-10 pr-4 rounded-2xl bg-surface-raised border border-border-subtle text-xl font-bold text-foreground font-[family-name:var(--font-mono)] placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div className="flex gap-2 mb-5 flex-wrap">
              {[10000, 25000, 50000, 75000, 100000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setIncomeValue(String(amt))}
                  className={clsx(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border",
                    Number(incomeValue) === amt
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-surface-overlay border-border-subtle text-muted hover:text-foreground hover:border-border"
                  )}
                >
                  ₹{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}K`}
                </button>
              ))}
            </div>

            {/* Salary date (fixed income only) */}
            {profile?.incomeType === "fixed" && (
              <>
                <label className="text-[10px] text-muted uppercase font-semibold tracking-widest mb-2 block">
                  Salary Date (day of month)
                </label>
                <div className="grid grid-cols-7 gap-1.5 mb-5">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <button
                      key={day}
                      onClick={() => setSalaryDateValue(String(day))}
                      className={clsx(
                        "h-9 rounded-lg text-xs font-bold transition-all",
                        Number(salaryDateValue) === day
                          ? "bg-primary text-white shadow-md shadow-primary/25"
                          : "bg-surface-raised border border-border-subtle text-muted hover:text-foreground hover:border-border"
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button
              onClick={handleSave}
              disabled={saving || !incomeValue}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm disabled:opacity-40 transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
            >
              <HiOutlineCheck className="w-5 h-5" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full mt-6 flex items-center justify-center gap-2 h-12 rounded-2xl border border-danger/25 text-danger text-sm font-semibold hover:bg-danger/10 transition-colors"
      >
        <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}
