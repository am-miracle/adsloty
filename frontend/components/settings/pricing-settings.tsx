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

interface PricingSettingsData {
  pricePerSlot: string;
  weeklySlots: string;
  autoApproval: boolean;
  minimumNotice: string;
}

interface PricingSettingsProps {
  data: PricingSettingsData;
  onChange: (data: PricingSettingsData) => void;
  onSave: () => void;
}

export function PricingSettings({ data, onChange, onSave }: PricingSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="pricePerSlot">Price per Slot</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
              $
            </span>
            <input
              id="pricePerSlot"
              type="number"
              value={data.pricePerSlot}
              onChange={(e) =>
                onChange({ ...data, pricePerSlot: e.target.value })
              }
              className="w-full pl-8 pr-4 py-3 bg-surface-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weeklySlots">Weekly Slots</Label>
          <Select
            value={data.weeklySlots}
            onValueChange={(value) => onChange({ ...data, weeklySlots: value })}
          >
            <SelectTrigger id="weeklySlots">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 slot per week</SelectItem>
              <SelectItem value="2">2 slots per week</SelectItem>
              <SelectItem value="3">3 slots per week</SelectItem>
              <SelectItem value="5">5 slots per week</SelectItem>
              <SelectItem value="7">Daily (7 slots)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox
          id="autoApproval"
          checked={data.autoApproval}
          onCheckedChange={(checked) =>
            onChange({ ...data, autoApproval: checked as boolean })
          }
        />
        <div className="space-y-1">
          <Label htmlFor="autoApproval" className="cursor-pointer">
            Automatically approve all bookings
          </Label>
          <p className="text-sm text-text-secondary">
            Not recommended for new writers
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="minimumNotice">Minimum Booking Notice</Label>
        <Select
          value={data.minimumNotice}
          onValueChange={(value) =>
            onChange({ ...data, minimumNotice: value })
          }
        >
          <SelectTrigger id="minimumNotice">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 day before</SelectItem>
            <SelectItem value="2">2 days before</SelectItem>
            <SelectItem value="3">3 days before</SelectItem>
            <SelectItem value="5">5 days before</SelectItem>
            <SelectItem value="7">1 week before</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-text-secondary">
          Sponsors must book at least this many days before the newsletter date
        </p>
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button onClick={onSave}>Save Changes</Button>
      </div>
    </div>
  );
}
