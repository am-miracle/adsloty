"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export interface CampaignData {
  id: string;
  newsletterName: string;
  newsletterLogo?: string;
  status: "active" | "scheduled" | "completed" | "draft";
  publishDate: string;
  subscribers: number;
  estimatedReach: string;
  amount: number;
  adCopy: string;
  imageUrl?: string;
}

interface CampaignCardProps {
  campaign: CampaignData;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function CampaignCard({ campaign, onView, onEdit }: CampaignCardProps) {
  const statusConfig = {
    active: {
      label: "Active",
      color: "bg-green-500/10 text-green-400 border-green-500/30",
    },
    scheduled: {
      label: "Scheduled",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    },
    completed: {
      label: "Completed",
      color: "bg-gray-500/10 text-gray-400 border-gray-500/30",
    },
    draft: {
      label: "Draft",
      color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    },
  };

  const config = statusConfig[campaign.status];

  return (
    <div className="glass-strong rounded-xl p-6 border border-border hover:border-primary/30 transition-all flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {campaign.newsletterLogo ? (
            <Image
              src={campaign.newsletterLogo}
              alt={campaign.newsletterName}
              width={100}
              height={100}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
              {campaign.newsletterName.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">{campaign.newsletterName}</h3>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium border ${config.color} mt-1`}
            >
              <span className="size-1.5 rounded-full bg-current"></span>
              {config.label}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            ${campaign.amount}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-sm text-text-secondary">
          <span className="font-medium text-white">Publishes:</span>{" "}
          {campaign.publishDate}
        </div>
        <div className="text-sm text-text-secondary">
          <span className="font-medium text-white">Subscribers:</span>{" "}
          {campaign.subscribers.toLocaleString()}
        </div>
        <div className="text-sm text-text-secondary">
          <span className="font-medium text-white">Est. Reach:</span>{" "}
          {campaign.estimatedReach}
        </div>
      </div>

      {campaign.adCopy && (
        <div className="mb-4 p-3 bg-surface-border/30 rounded-lg">
          <p className="text-sm text-text-secondary line-clamp-2">
            {campaign.adCopy}
          </p>
        </div>
      )}

      <div className="flex gap-2 mt-auto">
        <Button
          onClick={() => onView(campaign.id)}
          className="flex-1"
          variant="outline"
        >
          View Details
        </Button>
        {campaign.status === "draft" && onEdit && (
          <Button onClick={() => onEdit(campaign.id)} className="flex-1">
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
