"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";

interface AccountSettingsData {
  email: string;
  plan: string;
  platformFee: number;
}

interface AccountSettingsProps {
  data: AccountSettingsData;
  onChangeEmail: () => void;
  onChangePassword: () => void;
  onUpgrade: () => void;
  onDeleteAccount: () => void;
}

export function AccountSettings({
  data,
  onChangeEmail,
  onChangePassword,
  onUpgrade,
  onDeleteAccount,
}: AccountSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              value={data.email}
              disabled
              className="flex-1 px-4 py-3 bg-surface-dark border border-border rounded-lg text-text-secondary"
            />
            <Button variant="outline" size="sm" onClick={onChangeEmail}>
              Change
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="flex gap-2">
            <Input
              id="password"
              type="password"
              value="••••••••"
              disabled
              className="flex-1 px-4 py-3 bg-surface-dark border border-border rounded-lg text-text-secondary"
            />
            <Button variant="outline" size="sm" onClick={onChangePassword}>
              Change
            </Button>
          </div>
        </div>
      </div>

      <div className="glass rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-3">Subscription</h3>
        <div className="space-y-2 text-sm mb-4">
          <p>
            <span className="text-text-secondary">Current Plan:</span>{" "}
            <span className="font-semibold">{data.plan}</span>
          </p>
          <p>
            <span className="text-text-secondary">Platform Fee:</span>{" "}
            <span className="font-semibold">{data.platformFee}%</span>
          </p>
        </div>
        <Button onClick={onUpgrade}>Upgrade to Pro - $29/mo, 5% fee</Button>
      </div>

      <div className="glass rounded-lg p-6 border border-red-500/30 bg-red-500/5">
        <h3 className="font-semibold text-red-400 mb-3">Danger Zone</h3>
        <p className="text-sm text-text-secondary mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <Button
          variant="outline"
          onClick={onDeleteAccount}
          className="text-red-400 hover:text-red-300 hover:border-red-400"
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
