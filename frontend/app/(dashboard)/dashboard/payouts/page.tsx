"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { BalanceCard, BalanceData } from "@/components/payouts/balance-card";
import {
  PayoutRequestModal,
  PaymentMethod,
} from "@/components/payouts/payout-request-modal";
import {
  TransactionHistory,
  Transaction,
} from "@/components/payouts/transaction-history";
import { Notification, NotificationType } from "@/components/ui/notification";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PayoutsContent() {
  const searchParams = useSearchParams();
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "success" as NotificationType,
    message: "",
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [balance] = useState<BalanceData>({
    available: 1237.5,
    pending: 562.0,
    totalEarned: 4825.0,
    nextPayoutDate: "February 15, 2025",
  });

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "method-1",
      type: "bank",
      displayName: "Chase Bank Account",
      lastFour: "4567",
    },
    {
      id: "method-2",
      type: "paypal",
      displayName: "PayPal",
      email: "john@example.com",
    },
    {
      id: "method-3",
      type: "wise",
      displayName: "Wise Account",
      email: "john@wise.com",
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "txn-1",
      type: "earning",
      amount: 237.5,
      status: "completed",
      date: "January 13, 2025",
      description: "Ad revenue from TechFlow Analytics",
      reference: "TFA-2025-001",
    },
    {
      id: "txn-2",
      type: "payout",
      amount: 500.0,
      status: "completed",
      date: "January 10, 2025",
      description: "Payout to Chase Bank",
      method: "Bank Transfer",
      reference: "PAY-2025-001",
    },
    {
      id: "txn-3",
      type: "earning",
      amount: 237.5,
      status: "completed",
      date: "January 6, 2025",
      description: "Ad revenue from CloudHost Pro",
      reference: "CHP-2025-001",
    },
    {
      id: "txn-4",
      type: "earning",
      amount: 237.5,
      status: "pending",
      date: "January 20, 2025",
      description: "Ad revenue from DesignKit Studio (Pending approval)",
      reference: "DKS-2025-001",
    },
    {
      id: "txn-5",
      type: "payout",
      amount: 750.0,
      status: "completed",
      date: "December 28, 2024",
      description: "Payout to PayPal",
      method: "PayPal",
      reference: "PAY-2024-012",
    },
    {
      id: "txn-6",
      type: "earning",
      amount: 237.5,
      status: "completed",
      date: "December 25, 2024",
      description: "Ad revenue from SecureVault",
      reference: "SV-2024-012",
    },
    {
      id: "txn-7",
      type: "earning",
      amount: 237.5,
      status: "completed",
      date: "December 18, 2024",
      description: "Ad revenue from MarketGrowth AI",
      reference: "MGA-2024-011",
    },
    {
      id: "txn-8",
      type: "payout",
      amount: 600.0,
      status: "failed",
      date: "December 15, 2024",
      description: "Failed payout to Wise (Insufficient funds)",
      method: "Wise",
      reference: "PAY-2024-011",
    },
  ]);

  const stats = {
    averageEarning: 237.5,
    successRate: 95,
    nextPayout: "Feb 15",
    totalPayouts: 3,
  };

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
    }

    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.2,
        },
      );
    }

    const action = searchParams.get("action");
    if (action === "request") {
      const timer = setTimeout(() => {
        setIsPayoutModalOpen(true);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message });
  };

  const handleRequestPayout = () => {
    setIsPayoutModalOpen(true);
  };

  const handleConfirmPayout = (methodId: string, amount: number) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    if (method) {
      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        type: "payout",
        amount,
        status: "pending",
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        description: `Payout to ${method.displayName}`,
        method: method.type.charAt(0).toUpperCase() + method.type.slice(1),
        reference: `PAY-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      };

      setTransactions((prev) => [newTransaction, ...prev]);
      showNotification(
        "success",
        `Payout request of $${amount.toFixed(2)} submitted successfully!`,
      );
    }
  };

  const handleDownloadInvoice = (id: string) => {
    showNotification("info", "Downloading invoice...");
  };

  return (
    <>
      <div className="space-y-6">
        <div ref={headerRef}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Payouts & <span className="gradient-text">Earnings</span>
              </h1>
              <p className="text-text-secondary">
                Manage your earnings and withdraw funds
              </p>
            </div>
            <Button variant="outline">
              <Link
                href={"/dashboard/settings"}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Payment Methods
              </Link>
            </Button>
          </div>

          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            <div className="glass-strong rounded-xl p-4 border border-border">
              <span className="text-text-secondary text-sm block mb-2">
                Avg Earning
              </span>
              <div className="text-2xl font-bold">${stats.averageEarning}</div>
            </div>

            <div className="glass-strong rounded-xl p-4 border border-border">
              <span className="text-text-secondary text-sm block mb-2">
                Success Rate
              </span>
              <div className="text-2xl font-bold text-green-400">
                {stats.successRate}%
              </div>
            </div>

            <div className="glass-strong rounded-xl p-4 border border-border">
              <span className="text-text-secondary text-sm block mb-2">
                Next Payout
              </span>
              <div className="text-2xl font-bold text-blue-400">
                {stats.nextPayout}
              </div>
            </div>

            <div className="glass-strong rounded-xl p-4 border border-border">
              <span className="text-text-secondary text-sm block mb-2">
                Total Payouts
              </span>
              <div className="text-2xl font-bold">{stats.totalPayouts}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <BalanceCard
              balance={balance}
              onRequestPayout={handleRequestPayout}
              minPayout={100}
            />

            <div className="glass-strong rounded-2xl border border-border p-6 mt-6">
              <h3 className="text-lg font-bold mb-4">Payment Methods</h3>
              <div className="space-y-2 mb-4">
                {paymentMethods.slice(0, 2).map((method) => (
                  <div
                    key={method.id}
                    className="glass rounded-lg p-3 border border-border"
                  >
                    <p className="text-sm font-medium truncate">
                      {method.displayName}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {method.lastFour
                        ? `•••• ${method.lastFour}`
                        : method.email}
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/settings">Add Payment Method</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <TransactionHistory
              transactions={transactions}
              onDownloadInvoice={handleDownloadInvoice}
            />
          </div>
        </div>
      </div>

      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      <PayoutRequestModal
        isOpen={isPayoutModalOpen}
        amount={balance.available}
        fee={2.5}
        paymentMethods={paymentMethods}
        onClose={() => setIsPayoutModalOpen(false)}
        onConfirm={handleConfirmPayout}
      />
    </>
  );
}

export default function PayoutsPage() {
  return (
    <Suspense
      fallback={
        <>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-secondary">Loading payouts...</p>
            </div>
          </div>
        </>
      }
    >
      <PayoutsContent />
    </Suspense>
  );
}
