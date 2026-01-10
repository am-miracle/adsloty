"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./setting";

interface PricingSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
  onSave: () => void;
}

export function PricingSettings({ form, onSave }: PricingSettingsProps) {
  return (
    <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="pricing.pricePerSlot"
          render={({ field }) => (
            <div className="space-y-2">
              <Label>Price per Slot</Label>
              <input
                {...field}
                type="number"
                step="0.01"
                min="0"
                className="w-full pl-8 pr-4 py-3 bg-surface-dark border border-border rounded-lg"
              />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="pricing.weeklySlots"
          render={({ field }) => (
            <div className="space-y-2">
              <Label>Weekly Slots</Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 slot</SelectItem>
                  <SelectItem value="2">2 slots</SelectItem>
                  <SelectItem value="3">3 slots</SelectItem>
                  <SelectItem value="5">5 slots</SelectItem>
                  <SelectItem value="7">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="pricing.autoApproval"
        render={({ field }) => (
          <div className="flex items-start space-x-3">
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            <Label className="cursor-pointer">
              Automatically approve all bookings
            </Label>
          </div>
        )}
      />

      <div className="flex justify-end pt-4 border-t border-border">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
