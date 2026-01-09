"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface NotificationSettingsData {
  newBooking: boolean;
  bookingApproaching: boolean;
  paymentReceived: boolean;
  payoutCompleted: boolean;
  weeklySummary: boolean;
  marketing: boolean;
}

interface NotificationSettingsProps {
  data: NotificationSettingsData;
  onChange: (data: NotificationSettingsData) => void;
  onSave: () => void;
}

export function NotificationSettings({
  data,
  onChange,
  onSave,
}: NotificationSettingsProps) {
  const notifications = [
    { id: "newBooking", label: "New booking received", key: "newBooking" },
    {
      id: "bookingApproaching",
      label: "Booking approaching (2 days before)",
      key: "bookingApproaching",
    },
    { id: "paymentReceived", label: "Payment received", key: "paymentReceived" },
    { id: "payoutCompleted", label: "Payout completed", key: "payoutCompleted" },
    { id: "weeklySummary", label: "Weekly summary", key: "weeklySummary" },
    { id: "marketing", label: "Marketing emails", key: "marketing" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-center justify-between p-3 glass rounded-lg border border-border hover:border-primary/50 transition-colors"
          >
            <Label htmlFor={notification.id} className="cursor-pointer flex-1">
              {notification.label}
            </Label>
            <Checkbox
              id={notification.id}
              checked={data[notification.key as keyof NotificationSettingsData]}
              onCheckedChange={(checked) =>
                onChange({
                  ...data,
                  [notification.key]: checked as boolean,
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button onClick={onSave}>Save Preferences</Button>
      </div>
    </div>
  );
}
