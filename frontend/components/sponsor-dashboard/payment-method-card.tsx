"use client";

import { CreditCard, Building2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "wallet";
  last4: string;
  brand?: string;
  expiryDate?: string;
  bankName?: string;
  isDefault: boolean;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
}

export function PaymentMethodCard({
  method,
  onSetDefault,
  onRemove,
}: PaymentMethodCardProps) {
  const getIcon = () => {
    switch (method.type) {
      case "card":
        return <CreditCard className="w-5 h-5" />;
      case "bank":
        return <Building2 className="w-5 h-5" />;
      case "wallet":
        return <Wallet className="w-5 h-5" />;
    }
  };

  const getLabel = () => {
    switch (method.type) {
      case "card":
        return `${method.brand || "Card"} ending in ${method.last4}`;
      case "bank":
        return `${method.bankName || "Bank"} ending in ${method.last4}`;
      case "wallet":
        return `Wallet ending in ${method.last4}`;
    }
  };

  return (
    <div className="glass-strong rounded-xl p-4 border border-border hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-border flex items-center justify-center text-text-secondary">
            {getIcon()}
          </div>
          <div>
            <div className="font-medium">{getLabel()}</div>
            {method.expiryDate && (
              <div className="text-sm text-text-secondary">
                Expires {method.expiryDate}
              </div>
            )}
            {method.isDefault && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                Default
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {!method.isDefault && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSetDefault(method.id)}
            >
              Set Default
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(method.id)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
