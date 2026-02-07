"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { ROUTES } from "@/lib/constants/routes";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user && profile?.onboardingComplete) {
      router.replace(ROUTES.DASHBOARD);
    } else if (user && !profile?.onboardingComplete) {
      router.replace(ROUTES.ONBOARDING);
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 py-12 bg-background">
      {/* Decorative background orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-savings/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-75 h-75 rounded-full bg-primary-dark/5 blur-3xl pointer-events-none" />

      {/* Desktop: side-by-side branding + form */}
      <div className="w-full max-w-sm lg:max-w-4xl lg:flex lg:items-center lg:gap-16 animate-scale-in">
        {/* Branding panel - desktop only */}
        <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:pr-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary to-savings opacity-20 blur-xl" />
            <div className="relative w-20 h-20 rounded-2xl bg-linear-to-br from-primary to-savings flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-3xl font-extrabold text-white font-[family-name:var(--font-display)]">F</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold font-[family-name:var(--font-display)] text-foreground mb-3">FinWell</h2>
          <p className="text-base text-muted leading-relaxed max-w-md">Your personal financial wellbeing companion. Track spending, manage budgets, and build healthier money habits.</p>
        </div>

        {/* Form panel */}
        <div className="w-full lg:w-[400px] lg:shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
}
