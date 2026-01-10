"use client";

import { Search, Calendar, FileText, TrendingUp } from "lucide-react";

interface QuickActionsSponsorProps {
  onViewCampaigns: () => void;
  onViewBilling: () => void;
  onViewAnalytics: () => void;
}

export function QuickActionsSponsor({
  onViewCampaigns,
  onViewBilling,
  onViewAnalytics,
}: QuickActionsSponsorProps) {
  const actions = [
    {
      icon: Search,
      label: "Browse Newsletters",
      description: "Find newsletters for your ads",
      href: "/newsletters",
      color: "from-primary to-purple-600",
    },
    {
      icon: Calendar,
      label: "View Campaigns",
      description: "Manage active campaigns",
      onClick: onViewCampaigns,
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FileText,
      label: "View Billing",
      description: "Check invoices & payments",
      onClick: onViewBilling,
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: TrendingUp,
      label: "View Analytics",
      description: "Track campaign performance",
      onClick: onViewAnalytics,
      color: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const Component = action.href ? "a" : "button";
          const props = action.href
            ? { href: action.href }
            : { onClick: action.onClick };

          return (
            <Component
              key={index}
              {...props}
              className="glass-strong rounded-xl p-4 border border-border hover:border-primary/50 transition-all text-left group block"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-linear-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold mb-1">{action.label}</div>
              <div className="text-xs text-text-secondary">
                {action.description}
              </div>
            </Component>
          );
        })}
      </div>
    </div>
  );
}
