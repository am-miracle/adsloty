"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  X,
  Download,
  Copy,
  CheckCircle,
  Calendar,
  DollarSign,
  Mail,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import gsap from "gsap";
import Image from "next/image";

export interface BookingData {
  id: string;
  company: string;
  contactEmail: string;
  weekStarting: string;
  amount: number;
  fee: number;
  imageUrl: string;
  clickUrl: string;
  altText: string;
  bookedOn: string;
}

interface ReviewBookingModalProps {
  booking: BookingData;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export function ReviewBookingModal({
  booking,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: ReviewBookingModalProps) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current && overlayRef.current) {
      // Animate overlay
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );

      // Animate modal
      gsap.fromTo(
        modalRef.current,
        {
          opacity: 0,
          scale: 0.9,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
        },
      );

      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    if (modalRef.current && overlayRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 50,
        duration: 0.3,
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: onClose,
      });
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(booking.clickUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadImage = () => {
    // Simulate download
    const link = document.createElement("a");
    link.href = booking.imageUrl;
    link.download = `ad-${booking.company.replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApprove = () => {
    gsap.to(modalRef.current, {
      scale: 1.05,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        onApprove(booking.id);
        handleClose();
      },
    });
  };

  const handleRejectClick = () => {
    setShowRejectForm(true);
    // Animate reject form
    setTimeout(() => {
      const rejectForm = document.querySelector(".reject-form");
      if (rejectForm) {
        gsap.fromTo(
          rejectForm,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        );
      }
    }, 50);
  };

  const handleConfirmReject = () => {
    if (rejectReason.trim()) {
      onReject(booking.id, rejectReason);
      handleClose();
    }
  };

  if (!isOpen) return null;

  const youReceive = booking.amount - booking.fee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-strong rounded-2xl border-2 border-primary/30 shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-surface-dark/95 backdrop-blur-lg">
          <h2 className="text-2xl font-bold">Review Ad Booking</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-surface-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Booking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-surface-dark border border-border">
                <p className="text-xs text-text-secondary mb-1">Company</p>
                <p className="font-semibold">{booking.company}</p>
              </div>
              <div className="p-4 rounded-lg bg-surface-dark border border-border">
                <p className="text-xs text-text-secondary mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Contact
                </p>
                <p className="font-semibold text-sm">{booking.contactEmail}</p>
              </div>
              <div className="p-4 rounded-lg bg-surface-dark border border-border">
                <p className="text-xs text-text-secondary mb-1">
                  Week Starting
                </p>
                <p className="font-semibold">{booking.weekStarting}</p>
              </div>
              <div className="p-4 rounded-lg bg-surface-dark border border-border">
                <p className="text-xs text-text-secondary mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Amount
                </p>
                <p className="font-semibold">${booking.amount.toFixed(2)}</p>
                <p className="text-xs text-green-400">
                  You receive ${youReceive.toFixed(2)} after fees
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Ad Preview
            </h3>
            <div className="p-4 rounded-lg bg-surface-dark border border-border space-y-4">
              <div className="aspect-4/1 bg-linear-to-r from-purple-500/20 to-primary/20 rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src={booking.imageUrl}
                  alt={booking.altText}
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.innerHTML = `
                      <div class="text-center">
                        <p class="text-text-secondary text-sm">Ad Banner (800x200px)</p>
                        <p class="text-xs text-text-secondary mt-2">${booking.company}</p>
                      </div>
                    `;
                  }}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background-dark border border-border">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <LinkIcon className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm truncate">{booking.clickUrl}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyUrl}
                    className="ml-2"
                  >
                    {copiedUrl ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copiedUrl ? "Copied!" : "Copy"}
                  </Button>
                </div>

                <div className="p-3 rounded-lg bg-background-dark border border-border">
                  <p className="text-xs text-text-secondary mb-1">Alt Text</p>
                  <p className="text-sm">{booking.altText}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-text-secondary">Booked on</p>
            <p className="text-sm font-medium">{booking.bookedOn}</p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDownloadImage}
            >
              <Download className="w-4 h-4" />
              Download Image
            </Button>
          </div>

          {showRejectForm ? (
            <div className="reject-form space-y-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <Label>
                Reason for rejection{" "}
                <span className="text-red-400">(will be sent to sponsor)</span>
              </Label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please explain why you're rejecting this ad..."
                className="w-full min-h-25 p-3 rounded-lg bg-surface-dark border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmReject}
                  disabled={!rejectReason.trim()}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRejectClick}
                className="flex-1 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10"
              >
                Reject Ad
              </Button>
              <Button onClick={handleApprove} className="flex-1">
                <CheckCircle className="w-4 h-4" />
                Approve Ad
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
