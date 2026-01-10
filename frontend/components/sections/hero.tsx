"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { floatingAnimation } from "@/lib/animations";
import { gsap } from "gsap";
import Link from "next/link";
import { RiCalendarCheckLine } from "@remixicon/react";

export function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const floatingRef1 = useRef<HTMLDivElement>(null);
  const floatingRef2 = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(headingRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
    })
      .from(
        subheadingRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.6",
      )
      .from(
        ctaRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.5",
      )
      .from(
        imageRef.current,
        {
          scale: 0.8,
          opacity: 0,
          duration: 1,
        },
        "-=0.8",
      );

    floatingAnimation(floatingRef1.current, -20, 2);
    floatingAnimation(floatingRef2.current, -30, 2.5);
  }, []);

  return (
    <section className="relative py-32 min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-background-dark via-surface-dark to-background-dark">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2e283930_1px,transparent_1px),linear-gradient(to_bottom,#2e283930_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="container-padding relative z-10 mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8 lg:space-y-3 xl:space-y-8">
            {/*<div ref={floatingRef1} className="inline-block">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Self-Service Newsletter Advertising
              </div>
            </div>*/}

            <h1
              ref={headingRef}
              className="text-5xl xl:text-6xl 2xl:text-7xl font-bold font-outfit leading-tight"
            >
              Monetize Your <span className="gradient-text">Newsletter</span>{" "}
              With Ease
            </h1>

            <p
              ref={subheadingRef}
              className="text-base xl:text-xl text-text-secondary max-w-2xl mx-auto lg:mx-0"
            >
              Connect newsletter creators with sponsors. A self-service platform
              that makes advertising simple, transparent, and profitable for
              everyone.
            </p>

            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button className="group">
                <Link href={"/sign-up"}>Get Started Free</Link>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline">View Demo</Button>
            </div>

            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8">
              <div>
                <div className="text-3xl lg:text-xl xl:text-3xl  font-bold text-white">
                  10K+
                </div>
                <div className="text-sm lg:text-xs xl:text-sm text-text-secondary">
                  Active Newsletters
                </div>
              </div>
              <div>
                <div className="text-3xl lg:text-xl xl:text-3xl font-bold text-white">
                  $2M+
                </div>
                <div className="text-sm lg:text-xs xl:text-sm  text-text-secondary">
                  Payouts to Creators
                </div>
              </div>
              <div>
                <div className="text-3xl lg:text-xl xl:text-3xl font-bold text-white">
                  50K+
                </div>
                <div className="text-sm lg:text-xs xl:text-sm  text-text-secondary">
                  Ads Booked
                </div>
              </div>
            </div>
          </div>

          <div className="relative" ref={imageRef}>
            <div className="relative">
              <div
                ref={floatingRef2}
                className="absolute -top-2 -right-8 glass-strong rounded-2xl p-4 shadow-2xl z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 lg:h-10 lg:w-10 rounded-full bg-primary flex items-center justify-center">
                    <RiCalendarCheckLine className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">New Booking</div>
                    <div className="text-xs text-text-secondary">
                      $500 earned
                    </div>
                  </div>
                </div>
              </div>

              <div className="aspect-square rounded-3xl glass-strong p-8 shadow-2xl border-2 border-primary/20">
                <div className="w-full h-full rounded-2xl bg-linear-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">📧</div>
                    <div className="text-text-secondary text-sm">
                      Platform Dashboard Screenshot
                    </div>
                    <div className="text-text-secondary text-xs max-w-xs">
                      Image: Add a high-quality screenshot or mockup of the
                      Adsloty dashboard showing newsletter listings, booking
                      calendar, and analytics
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 glass-strong rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-400 border-2 border-surface-dark" />
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 border-2 border-surface-dark" />
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-emerald-400 border-2 border-surface-dark" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">1,234+</div>
                    <div className="text-xs text-text-secondary">
                      Active Users
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
