"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { fadeInUpScroll, rotatingFloat } from "@/lib/animations";
import Link from "next/link";

export function CTA() {
  const contentRef = useRef<HTMLDivElement>(null);
  const floatingRef1 = useRef<HTMLDivElement>(null);
  const floatingRef2 = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (contentRef.current) {
      fadeInUpScroll(contentRef.current, contentRef.current);
    }
    if (floatingRef1.current) {
      rotatingFloat(floatingRef1.current, -15, 5, 3);
    }
    if (floatingRef2.current) {
      rotatingFloat(floatingRef2.current, -20, -5, 2.5);
    }
  }, []);

  return (
    <section className="section-padding bg-background-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2e283920_1px,transparent_1px),linear-gradient(to_bottom,#2e283920_1px,transparent_1px)] bg-size-[4rem_4rem]" />

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />

      <div className="container-padding mx-auto max-w-7xl relative z-10">
        <div
          ref={contentRef}
          className="relative glass-strong rounded-3xl p-12 md:p-16 lg:p-20 border-2 border-primary/30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-purple-600/10" />

          <div
            ref={floatingRef1}
            className="absolute top-10 right-10 w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-sm"
          />
          <div
            ref={floatingRef2}
            className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-purple-600/20 backdrop-blur-sm"
          />

          <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium">
              Start Earning Today
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Ready to Monetize Your{" "}
              <span className="gradient-text">Newsletter?</span>
            </h2>

            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
              Join thousands of marketers and writers using Adsloty to connect
              and grow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button className="group">
                <Link href={"/sign-in"}>Get Started Free</Link>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline">
                <Link href={""}>View Demo</Link>
              </Button>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                Setup in 5 minutes
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
