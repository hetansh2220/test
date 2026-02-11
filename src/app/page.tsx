"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { ROUTES } from "@/lib/constants/routes";
import {
  HiOutlineSquares2X2,
  HiOutlineChartPie,
  HiOutlineDocumentText,
  HiOutlineTrophy,
  HiOutlineSparkles,
  HiOutlineAcademicCap,
  HiOutlineArrowTrendingUp,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineCreditCard,
  HiOutlineUserCircle,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi2";

const stats = [
  {
    value: "78%",
    label: "of Indians live paycheck to paycheck",
    icon: <HiOutlineExclamationTriangle className="w-6 h-6 text-primary" />,
  },
  {
    value: "₹2.4L",
    label: "average credit card debt per household",
    icon: <HiOutlineCreditCard className="w-6 h-6 text-primary" />,
  },
  {
    value: "63%",
    label: "miss bill payments regularly each month",
    icon: <HiOutlineClock className="w-6 h-6 text-primary" />,
  },
  {
    value: "27%",
    label: "only this many have a monthly budget",
    icon: <HiOutlineChartPie className="w-6 h-6 text-primary" />,
  },
];

const features = [
  {
    icon: <HiOutlineSquares2X2 className="w-6 h-6 text-primary" />,
    bgColor: "bg-primary/15",
    title: "Smart Dashboard",
    description:
      "See your complete financial picture at a glance — balance, income, expenses, savings, and health score all in one view.",
  },
  {
    icon: <HiOutlineChartPie className="w-6 h-6 text-needs" />,
    bgColor: "bg-needs/15",
    title: "Budget Tracking",
    description:
      "Set monthly budgets with the 50/30/20 rule. Track needs, wants, and EMI spending with visual progress bars.",
  },
  {
    icon: <HiOutlineDocumentText className="w-6 h-6 text-emi" />,
    bgColor: "bg-emi/15",
    title: "Bills & EMI Manager",
    description:
      "Never miss a payment again. Track due dates, get overdue alerts, and stay on top of every obligation.",
  },
  {
    icon: <HiOutlineTrophy className="w-6 h-6 text-accent" />,
    bgColor: "bg-accent/15",
    title: "Saving Challenges",
    description:
      "Gamified savings goals tailored to your income. Build consistency with daily and weekly targets.",
  },
  {
    icon: <HiOutlineSparkles className="w-6 h-6 text-pink-500" />,
    bgColor: "bg-pink-500/15",
    title: "AI Finance Assistant",
    description:
      "Ask anything about your finances. Get personalized insights and smart recommendations powered by AI.",
  },
  {
    icon: <HiOutlineAcademicCap className="w-6 h-6 text-primary" />,
    bgColor: "bg-primary/15",
    title: "Financial Learning",
    description:
      "Bite-sized articles on budgeting, saving, debt awareness, and building wealth — curated for you.",
  },
];

const steps = [
  {
    icon: <HiOutlineUserCircle className="w-7 h-7 text-primary" />,
    title: "Sign Up & Personalize",
    description:
      "Create your account, tell us your profession, income type, and salary date. We tailor everything to you.",
  },
  {
    icon: <HiOutlineChartPie className="w-7 h-7 text-primary" />,
    title: "Track & Budget",
    description:
      "Log transactions, set budgets, add bills, and let the dashboard show you exactly where your money goes.",
  },
  {
    icon: <HiOutlineArrowTrendingUp className="w-7 h-7 text-primary" />,
    title: "Build Habits & Grow",
    description:
      "Take on saving challenges, improve your financial health score, and watch your wealth grow over time.",
  },
];

const testimonials = [
  {
    name: "Dhrumil",
    role: "Software Engineer, Bangalore",
    quote:
      "I finally know where my money goes each month. The budget tracking with the 50/30/20 split is exactly what I needed as a salaried professional.",
  },
  {
    name: "Rahul Patel",
    role: "Freelance Designer, Mumbai",
    quote:
      "As a freelancer with variable income, the saving challenges keep me disciplined. I've saved more in 3 months than I did all last year.",
  },
  {
    name: "Anita Desai",
    role: "Business Owner, Delhi",
    quote:
      "The bill tracker alone is worth it. No more missed EMIs or late fees. Plus the AI assistant gives genuinely useful advice for my situation.",
  },
];

const mockTransactions = [
  { name: "Grocery Store", amount: "-₹840", color: "#3B82F6", initial: "G" },
  { name: "Salary Credit", amount: "+₹65,000", color: "#22c55e", initial: "S" },
  { name: "Netflix", amount: "-₹649", color: "#F59E0B", initial: "N" },
];

export default function LandingPage() {
  const { user, profile, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user && profile?.onboardingComplete) {
      router.replace(ROUTES.DASHBOARD);
    } else if (user && !profile?.onboardingComplete) {
      router.replace(ROUTES.ONBOARDING);
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    if (loading || user) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    const els = document.querySelectorAll(".lp-reveal");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, user]);

  const handleNavClick = () => setMobileMenuOpen(false);

  if (loading || user) {
    return null;
  }

  const GAUGE_R = 24;
  const GAUGE_C = 2 * Math.PI * GAUGE_R;
  const PREVIEW_R = 48;
  const PREVIEW_C = 2 * Math.PI * PREVIEW_R;

  return (
    <>
      <style>{`
        .lp-reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lp-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes lp-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes lp-float-reverse {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(10px) rotate(-2deg); }
        }
        @keyframes lp-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .lp-delay-1 { transition-delay: 80ms; }
        .lp-delay-2 { transition-delay: 160ms; }
        .lp-delay-3 { transition-delay: 240ms; }
        .lp-delay-4 { transition-delay: 320ms; }
        .lp-delay-5 { transition-delay: 400ms; }
      `}</style>

      <div className="relative min-h-screen bg-background transition-colors duration-300" style={{ zIndex: 1 }}>

        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/60">
          <div className="max-w-6xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
             
              <span className="text-xl font-bold font-[family-name:var(--font-display)] text-foreground">
                Expensio
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                How It Works
              </a>
              <a
                href="#preview"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                Preview
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-raised transition-all"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
              </button>
              <Link
                href={ROUTES.LOGIN}
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href={ROUTES.SIGNUP}
                className="px-5 py-2.5 rounded-2xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25"
              >
                Get Started Free
              </Link>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-muted hover:text-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-xl text-foreground hover:bg-surface-raised transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <HiOutlineXMark className="w-6 h-6" />
                ) : (
                  <HiOutlineBars3 className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-background border-b border-border px-5 pb-5 pt-2 space-y-1">
              <a
                href="#features"
                onClick={handleNavClick}
                className="block py-3 text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={handleNavClick}
                className="block py-3 text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                How It Works
              </a>
              <a
                href="#preview"
                onClick={handleNavClick}
                className="block py-3 text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                Preview
              </a>
              <div className="flex gap-3 pt-3">
                <Link
                  href={ROUTES.LOGIN}
                  onClick={handleNavClick}
                  className="flex-1 text-center py-3 rounded-2xl text-sm font-semibold text-foreground border border-border hover:border-primary/30 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href={ROUTES.SIGNUP}
                  onClick={handleNavClick}
                  className="flex-1 text-center py-3 rounded-2xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          )}
        </nav>

        <section className="relative min-h-screen flex items-center pt-20 pb-16 lg:pt-24 lg:pb-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[10%] right-[10%] w-96 h-96 rounded-full bg-primary/15 blur-[100px]" />
            <div className="absolute bottom-[5%] left-[5%] w-80 h-80 rounded-full bg-savings/10 blur-[80px]" />
            <div className="absolute top-[40%] left-[30%] w-64 h-64 rounded-full bg-accent/8 blur-[60px]" />
            
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-foreground) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-raised border border-border/50 mb-8 shadow-lg shadow-black/5">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping opacity-75"></div>
                  </div>
                  <span className="text-xs font-semibold text-muted">Smart Money Management</span>
                </div>

                <h1>
                  <span className="block text-5xl sm:text-6xl lg:text-7xl font-black text-foreground leading-[0.95] tracking-tight">
                    Master Your
                  </span>
                  <span className="block text-5xl sm:text-6xl lg:text-7xl font-black text-primary leading-[0.95] tracking-tight mt-2">
                    Money Game
                  </span>
                </h1>

                <p className="mt-8 text-xl text-muted leading-relaxed max-w-lg">
                  Track spending, set budgets, crush saving goals. Your complete financial command center.
                </p>

                <div className="flex flex-wrap gap-4 mt-10">
                  <Link
                    href={ROUTES.SIGNUP}
                    className="group relative px-8 py-4 rounded-2xl bg-primary text-white font-bold text-base overflow-hidden transition-all shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started Free
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-primary-dark opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    href={ROUTES.LOGIN}
                    className="px-8 py-4 rounded-2xl text-foreground font-semibold text-base border-2 border-border hover:border-primary/40 hover:bg-surface-raised transition-all"
                  >
                    Sign In
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <HiOutlineCheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Free Forever</p>
                      <p className="text-xs text-muted">No hidden fees</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <HiOutlineSparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">AI Powered</p>
                      <p className="text-xs text-muted">Smart insights</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative h-[520px] lg:h-[600px] hidden md:block">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/20 blur-[80px]" />

                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-72 bg-linear-to-br from-primary via-primary to-savings rounded-3xl p-6 shadow-2xl shadow-primary/30 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-white/60 uppercase tracking-widest font-semibold">Current Balance</span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">₹</span>
                    </div>
                  </div>
                  <p className="text-4xl font-black text-white tracking-tight">₹42,580</p>
                  <div className="flex gap-6 mt-5">
                    <div>
                      <p className="text-[10px] text-white/50">Income</p>
                      <p className="text-sm font-bold text-white mt-0.5">₹65,000</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50">Spent</p>
                      <p className="text-sm font-bold text-white/90 mt-0.5">₹18,420</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50">Saved</p>
                      <p className="text-sm font-bold text-savings-light mt-0.5">₹4,000</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-48 left-4 w-44 bg-surface-raised rounded-2xl p-4 shadow-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <svg className="w-14 h-14" viewBox="0 0 60 60" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="30" cy="30" r={GAUGE_R} fill="none" stroke="var(--color-border)" strokeWidth="5" />
                        <circle 
                          cx="30" cy="30" r={GAUGE_R} fill="none" stroke="var(--color-primary)" strokeWidth="5" 
                          strokeLinecap="round" strokeDasharray={GAUGE_C} strokeDashoffset={GAUGE_C * 0.24}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-primary">76</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Health</p>
                      <span className="text-[10px] font-semibold text-primary bg-primary/15 px-2 py-0.5 rounded-md">Good</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-52 right-0 w-48 bg-surface-raised rounded-2xl p-4 shadow-xl border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
                      <HiOutlineTrophy className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">7 Day Streak!</p>
                      <p className="text-[10px] text-muted">Keep going</p>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                    <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-accent to-primary" />
                  </div>
                  <p className="text-[10px] text-muted mt-2">₹3,500 / ₹5,000</p>
                </div>

                <div className="absolute bottom-24 left-8 w-52 bg-surface-raised rounded-2xl p-4 shadow-xl border border-border">
                  <p className="text-[10px] text-muted font-semibold mb-3 uppercase tracking-wider">Recent</p>
                  <div className="space-y-2.5">
                    {mockTransactions.slice(0, 2).map((item) => (
                      <div key={item.name} className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: item.color + "15", color: item.color }}
                        >
                          {item.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                        </div>
                        <span className={`text-xs font-bold ${item.amount.startsWith("+") ? "text-primary" : "text-foreground"}`}>
                          {item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-16 right-4 w-40 bg-surface-raised rounded-2xl p-4 shadow-xl border border-border">
                  <p className="text-[10px] text-muted font-semibold uppercase tracking-wider">Budget</p>
                  <p className="text-2xl font-black text-foreground mt-1">42%</p>
                  <div className="w-full h-1.5 rounded-full bg-border mt-2">
                    <div className="h-full w-[42%] rounded-full bg-primary" />
                  </div>
                  <p className="text-[10px] text-muted mt-2">₹18,900 left</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-surface scroll-mt-20">
          <div className="max-w-6xl mx-auto px-5 lg:px-8">
            <div className="text-center mb-12 lp-reveal">
              <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-display)] text-foreground">
                The Financial Reality Check
              </h2>
              <p className="mt-3 text-muted text-lg max-w-2xl mx-auto">
                Most Indians struggle with money management. Expensio is built to
                change that.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`lp-reveal bg-surface-raised rounded-3xl p-6 text-center border border-border hover:border-primary/30 transition-all duration-300 ${
                    i === 1 ? "lp-delay-1" : i === 2 ? "lp-delay-2" : i === 3 ? "lp-delay-3" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
                    {stat.icon}
                  </div>
                  <p className="text-3xl lg:text-4xl font-extrabold font-[family-name:var(--font-display)] text-primary">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-20">
          <div className="lg:flex lg:min-h-[300vh]">
            <div className="lg:sticky lg:top-0 lg:h-screen lg:w-1/2 flex items-center bg-background">
              <div className="w-full px-5 lg:px-12 py-16 lg:py-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 text-accent text-xs font-semibold mb-6">
                  Features
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-foreground leading-tight">
                  Everything You Need to{" "}
                  <span className="text-primary">Thrive Financially</span>
                </h2>
                <p className="mt-6 text-lg text-muted leading-relaxed max-w-md">
                  A complete toolkit designed around how you actually manage money. Simple, powerful, effective.
                </p>
                <div className="hidden lg:flex items-center gap-2 mt-8 text-sm text-muted">
                  <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  Scroll to explore
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 lg:py-[50vh]">
              <div className="space-y-8 px-5 lg:px-12">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="group bg-surface-raised rounded-3xl p-8 border border-border hover:border-primary/30 transition-all duration-300"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bgColor} transition-transform duration-300 group-hover:scale-110`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="py-16 lg:py-24 bg-surface scroll-mt-20"
        >
          <div className="max-w-6xl mx-auto px-5 lg:px-8">
            <div className="text-center mb-16 lp-reveal">
              <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-display)] text-foreground">
                Get Started in 3 Simple Steps
              </h2>
              <p className="mt-3 text-muted text-lg max-w-xl mx-auto">
                From sign-up to financial growth in minutes, not hours.
              </p>
            </div>

            <div className="relative flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-0">
              <div className="hidden lg:block absolute top-6 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px] bg-primary/15" />
              <div className="lg:hidden absolute top-6 bottom-6 left-[23px] w-[2px] bg-primary/15" />

              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`lp-reveal flex lg:flex-col lg:items-center lg:text-center flex-1 relative pl-16 lg:pl-0 ${
                    i === 1 ? "lp-delay-1" : i === 2 ? "lp-delay-2" : ""
                  }`}
                >
                  <div className="absolute left-0 lg:relative lg:left-auto w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold font-[family-name:var(--font-display)] z-10 shadow-md shadow-primary/20">
                    {i + 1}
                  </div>
                  <div className="lg:mt-6">
                    <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-border items-center justify-center mb-4 mx-auto hidden lg:flex">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed max-w-xs lg:mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="preview" className="py-16 lg:py-24 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-5 lg:px-8">
            <div className="text-center mb-12 lp-reveal">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 text-primary text-xs font-semibold mb-4">
                Dashboard Preview
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-display)] text-foreground">
                Your Command Center for Money
              </h2>
              <p className="mt-3 text-muted text-lg max-w-2xl mx-auto">
                Everything you need, beautifully organized in one intelligent
                dashboard.
              </p>
            </div>

            <div className="lp-reveal bg-surface-raised rounded-2xl lg:rounded-3xl shadow-2xl shadow-black/30 border border-border overflow-hidden max-w-4xl mx-auto">
              <div className="flex items-center gap-2 px-4 py-3 bg-surface-overlay border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-danger/50" />
                  <div className="w-3 h-3 rounded-full bg-accent/50" />
                  <div className="w-3 h-3 rounded-full bg-primary/50" />
                </div>
                <div className="flex-1 mx-2 sm:mx-4">
                  <div className="bg-surface rounded-lg px-4 py-1.5 text-[10px] sm:text-xs text-muted font-[family-name:var(--font-mono)] border border-border max-w-xs mx-auto text-center truncate">
                    expensio.app/dashboard
                  </div>
                </div>
              </div>

              <div className="bg-surface p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
                <div className="bg-surface-raised rounded-2xl p-4 sm:p-5 border border-border">
                  <p className="text-[8px] sm:text-[9px] text-muted uppercase tracking-widest font-semibold">
                    Current Balance
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-[family-name:var(--font-display)] mt-1">
                    ₹42,580
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-muted mt-0.5">
                    Income - Expenses - Savings this month
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-success/10 border border-success/20">
                    <p className="text-sm sm:text-lg font-bold text-success font-[family-name:var(--font-display)]">
                      ₹65,000
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-muted">
                      Income
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-danger/10 border border-danger/20">
                    <p className="text-sm sm:text-lg font-bold text-danger font-[family-name:var(--font-display)]">
                      ₹18,420
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-muted">
                      Expenses
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-savings/10 border border-savings/20">
                    <p className="text-sm sm:text-lg font-bold text-savings font-[family-name:var(--font-display)]">
                      ₹4,000
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-muted">
                      Savings
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-surface-raised rounded-2xl p-4 sm:p-5 border border-border flex flex-col items-center">
                    <svg
                      className="w-20 h-20 sm:w-24 sm:h-24"
                      viewBox="0 0 120 120"
                      style={{ transform: "rotate(-90deg)" }}
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r={PREVIEW_R}
                        fill="none"
                        stroke="var(--color-border)"
                        strokeWidth="7"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={PREVIEW_R}
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={PREVIEW_C}
                        strokeDashoffset={PREVIEW_C * 0.24}
                      />
                    </svg>
                    <p className="text-xs font-bold text-primary mt-2">
                      Good
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-muted">
                      Financial Health
                    </p>
                  </div>

                  <div className="bg-surface-raised rounded-2xl p-4 sm:p-5 border border-border">
                    <p className="text-[8px] sm:text-[9px] text-muted uppercase tracking-widest font-semibold mb-3">
                      Budget
                    </p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-[family-name:var(--font-display)]">
                      42<span className="text-sm text-muted">%</span>
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-muted mt-0.5">
                      of ₹45,000 used
                    </p>
                    <div className="w-full h-2 rounded-full bg-surface-overlay mt-3">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: "42%" }}
                      />
                    </div>
                    <div className="flex gap-3 mt-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-needs" />
                        <span className="text-[8px] text-muted">Needs</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-[8px] text-muted">Wants</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emi" />
                        <span className="text-[8px] text-muted">EMI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-savings" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div
            className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-white/10"
            style={{ animation: "lp-float 5s ease-in-out infinite" }}
          />
          <div
            className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-lg bg-white/10 rotate-45"
            style={{ animation: "lp-float-reverse 4s ease-in-out infinite" }}
          />

          <div className="relative max-w-3xl mx-auto px-5 lg:px-8 text-center lp-reveal">
            <h2 className="text-3xl lg:text-5xl font-extrabold font-[family-name:var(--font-display)] text-white leading-tight">
              Start Your Financial Wellness Journey Today
            </h2>
            <p className="mt-5 text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
              Join thousands of Indians who are taking control of their money,
              building savings habits, and improving their financial health.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href={ROUTES.SIGNUP}
                className="px-10 py-4 rounded-2xl bg-white text-primary font-bold text-base hover:bg-white/90 transition-all shadow-lg shadow-black/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started Free
              </Link>
              <Link
                href={ROUTES.LOGIN}
                className="px-10 py-4 rounded-2xl bg-transparent text-white font-semibold text-base border-2 border-white/30 hover:border-white/60 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        <footer className="py-10 bg-background border-t border-border/60">
          <div className="max-w-6xl mx-auto px-5 lg:px-8 flex flex-col items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
                <span className="text-xs font-extrabold text-white font-[family-name:var(--font-display)]">E</span>
              </div>
              <span className="text-base font-bold font-[family-name:var(--font-display)] text-foreground">
                Expensio
              </span>
            </Link>
            <p className="text-xs text-muted">
              Built with care for your financial wellbeing
            </p>
            <p className="text-xs text-muted/60">
              &copy; {new Date().getFullYear()} Expensio. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
