"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
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
} from "react-icons/hi2";

/* ─── Static Data ─────────────────────────── */

const stats = [
  {
    value: "78%",
    label: "of Indians live paycheck to paycheck",
    icon: <HiOutlineExclamationTriangle className="w-6 h-6 text-[#059669]" />,
  },
  {
    value: "₹2.4L",
    label: "average credit card debt per household",
    icon: <HiOutlineCreditCard className="w-6 h-6 text-[#059669]" />,
  },
  {
    value: "63%",
    label: "miss bill payments regularly each month",
    icon: <HiOutlineClock className="w-6 h-6 text-[#059669]" />,
  },
  {
    value: "27%",
    label: "only this many have a monthly budget",
    icon: <HiOutlineChartPie className="w-6 h-6 text-[#059669]" />,
  },
];

const features = [
  {
    icon: <HiOutlineSquares2X2 className="w-6 h-6 text-[#059669]" />,
    bgColor: "bg-[#D1FAE5]",
    title: "Smart Dashboard",
    description:
      "See your complete financial picture at a glance — balance, income, expenses, savings, and health score all in one view.",
  },
  {
    icon: <HiOutlineChartPie className="w-6 h-6 text-[#3B82F6]" />,
    bgColor: "bg-[#DBEAFE]",
    title: "Budget Tracking",
    description:
      "Set monthly budgets with the 50/30/20 rule. Track needs, wants, and EMI spending with visual progress bars.",
  },
  {
    icon: <HiOutlineDocumentText className="w-6 h-6 text-[#8B5CF6]" />,
    bgColor: "bg-[#EDE9FE]",
    title: "Bills & EMI Manager",
    description:
      "Never miss a payment again. Track due dates, get overdue alerts, and stay on top of every obligation.",
  },
  {
    icon: <HiOutlineTrophy className="w-6 h-6 text-[#F59E0B]" />,
    bgColor: "bg-[#FEF3C7]",
    title: "Saving Challenges",
    description:
      "Gamified savings goals tailored to your income. Build consistency with daily and weekly targets.",
  },
  {
    icon: <HiOutlineSparkles className="w-6 h-6 text-[#EC4899]" />,
    bgColor: "bg-[#FCE7F3]",
    title: "AI Finance Assistant",
    description:
      "Ask anything about your finances. Get personalized insights and smart recommendations powered by AI.",
  },
  {
    icon: <HiOutlineAcademicCap className="w-6 h-6 text-[#059669]" />,
    bgColor: "bg-[#D1FAE5]",
    title: "Financial Learning",
    description:
      "Bite-sized articles on budgeting, saving, debt awareness, and building wealth — curated for you.",
  },
];

