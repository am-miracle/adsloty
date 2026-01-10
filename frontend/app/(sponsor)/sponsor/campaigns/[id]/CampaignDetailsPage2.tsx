"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Users,
  TrendingUp,
  ExternalLink,
  Edit,
} from "lucide-react";
import Image from "next/image";

export default function CampaignDetailsPage2() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const campaign = {
    id: campaignId,
    newsletterName: "Tech Weekly",
    newsletterLogo: "",
    status: "active" as const,
    publishDate: "Oct 24, 2023",
    subscribers: 15000,
    estimatedReach: "~600-750 clicks",
    amount: 250,
    adCopy:
      "Discover the best AI-powered productivity tools to supercharge your workflow. Limited time 50% off for new users!",
    imageUrl:
      "https://via.placeholder.com/800x200/5b13ec/ffffff?text=Your+Ad+Preview",
    clickUrl: "https://yourproduct.com/promo",

    impressions: 14250,
    clicks: 683,
    clickRate: 4.8,
    conversions: 47,
    conversionRate: 6.9,
    roi: 188,
  };

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
    <>
      <div className="space-y-8">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/sponsor/campaigns")}
            className="mb-4 -ml-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {campaign.newsletterLogo ? (
                <Image
                  src={campaign.newsletterLogo}
                  alt={campaign.newsletterName}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl border border-primary/30">
                  {campaign.newsletterName.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {campaign.newsletterName}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${config.color}`}
                >
                  <span className="size-1.5 rounded-full bg-current"></span>
                  {config.label}
                </span>
              </div>
            </div>

            <Button
              onClick={() =>
                router.push(`/sponsor/campaigns/${campaignId}/edit`)
              }
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Campaign
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-strong rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
              <Users className="w-4 h-4" />
              Impressions
            </div>
            <div className="text-3xl font-bold mb-1">
              {campaign.impressions.toLocaleString()}
            </div>
            <div className="text-sm text-green-400">95% of subscribers</div>
          </div>

          <div className="glass-strong rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
              <TrendingUp className="w-4 h-4" />
              Clicks
            </div>
            <div className="text-3xl font-bold mb-1">
              {campaign.clicks.toLocaleString()}
            </div>
            <div className="text-sm text-text-secondary">
              {campaign.clickRate}% click rate
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
              <Calendar className="w-4 h-4" />
              Conversions
            </div>
            <div className="text-3xl font-bold mb-1">
              {campaign.conversions}
            </div>
            <div className="text-sm text-green-400">
              {campaign.conversionRate}% conversion rate
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
              <TrendingUp className="w-4 h-4" />
              ROI
            </div>
            <div className="text-3xl font-bold mb-1 text-green-400">
              {campaign.roi}%
            </div>
            <div className="text-sm text-text-secondary">
              ${(campaign.amount * (campaign.roi / 100)).toFixed(2)} return
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Ad Preview */}
            <div className="glass-strong rounded-2xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-4">Ad Preview</h3>
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden border border-border">
                  <Image
                    src={campaign.imageUrl}
                    alt="Ad preview"
                    width={800}
                    height={200}
                    className="w-full h-auto"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-text-secondary">Ad Copy:</div>
                  <p className="text-base leading-relaxed">{campaign.adCopy}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">
                    Click URL:
                  </span>
                  <a
                    href={campaign.clickUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 text-sm"
                  >
                    {campaign.clickUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Performance Timeline */}
            <div className="glass-strong rounded-2xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-4">
                Performance Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-border/30 rounded-lg">
                  <div>
                    <div className="font-medium">Campaign Launched</div>
                    <div className="text-sm text-text-secondary">
                      Oct 24, 2023 at 9:00 AM
                    </div>
                  </div>
                  <div className="size-2 rounded-full bg-green-400"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-border/30 rounded-lg">
                  <div>
                    <div className="font-medium">First 100 Clicks</div>
                    <div className="text-sm text-text-secondary">
                      Oct 24, 2023 at 11:30 AM
                    </div>
                  </div>
                  <div className="size-2 rounded-full bg-primary"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-border/30 rounded-lg">
                  <div>
                    <div className="font-medium">Peak Engagement</div>
                    <div className="text-sm text-text-secondary">
                      Oct 24, 2023 at 2:15 PM
                    </div>
                  </div>
                  <div className="size-2 rounded-full bg-purple-400"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Info Sidebar */}
          <div className="space-y-6">
            <div className="glass-strong rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4">Campaign Info</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-text-secondary mb-1">
                    Publish Date
                  </div>
                  <div className="font-medium">{campaign.publishDate}</div>
                </div>
                <div className="h-px bg-border"></div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">
                    Subscribers
                  </div>
                  <div className="font-medium">
                    {campaign.subscribers.toLocaleString()}
                  </div>
                </div>
                <div className="h-px bg-border"></div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">
                    Estimated Reach
                  </div>
                  <div className="font-medium">{campaign.estimatedReach}</div>
                </div>
                <div className="h-px bg-border"></div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">
                    Investment
                  </div>
                  <div className="font-medium text-primary text-xl">
                    ${campaign.amount}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Download Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  View Newsletter
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-400 hover:text-red-300"
                >
                  Pause Campaign
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
