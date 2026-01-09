"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  Rocket,
  DollarSign,
  Calendar,
  Shield,
  BarChart3,
  Zap,
} from "lucide-react";
import { fadeInUpScroll, staggerFadeIn } from "@/lib/animations";

const features = [
  {
    icon: Rocket,
    title: "Self-Service Platform",
    description:
      "No more back-and-forth emails. Sponsors browse, book, and pay for ad slots instantly. Writers approve and get paid automatically.",
  },
  {
    icon: DollarSign,
    title: "Automated Payouts",
    description:
      "Set your price, manage availability, and receive payments automatically. Platform handles all payment processing and fee management.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Control your availability with blackout dates, lead times, and slots per week. Let sponsors book only when you're ready.",
  },
  {
    icon: Shield,
    title: "Review & Approve",
    description:
      "Full control over what gets published. Review ad content, approve or reject submissions, and maintain your newsletter's integrity.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track bookings, revenue, and performance metrics in real-time. Get insights to optimize pricing and maximize earnings.",
  },
  {
    icon: Zap,
    title: "Instant Integration",
    description:
      "Embed booking widgets on your site or use our API. Get started in minutes with seamless integration options.",
  },
];

export function Features() {
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      fadeInUpScroll(headingRef.current);

      const cards = cardsRef.current?.querySelectorAll(".feature-card");

      if (cards && cards.length) {
        staggerFadeIn(cards, cardsRef.current);
      }
    },
    { scope: cardsRef },
  );

  return (
    <section className="section-padding bg-background-light dark:bg-background-dark relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />

      <div className="container-padding mx-auto max-w-7xl relative z-10">
        <div ref={headingRef} className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Platform Features
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            Everything You Need to{" "}
            <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            A complete platform designed for newsletter creators and sponsors.
            Simple, powerful, and built for growth.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="feature-card glass-strong rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors group-hover:scale-110 duration-300">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 glass-strong rounded-3xl p-8 md:p-12 border-2 border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold">
                Built for Newsletter Creators
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed">
                Adsloty was designed from the ground up to solve the unique
                challenges of newsletter monetization. No complex setup, no
                hidden fees, just a straightforward platform that works.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-text-secondary">
                    10% platform fee only on published ads
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-text-secondary">
                    Weekly automated payouts via LemonSqueezy
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-text-secondary">
                    Full control over pricing and availability
                  </span>
                </li>
              </ul>
            </div>

            <div className="aspect-square rounded-2xl bg-linear-to-br from-primary/10 to-purple-600/10 flex items-center justify-center p-8">
              <div className="text-center space-y-3">
                <div className="text-5xl">💰</div>
                <div className="text-text-secondary text-sm">
                  Revenue Dashboard Image
                </div>
                <div className="text-text-secondary text-xs max-w-xs">
                  Image: Add a screenshot showing revenue analytics, earnings
                  chart, and payout history
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
