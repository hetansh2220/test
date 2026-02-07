"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddBill } from "@/hooks/useBills";
import { useToast } from "@/providers/ToastProvider";
import { ROUTES } from "@/lib/constants/routes";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import clsx from "clsx";
import type { BillFrequency } from "@/types/bill";

export default function AddBillPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const addMutation = useAddBill();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [frequency, setFrequency] = useState<BillFrequency>("monthly");
  const [isEMI, setIsEMI] = useState(false);
  const [emiTotalMonths, setEmiTotalMonths] = useState("");
  const [emiCompletedMonths, setEmiCompletedMonths] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !dueDate) {
      showToast("Fill all required fields", "error");
      return;
    }
    try {
      await addMutation.mutateAsync({
        name,
        amount: Number(amount),
        dueDate: Number(dueDate),
        frequency,
        isEMI,
        emiTotalMonths: isEMI ? Number(emiTotalMonths) || undefined : undefined,
        emiCompletedMonths: isEMI ? Number(emiCompletedMonths) || 0 : undefined,
        isPaid: false,
      });
      showToast("Bill added!", "success");
      router.push(ROUTES.BILLS);
    } catch {
      showToast("Failed to add bill", "error");
    }
  };

  return (
    <div className="py-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-surface-overlay border border-border-subtle flex items-center justify-center hover:border-border transition-colors"
        >
          <HiOutlineArrowLeft className="w-5 h-5 text-muted" />
        </button>
        <h1 className="text-lg font-bold font-[family-name:var(--font-display)]">Add Bill / EMI</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 lg:max-w-xl">
        <div>
          <label className="text-[10px] font-semibold text-muted uppercase tracking-widest block mb-2">Bill Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Electricity, Rent, Loan..."
            className="w-full h-12 px-4 rounded-2xl bg-surface border border-border-subtle text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-muted uppercase tracking-widest block mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted/50">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full h-12 pl-8 pr-3 rounded-2xl bg-surface border border-border-subtle text-sm font-bold text-foreground font-[family-name:var(--font-mono)] placeholder:text-muted/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-muted uppercase tracking-widest block mb-2">Due Day</label>
            <input
              type="number"
              min="1"
              max="31"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="1-31"
              className="w-full h-12 px-4 rounded-2xl bg-surface border border-border-subtle text-sm font-bold text-foreground font-[family-name:var(--font-mono)] placeholder:text-muted/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold text-muted uppercase tracking-widest block mb-2">Frequency</label>
          <div className="grid grid-cols-4 gap-2">
            {(["monthly", "quarterly", "yearly", "one_time"] as BillFrequency[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={clsx(
                  "py-2 rounded-xl text-xs font-semibold transition-all border capitalize",
                  frequency === f
                    ? "bg-primary/15 border-primary/30 text-primary"
                    : "bg-surface-overlay border-border-subtle text-muted hover:border-border"
                )}
              >
                {f.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* EMI Toggle */}
        <button
          type="button"
          onClick={() => setIsEMI(!isEMI)}
          className={clsx(
            "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
            isEMI
              ? "bg-emi/15 border-emi/30"
              : "bg-surface-overlay border-border-subtle hover:border-border"
          )}
        >
          <span className="text-sm font-semibold text-foreground">This is an EMI</span>
          <div className={clsx("w-10 h-6 rounded-full transition-colors flex items-center px-0.5", isEMI ? "bg-emi" : "bg-border")}>
            <div className={clsx("w-5 h-5 rounded-full bg-white transition-transform", isEMI && "translate-x-4")} />
          </div>
        </button>

        {isEMI && (
          <div className="grid grid-cols-2 gap-3 animate-scale-in">
            <div>
              <label className="text-[10px] font-semibold text-muted uppercase tracking-widest block mb-2">Total Months</label>
              <input
                type="number"
                value={emiTotalMonths}
                onChange={(e) => setEmiTotalMonths(e.target.value)}
                placeholder="24"
                className="w-full h-12 px-4 rounded-2xl bg-surface border border-border-subtle text-sm font-bold text-foreground font-[family-name:var(--font-mono)] placeholder:text-muted/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted uppercase tracking-widest block mb-2">Months Done</label>
              <input
                type="number"
                value={emiCompletedMonths}
                onChange={(e) => setEmiCompletedMonths(e.target.value)}
                placeholder="0"
                className="w-full h-12 px-4 rounded-2xl bg-surface border border-border-subtle text-sm font-bold text-foreground font-[family-name:var(--font-mono)] placeholder:text-muted/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={addMutation.isPending || !name || !amount || !dueDate}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
        >
          {addMutation.isPending ? "Adding..." : "Add Bill"}
        </button>
      </form>
    </div>
  );
}
