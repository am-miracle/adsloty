"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { Button } from "@/components/ui/button";
import {
  Code,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Eye,
} from "lucide-react";

export default function WidgetPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("substack");
  const [showInstructions, setShowInstructions] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);

  const writerId = "abc123xyz"; // This would come from your auth context

  const widgetCode = `<script
  src="https://adsloty.com/widget.js"
  data-writer-id="${writerId}"
></script>`;

  const platforms = [
    { id: "substack", name: "Substack" },
    { id: "beehiiv", name: "Beehiiv" },
    { id: "convertkit", name: "ConvertKit" },
    { id: "ghost", name: "Ghost" },
    { id: "custom", name: "Custom HTML" },
  ];

  const instructions: Record<string, string[]> = {
    substack: [
      "Go to Substack.com and sign in to your account",
      "Click on 'Settings' in your dashboard",
      "Navigate to 'Publication Details'",
      "Scroll down to the 'Footer' section",
      "Paste the widget code in the footer text area",
      "Click 'Save' to publish your changes",
    ],
    beehiiv: [
      "Open your Beehiiv dashboard",
      "Go to 'Settings' → 'Website'",
      "Find the 'Custom HTML' section",
      "Paste the code in the footer area",
      "Save your changes",
    ],
    convertkit: [
      "Go to your ConvertKit dashboard",
      "Navigate to 'Settings' → 'Advanced'",
      "Find 'Custom CSS & JavaScript'",
      "Paste the code in the JavaScript section",
      "Click 'Save'",
    ],
    ghost: [
      "Access your Ghost admin panel",
      "Go to 'Settings' → 'Code Injection'",
      "Paste the code in 'Site Footer'",
      "Click 'Save'",
    ],
    custom: [
      "Locate your website's HTML template",
      "Find the closing </body> tag",
      "Paste the widget code just before </body>",
      "Deploy your changes",
    ],
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    let progress = 0;
    if (copied) progress += 40;
    if (showInstructions) progress += 30;
    if (selectedPlatform) progress += 30;
    setCompletionProgress(progress);
  }, [copied, showInstructions, selectedPlatform]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(widgetCode);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePreview = () => {
    window.open("/widget-preview", "_blank");
  };

  const handleComplete = () => {
    router.push("/dashboard");
  };

  const steps = [
    { number: 1, title: "Pricing", completed: true },
    { number: 2, title: "Payout", completed: true },
    { number: 3, title: "Widget", completed: false },
  ];

  return (
    <OnboardingLayout currentStep={3} totalSteps={3} steps={steps}>
      <div className="glass-strong rounded-3xl p-8 md:p-12 border-2 border-primary/20">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Almost <span className="gradient-text">There!</span>
          </h1>
          <p className="text-text-secondary text-lg">
            Add our widget to start receiving ad bookings automatically
          </p>
        </div>

        <div className="mb-8 p-6 rounded-2xl bg-linear-to-br from-primary/20 to-purple-600/20 border-2 border-primary/30">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold">Why add the widget?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-surface-dark/50">
              <div className="font-semibold mb-1">Real-time Availability</div>
              <p className="text-text-secondary">
                Sponsors see your open slots instantly
              </p>
            </div>
            <div className="p-3 rounded-lg bg-surface-dark/50">
              <div className="font-semibold mb-1">Auto Bookings</div>
              <p className="text-text-secondary">Get booked while you sleep</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-dark/50">
              <div className="font-semibold mb-1">Track Performance</div>
              <p className="text-text-secondary">
                See clicks, views, and earnings
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-bold">
                1
              </span>
              Choose Your Platform
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    selectedPlatform === platform.id
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-sm font-semibold">{platform.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-bold">
                2
              </span>
              Copy Your Widget Code
            </h3>
            <div className="relative">
              <div className="absolute top-3 right-3 z-10">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCopy}
                  className={`transition-all ${
                    copied
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-primary hover:bg-primary-hover"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
              <div className="p-6 pr-32 rounded-xl bg-surface-dark border border-border font-mono text-sm overflow-x-auto">
                <pre className="text-text-secondary">
                  <code>{widgetCode}</code>
                </pre>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
              <Code className="w-4 h-4" />
              <span>
                Your unique writer ID:{" "}
                <code className="px-2 py-1 rounded bg-surface-dark text-primary">
                  {writerId}
                </code>
              </span>
            </div>
          </div>

          <div>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 transition-all mb-4"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-bold">
                  3
                </span>
                Installation Instructions
              </h3>
              {showInstructions ? (
                <ChevronUp className="w-5 h-5 text-text-secondary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-text-secondary" />
              )}
            </button>

            {showInstructions && (
              <div className="p-6 rounded-xl bg-surface-dark border border-border">
                <div className="mb-4">
                  <h4 className="font-semibold">
                    Installing on{" "}
                    {platforms.find((p) => p.id === selectedPlatform)?.name}
                  </h4>
                </div>
                <ol className="space-y-3">
                  {instructions[selectedPlatform]?.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-text-secondary pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={handlePreview}
              className="p-6 rounded-xl border-2 border-border hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-6 h-6 text-primary" />
                <h4 className="font-semibold">Preview Widget</h4>
              </div>
              <p className="text-sm text-text-secondary text-left mb-3">
                See how the widget will look on your newsletter
              </p>
              <div className="flex items-center gap-2 text-primary text-sm">
                <span>Open Preview</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <a
              href="https://youtube.com/watch?v=demo"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-xl border-2 border-border hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <PlayCircle className="w-6 h-6 text-primary" />
                <h4 className="font-semibold">Video Tutorial</h4>
              </div>
              <p className="text-sm text-text-secondary text-left mb-3">
                Watch our 60-second installation guide
              </p>
              <div className="flex items-center gap-2 text-primary text-sm">
                <span>Watch Now</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </div>

        <div className="mt-10 p-6 rounded-xl bg-primary/10 border border-primary/20">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Setup Progress</span>
              <span className="text-sm text-primary font-semibold">
                {completionProgress}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-dark overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-primary to-purple-600 transition-all duration-500"
                style={{ width: `${completionProgress}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-text-secondary text-center mb-2">
            <strong className="text-white">Pro Tip:</strong> You can always find
            this code in your dashboard under Settings → Widget
          </p>
          <p className="text-xs text-text-secondary text-center">
            Installation is optional but highly recommended for automatic
            bookings
          </p>
        </div>

        <div className="flex gap-4 pt-8">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => router.push("/onboard/payout-details")}
          >
            Back
          </Button>
          <Button
            type="button"
            size="lg"
            className="flex-1 group"
            onClick={handleComplete}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