const steps = [
  {
    icon: <HiOutlineUserCircle className="w-7 h-7 text-[#059669]" />,
    title: "Sign Up & Personalize",
    description:
      "Create your account, tell us your profession, income type, and salary date. We tailor everything to you.",
  },
  {
    icon: <HiOutlineChartPie className="w-7 h-7 text-[#059669]" />,
    title: "Track & Budget",
    description:
      "Log transactions, set budgets, add bills, and let the dashboard show you exactly where your money goes.",
  },
  {
    icon: <HiOutlineArrowTrendingUp className="w-7 h-7 text-[#059669]" />,
    title: "Build Habits & Grow",
    description:
      "Take on saving challenges, improve your financial health score, and watch your wealth grow over time.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
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

/* ─── Component ───────────────────────────── */

export default function LandingPage() {
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ctaHref =
    user && profile?.onboardingComplete ? ROUTES.DASHBOARD : ROUTES.SIGNUP;
  const ctaText =
    user && profile?.onboardingComplete ? "Go to Dashboard" : "Get Started Free";

  /* Scroll-reveal observer */
  useEffect(() => {
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
  }, []);

  /* Close mobile menu on anchor click */
  const handleNavClick = () => setMobileMenuOpen(false);

  const GAUGE_R = 24;
  const GAUGE_C = 2 * Math.PI * GAUGE_R;
  const PREVIEW_R = 48;
  const PREVIEW_C = 2 * Math.PI * PREVIEW_R;

  return (
    <>
      {/* ─── Scoped Styles ────────────────── */}
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
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .lp-delay-1 { transition-delay: 80ms; }
        .lp-delay-2 { transition-delay: 160ms; }
        .lp-delay-3 { transition-delay: 240ms; }
        .lp-delay-4 { transition-delay: 320ms; }
        .lp-delay-5 { transition-delay: 400ms; }
      `}</style>

      {/* ─── Main Wrapper ─────────────────── */}
      <div className="relative min-h-screen bg-[#FAFAF7]" style={{ zIndex: 1 }}>

        {/* ═══════════════════════════════════ */}
        {/* NAVBAR                              */}
        {/* ═══════════════════════════════════ */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF7]/80 backdrop-blur-xl border-b border-[#E2E8F0]/60">
          <div className="max-w-6xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#059669] flex items-center justify-center shadow-md shadow-[#059669]/20">
                <span className="text-sm font-extrabold text-white font-[family-name:var(--font-display)]">
                  F
                </span>
              </div>
              <span className="text-lg font-bold font-[family-name:var(--font-display)] text-[#1A1A2E]">
                FinWell
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-[#64748B] hover:text-[#1A1A2E] transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-[#64748B] hover:text-[#1A1A2E] transition-colors"
              >
                How It Works
              </a>
              <a
                href="#preview"
                className="text-sm font-medium text-[#64748B] hover:text-[#1A1A2E] transition-colors"
              >
                Preview
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href={ROUTES.LOGIN}
                className="text-sm font-semibold text-[#1A1A2E] hover:text-[#059669] transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href={ctaHref}
                className="px-5 py-2.5 rounded-2xl bg-[#059669] text-white text-sm font-semibold hover:bg-[#047857] transition-all shadow-md shadow-[#059669]/20 hover:shadow-lg hover:shadow-[#059669]/25"
              >
                {ctaText}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-[#1A1A2E] hover:bg-[#E2E8F0]/50 transition-colors"
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

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#FAFAF7] border-b border-[#E2E8F0] px-5 pb-5 pt-2 space-y-1">
              <a
                href="#features"
                onClick={handleNavClick}
                className="block py-3 text-sm font-medium text-[#64748B] hover:text-[#1A1A2E] transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={handleNavClick}
                className="block py-3 text-sm font-medium text-[#64748B] hover:text-[#1A1A2E] transition-colors"
              >
                How It Works
              </a>
              <a
                href="#preview"
                onClick={handleNavClick}
                className="block py-3 text-sm font-medium text-[#64748B] hover:text-[#1A1A2E] transition-colors"
              >
                Preview
              </a>
              <div className="flex gap-3 pt-3">
                <Link
                  href={ROUTES.LOGIN}
                  onClick={handleNavClick}
                  className="flex-1 text-center py-3 rounded-2xl text-sm font-semibold text-[#1A1A2E] border border-[#E2E8F0] hover:border-[#059669]/30 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href={ctaHref}
                  onClick={handleNavClick}
                  className="flex-1 text-center py-3 rounded-2xl bg-[#059669] text-white text-sm font-semibold hover:bg-[#047857] transition-colors"
                >
                  {ctaText}
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* ═══════════════════════════════════ */}
        {/* HERO                                */}
        {/* ═══════════════════════════════════ */}
        <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-28 overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-16 right-[5%] w-80 h-80 rounded-full bg-[#D1FAE5]/50 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-[2%] w-64 h-64 rounded-full bg-[#FEF3C7]/60 blur-3xl pointer-events-none" />

          {/* Floating geometric decorations */}
          <div
            className="absolute top-32 left-[12%] w-3 h-3 rounded-full bg-[#059669]/25 hidden lg:block"
            style={{ animation: "lp-float 5s ease-in-out infinite" }}
          />
          <div
            className="absolute top-52 right-[18%] w-5 h-5 rounded-lg bg-[#F59E0B]/15 rotate-45 hidden lg:block"
            style={{ animation: "lp-float-reverse 6s ease-in-out infinite" }}
          />
          <div
            className="absolute bottom-24 left-[22%] w-4 h-4 rounded-full border-2 border-[#059669]/15 hidden lg:block"
            style={{ animation: "lp-float 7s ease-in-out infinite" }}
          />
          <div
            className="absolute top-40 right-[8%] w-2 h-2 rounded-full bg-[#10B981]/30 hidden lg:block"
            style={{ animation: "lp-pulse 3s ease-in-out infinite" }}
          />

          <div className="max-w-6xl mx-auto px-5 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:gap-16">
            {/* Left: Text */}
            <div className="flex-1 lg:max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D1FAE5] text-[#059669] text-xs font-semibold mb-6">
                <HiOutlineSparkles className="w-4 h-4" />
                Your Financial Wellness Partner
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold font-[family-name:var(--font-display)] text-[#1A1A2E] leading-[1.08] tracking-tight">
                Take Control of Your{" "}
                <span className="text-[#059669] relative">
                  Financial Wellbeing
                  <svg
                    className="absolute -bottom-2 left-0 w-full hidden sm:block"
                    viewBox="0 0 300 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 8c50-6 100-6 150-2s100 2 146-4"
                      stroke="#059669"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                  </svg>
                </span>
              </h1>

              <p className="mt-6 text-lg text-[#64748B] leading-relaxed max-w-lg">
                Track spending, manage budgets, crush saving challenges, and
                build healthier money habits — all in one beautiful dashboard.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href={ctaHref}
                  className="px-8 py-4 rounded-2xl bg-[#059669] text-white font-semibold text-base hover:bg-[#047857] transition-all shadow-lg shadow-[#059669]/25 hover:shadow-xl hover:shadow-[#059669]/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {ctaText}
                </Link>
                <Link
                  href={ROUTES.LOGIN}
                  className="px-8 py-4 rounded-2xl bg-white text-[#1A1A2E] font-semibold text-base border border-[#E2E8F0] hover:border-[#059669]/30 hover:text-[#059669] transition-all"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-8 text-xs text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <HiOutlineCheckCircle className="w-4 h-4 text-[#059669]" />
                  Free to use
                </span>
                <span className="flex items-center gap-1.5">
                  <HiOutlineCheckCircle className="w-4 h-4 text-[#059669]" />
                  No credit card needed
                </span>
              </div>
            </div>

            {/* Right: Phone Mockup */}
            <div className="flex-1 mt-14 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-[300px]">
                {/* Glow behind phone */}
                <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-[#059669]/10 to-[#10B981]/5 blur-2xl pointer-events-none" />

                {/* Phone frame */}
                <div
                  className="relative bg-white rounded-[2rem] shadow-2xl shadow-[#1A1A2E]/10 border border-[#E2E8F0] p-5 overflow-hidden"
                  style={{ animation: "lp-float 6s ease-in-out infinite" }}
                >
                  {/* Status bar */}
                  <div className="flex items-center justify-between mb-4 px-0.5">
                    <span className="text-[10px] font-semibold text-[#64748B] font-[family-name:var(--font-mono)]">
                      9:41
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2.5 rounded-sm bg-[#1A1A2E] relative">
                        <div className="absolute inset-[2px] rounded-[1px] bg-[#059669]" style={{ width: "60%" }} />
                      </div>
                    </div>
                  </div>

                  {/* Greeting */}
                  <div className="mb-3">
                    <p className="text-[10px] text-[#64748B]">Good morning</p>
                    <p className="text-sm font-bold font-[family-name:var(--font-display)] text-[#1A1A2E]">
                      Priya
                    </p>
                  </div>

                  {/* Balance card */}
                  <div className="bg-gradient-to-br from-[#059669] to-[#10B981] rounded-2xl p-4 mb-3">
                    <p className="text-[8px] text-white/70 uppercase tracking-wider font-semibold">
                      Current Balance
                    </p>
                    <p className="text-2xl font-extrabold text-white font-[family-name:var(--font-display)] mt-0.5">
                      ₹42,580
                    </p>
                    <div className="flex gap-4 mt-2.5">
                      <div>
                        <p className="text-[7px] text-white/60">Income</p>
                        <p className="text-[10px] font-bold text-white font-[family-name:var(--font-mono)]">
                          ₹65,000
                        </p>
                      </div>
                      <div>
                        <p className="text-[7px] text-white/60">Spent</p>
                        <p className="text-[10px] font-bold text-white font-[family-name:var(--font-mono)]">
                          ₹18,420
                        </p>
                      </div>
                      <div>
                        <p className="text-[7px] text-white/60">Saved</p>
                        <p className="text-[10px] font-bold text-white font-[family-name:var(--font-mono)]">
                          ₹4,000
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Health gauge row */}
                  <div className="flex items-center gap-3 bg-[#F8FAFC] rounded-2xl p-3 mb-3">
                    <svg
                      className="w-12 h-12 shrink-0"
                      viewBox="0 0 60 60"
                      style={{ transform: "rotate(-90deg)" }}
                    >
                      <circle
                        cx="30"
                        cy="30"
                        r={GAUGE_R}
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="4"
                      />
                      <circle
                        cx="30"
                        cy="30"
                        r={GAUGE_R}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={GAUGE_C}
                        strokeDashoffset={GAUGE_C * 0.24}
                      />
                    </svg>
                    <div>
                      <p className="text-lg font-extrabold text-[#059669] font-[family-name:var(--font-display)] leading-none">
                        76
                      </p>
                      <p className="text-[8px] text-[#64748B] mt-0.5">
                        Health Score
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-[8px] font-semibold text-[#059669] bg-[#D1FAE5] px-2 py-1 rounded-lg">
                        Good
                      </span>
                    </div>
                  </div>

                  {/* Budget bar */}
                  <div className="mb-3">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[9px] text-[#64748B] font-semibold">
                        Budget
                      </span>
                      <span className="text-[9px] font-bold text-[#1A1A2E] font-[family-name:var(--font-mono)]">
                        42%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E2E8F0]">
                      <div
                        className="h-full rounded-full bg-[#059669]"
                        style={{ width: "42%" }}
                      />
                    </div>
                  </div>

                  {/* Transactions */}
                  <div className="space-y-1.5">
                    {mockTransactions.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-2.5 py-1.5"
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold shrink-0"
                          style={{
                            backgroundColor: item.color + "15",
                            color: item.color,
                          }}
                        >
                          {item.initial}
                        </div>
                        <p className="text-[10px] font-medium text-[#1A1A2E] flex-1 truncate">
                          {item.name}
                        </p>
                        <span
                          className={`text-[10px] font-bold font-[family-name:var(--font-mono)] ${
                            item.amount.startsWith("+")
                              ? "text-[#059669]"
                              : "text-[#1A1A2E]"
                          }`}
                        >
                          {item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════ */}
        {/* STATS / PROBLEM                     */}
        {/* ═══════════════════════════════════ */}
        <section className="py-16 lg:py-24 bg-[#F5F5F0] scroll-mt-20">
          <div className="max-w-6xl mx-auto px-5 lg:px-8">
            <div className="text-center mb-12 lp-reveal">
              <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-display)] text-[#1A1A2E]">
                The Financial Reality Check
              </h2>
              <p className="mt-3 text-[#64748B] text-lg max-w-2xl mx-auto">
                Most Indians struggle with money management. FinWell is built to
                change that.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`lp-reveal bg-white rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 ${
                    i === 1 ? "lp-delay-1" : i === 2 ? "lp-delay-2" : i === 3 ? "lp-delay-3" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] flex items-center justify-center mx-auto mb-4">
                    {stat.icon}
                  </div>
                  <p className="text-3xl lg:text-4xl font-extrabold font-[family-name:var(--font-display)] text-[#059669]">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════ */}
        {/* FEATURES                            */}
        {/* ═══════════════════════════════════ */}
        <section id="features" className="py-16 lg:py-24 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-5 lg:px-8">
            <div className="text-center mb-12 lp-reveal">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FEF3C7] text-[#B45309] text-xs font-semibold mb-4">
                Features
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-display)] text-[#1A1A2E]">
                Everything You Need to Thrive Financially
              </h2>
              <p className="mt-3 text-[#64748B] text-lg max-w-2xl mx-auto">
                A complete toolkit designed around how Indians actually manage
                money.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className={`lp-reveal bg-white rounded-3xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ${
                    i === 1
                      ? "lp-delay-1"
                      : i === 2
                      ? "lp-delay-2"
                      : i === 3
                      ? "lp-delay-3"
                      : i === 4
                      ? "lp-delay-4"
                      : i === 5
                      ? "lp-delay-5"
                      : ""
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${feature.bgColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#1A1A2E] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════ */}
        {/* HOW IT WORKS                        */}
        {/* ═══════════════════════════════════ */}
        <section
          id="how-it-works"
          className="py-16 lg:py-24 bg-[#F5F5F0] scroll-mt-20"
        >
          <div className="max-w-6xl mx-auto px-5 lg:px-8">
            <div className="text-center mb-16 lp-reveal">
              <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-display)] text-[#1A1A2E]">
                Get Started in 3 Simple Steps
              </h2>
              <p className="mt-3 text-[#64748B] text-lg max-w-xl mx-auto">
                From sign-up to financial growth in minutes, not hours.
              </p>
            </div>

            <div className="relative flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-0">
              {/* Connecting line — desktop */}
              <div className="hidden lg:block absolute top-6 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px] bg-[#D1FAE5]" />
              {/* Connecting line — mobile */}
              <div className="lg:hidden absolute top-6 bottom-6 left-[23px] w-[2px] bg-[#D1FAE5]" />

              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`lp-reveal flex lg:flex-col lg:items-center lg:text-center flex-1 relative pl-16 lg:pl-0 ${
                    i === 1 ? "lp-delay-1" : i === 2 ? "lp-delay-2" : ""
                  }`}
                >
                  {/* Step number */}
                  <div className="absolute left-0 lg:relative lg:left-auto w-12 h-12 rounded-full bg-[#059669] text-white flex items-center justify-center text-lg font-bold font-[family-name:var(--font-display)] z-10 shadow-md shadow-[#059669]/20">
                    {i + 1}
                  </div>
                  <div className="lg:mt-6">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm items-center justify-center mb-4 mx-auto hidden lg:flex">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-[#1A1A2E] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#64748B] leading-relaxed max-w-xs lg:mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════ */}
        {/* DASHBOARD PREVIEW                   */}
        {/* ═══════════════════════════════════ */}
        <section id="preview" className="py-16 lg:py-24 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-5 lg:px-8">
            <div className="text-center mb-12 lp-reveal">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D1FAE5] text-[#059669] text-xs font-semibold mb-4">
                Dashboard Preview
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-display)] text-[#1A1A2E]">
                Your Command Center for Money
              </h2>
              <p className="mt-3 text-[#64748B] text-lg max-w-2xl mx-auto">
                Everything you need, beautifully organized in one intelligent
                dashboard.
              </p>
            </div>

            {/* Browser chrome frame */}
            <div className="lp-reveal bg-white rounded-2xl lg:rounded-3xl shadow-2xl shadow-[#1A1A2E]/8 border border-[#E2E8F0] overflow-hidden max-w-4xl mx-auto">
              {/* Browser tab bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]/50" />
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]/50" />
                  <div className="w-3 h-3 rounded-full bg-[#22C55E]/50" />
                </div>
                <div className="flex-1 mx-2 sm:mx-4">
                  <div className="bg-white rounded-lg px-4 py-1.5 text-[10px] sm:text-xs text-[#64748B] font-[family-name:var(--font-mono)] border border-[#E2E8F0] max-w-xs mx-auto text-center truncate">
                    finwell.app/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard content — light theme to match actual app */}
              <div className="bg-[#FAFAF7] p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
                {/* Balance card */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-sm">
                  <p className="text-[8px] sm:text-[9px] text-[#64748B] uppercase tracking-widest font-semibold">
                    Current Balance
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E] font-[family-name:var(--font-display)] mt-1">
                    ₹42,580
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-[#64748B] mt-0.5">
                    Income - Expenses - Savings this month
                  </p>
                </div>

                {/* 3-column stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-[#22c55e]/5 border border-[#22c55e]/10">
                    <p className="text-sm sm:text-lg font-bold text-[#22c55e] font-[family-name:var(--font-display)]">
                      ₹65,000
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-[#64748B]">
                      Income
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-[#ef4444]/5 border border-[#ef4444]/10">
                    <p className="text-sm sm:text-lg font-bold text-[#ef4444] font-[family-name:var(--font-display)]">
                      ₹18,420
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-[#64748B]">
                      Expenses
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-[#06b6d4]/5 border border-[#06b6d4]/10">
                    <p className="text-sm sm:text-lg font-bold text-[#06b6d4] font-[family-name:var(--font-display)]">
                      ₹4,000
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-[#64748B]">
                      Savings
                    </p>
                  </div>
                </div>

                {/* Health + Budget row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {/* Health gauge */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-sm flex flex-col items-center">
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
                        stroke="#E5E7EB"
                        strokeWidth="7"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={PREVIEW_R}
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={PREVIEW_C}
                        strokeDashoffset={PREVIEW_C * 0.24}
                      />
                    </svg>
                    <p className="text-xs font-bold text-[#22c55e] mt-2">
                      Good
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-[#64748B]">
                      Financial Health
                    </p>
                  </div>

                  {/* Budget progress */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-sm">
                    <p className="text-[8px] sm:text-[9px] text-[#64748B] uppercase tracking-widest font-semibold mb-3">
                      Budget
                    </p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E] font-[family-name:var(--font-display)]">
                      42<span className="text-sm text-[#64748B]">%</span>
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-[#64748B] mt-0.5">
                      of ₹45,000 used
                    </p>
                    <div className="w-full h-2 rounded-full bg-[#F5F5F0] mt-3">
                      <div
                        className="h-full rounded-full bg-[#059669]"
                        style={{ width: "42%" }}
                      />
                    </div>
                    <div className="flex gap-3 mt-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                        <span className="text-[8px] text-[#64748B]">Needs</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                        <span className="text-[8px] text-[#64748B]">Wants</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                        <span className="text-[8px] text-[#64748B]">EMI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════ */}
        {/* TESTIMONIALS                        */}
        {/* ═══════════════════════════════════ */}
        <section className="py-16 lg:py-24 bg-[#F5F5F0]">
          <div className="max-w-6xl mx-auto px-5 lg:px-8">
            <div className="text-center mb-12 lp-reveal">
              <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-display)] text-[#1A1A2E]">
                Loved by People Like You
              </h2>
              <p className="mt-3 text-[#64748B] text-lg max-w-xl mx-auto">
                Real stories from users who transformed their financial habits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`lp-reveal bg-white rounded-3xl p-7 shadow-sm relative hover:shadow-md transition-shadow duration-300 ${
                    i === 1 ? "lp-delay-1" : i === 2 ? "lp-delay-2" : ""
                  }`}
                >
                  <div className="text-5xl font-serif text-[#059669]/10 absolute top-3 right-5 leading-none select-none">
                    &ldquo;
                  </div>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6 relative z-10">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] flex items-center justify-center">
                      <span className="text-sm font-bold text-[#059669]">
                        {t.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A2E]">
                        {t.name}
                      </p>
                      <p className="text-xs text-[#64748B]">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════ */}
        {/* FINAL CTA                           */}
        {/* ═══════════════════════════════════ */}
        <section className="py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#059669] to-[#047857]" />
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
                href={ctaHref}
                className="px-10 py-4 rounded-2xl bg-white text-[#059669] font-bold text-base hover:bg-white/90 transition-all shadow-lg shadow-black/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                {ctaText}
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

        {/* ═══════════════════════════════════ */}
        {/* FOOTER                              */}
        {/* ═══════════════════════════════════ */}
        <footer className="py-12 bg-[#FAFAF7] border-t border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto px-5 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
              {/* Logo + description */}
              <div className="max-w-xs">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#059669] flex items-center justify-center">
                    <span className="text-sm font-extrabold text-white font-[family-name:var(--font-display)]">
                      F
                    </span>
                  </div>
                  <span className="text-lg font-bold font-[family-name:var(--font-display)] text-[#1A1A2E]">
                    FinWell
                  </span>
                </div>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Your personal financial wellbeing companion. Track, budget,
                  save, and grow.
                </p>
              </div>

              {/* Links */}
              <div className="flex gap-12 sm:gap-16">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[#1A1A2E] uppercase tracking-wider">
                    Product
                  </p>
                  <a
                    href="#features"
                    className="block text-sm text-[#64748B] hover:text-[#059669] transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="block text-sm text-[#64748B] hover:text-[#059669] transition-colors"
                  >
                    How It Works
                  </a>
                  <a
                    href="#preview"
                    className="block text-sm text-[#64748B] hover:text-[#059669] transition-colors"
                  >
                    Preview
                  </a>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[#1A1A2E] uppercase tracking-wider">
                    Account
                  </p>
                  <Link
                    href={ROUTES.LOGIN}
                    className="block text-sm text-[#64748B] hover:text-[#059669] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href={ROUTES.SIGNUP}
                    className="block text-sm text-[#64748B] hover:text-[#059669] transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-[#94A3B8]">
                &copy; {new Date().getFullYear()} FinWell. All rights reserved.
              </p>
              <p className="text-xs text-[#94A3B8]">
                Built with care for your financial wellbeing
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
