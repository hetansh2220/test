"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { useToast } from "@/providers/ToastProvider";
import { ROUTES } from "@/lib/constants/routes";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      router.push(ROUTES.ONBOARDING);
    } catch (err: any) {
      showToast(err.message || "Signup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push(ROUTES.HOME);
    } catch (err: any) {
      showToast(err.message || "Google signup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-10 text-center">
        <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-success to-savings opacity-20 blur-lg" />
          <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-success/20 to-savings/20 blur-xl animate-pulse-glow" />
          <div className="relative w-16 h-16 rounded-2xl bg-linear-to-br from-success to-savings flex items-center justify-center shadow-lg shadow-success/25">
            <span className="text-2xl font-extrabold text-white font-[family-name:var(--font-display)]">F</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-foreground">Create account</h1>
        <p className="text-sm text-muted mt-1">Start your financial wellbeing journey</p>
      </div>

      <button
        onClick={handleGoogleSignup}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 h-12 rounded-2xl bg-surface-raised border border-border-subtle text-sm font-semibold text-foreground transition-all hover:border-border hover:bg-surface-overlay disabled:opacity-50 mb-6"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 w-full mb-6">
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-xs text-muted font-medium">or sign up with email</span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      <form onSubmit={handleSignup} className="w-full flex flex-col gap-3">
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-12 px-4 rounded-2xl bg-surface border border-border-subtle text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 px-4 rounded-2xl bg-surface border border-border-subtle text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 px-4 rounded-2xl bg-surface border border-border-subtle text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !name || !email || !password}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-success to-savings text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-success/25 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="text-primary font-semibold hover:text-primary-light transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
