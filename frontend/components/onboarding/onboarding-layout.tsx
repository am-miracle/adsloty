"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import { Check } from "lucide-react";

interface OnboardingStep {
  number: number;
  title: string;
  completed: boolean;
}

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  steps,
}: OnboardingLayoutProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(progressRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
    }).from(
      contentRef.current,
      {
        y: 50,
        opacity: 0,
        duration: 0.8,
      },
      "-=0.4",
    );

    const progressBar = progressRef.current?.querySelector(".progress-bar");
    if (progressBar) {
      gsap.to(progressBar, {
        width: `${(currentStep / totalSteps) * 100}%`,
        duration: 1,
        ease: "power2.out",
        delay: 0.5,
      });
    }
  }, [currentStep, totalSteps]);

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-background-dark via-surface-dark to-background-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2e283915_1px,transparent_1px),linear-gradient(to_bottom,#2e283915_1px,transparent_1px)] bg-size[3rem_3rem]" />

      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="container-padding mx-auto max-w-4xl min-h-screen py-12 relative z-10">
        <Link href="/" className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
            A
          </div>
          <span className="text-2xl font-bold gradient-text">Adsloty</span>
        </Link>

        <div ref={progressRef} className="mb-12 w-full">
          <div className="flex items-center justify-between mb-6 w-full">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center relative w-full">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step.completed
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : step.number === currentStep
                          ? "bg-primary/20 text-primary border-2 border-primary"
                          : "bg-surface-dark border-2 border-border text-text-secondary"
                    }`}
                  >
                    {step.completed ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium whitespace-nowrap ${
                      step.number === currentStep
                        ? "text-primary"
                        : "text-text-secondary"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-border mx-4 relative">
                    <div
                      className={`absolute inset-0 bg-primary transition-all duration-500 ${
                        step.completed ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="w-full h-2 bg-surface-dark rounded-full overflow-hidden">
            <div
              className="progress-bar h-full bg-linear-to-r from-primary to-purple-600 rounded-full"
              style={{ width: "0%" }}
            />
          </div>

          <div className="mt-3 text-sm text-text-secondary text-center">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
}
