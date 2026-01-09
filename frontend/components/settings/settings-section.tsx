"use client";

import { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <div className="glass-strong rounded-2xl border border-border p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
