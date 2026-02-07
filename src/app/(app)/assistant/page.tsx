"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useTransactions } from "@/hooks/useTransactions";
import { useBudget } from "@/hooks/useBudget";
import { useBills } from "@/hooks/useBills";
import { useChallenges } from "@/hooks/useChallenges";
import { getCurrentMonth } from "@/lib/utils/dateHelpers";
import { calculateHealthScore } from "@/lib/utils/healthScore";
import type { ChatMessage, FinancialContext } from "@/types/assistant";
import { HiOutlinePaperAirplane, HiOutlineSparkles } from "react-icons/hi2";
import clsx from "clsx";

const quickPrompts = [
  "How is my financial health?",
  "How can I save more?",
  "Explain my budget",
  "Tips for reducing spending",
  "Am I on track this month?",
  "Help me plan for next month",
];

function renderMessageContent(content: string): string {
  const lines = content.split("\n");
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) { result.push("<ul class='list-disc pl-4 space-y-0.5 my-1'>"); inList = true; }
      const text = trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");
      result.push(`<li>${text}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) { result.push("<ol class='list-decimal pl-4 space-y-0.5 my-1'>"); inList = true; }
      const text = trimmed.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");
      result.push(`<li>${text}</li>`);
    } else {
      if (inList) { result.push("</ul>"); inList = false; }
      if (trimmed === "") {
        result.push("<br/>");
      } else {
        const text = trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");
        result.push(`<p>${text}</p>`);
      }
    }
  }
  if (inList) result.push("</ul>");
  return result.join("");
}

export default function AssistantPage() {
  const { profile } = useAuth();
  const month = getCurrentMonth();
  const { data: transactions = [] } = useTransactions(month);
  const { data: budget } = useBudget(month);
  const { data: bills = [] } = useBills();
  const { data: challenges = [] } = useChallenges();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const financialContext: FinancialContext = useMemo(() => {
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const totalSavings = transactions.filter((t) => t.type === "savings").reduce((s, t) => s + t.amount, 0);
    const health = calculateHealthScore(transactions, budget ?? null, bills, challenges, profile?.monthlyIncome || 0);
    const upcomingBills = bills.filter((b) => !b.isPaid).map((b) => `${b.name} (₹${b.amount}, due ${b.dueDate}th)`).join(", ") || "None";
    const activeCh = challenges.filter((c) => c.status === "active").map((c) => c.title).join(", ") || "None";

    return {
      monthlyIncome: profile?.monthlyIncome || 0,
      totalExpenses,
      budgetLimit: budget?.monthlyLimit || 0,
      totalSavings,
      healthScore: health.score,
      upcomingBills,
      activeChallenges: activeCh,
    };
  }, [transactions, budget, bills, challenges, profile]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, financialContext }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "Sorry, I couldn't process that. Please try again.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm having trouble connecting. Please check your API key and try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] lg:h-[calc(100vh-6rem)] -mx-4 lg:-mx-8 animate-fade-in">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-savings flex items-center justify-center">
            <HiOutlineSparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold font-[family-name:var(--font-display)]">FinWell AI</p>
            <p className="text-[10px] text-muted">Your financial assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-savings/20 flex items-center justify-center mb-4">
              <HiOutlineSparkles className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Ask me anything</p>
            <p className="text-xs text-muted text-center max-w-xs mb-6">
              I can help you understand your finances, suggest savings strategies, and explain your budget.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="px-3 py-2 rounded-xl bg-surface-raised border border-border-subtle text-xs font-medium text-muted hover:text-foreground hover:border-border transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx("flex", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={clsx(
                "max-w-[80%] lg:max-w-[60%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-white rounded-br-md"
                  : "glass-light text-foreground rounded-bl-md"
              )}
            >
              {msg.role === "assistant" ? (
                <div dangerouslySetInnerHTML={{ __html: renderMessageContent(msg.content) }} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="glass-light px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-muted animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-5 py-3 border-t border-border-subtle bg-background/80 backdrop-blur-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about your finances..."
            className="flex-1 h-12 px-4 rounded-2xl bg-surface border border-border-subtle text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary/50 transition-all"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white disabled:opacity-40 hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            <HiOutlinePaperAirplane className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
