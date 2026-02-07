"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { ROUTES } from "@/lib/constants/routes";

export default function Home() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(ROUTES.LOGIN);
    } else if (!profile || !profile.onboardingComplete) {
      router.replace(ROUTES.ONBOARDING);
    } else {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [user, profile, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-glow" />
          <div className="absolute inset-2 rounded-full bg-primary/40 animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
          <div className="absolute inset-4 rounded-full bg-primary" />
        </div>
        <p className="text-sm text-muted font-medium tracking-wide">Loading FinWell...</p>
      </div>
    </div>
  );
}
