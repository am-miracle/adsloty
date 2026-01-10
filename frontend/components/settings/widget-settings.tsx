"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy } from "lucide-react";
import { FormField, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./setting";

interface WidgetSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
  widgetCode: string;
  onSave: () => void;
  onCopy: () => void;
  onPreview: () => void;
}

export function WidgetSettings({
  form,
  widgetCode,
  onSave,
  onCopy,
  onPreview,
}: WidgetSettingsProps) {
  return (
    <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
      <div>
        <Label>Widget Code</Label>
        <div className="relative mt-2">
          <pre className="bg-surface-dark border border-border rounded-lg p-4 overflow-x-auto text-sm text-text-secondary">
            {widgetCode}
          </pre>
          <button
            type="button"
            onClick={onCopy}
            className="absolute top-2 right-2 p-2 bg-surface-border rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      <FormField
        control={form.control}
        name="widget.enabled"
        render={({ field }) => (
          <div className="flex items-center justify-between glass rounded-lg p-4 border border-border">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  field.value ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span className="text-sm font-medium">
                Widget Status: {field.value ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Label className="cursor-pointer">Enable widget</Label>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </div>
          </div>
        )}
      />

      <div className="flex gap-3 pt-4 border-t border-border">
        <Button type="submit" className="flex-1">
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onPreview}>
          Preview Widget
        </Button>
      </div>
    </form>
  );
}
