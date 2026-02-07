"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useAutoSalary } from "@/hooks/useAutoSalary";
import { ROUTES } from "@/lib/constants/routes";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  useAutoSalary();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(ROUTES.LOGIN);
    } else if (!profile || !profile.onboardingComplete) {
      router.replace(ROUTES.ONBOARDING);
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile?.onboardingComplete) return null;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Sidebar />
      <div className="lg:ml-72">
        <TopBar />
        <main className="px-5 pb-28 lg:pb-10 max-w-lg mx-auto lg:max-w-5xl lg:px-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
