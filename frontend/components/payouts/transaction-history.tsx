"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDownCircle, ArrowUpCircle, Download } from "lucide-react";

export interface Transaction {
  id: string;
  type: "payout" | "earning";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
  method?: string;
  reference?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  onDownloadInvoice?: (id: string) => void;
}

export function TransactionHistory({
  transactions,
  onDownloadInvoice,
}: TransactionHistoryProps) {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    itemsRef.current.forEach((item, index) => {
      if (item) {
        gsap.fromTo(
          item,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            delay: index * 0.05,
            ease: "power3.out",
          },
        );
      }
    });
  }, [transactions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-text-secondary";
    }
  };

  const groupedTransactions = transactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(transaction);
      return acc;
    },
    {} as Record<string, Transaction[]>,
  );

  return (
    <div className="glass-strong rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        {onDownloadInvoice && (
          <button className="text-sm text-primary hover:underline flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowDownCircle className="w-8 h-8 text-text-secondary" />
          </div>
          <p className="text-text-secondary">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(
            ([monthYear, monthTransactions]) => (
              <div key={monthYear}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    {monthYear}
                  </h3>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="space-y-2">
                  {monthTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      ref={(el) => {
                        itemsRef.current.push(el);
                      }}
                      className="glass rounded-xl p-4 border border-border hover:border-primary/50 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            transaction.type === "earning"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {transaction.type === "earning" ? (
                            <ArrowDownCircle className="w-5 h-5" />
                          ) : (
                            <ArrowUpCircle className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <div>
                              <p className="font-semibold group-hover:text-primary transition-colors">
                                {transaction.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                                <span>{transaction.date}</span>
                                {transaction.method && (
                                  <>
                                    <span>•</span>
                                    <span>{transaction.method}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <p
                                className={`text-lg font-bold ${
                                  transaction.type === "earning"
                                    ? "text-green-400"
                                    : "text-white"
                                }`}
                              >
                                {transaction.type === "earning" ? "+" : "-"}$
                                {transaction.amount.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div
                              className={`text-xs font-medium ${getStatusColor(
                                transaction.status,
                              )}`}
                            >
                              <span className="capitalize">
                                {transaction.status}
                              </span>
                            </div>

                            {transaction.reference && (
                              <p className="text-xs text-text-secondary">
                                Ref: {transaction.reference}
                              </p>
                            )}

                            {onDownloadInvoice &&
                              transaction.type === "earning" &&
                              transaction.status === "completed" && (
                                <button
                                  onClick={() =>
                                    onDownloadInvoice(transaction.id)
                                  }
                                  className="text-xs text-primary hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Download className="w-3 h-3" />
                                  Invoice
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
