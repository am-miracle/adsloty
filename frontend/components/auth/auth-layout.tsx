"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(leftRef.current, {
      x: -100,
      opacity: 0,
      duration: 1,
    }).from(
      rightRef.current,
      {
        x: 100,
        opacity: 0,
        duration: 1,
      },
      "-=0.8",
    );

    gsap.to(orb1Ref.current, {
      y: -30,
      x: 20,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    gsap.to(orb2Ref.current, {
      y: 20,
      x: -30,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-background-dark via-surface-dark to-background-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2e283915_1px,transparent_1px),linear-gradient(to_bottom,#2e283915_1px,transparent_1px)] bg-size-[3rem_3rem]" />

      <div
        ref={orb1Ref}
        className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-20 right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"
      />

      <div className="container-padding mx-auto max-w-7xl min-h-screen flex items-center justify-center py-12 relative z-10">
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div
          ref={containerRef}
          className="w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          <div ref={leftRef} className="hidden lg:block space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/30">
                A
              </div>
              <span className="text-3xl font-bold gradient-text">Adsloty</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight">{title}</h1>
              <p className="text-lg text-text-secondary leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Self-Service Platform</h3>
                  <p className="text-sm text-text-secondary">
                    Automate your newsletter advertising workflow
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Automated Payouts</h3>
                  <p className="text-sm text-text-secondary">
                    Get paid automatically when ads are published
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Full Control</h3>
                  <p className="text-sm text-text-secondary">
                    Review and approve every ad before it goes live
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold gradient-text">10K+</div>
                <div className="text-sm text-text-secondary">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text">$2M+</div>
                <div className="text-sm text-text-secondary">Total Payouts</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text">98%</div>
                <div className="text-sm text-text-secondary">Satisfaction</div>
              </div>
            </div>
          </div>

          <div ref={rightRef} className="w-full max-w-md mx-auto lg:mx-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
