"use client";

import Link from "next/link";

export interface AvailabilitySlot {
  date: string;
  label: string;
  status: "booked" | "open" | "pending" | "empty";
  requestCount?: number;
}

interface AvailabilityCardProps {
  slots: AvailabilitySlot[];
  manageLink?: string;
}

export function AvailabilityCard({
  slots,
  manageLink = "/dashboard/schedule",
}: AvailabilityCardProps) {
  const getSlotStyles = (status: string) => {
    switch (status) {
      case "booked":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          labelColor: "text-red-400",
        };
      case "open":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          labelColor: "text-green-400",
        };
      case "pending":
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          labelColor: "text-yellow-400",
        };
      default:
        return {
          bg: "bg-surface-dark",
          border: "border-border",
          labelColor: "text-text-secondary",
        };
    }
  };

  const getStatusBadge = (slot: AvailabilitySlot) => {
    switch (slot.status) {
      case "booked":
        return (
          <span className="text-xs font-bold bg-surface-dark px-2 py-1 rounded border border-border">
            Booked
          </span>
        );
      case "open":
        return (
          <span className="text-xs font-bold bg-green-500 text-white px-2 py-1 rounded shadow-sm">
            Open
          </span>
        );
      case "pending":
        return (
          <span className="text-xs font-bold text-yellow-400">
            {slot.requestCount} Request{slot.requestCount !== 1 ? "s" : ""}
          </span>
        );
      default:
        return (
          <span className="text-xs font-bold text-text-secondary">Empty</span>
        );
    }
  };

  return (
    <div className="glass-strong rounded-2xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-bold">Upcoming Availability</h3>
        <Link
          href={manageLink}
          className="text-primary text-xs font-bold hover:underline"
        >
          Manage
        </Link>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {slots.map((slot, index) => {
          const styles = getSlotStyles(slot.status);
          return (
            <div
              key={index}
              data-slot
              className={`flex items-center justify-between p-3 rounded-lg ${styles.bg} border ${styles.border}`}
            >
              <div className="flex flex-col">
                <span
                  className={`text-xs font-semibold ${styles.labelColor} uppercase tracking-wider`}
                >
                  {slot.label}
                </span>
                <span className="font-bold">{slot.date}</span>
              </div>
              {getStatusBadge(slot)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
