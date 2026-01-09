"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BalanceData {
  available: number;
  pending: number;
  totalEarned: number;
  nextPayoutDate: string;
}

interface BalanceCardProps {
  balance: BalanceData;
  onRequestPayout: () => void;
  minPayout: number;
}

export function BalanceCard({
  balance,
  onRequestPayout,
  minPayout,
}: BalanceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const availableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
      );
    }

    if (availableRef.current) {
      gsap.fromTo(
        availableRef.current,
        { textContent: 0 },
        {
          textContent: balance.available,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 0.01 },
          onUpdate: function () {
            if (availableRef.current) {
              const value = parseFloat(
                gsap.getProperty(availableRef.current, "textContent") as string,
              );
              availableRef.current.textContent = `$${value.toFixed(2)}`;
            }
          },
        },
      );
    }
  }, [balance.available]);

  const canRequestPayout = balance.available >= minPayout;

  return (
    <div
      ref={cardRef}
      className="glass-strong rounded-2xl border border-border p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-green-500/10 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-text-secondary mb-1">
              Available Balance
            </p>
            <div
              ref={availableRef}
              className="text-5xl font-bold gradient-text"
            >
              ${balance.available.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass rounded-lg p-3 border border-border">
            <span className="text-xs text-text-secondary block mb-1">
              Pending
            </span>
            <p className="text-xl font-bold">${balance.pending.toFixed(2)}</p>
          </div>

          <div className="glass rounded-lg p-3 border border-border">
            <span className="text-xs text-text-secondary block mb-1">
              Total Earned
            </span>
            <p className="text-xl font-bold">
              ${balance.totalEarned.toFixed(2)}
            </p>
          </div>
        </div>

        {!canRequestPayout && (
          <div className="mb-4 glass rounded-lg p-3 border border-yellow-500/30 bg-yellow-500/5">
            <p className="text-xs text-yellow-400">
              Minimum payout amount is ${minPayout.toFixed(2)}. Current balance:
              ${balance.available.toFixed(2)}
            </p>
          </div>
        )}

        <Button
          onClick={onRequestPayout}
          disabled={!canRequestPayout}
          className="w-full group"
        >
          Request Payout
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <div className="mt-4 text-center">
          <p className="text-xs text-text-secondary">
            Next auto-payout on{" "}
            <span className="font-semibold text-white">
              {balance.nextPayoutDate}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
