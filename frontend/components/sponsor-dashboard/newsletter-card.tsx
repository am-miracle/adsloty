"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export interface NewsletterData {
  id: string;
  name: string;
  description: string;
  logo?: string;
  category: string;
  subscribers: number;
  openRate: number;
  clickRate: number;
  pricePerSlot: number;
  availableSlots: number;
  nextAvailableDate?: string;
  featured?: boolean;
}

interface NewsletterCardProps {
  newsletter: NewsletterData;
  onBookSlot: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export function NewsletterCard({
  newsletter,
  onBookSlot,
  onViewDetails,
}: NewsletterCardProps) {
  return (
    <div className="glass-strong rounded-xl p-6 border border-border hover:border-primary/30 transition-all flex flex-col h-full">
      {newsletter.featured && (
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-primary to-purple-600 text-white">
            ⭐ Featured
          </span>
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        {newsletter.logo ? (
          <Image
            src={newsletter.logo}
            alt={newsletter.name}
            width={100}
            height={100}
            className="w-16 h-16 rounded-xl object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-linear-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary font-bold text-2xl border border-primary/30">
            {newsletter.name.charAt(0)}
          </div>
        )}

        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{newsletter.name}</h3>
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-surface-border text-text-secondary">
            {newsletter.category}
          </span>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            ${newsletter.pricePerSlot}
          </div>
          <div className="text-xs text-text-secondary">per slot</div>
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-4 line-clamp-2">
        {newsletter.description}
      </p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-surface-border/30 rounded-lg p-3">
          <div className="text-xs text-text-secondary mb-1">Subscribers</div>
          <div className="font-bold">
            {newsletter.subscribers >= 1000
              ? `${(newsletter.subscribers / 1000).toFixed(1)}k`
              : newsletter.subscribers}
          </div>
        </div>

        <div className="bg-surface-border/30 rounded-lg p-3">
          <div className="text-xs text-text-secondary mb-1">Open Rate</div>
          <div className="font-bold">{newsletter.openRate}%</div>
        </div>

        <div className="bg-surface-border/30 rounded-lg p-3">
          <div className="text-xs text-text-secondary mb-1">Click Rate</div>
          <div className="font-bold">{newsletter.clickRate}%</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 p-3 bg-surface-border/20 rounded-lg">
        <div>
          <div className="text-xs text-text-secondary mb-0.5">
            Available Slots
          </div>
          <div className="font-semibold">
            {newsletter.availableSlots > 0 ? (
              <span className="text-green-400">
                {newsletter.availableSlots} slots
              </span>
            ) : (
              <span className="text-red-400">Fully booked</span>
            )}
          </div>
        </div>
        {newsletter.nextAvailableDate && (
          <div className="text-right">
            <div className="text-xs text-text-secondary mb-0.5">
              Next Available
            </div>
            <div className="font-semibold text-sm">
              {newsletter.nextAvailableDate}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-auto">
        <Button
          onClick={() => onViewDetails(newsletter.id)}
          variant="outline"
          className="flex-1"
        >
          View Details
        </Button>
        <Button
          onClick={() => onBookSlot(newsletter.id)}
          disabled={newsletter.availableSlots === 0}
          className="flex-1"
        >
          {newsletter.availableSlots > 0 ? "Book Slot" : "Join Waitlist"}
        </Button>
      </div>
    </div>
  );
}
