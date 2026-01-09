"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy } from "lucide-react";

interface WidgetSettingsData {
  enabled: boolean;
  widgetColor: string;
  buttonText: string;
}

interface WidgetSettingsProps {
  data: WidgetSettingsData;
  widgetCode: string;
  onChange: (data: WidgetSettingsData) => void;
  onSave: () => void;
  onCopy: () => void;
  onPreview: () => void;
}

export function WidgetSettings({
  data,
  widgetCode,
  onChange,
  onSave,
  onCopy,
  onPreview,
}: WidgetSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Widget Code</Label>
        <div className="relative mt-2">
          <pre className="bg-surface-dark border border-border rounded-lg p-4 overflow-x-auto text-sm text-text-secondary">
            {widgetCode}
          </pre>
          <button
            onClick={onCopy}
            className="absolute top-2 right-2 p-2 bg-surface-border rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between glass rounded-lg p-4 border border-border">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${
              data.enabled ? "bg-green-400" : "bg-red-400"
            }`}
          />
          <span className="text-sm font-medium">
            Widget Status: {data.enabled ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Label htmlFor="widgetEnabled" className="cursor-pointer">
            Enable widget
          </Label>
          <Checkbox
            id="widgetEnabled"
            checked={data.enabled}
            onCheckedChange={(checked) =>
              onChange({ ...data, enabled: checked as boolean })
            }
          />
        </div>
      </div>

      <div className="glass rounded-lg p-4 border border-blue-500/30 bg-blue-500/5">
        <p className="text-sm text-text-secondary mb-2">
          <span className="font-semibold text-blue-400">Pro Plan Feature:</span>{" "}
          Customize widget colors and button text
        </p>
        <Button variant="outline" size="sm" disabled>
          Upgrade to Pro
        </Button>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
        <Button onClick={onSave} className="flex-1">
          Save Changes
        </Button>
        <Button variant="outline" onClick={onPreview}>
          Preview Widget
        </Button>
      </div>
    </div>
  );
}
