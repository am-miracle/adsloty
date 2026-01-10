"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Calendar, ExternalLink, Check } from "lucide-react";
import Image from "next/image";

export default function NewsletterDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const newsletterId = params.id as string;

  const newsletter = {
    id: newsletterId,
    name: "Tech Weekly",
    logo: "",
    description:
      "The latest in technology, startups, and innovation. Curated for tech enthusiasts and entrepreneurs.",
    longDescription:
      "Tech Weekly is a premium newsletter that delivers the most important tech news, startup insights, and innovation trends directly to your inbox. Our audience consists of tech professionals, entrepreneurs, investors, and enthusiasts who are passionate about staying ahead of the curve.",
    category: "Technology",
    subscribers: 15000,
    openRate: 42.5,
    clickRate: 3.8,
    pricePerSlot: 250,
    availableSlots: 4,
    nextAvailableDate: "Oct 24",
    featured: true,
    publishDay: "Every Monday",
    website: "https://techweekly.com",

    audienceLocations: ["US (45%)", "UK (20%)", "Canada (15%)", "Other (20%)"],
    audienceInterests: [
      "SaaS",
      "AI/ML",
      "Startups",
      "Web Development",
      "Cloud Computing",
    ],

    avgClicksPerAd: 570,
    avgConversionRate: 4.2,

    sampleAds: [
      {
        id: "1",
        company: "DevTools Pro",
        copy: "Supercharge your development workflow with AI-powered code completion.",
        results: "680 clicks, 5.1% CTR",
      },
      {
        id: "2",
        company: "CloudHost",
        copy: "Deploy your apps globally in seconds. Free tier available.",
        results: "520 clicks, 4.3% CTR",
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <div className="max-w-5xl mx-auto space-y-8">
        <PageBreadcrumb
          items={[
            { label: "Newsletters", href: "/newsletters" },
            { label: newsletter.name },
          ]}
        />

        <div className="glass-strong rounded-2xl p-8 border border-border">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                {newsletter.logo ? (
                  <Image
                    src={newsletter.logo}
                    alt={newsletter.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl border border-primary/30">
                    {newsletter.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold mb-2">{newsletter.name}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-border text-text-secondary">
                      {newsletter.category}
                    </span>
                    {newsletter.featured && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-primary to-purple-600 text-white">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-lg text-text-secondary mb-4">
                {newsletter.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <Calendar className="w-4 h-4" />
                  {newsletter.publishDay}
                </div>
                {newsletter.website && (
                  <a
                    href={newsletter.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>

            <div className="md:text-right">
              <div className="text-sm text-text-secondary mb-1">
                Price per slot
              </div>
              <div className="text-4xl font-bold text-primary mb-4">
                ${newsletter.pricePerSlot}
              </div>
              <Button
                size="lg"
                onClick={() => router.push(`/sponsor/book/${newsletterId}`)}
                disabled={newsletter.availableSlots === 0}
                className="w-full md:w-auto"
              >
                {newsletter.availableSlots > 0
                  ? "Book a Slot"
                  : "Join Waitlist"}
              </Button>
              {newsletter.availableSlots > 0 && (
                <p className="text-sm text-green-400 mt-2">
                  {newsletter.availableSlots} slots available
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-strong rounded-xl p-6 border border-border">
            <div className=" text-primary mb-2">
              <span className="text-sm text-text-secondary">Subscribers</span>
            </div>
            <div className="text-3xl font-bold">
              {newsletter.subscribers.toLocaleString()}
            </div>
          </div>

          <div className="glass-strong rounded-xl p-6 border border-border">
            <div className=" text-green-400 mb-2">
              <span className="text-sm text-text-secondary">Open Rate</span>
            </div>
            <div className="text-3xl font-bold">{newsletter.openRate}%</div>
          </div>

          <div className="glass-strong rounded-xl p-6 border border-border">
            <div className=" text-purple-400 mb-2">
              <span className="text-sm text-text-secondary">Click Rate</span>
            </div>
            <div className="text-3xl font-bold">{newsletter.clickRate}%</div>
          </div>

          <div className="glass-strong rounded-xl p-6 border border-border">
            <div className=" text-blue-400 mb-2">
              <span className="text-sm text-text-secondary">Avg Clicks</span>
            </div>
            <div className="text-3xl font-bold">
              {newsletter.avgClicksPerAd}
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-bold mb-4">About This Newsletter</h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            {newsletter.longDescription}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Audience Locations</h3>
              <ul className="space-y-2">
                {newsletter.audienceLocations.map((location, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-text-secondary"
                  >
                    <Check className="w-4 h-4 text-primary" />
                    {location}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Audience Interests</h3>
              <div className="flex flex-wrap gap-2">
                {newsletter.audienceInterests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg bg-surface-border text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-bold mb-4">Expected Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-surface-border/30">
              <div className="text-text-secondary text-sm mb-1">
                Estimated Impressions
              </div>
              <div className="text-3xl font-bold mb-2">
                {(newsletter.subscribers * (newsletter.openRate / 100)).toFixed(
                  0,
                )}
              </div>
              <div className="text-sm text-text-secondary">
                Based on {newsletter.openRate}% open rate
              </div>
            </div>

            <div className="p-6 rounded-xl bg-surface-border/30">
              <div className="text-text-secondary text-sm mb-1">
                Estimated Clicks
              </div>
              <div className="text-3xl font-bold mb-2">
                {newsletter.avgClicksPerAd}
              </div>
              <div className="text-sm text-text-secondary">
                {newsletter.clickRate}% average click-through rate
              </div>
            </div>
          </div>
        </div>

        {/* Sample Ads */}
        <div className="glass-strong rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-bold mb-4">Recent Ad Examples</h2>
          <div className="space-y-4">
            {newsletter.sampleAds.map((ad) => (
              <div
                key={ad.id}
                className="p-6 rounded-xl bg-surface-border/30 border border-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="font-semibold text-lg">{ad.company}</div>
                  <span className="text-sm text-green-400">{ad.results}</span>
                </div>
                <p className="text-text-secondary">{ad.copy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass-strong rounded-2xl p-8 border border-primary/30 text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to advertise?</h3>
          <p className="text-text-secondary mb-6">
            Join successful companies advertising in {newsletter.name}
          </p>
          <Button
            size="lg"
            onClick={() => router.push(`/sponsor/book/${newsletterId}`)}
            disabled={newsletter.availableSlots === 0}
          >
            {newsletter.availableSlots > 0
              ? "Book Your Slot Now"
              : "Join Waitlist"}
          </Button>
        </div>
      </div>
    </div>
  );
}
