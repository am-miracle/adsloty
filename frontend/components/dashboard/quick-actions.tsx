"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Code, DollarSign, Eye, Ban } from "lucide-react";
import gsap from "gsap";

interface QuickActionsProps {
  pendingBalance: number;
  onViewBookings: () => void;
  onAddBlackoutDate: () => void;
  onGetWidgetCode: () => void;
  onRequestPayout: () => void;
}

export function QuickActions({
  pendingBalance,
  onViewBookings,
  onAddBlackoutDate,
  onGetWidgetCode,
  onRequestPayout,
}: QuickActionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canRequestPayout = pendingBalance >= 100;

  useEffect(() => {
    if (containerRef.current) {
      const buttons = containerRef.current.querySelectorAll(".action-button");
      gsap.fromTo(
        buttons,
        {
          opacity: 0,
          y: 20,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
      );
    }
  }, []);

  const handleButtonClick = (callback: () => void, button: HTMLElement) => {
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: callback,
    });
  };

  return (
    <div
      ref={containerRef}
      className="glass-strong rounded-2xl p-6 border border-border"
    >
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-bold">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="action-button justify-start h-auto py-4 px-4 hover:border-primary/50 group"
          onClick={(e) => handleButtonClick(onViewBookings, e.currentTarget)}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm">View All Bookings</span>
              <span className="text-xs text-text-secondary">
                Manage campaigns
              </span>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="action-button justify-start h-auto py-4 px-4 hover:border-primary/50 group"
          onClick={(e) => handleButtonClick(onAddBlackoutDate, e.currentTarget)}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <Ban className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm">Add Blackout Date</span>
              <span className="text-xs text-text-secondary">
                Block unavailable dates
              </span>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="action-button justify-start h-auto py-4 px-4 hover:border-primary/50 group"
          onClick={(e) => handleButtonClick(onGetWidgetCode, e.currentTarget)}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <Code className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm">Get Widget Code</span>
              <span className="text-xs text-text-secondary">
                Embed on newsletter
              </span>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className={`action-button justify-start h-auto py-4 px-4 group ${
            canRequestPayout
              ? "hover:border-green-500/50 border-green-500/30"
              : "opacity-50 cursor-not-allowed"
          }`}
          onClick={(e) =>
            canRequestPayout &&
            handleButtonClick(onRequestPayout, e.currentTarget)
          }
          disabled={!canRequestPayout}
        >
          <div className="flex items-center gap-3 w-full">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                canRequestPayout
                  ? "bg-green-500/10 group-hover:bg-green-500/20"
                  : "bg-gray-500/10"
              }`}
            >
              <DollarSign
                className={`w-5 h-5 ${
                  canRequestPayout ? "text-green-400" : "text-gray-400"
                }`}
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm">Request Payout</span>
              <span className="text-xs text-text-secondary">
                {canRequestPayout
                  ? `$${pendingBalance.toFixed(2)} available`
                  : "Min $100 required"}
              </span>
            </div>
          </div>
        </Button>
      </div>

      {!canRequestPayout && (
        <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-xs text-yellow-400">
            You need ${(100 - pendingBalance).toFixed(2)} more to request a
            payout
          </p>
        </div>
      )}
    </div>
  );
}
