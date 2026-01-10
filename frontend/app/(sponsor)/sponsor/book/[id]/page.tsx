"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  WeekSelector,
  WeekSlot,
} from "@/components/sponsor-dashboard/week-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, CreditCard, Check } from "lucide-react";
import Image from "next/image";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";

type BookingStep = "select-week" | "ad-details" | "payment" | "confirmation";

export default function BookSlotPage() {
  const params = useParams();
  const router = useRouter();
  const newsletterId = params.id as string;

  const [currentStep, setCurrentStep] = useState<BookingStep>("select-week");
  const [selectedWeek, setSelectedWeek] = useState<WeekSlot | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [adDetails, setAdDetails] = useState({
    adCopy: "",
    clickUrl: "",
    imageUrl: "",
  });

  const newsletter = useMemo(
    () => ({
      id: newsletterId,
      name: "Tech Weekly",
      logo: "",
      subscribers: 15000,
      openRate: 42.5,
      clickRate: 3.8,
      pricePerSlot: 250,
    }),
    [newsletterId],
  );

  const weekSlots = useMemo(() => {
    const slots: WeekSlot[] = [];
    const today = new Date();

    for (let i = 1; i <= 12; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i * 7);

      slots.push({
        date,
        weekLabel: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: newsletter.pricePerSlot,
        available: i % 4 !== 0,
      });
    }

    return slots;
  }, [newsletter.pricePerSlot]);

  const handleSelectWeek = (slot: WeekSlot) => {
    setSelectedWeek(slot);
    setCurrentStep("ad-details");
  };

  const handleAdDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("payment");
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setCurrentStep("confirmation");
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: "select-week", label: "Select Week" },
      { key: "ad-details", label: "Ad Details" },
      { key: "payment", label: "Payment" },
      { key: "confirmation", label: "Confirmation" },
    ];

    const currentIndex = steps.findIndex((s) => s.key === currentStep);

    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                index <= currentIndex
                  ? "bg-primary/20 text-primary"
                  : "bg-surface-border/30 text-text-secondary"
              }`}
            >
              {index < currentIndex ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
              )}
              <span className="text-sm font-medium hidden sm:inline">
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 h-px mx-1 ${index < currentIndex ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <PageBreadcrumb
            items={[
              { label: "Newsletters", href: `/newsletters/${newsletterId}` },
              { label: newsletter.name },
            ]}
          />

          <div className="flex items-center gap-4 mb-4">
            {newsletter.logo ? (
              <Image
                src={newsletter.logo}
                alt={newsletter.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl border border-primary/30">
                {newsletter.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">Book Ad Slot</h1>
              <p className="text-text-secondary">{newsletter.name}</p>
            </div>
          </div>
        </div>

        {renderStepIndicator()}

        {currentStep === "select-week" && (
          <div className="glass-strong rounded-2xl p-6 border border-border">
            <h2 className="text-xl font-semibold mb-6">
              Select Your Preferred Week
            </h2>
            <WeekSelector slots={weekSlots} onSelectWeek={handleSelectWeek} />
          </div>
        )}

        {currentStep === "ad-details" && selectedWeek && (
          <form onSubmit={handleAdDetailsSubmit} className="space-y-6">
            <div className="glass-strong rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Ad Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ad Copy (max 280 characters)
                  </label>
                  <Textarea
                    value={adDetails.adCopy}
                    onChange={(e) =>
                      setAdDetails({ ...adDetails, adCopy: e.target.value })
                    }
                    rows={4}
                    placeholder="Enter your ad copy..."
                    className="w-full"
                    maxLength={280}
                    required
                  />
                  <div className="mt-2 text-sm text-text-secondary text-right">
                    {adDetails.adCopy.length} / 280 characters
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Click URL
                  </label>
                  <Input
                    type="url"
                    value={adDetails.clickUrl}
                    onChange={(e) =>
                      setAdDetails({ ...adDetails, clickUrl: e.target.value })
                    }
                    placeholder="https://yourproduct.com/promo"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ad Image
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => alert("Image upload functionality")}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    <Input
                      type="url"
                      value={adDetails.imageUrl}
                      onChange={(e) =>
                        setAdDetails({ ...adDetails, imageUrl: e.target.value })
                      }
                      placeholder="Or paste image URL"
                      className="flex-1"
                    />
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">
                    Recommended: 800x200px, JPG or PNG
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep("select-week")}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Continue to Payment
              </Button>
            </div>
          </form>
        )}

        {currentStep === "payment" && selectedWeek && (
          <div className="space-y-6">
            <div className="glass-strong rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Newsletter:</span>
                  <span className="font-medium">{newsletter.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Week of:</span>
                  <span className="font-medium">{selectedWeek.weekLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subscribers:</span>
                  <span className="font-medium">
                    {newsletter.subscribers.toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-border my-3"></div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-primary">
                    ${selectedWeek.price}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-border/30 border border-primary">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Visa ending in 4242</div>
                      <div className="text-sm text-text-secondary">
                        Expires 12/2025
                      </div>
                    </div>
                  </div>
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <Button variant="outline" className="w-full">
                  Use Different Payment Method
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("ad-details")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? "Processing..." : `Pay $${selectedWeek.price}`}
              </Button>
            </div>
          </div>
        )}

        {currentStep === "confirmation" && selectedWeek && (
          <div className="glass-strong rounded-2xl p-8 border border-primary/30 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-text-secondary mb-6">
              Your ad slot has been successfully booked for the week of{" "}
              {selectedWeek.weekLabel}
            </p>
            <div className="space-y-3 max-w-md mx-auto mb-6">
              <div className="text-sm text-text-secondary">
                The newsletter publisher will review your ad within 24 hours.
                You&apos;ll receive an email once it&apos;s approved.
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push("/sponsor/campaigns")}
              >
                View My Campaigns
              </Button>
              <Button onClick={() => router.push("/sponsor/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
