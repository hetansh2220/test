"use client";

import { useMemo, useEffect } from "react";
import Link from "next/link";
import { useBills, useUpdateBill, useDeleteBill } from "@/hooks/useBills";
import { useAddTransaction } from "@/hooks/useTransactions";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { isOverdue, isDueSoon, getDaysUntilDue } from "@/lib/utils/dateHelpers";
import { ROUTES } from "@/lib/constants/routes";
import { useToast } from "@/providers/ToastProvider";
import { Timestamp } from "firebase/firestore";
import {
  HiOutlinePlus,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineTrash,
} from "react-icons/hi2";
import clsx from "clsx";

export default function BillsPage() {
  const { data: bills = [], isLoading } = useBills();
  const updateBill = useUpdateBill();
  const deleteBill = useDeleteBill();
  const addTransaction = useAddTransaction();
  const { showToast } = useToast();

  // Auto-reset recurring bills at the start of each month
  useEffect(() => {
    if (bills.length === 0) return;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    bills.forEach((bill) => {
      if (!bill.isPaid || bill.frequency === "one_time") return;
      if (!bill.lastPaidDate) return;

      const paidDate = bill.lastPaidDate.toDate();
      const paidMonth = paidDate.getMonth();
      const paidYear = paidDate.getFullYear();

      let shouldReset = false;
      if (bill.frequency === "monthly") {
        shouldReset = paidYear < currentYear || paidMonth < currentMonth;
      } else if (bill.frequency === "quarterly") {
        const monthsDiff = (currentYear - paidYear) * 12 + (currentMonth - paidMonth);
        shouldReset = monthsDiff >= 3;
      } else if (bill.frequency === "yearly") {
        const monthsDiff = (currentYear - paidYear) * 12 + (currentMonth - paidMonth);
        shouldReset = monthsDiff >= 12;
      }

      if (shouldReset) {
        updateBill.mutate({
          billId: bill.id,
          data: {
            isPaid: false,
            ...(bill.isEMI && bill.emiCompletedMonths != null
              ? { emiCompletedMonths: (bill.emiCompletedMonths || 0) + 1 }
              : {}),
          },
        });
      }
    });
    // Only run when bills data first loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bills.length]);

  const grouped = useMemo(() => {
    const overdue = bills.filter((b) => isOverdue(b.dueDate, b.isPaid));
    const dueSoon = bills.filter((b) => !b.isPaid && isDueSoon(b.dueDate, 7) && !isOverdue(b.dueDate, b.isPaid));
    const upcoming = bills.filter(
      (b) => !b.isPaid && !isOverdue(b.dueDate, b.isPaid) && !isDueSoon(b.dueDate, 7)
    );
    const paid = bills.filter((b) => b.isPaid);
    return { overdue, dueSoon, upcoming, paid };
  }, [bills]);

  // Monthly summary
  const totalMonthly = useMemo(() => {
    return bills.reduce((sum, b) => sum + b.amount, 0);
  }, [bills]);

  const unpaidTotal = useMemo(() => {
    return bills.filter((b) => !b.isPaid).reduce((sum, b) => sum + b.amount, 0);
  }, [bills]);

  const handleMarkPaid = async (billId: string) => {
    const bill = bills.find((b) => b.id === billId);
    if (!bill) return;

    try {
      // Create an expense transaction for this bill payment
      await addTransaction.mutateAsync({
        type: "expense",
        amount: bill.amount,
        category: bill.isEMI ? "emi" : "needs",
        description: `${bill.name}${bill.isEMI ? " (EMI)" : " (Bill)"}`,
        date: Timestamp.now(),
      });

      // Mark the bill as paid
      await updateBill.mutateAsync({
        billId,
        data: {
          isPaid: true,
          lastPaidDate: Timestamp.now(),
          ...(bill.isEMI && bill.emiCompletedMonths != null
            ? { emiCompletedMonths: (bill.emiCompletedMonths || 0) + 1 }
            : {}),
        },
      });

      showToast("Bill paid & recorded as expense!", "success");
    } catch {
      showToast("Failed to update bill", "error");
    }
  };

  const handleMarkUnpaid = async (billId: string) => {
    try {
      await updateBill.mutateAsync({
        billId,
        data: { isPaid: false },
      });
      showToast("Bill marked as unpaid", "info");
    } catch {
      showToast("Failed to update bill", "error");
    }
  };

  const handleDelete = async (billId: string, billName: string) => {
    if (!confirm(`Delete "${billName}"?`)) return;
    try {
      await deleteBill.mutateAsync(billId);
      showToast("Bill deleted", "info");
    } catch {
      showToast("Failed to delete bill", "error");
    }
  };

  type BillSection = { label: string; items: typeof bills; color: string; icon: React.ReactNode };
  const sections: BillSection[] = [
    { label: "Overdue", items: grouped.overdue, color: "text-danger", icon: <HiOutlineExclamationTriangle className="w-4 h-4 text-danger" /> },
    { label: "Due Soon", items: grouped.dueSoon, color: "text-warning", icon: <HiOutlineClock className="w-4 h-4 text-warning" /> },
    { label: "Upcoming", items: grouped.upcoming, color: "text-muted", icon: <HiOutlineClock className="w-4 h-4 text-muted" /> },
    { label: "Paid", items: grouped.paid, color: "text-success", icon: <HiOutlineCheckCircle className="w-4 h-4 text-success" /> },
  ];

  if (isLoading) {
    return <div className="py-4 space-y-4">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-20" />)}</div>;
  }

  return (
    <div className="py-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg lg:text-xl font-bold font-[family-name:var(--font-display)]">Bills & EMI</h1>
        <Link
          href={ROUTES.ADD_BILL}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" />
          Add
        </Link>
      </div>

      {/* Monthly summary bar */}
      {bills.length > 0 && (
        <div className="card p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted font-semibold uppercase tracking-widest">Total Monthly</p>
            <p className="text-lg font-bold font-[family-name:var(--font-mono)] text-foreground">{formatCurrency(totalMonthly)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted font-semibold uppercase tracking-widest">Unpaid</p>
            <p className={clsx("text-lg font-bold font-[family-name:var(--font-mono)]", unpaidTotal > 0 ? "text-danger" : "text-success")}>
              {formatCurrency(unpaidTotal)}
            </p>
          </div>
        </div>
      )}

      {bills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-surface-overlay flex items-center justify-center mb-4">
            <HiOutlineClock className="w-8 h-8 text-muted" />
          </div>
          <p className="text-sm text-muted font-medium">No bills tracked</p>
          <Link
            href={ROUTES.ADD_BILL}
            className="mt-4 px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold"
          >
            Add your first bill
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map(
            (section) =>
              section.items.length > 0 && (
                <div key={section.label}>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    {section.icon}
                    <span className={clsx("text-[10px] font-bold uppercase tracking-widest", section.color)}>
                      {section.label} ({section.items.length})
                    </span>
                  </div>
                  <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
                    {section.items.map((bill) => (
                      <div key={bill.id} className="card p-4 flex items-center gap-3">
                        <div
                          className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", {
                            "bg-danger/15": isOverdue(bill.dueDate, bill.isPaid),
                            "bg-warning/15": !bill.isPaid && isDueSoon(bill.dueDate, 7),
                            "bg-success/15": bill.isPaid,
                            "bg-surface-overlay": !bill.isPaid && !isOverdue(bill.dueDate, bill.isPaid) && !isDueSoon(bill.dueDate, 7),
                          })}
                        >
                          <span className="text-lg">{bill.isEMI ? "🏦" : "📄"}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{bill.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted">Due: {bill.dueDate}th</span>
                            {bill.isEMI && bill.emiTotalMonths && (
                              <span className="text-[10px] text-emi font-semibold">
                                EMI {bill.emiCompletedMonths || 0}/{bill.emiTotalMonths}
                              </span>
                            )}
                            {!bill.isPaid && !isOverdue(bill.dueDate, bill.isPaid) && (
                              <span className="text-[10px] text-muted">
                                {getDaysUntilDue(bill.dueDate)}d left
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-bold font-[family-name:var(--font-mono)] text-foreground">
                          {formatCurrency(bill.amount)}
                        </p>
                        <div className="flex items-center gap-1.5 ml-1">
                          <button
                            onClick={() => bill.isPaid ? handleMarkUnpaid(bill.id) : handleMarkPaid(bill.id)}
                            className={clsx(
                              "px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5",
                              bill.isPaid
                                ? "bg-success/15 text-success hover:bg-success/20"
                                : "bg-surface-overlay border border-border-subtle text-muted hover:border-success/40 hover:text-success"
                            )}
                          >
                            <HiOutlineCheckCircle className={clsx("w-3.5 h-3.5", bill.isPaid ? "text-success" : "text-muted")} />
                            {bill.isPaid ? "Paid" : "Mark Paid"}
                          </button>
                          <button
                            onClick={() => handleDelete(bill.id, bill.name)}
                            className="p-1.5 rounded-lg hover:bg-danger/10 transition-all text-danger/50 hover:text-danger/80"
                          >
                            <HiOutlineTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
