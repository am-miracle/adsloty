"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { UserPlus, CreditCard, CheckCircle } from "lucide-react";
import {
  fadeInUpScroll,
  slideInFromLeft,
  slideInFromRight,
} from "@/lib/animations";
import {
  RiLineChartLine,
  RiMenuSearchLine,
  RiShoppingCart2Line,
} from "@remixicon/react";

const steps = {
  writers: [
    {
      icon: UserPlus,
      step: "1",
      title: "Create Your Profile",
      description:
        "Sign up and set up your newsletter profile with subscriber count, niche, and audience demographics.",
    },
    {
      icon: CreditCard,
      step: "2",
      title: "Set Your Pricing",
      description:
        "Define your ad slot price, availability, and booking settings. You're in complete control.",
    },
    {
      icon: CheckCircle,
      step: "3",
      title: "Approve & Publish",
      description:
        "Review booking requests, approve ad content, and get paid automatically when ads are published.",
    },
  ],
  sponsors: [
    {
      icon: RiMenuSearchLine,
      step: "1",
      title: "Browse Newsletters",
      description:
        "Search newsletters by niche, audience size, and demographics to find your perfect match.",
    },
    {
      icon: RiShoppingCart2Line,
      step: "2",
      title: "Book Ad Slots",
      description:
        "Select available dates, submit your ad content, and pay securely via LemonSqueezy.",
    },
    {
      icon: RiLineChartLine,
      step: "3",
      title: "Track Performance",
      description:
        "Monitor your campaigns, track bookings, and measure ROI from your dashboard.",
    },
  ],
};

export function HowItWorks() {
  const headingRef = useRef<HTMLDivElement>(null);
  const writersRef = useRef<HTMLDivElement>(null);
  const sponsorsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    fadeInUpScroll(headingRef.current);

    const writerSteps = writersRef.current?.querySelectorAll(".step-card");
    if (writerSteps) {
      slideInFromLeft(writerSteps, writersRef.current);
    }

    const sponsorSteps = sponsorsRef.current?.querySelectorAll(".step-card");
    if (sponsorSteps) {
      slideInFromRight(sponsorSteps, sponsorsRef.current);
    }
  }, []);

  return (
    <section className="section-padding bg-background-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2e283915_1px,transparent_1px),linear-gradient(to_bottom,#2e283915_1px,transparent_1px)] bg-size-[3rem_3rem]" />

      <div className="container-padding mx-auto max-w-7xl relative z-10">
        <div ref={headingRef} className="text-center mb-20 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            How <span className="gradient-text">Adsloty</span> Works
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Whether you&apos;re a newsletter creator or a sponsor, getting
            started is simple and straightforward.
          </p>
        </div>

        <div className="mb-24">
          <div className="flex items-center gap-3 mb-12">
            <h3 className="text-3xl font-bold">For Newsletter Writers</h3>
          </div>

          <div ref={writersRef} className="grid md:grid-cols-3 gap-8">
            {steps.writers.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="step-card relative">
                  {index < steps.writers.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-linear-to-r from-primary/50 to-transparent -translate-x-1/2 z-0" />
                  )}

                  <div className="relative glass-strong rounded-2xl p-8 h-full border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/30">
                        {step.step}
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                    <p className="text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-12">
            <h3 className="text-3xl font-bold">For Sponsors</h3>
          </div>

          <div ref={sponsorsRef} className="grid md:grid-cols-3 gap-8">
            {steps.sponsors.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="step-card relative">
                  {index < steps.sponsors.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-linear-to-r from-primary/50 to-transparent -translate-x-1/2 z-0" />
                  )}

                  <div className="relative glass-strong rounded-2xl p-8 h-full border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-linear-to-br from-primary to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/30">
                        {step.step}
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                    <p className="text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
