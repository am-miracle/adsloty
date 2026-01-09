"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  X,
  Mail,
  ExternalLink,
  TrendingUp,
  Clock,
  CheckCircle2,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export interface BookingDetails {
  id: string;
  date: Date;
  company: string;
  contactEmail: string;
  amount: number;
  fee: number;
  status: "booked" | "pending";
  fitScore?: number;
  adCopy: string;
  imageUrl: string;
  clickUrl: string;
  altText: string;
  bookedOn: string;
}

interface BookingPreviewPanelProps {
  booking: BookingDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onViewFull: (id: string) => void;
}

export function BookingPreviewPanel({
  booking,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onViewFull,
}: BookingPreviewPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current) return;

    if (isOpen && booking) {
      gsap.fromTo(
        panelRef.current,
        { x: 400, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
      );
    }
  }, [isOpen, booking]);

  const handleClose = () => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        x: 400,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  if (!isOpen || !booking) return null;

  const getFitScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        onClick={handleClose}
      />

      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-screen w-full lg:w-120 bg-surface-dark border-l border-border z-50 overflow-y-auto"
      >
        <div className="sticky top-0 bg-surface-dark/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-lg font-bold">Booking Details</h3>
            <p className="text-xs text-text-secondary">
              {booking.date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-surface-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div
            className={`glass rounded-xl p-4 border ${
              booking.status === "pending"
                ? "border-yellow-500/30 bg-yellow-500/5"
                : "border-primary/30 bg-primary/5"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {booking.status === "pending" ? (
                  <Clock className="w-5 h-5 text-yellow-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                )}
                <span
                  className={`font-semibold ${
                    booking.status === "pending"
                      ? "text-yellow-400"
                      : "text-primary"
                  }`}
                >
                  {booking.status === "pending"
                    ? "Pending Approval"
                    : "Confirmed Booking"}
                </span>
              </div>
              {booking.fitScore && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span
                    className={`font-bold text-sm ${getFitScoreColor(
                      booking.fitScore,
                    )}`}
                  >
                    {booking.fitScore}% Fit
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Booked on</span>
                <span className="font-medium">{booking.bookedOn}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Amount</span>
                <span className="font-bold text-lg text-green-400">
                  ${booking.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Platform Fee</span>
                <span className="font-medium text-red-400">
                  -${booking.fee.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
                <span className="text-text-secondary font-semibold">
                  You Receive
                </span>
                <span className="font-bold text-xl text-primary">
                  ${(booking.amount - booking.fee).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Sponsor Information
            </h4>
            <div className="glass rounded-xl p-4 border border-border space-y-3">
              <div>
                <label className="text-xs text-text-secondary">Company</label>
                <p className="font-semibold text-lg">{booking.company}</p>
              </div>
              <div>
                <label className="text-xs text-text-secondary flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Contact Email
                </label>
                <a
                  href={`mailto:${booking.contactEmail}`}
                  className="text-primary hover:underline"
                >
                  {booking.contactEmail}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Ad Preview
            </h4>
            <div className="glass rounded-xl p-4 border border-border space-y-4">
              <div>
                <label className="text-xs text-text-secondary mb-2 block">
                  Ad Copy
                </label>
                <p className="text-sm leading-relaxed bg-surface-dark p-3 rounded-lg border border-border">
                  {booking.adCopy}
                </p>
              </div>

              <div>
                <label className="text-xs text-text-secondary mb-2 block">
                  Banner Image
                </label>
                <div className="relative aspect-4/1 rounded-lg overflow-hidden bg-surface-dark border border-border">
                  <Image
                    src={booking.imageUrl}
                    alt={booking.altText}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 flex items-center gap-2"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = booking.imageUrl;
                      link.download = `${booking.company}-ad.png`;
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 flex items-center gap-2"
                    onClick={() => window.open(booking.imageUrl, "_blank")}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs text-text-secondary mb-2 block">
                  Click URL
                </label>
                <a
                  href={booking.clickUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-2 bg-surface-dark p-3 rounded-lg border border-border group"
                >
                  <span className="flex-1 truncate">{booking.clickUrl}</span>
                  <ExternalLink className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div>
                <label className="text-xs text-text-secondary mb-2 block">
                  Alt Text
                </label>
                <p className="text-sm bg-surface-dark p-3 rounded-lg border border-border">
                  {booking.altText}
                </p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-surface-dark pt-4 border-t border-border space-y-3">
            {booking.status === "pending" && onApprove && onReject && (
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => {
                    onApprove(booking.id);
                    handleClose();
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve Booking
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    onReject(booking.id);
                    handleClose();
                  }}
                >
                  Reject
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => onViewFull(booking.id)}
            >
              View Full Details
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
