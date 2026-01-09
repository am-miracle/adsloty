"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface PaymentSettingsData {
  isConnected: boolean;
  provider: string;
  accountEmail: string;
  payoutSchedule: string;
}

interface PaymentSettingsProps {
  data: PaymentSettingsData;
  onViewDashboard: () => void;
  onDisconnect: () => void;
  onConnect: () => void;
}

export function PaymentSettings({
  data,
  onViewDashboard,
  onDisconnect,
  onConnect,
}: PaymentSettingsProps) {
  return (
    <div className="space-y-6">
      {data.isConnected ? (
        <>
          <div className="glass rounded-lg p-4 border border-green-500/30 bg-green-500/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="font-semibold text-green-400">Connected</span>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-text-secondary">Provider:</span>{" "}
                {data.provider}
              </p>
              <p>
                <span className="text-text-secondary">Account:</span>{" "}
                {data.accountEmail}
              </p>
              <p>
                <span className="text-text-secondary">Payout Schedule:</span>{" "}
                {data.payoutSchedule}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onViewDashboard}>
              View Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={onDisconnect}
              className="text-red-400 hover:text-red-300"
            >
              Disconnect Account
            </Button>
          </div>

          <div className="glass rounded-lg p-4 border border-yellow-500/30 bg-yellow-500/5">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-yellow-400">Warning:</span>{" "}
                Disconnecting will prevent you from receiving payments. Make
                sure you have received all pending payouts before disconnecting.
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-text-secondary mb-4">
            No payment account connected
          </p>
          <Button onClick={onConnect}>Connect LemonSqueezy Account</Button>
        </div>
      )}
    </div>
  );
}
