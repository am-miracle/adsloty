"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WidgetPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsletterName: string;
  pricePerSlot: string;
}

export function WidgetPreviewModal({
  isOpen,
  onClose,
  newsletterName,
  pricePerSlot,
}: WidgetPreviewModalProps) {
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
        onComplete: onClose,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className="relative glass-strong rounded-2xl border border-border p-8 w-full max-w-3xl shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Widget Preview</h3>
          <button
            onClick={handleClose}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-lg p-4 border border-blue-500/30 bg-blue-500/5">
            <p className="text-sm text-text-secondary">
              This is how the widget will appear on your newsletter page
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Latest Newsletter
                </h2>
                <p className="text-gray-600">
                  Welcome to this week&apos;s edition. Here&apos;s what
                  we&apos;re covering today...
                </p>
              </div>

              <div className="border-2 border-primary rounded-xl p-6 bg-linear-to-br from-primary/5 to-transparent">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Advertise in {newsletterName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Reach our engaged audience of tech enthusiasts
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ${pricePerSlot}
                    </div>
                    <div className="text-xs text-gray-500">per slot</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="glass rounded-lg px-3 py-1.5 text-sm bg-white border border-gray-200">
                    <span className="text-gray-600">Subscribers:</span>{" "}
                    <span className="font-semibold text-gray-900">10,000+</span>
                  </div>
                  <div className="glass rounded-lg px-3 py-1.5 text-sm bg-white border border-gray-200">
                    <span className="text-gray-600">Open Rate:</span>{" "}
                    <span className="font-semibold text-gray-900">42%</span>
                  </div>
                  <div className="glass rounded-lg px-3 py-1.5 text-sm bg-white border border-gray-200">
                    <span className="text-gray-600">Click Rate:</span>{" "}
                    <span className="font-semibold text-gray-900">3.8%</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  size="lg"
                >
                  Book Ad Slot
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Continue reading the newsletter below...
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={handleClose}>
              Close Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
