"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaymentMethod {
  id: string;
  type: "bank" | "paypal" | "wise";
  displayName: string;
  lastFour?: string;
  email?: string;
}

interface PayoutRequestModalProps {
  isOpen: boolean;
  amount: number;
  fee: number;
  paymentMethods: PaymentMethod[];
  onClose: () => void;
  onConfirm: (methodId: string, amount: number) => void;
}

export function PayoutRequestModal({
  isOpen,
  amount,
  fee,
  paymentMethods,
  onClose,
  onConfirm,
}: PayoutRequestModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [customAmount, setCustomAmount] = useState(amount.toString());
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
          setSelectedMethod("");
          setCustomAmount(amount.toString());
          onClose();
        },
      });
    }
  };

  const handleConfirm = () => {
    if (selectedMethod) {
      const requestAmount = parseFloat(customAmount);
      onConfirm(selectedMethod, requestAmount);
      handleClose();
    }
  };

  const getMethodLabel = (type: string) => {
    switch (type) {
      case "bank":
        return "Bank";
      case "paypal":
        return "PayPal";
      case "wise":
        return "Wise";
      default:
        return type;
    }
  };

  const requestAmount = parseFloat(customAmount) || 0;
  const totalFee = (requestAmount * fee) / 100;
  const youReceive = requestAmount - totalFee;

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
        className="relative glass-strong rounded-2xl border border-border p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Request Payout</h3>
          <button
            onClick={handleClose}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Payout Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                $
              </span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                max={amount}
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 bg-surface-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg font-semibold"
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Maximum available: ${amount.toFixed(2)}
            </p>
          </div>

          <div className="glass rounded-xl p-4 border border-border space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Request Amount</span>
              <span className="font-semibold">${requestAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                Processing Fee ({fee}%)
              </span>
              <span className="font-semibold text-red-400">
                -${totalFee.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-border pt-2 flex items-center justify-between">
              <span className="font-semibold">You Receive</span>
              <span className="text-2xl font-bold text-green-400">
                ${youReceive.toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              Select Payment Method
            </label>

            {paymentMethods.length === 0 ? (
              <div className="glass rounded-lg p-6 border border-yellow-500/30 bg-yellow-500/5 text-center">
                <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-yellow-400 mb-3">
                  No payment methods configured
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleClose();
                    // Navigate to settings
                  }}
                >
                  Add Payment Method
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full glass rounded-lg p-4 border transition-all text-left ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{method.displayName}</p>
                        <p className="text-xs text-text-secondary">
                          {method.lastFour
                            ? `•••• ${method.lastFour}`
                            : method.email}
                        </p>
                      </div>
                      {selectedMethod === method.id && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="glass rounded-lg p-4 border border-blue-500/30 bg-blue-500/5">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-text-secondary">
                <p className="font-medium text-blue-400 mb-1">
                  Processing Time
                </p>
                <p>
                  Payouts typically arrive within 3-5 business days. You&apos;ll
                  receive an email confirmation once processed.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={
                !selectedMethod || requestAmount <= 0 || requestAmount > amount
              }
            >
              Confirm Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
