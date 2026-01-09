"use client";

import { Button } from "@/components/ui/button";

export interface NewsletterStats {
  subscribers: number;
  openRate: number;
  clickRate: number;
  adPrice: number;
}

interface NewsletterStatsCardProps {
  stats: NewsletterStats;
  onViewAnalytics?: () => void;
}

export function NewsletterStatsCard({
  stats,
  onViewAnalytics,
}: NewsletterStatsCardProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  return (
    <div className="flex flex-col rounded-2xl bg-linear-to-br from-surface-dark to-background-dark border border-border p-5">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-sm font-bold">Newsletter Stats</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-text-secondary text-xs mb-1">Subscribers</p>
          <p className="text-xl font-bold">{formatNumber(stats.subscribers)}</p>
        </div>
        <div>
          <p className="text-text-secondary text-xs mb-1">Open Rate</p>
          <p className="text-xl font-bold text-green-400">
            {formatPercentage(stats.openRate)}
          </p>
        </div>
        <div>
          <p className="text-text-secondary text-xs mb-1">Click Rate</p>
          <p className="text-xl font-bold">
            {formatPercentage(stats.clickRate)}
          </p>
        </div>
        <div>
          <p className="text-text-secondary text-xs mb-1">Ad Price</p>
          <p className="text-xl font-bold">${formatNumber(stats.adPrice)}</p>
        </div>
      </div>
      <Button
        variant="outline"
        className="mt-4 w-full bg-white/10 hover:bg-white/20"
        onClick={onViewAnalytics}
      >
        View Detailed Analytics
      </Button>
    </div>
  );
}
