"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import gsap from "gsap";
import { Notification, NotificationType } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Download, ExternalLink, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface NotificationState {
  show: boolean;
  type: NotificationType;
  message: string;
}

interface CampaignDetails {
  id: string;
  newsletterName: string;
  newsletterLogo?: string;
  status: "active" | "scheduled" | "completed" | "draft";
  publishDate: string;
  subscribers: number;
  estimatedReach: string;
  amount: number;
  fee: number;
  total: number;
  adCopy: string;
  imageUrl: string;
  clickUrl: string;
  altText: string;
  bookedOn: string;
  companyName: string;
  contactEmail: string;
  notes?: string;
  performance?: {
    impressions: number;
    clicks: number;
    clickRate: number;
  };
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const campaignId = params.id as string;

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: "success",
    message: "",
  });

  // Mock data - in real app, fetch based on params.id
  const [campaign] = useState<CampaignDetails>({
    id: campaignId,
    newsletterName: "Tech Crunch Weekly",
    status: "active",
    publishDate: "Jan 15, 2025",
    subscribers: 45000,
    estimatedReach: "18k-22k opens",
    amount: 350,
    fee: 17.5,
    total: 367.5,
    companyName: "Acme Inc.",
    contactEmail: "john@acme.com",
    adCopy:
      "Boost your SaaS growth with our AI-powered analytics platform. Get actionable insights in real-time and make data-driven decisions. Join 5,000+ companies growing faster with Acme Analytics. Start your 14-day free trial today!",
    imageUrl:
      "https://via.placeholder.com/800x200/5b13ec/ffffff?text=Acme+Analytics+-+Boost+Your+SaaS+Growth",
    clickUrl: "https://acme.com/analytics",
    altText: "Acme Analytics - AI-powered analytics for SaaS companies",
    bookedOn: "January 5, 2025 at 2:30 PM",
    notes:
      "Please place this ad in the top third of the newsletter for maximum visibility.",
    performance: {
      impressions: 19500,
      clicks: 823,
      clickRate: 4.2,
    },
  });

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
      );
    }
  }, []);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message });
  };

  const handleEdit = () => {
    if (campaign.status === "draft") {
      router.push(`/sponsor/campaigns/${params.id}/edit`);
    } else {
      showNotification(
        "info",
        "Only draft campaigns can be edited. Contact support for changes.",
      );
    }
  };

  const handleDownloadAd = () => {
    showNotification("success", "Downloading ad image...");
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
      <div className="max-w-full">
        <div className="flex items-center justify-between mb-6">
          <PageBreadcrumb
            items={[
              { label: "My Campaigns", href: "/sponsor/campaigns" },
              { label: campaign.newsletterName },
            ]}
          />

          <Button>
            <Link href={``}>View Newsletter</Link>
          </Button>
        </div>

        <div ref={contentRef} className="space-y-6">
          {" "}
          <div className="glass-strong rounded-xl p-8 border border-border">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {campaign.newsletterName}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border ${config.color}`}
                >
                  <span className="size-1.5 rounded-full bg-current"></span>
                  {config.label}
                </span>
              </div>

              <div className="flex gap-2">
                {campaign.status === "draft" && (
                  <Button onClick={handleEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
                <Button variant="outline" onClick={handleDownloadAd}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Ad
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-border/30 rounded-lg p-4">
                <div className="text-sm text-text-secondary mb-1">
                  Publish Date
                </div>
                <div className="font-bold">{campaign.publishDate}</div>
              </div>
              <div className="bg-surface-border/30 rounded-lg p-4">
                <div className="text-sm text-text-secondary mb-1">
                  Subscribers
                </div>
                <div className="font-bold">
                  {campaign.subscribers.toLocaleString()}
                </div>
              </div>
              <div className="bg-surface-border/30 rounded-lg p-4">
                <div className="text-sm text-text-secondary mb-1">
                  Est. Reach
                </div>
                <div className="font-bold">{campaign.estimatedReach}</div>
              </div>
              <div className="bg-surface-border/30 rounded-lg p-4">
                <div className="text-sm text-text-secondary mb-1">
                  Total Paid
                </div>
                <div className="font-bold text-primary">
                  ${campaign.total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          {campaign.performance && campaign.status !== "draft" && (
            <div className="glass-strong rounded-xl p-6 border border-border">
              <h3 className="text-xl font-bold mb-4">Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface-border/30 rounded-lg p-4">
                  <div className="text-sm text-text-secondary mb-1">
                    Impressions
                  </div>
                  <div className="text-2xl font-bold">
                    {campaign.performance.impressions.toLocaleString()}
                  </div>
                </div>
                <div className="bg-surface-border/30 rounded-lg p-4">
                  <div className="text-sm text-text-secondary mb-1">Clicks</div>
                  <div className="text-2xl font-bold">
                    {campaign.performance.clicks.toLocaleString()}
                  </div>
                </div>
                <div className="bg-surface-border/30 rounded-lg p-4">
                  <div className="text-sm text-text-secondary mb-1">
                    Click Rate
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {campaign.performance.clickRate}%
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="glass-strong rounded-xl p-6 border border-border">
            <h3 className="text-xl font-bold mb-4">Ad Creative</h3>

            <div className="mb-6">
              <div className="border border-border rounded-lg overflow-hidden mb-3">
                <Image
                  src={campaign.imageUrl}
                  alt={campaign.altText}
                  width={100}
                  height={200}
                  className="w-full h-50"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">
                  Alt Text: {campaign.altText}
                </span>
                <Button variant="ghost" size="sm" onClick={handleDownloadAd}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-2">
                  Ad Copy
                </label>
                <div className="bg-surface-border/30 rounded-lg p-4">
                  <p className="text-sm">{campaign.adCopy}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary block mb-2">
                  Click URL
                </label>
                <div className="bg-surface-border/30 rounded-lg p-4">
                  <a
                    href={campaign.clickUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1.5"
                  >
                    {campaign.clickUrl}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {campaign.notes && (
                <div>
                  <label className="text-sm font-medium text-text-secondary block mb-2">
                    Additional Notes
                  </label>
                  <div className="bg-surface-border/30 rounded-lg p-4">
                    <p className="text-sm text-text-secondary">
                      {campaign.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="glass-strong rounded-xl p-6 border border-border">
            <h3 className="text-xl font-bold mb-4">Booking Details</h3>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-text-secondary">Company Name</span>
                <span className="font-medium">{campaign.companyName}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-text-secondary">Contact Email</span>
                <span className="font-medium">{campaign.contactEmail}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-text-secondary">Booked On</span>
                <span className="font-medium">{campaign.bookedOn}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-text-secondary">Ad Slot</span>
                <span className="font-medium">
                  ${campaign.amount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-text-secondary">Processing Fee (5%)</span>
                <span className="font-medium">${campaign.fee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-3">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary text-lg">
                  ${campaign.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
    </>
  );
}
