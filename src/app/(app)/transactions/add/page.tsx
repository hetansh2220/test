"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddTransaction } from "@/hooks/useTransactions";
import { useToast } from "@/providers/ToastProvider";
import { EXPENSE_CATEGORIES } from "@/lib/constants/categories";
import { ROUTES } from "@/lib/constants/routes";
import { Timestamp } from "firebase/firestore";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import clsx from "clsx";
import type { TransactionType, ExpenseCategory } from "@/types/transaction";

const types: { value: TransactionType; label: string; color: string; gradient: string }[] = [
  { value: "income", label: "Income", color: "text-success", gradient: "from-success/25 to-success/10" },
  { value: "expense", label: "Expense", color: "text-danger", gradient: "from-danger/25 to-danger/10" },
  { value: "savings", label: "Savings", color: "text-savings", gradient: "from-savings/25 to-savings/10" },
];

export default function AddTransactionPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const addMutation = useAddTransaction();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("needs");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      showToast("Enter a valid amount", "error");
      return;
    }

    try {
      const data: Record<string, any> = {
        type,
        amount: Number(amount),
        description: description || type.charAt(0).toUpperCase() + type.slice(1),
        date: Timestamp.fromDate(new Date(date)),
      };
      if (type === "expense") {
        data.category = category;
      }
      await addMutation.mutateAsync(data as any);
      showToast("Transaction added!", "success");
      router.push(ROUTES.TRANSACTIONS);
    } catch {
      showToast("Failed to add transaction", "error");
    }
  };

  return (
    <div className="py-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="w-11 h-11 rounded-2xl bg-surface-raised border border-border flex items-center justify-center hover:border-primary/30 transition-all"
        >
          <HiOutlineArrowLeft className="w-5 h-5 text-muted" />
        </button>
        <h1 className="text-xl font-bold font-[family-name:var(--font-display)]">Add Transaction</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 lg:max-w-xl">
        {/* Type selector */}
        <div className="grid grid-cols-3 gap-2">
          {types.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={clsx(
                "py-3 rounded-2xl font-semibold text-sm transition-all border",
                type === t.value
                  ? `bg-gradient-to-b ${t.gradient} border-transparent ${t.color} shadow-sm`
                  : "bg-surface-overlay border-border text-muted hover:border-primary/30"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <label className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted/50">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full h-16 pl-12 pr-4 rounded-2xl bg-surface border border-border-subtle text-3xl font-bold text-foreground font-[family-name:var(--font-mono)] placeholder:text-muted/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Category (expense only) */}
        {type === "expense" && (
          <div>
            <label className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {EXPENSE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={clsx(
                    "flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border transition-all",
                    category === cat.value
                      ? "border-transparent shadow-sm"
                      : "border-border bg-surface-raised hover:border-primary/30"
                  )}
                  style={category === cat.value ? { backgroundColor: cat.bgColor, borderColor: cat.color + "30" } : {}}
                >
                  <span className="text-xs font-bold" style={{ color: cat.color }}>{cat.label}</span>
                  <span className="text-[10px] text-muted text-center leading-tight">{cat.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this for?"
            className="w-full h-12 px-4 rounded-2xl bg-surface border border-border-subtle text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Date */}
        <div>
          <label className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-12 px-4 rounded-2xl bg-surface border border-border-subtle text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={addMutation.isPending || !amount}
          className={clsx(
            "w-full h-14 rounded-2xl font-semibold text-white text-base shadow-lg transition-all disabled:opacity-50",
            type === "income" && "bg-gradient-to-r from-success to-success-light hover:shadow-lg hover:shadow-success/25",
            type === "expense" && "bg-gradient-to-r from-danger to-danger-light hover:shadow-lg hover:shadow-danger/25",
            type === "savings" && "bg-gradient-to-r from-savings to-savings-light hover:shadow-lg hover:shadow-savings/25"
          )}
        >
          {addMutation.isPending ? "Adding..." : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </button>
      </form>
    </div>
  );
}
