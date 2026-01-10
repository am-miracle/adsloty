"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./setting";

interface NotificationSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
  onSave: () => void;
}

export function NotificationSettings({
  form,
  onSave,
}: NotificationSettingsProps) {
  const notifications = [
    { name: "notifications.newBooking", label: "New booking received" },
    {
      name: "notifications.bookingApproaching",
      label: "Booking approaching (2 days before)",
    },
    { name: "notifications.paymentReceived", label: "Payment received" },
    { name: "notifications.payoutCompleted", label: "Payout completed" },
    { name: "notifications.weeklySummary", label: "Weekly summary" },
    { name: "notifications.marketing", label: "Marketing emails" },
  ] as const;

  return (
    <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
      <div className="space-y-4">
        {notifications.map((n) => (
          <FormField
            key={n.name}
            control={form.control}
            name={n.name}
            render={({ field }) => (
              <div className="flex items-center justify-between p-3 glass rounded-lg border border-border hover:border-primary/50 transition-colors">
                <Label className="cursor-pointer flex-1">{n.label}</Label>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            )}
          />
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button type="submit">Save Preferences</Button>
      </div>
    </form>
  );
}
