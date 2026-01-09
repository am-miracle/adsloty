"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";

export interface AdRequestData {
  id: string;
  companyName: string;
  requestedDate: string;
  adCopy: string;
  fitScore: number;
  tone: string;
  clarity: string;
  estimatedClicks: string;
  companyInitial?: string;
  bgColor?: string;
}

interface AdRequestCardProps {
  request: AdRequestData;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onMessage?: (id: string) => void;
}

export function AdRequestCard({
  request,
  onApprove,
  onReject,
  onMessage,
}: AdRequestCardProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showRejectModal && modalRef.current && overlayRef.current) {
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
  }, [showRejectModal]);

  const handleCloseModal = () => {
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
          setShowRejectModal(false);
          setRejectReason("");
        },
      });
    }
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(request.id, rejectReason);
      handleCloseModal();
    }
  };

  const getFitScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="glass-strong rounded-2xl p-5 border border-border flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`size-10 rounded-full ${
              request.bgColor || "bg-surface-dark"
            } border border-border flex items-center justify-center`}
          >
            <span className="text-text-secondary">
              {request.companyInitial || request.companyName.charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="font-bold">{request.companyName}</h4>
            <p className="text-xs text-text-secondary">
              Requested for{" "}
              <span className="text-white font-semibold">
                {request.requestedDate}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-surface-dark px-3 py-1 rounded-full border border-border">
          <span className="text-xs font-bold text-text-secondary">
            Smart Critique:
          </span>
          <span
            className={`text-xs font-bold ml-1 ${getFitScoreColor(
              request.fitScore,
            )}`}
          >
            {request.fitScore}% Fit
          </span>
        </div>
      </div>

      <div className="bg-surface-dark p-4 rounded-lg border border-border">
        <p className="text-text-secondary text-xs font-bold uppercase mb-2 tracking-wider">
          Ad Copy Preview
        </p>
        <p className="text-sm leading-relaxed">{request.adCopy}</p>
      </div>

      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-text-secondary">
            Tone:{" "}
            <span className="font-semibold text-white">{request.tone}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          <span className="text-text-secondary">
            Clarity:{" "}
            <span className="font-semibold text-white">{request.clarity}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-400"></div>
          <span className="text-text-secondary">
            Est. Clicks:{" "}
            <span className="font-semibold text-white">
              {request.estimatedClicks}
            </span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Button className="flex-1" onClick={() => onApprove(request.id)}>
          Approve Request
        </Button>
        <Button variant="outline" onClick={() => setShowRejectModal(true)}>
          Reject
        </Button>
        {onMessage && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMessage(request.id)}
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        )}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div
            ref={modalRef}
            className="relative glass-strong rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Reject Ad Request</h3>
              <button
                onClick={handleCloseModal}
                className="text-text-secondary hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-text-secondary mb-2">
                  Please explain why you&apos;re rejecting this ad from{" "}
                  <span className="font-semibold text-white">
                    {request.companyName}
                  </span>
                  . This feedback will help sponsors improve their ads.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g., The ad doesn't align with our audience, the copy is too promotional, etc."
                  className="w-full h-32 px-4 py-3 bg-surface-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Minimum 10 characters required
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  onClick={handleReject}
                  disabled={rejectReason.trim().length < 10}
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
