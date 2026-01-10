"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { StatCard } from "@/components/sponsor-dashboard/stat-card";
import {
  PaymentMethodCard,
  PaymentMethod,
} from "@/components/sponsor-dashboard/payment-method-card";
import { Notification, NotificationType } from "@/components/ui/notification";
import { DataTable, Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

interface InvoiceRow {
  id: string;
  newsletter: string;
  date: string;
  amount: string;
  status: string;
}

interface NotificationState {
  show: boolean;
  type: NotificationType;
  message: string;
}

export default function BillingPage() {
  const statsCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const paymentMethodsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: "success",
    message: "",
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryDate: "12/2026",
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      last4: "5555",
      brand: "Mastercard",
      expiryDate: "09/2025",
      isDefault: false,
    },
  ]);

  const [invoiceData] = useState<InvoiceRow[]>([
    {
      id: "INV-001",
      newsletter: "Tech Crunch Weekly",
      date: "Jan 8, 2025",
      amount: "$350.00",
      status: "paid",
    },
    {
      id: "INV-002",
      newsletter: "Marketing Brew",
      date: "Jan 5, 2025",
      amount: "$280.00",
      status: "paid",
    },
    {
      id: "INV-003",
      newsletter: "Startup Digest",
      date: "Dec 28, 2024",
      amount: "$250.00",
      status: "paid",
    },
    {
      id: "INV-004",
      newsletter: "Product Hunt Daily",
      date: "Dec 20, 2024",
      amount: "$400.00",
      status: "paid",
    },
    {
      id: "INV-005",
      newsletter: "Design Weekly",
      date: "Dec 15, 2024",
      amount: "$290.00",
      status: "paid",
    },
    {
      id: "INV-006",
      newsletter: "Developer Weekly",
      date: "Dec 8, 2024",
      amount: "$380.00",
      status: "paid",
    },
    {
      id: "INV-007",
      newsletter: "SaaS Growth Tips",
      date: "Nov 30, 2024",
      amount: "$320.00",
      status: "paid",
    },
    {
      id: "INV-008",
      newsletter: "Indie Hackers Digest",
      date: "Nov 22, 2024",
      amount: "$250.00",
      status: "paid",
    },
  ]);

  const totalSpent = invoiceData.reduce((sum, inv) => {
    const amount = parseFloat(inv.amount.replace("$", "").replace(",", ""));
    return sum + amount;
  }, 0);

  const thisMonthSpent = invoiceData
    .filter((inv) => inv.date.includes("Jan"))
    .reduce((sum, inv) => {
      const amount = parseFloat(inv.amount.replace("$", "").replace(",", ""));
      return sum + amount;
    }, 0);

  useEffect(() => {
    // Animate stats cards
    const cards = statsCardsRef.current.filter((card) => card !== null);
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
      );
    }

    // Animate payment methods
    if (paymentMethodsRef.current) {
      gsap.fromTo(
        paymentMethodsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power3.out" },
      );
    }

    // Animate table
    if (tableRef.current) {
      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power3.out" },
      );
    }
  }, []);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message });
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );
    showNotification("success", "Default payment method updated");
  };

  const handleRemovePaymentMethod = (id: string) => {
    const method = paymentMethods.find((m) => m.id === id);
    if (method?.isDefault && paymentMethods.length > 1) {
      showNotification(
        "error",
        "Cannot remove default payment method. Set another as default first.",
      );
      return;
    }

    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
    showNotification("success", "Payment method removed");
  };

  const handleAddPaymentMethod = () => {
    showNotification("info", "Opening payment method form...");
    // In a real app, this would open a modal or navigate to a form
  };

  const handleDownloadInvoice = (id: string) => {
    showNotification("success", `Downloading invoice ${id}...`);
    // In a real app, this would trigger a download
  };

  const invoiceColumns: Column<InvoiceRow>[] = [
    {
      key: "id",
      header: "Invoice ID",
      render: (value) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      key: "newsletter",
      header: "Newsletter",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "date",
      header: "Date",
      render: (value) => <span className="text-text-secondary">{value}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => {
        const statusConfig: Record<string, { label: string; color: string }> = {
          paid: { label: "Paid", color: "bg-green-500/10 text-green-400" },
          pending: {
            label: "Pending",
            color: "bg-yellow-500/10 text-yellow-400",
          },
          failed: { label: "Failed", color: "bg-red-500/10 text-red-400" },
        };

        const config = statusConfig[value] || statusConfig.pending;

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${config.color}`}
          >
            <span className="size-1.5 rounded-full bg-current"></span>
            {config.label}
          </span>
        );
      },
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "id",
      header: "",
      align: "right",
      render: (value) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDownloadInvoice(value as string)}
        >
          <Download className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing & Invoices</h1>
          <p className="text-text-secondary">
            Manage your payment methods and view billing history
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            ref={(el) => {
              statsCardsRef.current[0] = el;
            }}
          >
            <StatCard
              title="Total Spent"
              value={`$${totalSpent.toLocaleString()}`}
              subtitle="All time"
            />
          </div>

          <div
            ref={(el) => {
              statsCardsRef.current[1] = el;
            }}
          >
            <StatCard
              title="This Month"
              value={`$${thisMonthSpent.toLocaleString()}`}
              trend={{ value: "+18% vs last month", isPositive: true }}
            />
          </div>

          <div
            ref={(el) => {
              statsCardsRef.current[2] = el;
            }}
          >
            <StatCard
              title="Total Invoices"
              value={invoiceData.length}
              subtitle={`${invoiceData.filter((i) => i.status === "paid").length} paid`}
            />
          </div>
        </div>

        <div ref={paymentMethodsRef}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Payment Methods</h3>
            <Button
              onClick={handleAddPaymentMethod}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Payment Method
            </Button>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onSetDefault={handleSetDefaultPaymentMethod}
                onRemove={handleRemovePaymentMethod}
              />
            ))}
          </div>

          {paymentMethods.length === 0 && (
            <div className="glass-strong rounded-2xl p-12 border border-border text-center">
              <p className="text-text-secondary text-lg mb-2">
                No payment methods added
              </p>
              <p className="text-text-secondary text-sm mb-4">
                Add a payment method to start booking campaigns
              </p>
              <Button onClick={handleAddPaymentMethod}>
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          )}
        </div>

        <div ref={tableRef}>
          <h3 className="text-xl font-bold mb-4">Invoice History</h3>
          <DataTable
            data={invoiceData}
            columns={invoiceColumns}
            searchable={true}
            searchPlaceholder="Search invoices..."
            filterable={true}
            filterOptions={[
              { label: "Paid", value: "paid" },
              { label: "Pending", value: "pending" },
              { label: "Failed", value: "failed" },
            ]}
            filterLabel="Filter by status"
            itemsPerPage={10}
          />
        </div>
      </div>

      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
    </>
  );
}
