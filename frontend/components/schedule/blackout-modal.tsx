"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlackoutModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  onClose: () => void;
  onConfirm: (date: Date, reason: string) => void;
}

export function BlackoutModal({
  isOpen,
  selectedDate,
  onClose,
  onConfirm,
}: BlackoutModalProps) {
  const [reason, setReason] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current && overlayRef.current) {
      document.body.style.overflow = "hidden";

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      );

      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, y: 20, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
          delay: 0.1,
        },
      );
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    if (modalRef.current && overlayRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.9,
        y: 20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setReason("");
          onClose();
        },
      });
    }
  };

  const handleConfirm = () => {
    if (selectedDate && reason.trim()) {
      onConfirm(selectedDate, reason);
      handleClose();
    }
  };

  if (!isOpen || !selectedDate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className="relative glass-strong rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Add Blackout Date</h3>
          <button
            onClick={handleClose}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-lg p-4 border border-yellow-500/30 bg-yellow-500/5">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-400 mb-1">
                  Date will be unavailable for bookings
                </p>
                <p className="text-xs text-text-secondary">
                  You&apos;re marking{" "}
                  <span className="font-semibold text-white">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>{" "}
                  as unavailable. Sponsors won&apos;t be able to book ads for
                  this date.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Holiday break, newsletter not publishing this week, etc."
              className="w-full h-24 px-4 py-3 bg-surface-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
            />
            <p className="text-xs text-text-secondary mt-1">
              This helps you remember why this date was blocked
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600"
              onClick={handleConfirm}
              disabled={!reason.trim()}
            >
              Confirm Blackout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
