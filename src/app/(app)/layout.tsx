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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || !profile?.onboardingComplete) return null;

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="lg:ml-64">
        <TopBar />
        <main className="px-4 pb-24 lg:pb-8 max-w-lg mx-auto lg:max-w-5xl lg:px-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
