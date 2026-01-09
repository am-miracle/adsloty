"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, TrendingUp, Users, Info } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1.5">{message}</p>;
};

const pricingSchema = z.object({
  pricePerSlot: z.string().min(1, "Price is required"),
  weeklySlots: z.string().min(1, "Please select weekly slots"),
  subscriberCount: z.string().min(1, "Please select subscriber count"),
});

type PricingFormData = z.infer<typeof pricingSchema>;

const subscriberRanges = [
  { value: "under-500", label: "Under 500", recommendedPrice: "25-50" },
  { value: "500-1000", label: "500-1,000", recommendedPrice: "50-100" },
  { value: "1000-2500", label: "1,000-2,500", recommendedPrice: "100-200" },
  { value: "2500-5000", label: "2,500-5,000", recommendedPrice: "200-400" },
  { value: "5000-10000", label: "5,000-10,000", recommendedPrice: "400-800" },
  { value: "10000+", label: "10,000+", recommendedPrice: "800-1500" },
];

export default function PricingPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PricingFormData>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      pricePerSlot: "",
      weeklySlots: "",
      subscriberCount: "",
    },
  });

  const subscriberCount = useWatch({ control, name: "subscriberCount" });
  const weeklySlots = useWatch({ control, name: "weeklySlots" });
  const pricePerSlot = useWatch({ control, name: "pricePerSlot" });

  const selectedRange = subscriberRanges.find(
    (r) => r.value === subscriberCount,
  );

  const calculateMonthlyPotential = () => {
    if (!pricePerSlot || !weeklySlots) return 0;
    const price = parseFloat(pricePerSlot);
    const slots = parseInt(weeklySlots);
    return price * slots * 4;
  };

  const monthlyPotential = calculateMonthlyPotential();

  const onSubmit = async (data: PricingFormData) => {
    console.log("Pricing data:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/onboard/payout-details");
  };

  const steps = [
    { number: 1, title: "Pricing", completed: false },
    { number: 2, title: "Payout", completed: false },
    { number: 3, title: "Details", completed: false },
  ];

  return (
    <OnboardingLayout currentStep={1} totalSteps={3} steps={steps}>
      <div className="glass-strong rounded-3xl p-8 md:p-12 border-2 border-primary/20">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Set Your <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-text-secondary text-lg">
            Tell us about your pricing and subscriber base. You can always
            adjust these later.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <Label
              htmlFor="subscriberCount"
              className="mb-3 block text-base font-semibold"
            >
              What&apos;s your typical subscriber count?
            </Label>
            <div>
              <Select
                value={subscriberCount}
                onValueChange={(value) => setValue("subscriberCount", value)}
              >
                <SelectTrigger className="relative h-12 pl-11">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <SelectValue placeholder="Select subscriber range" />
                </SelectTrigger>
                <SelectContent>
                  {subscriberRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorMessage message={errors.subscriberCount?.message} />
            </div>
          </div>

          <div>
            <Label
              htmlFor="pricePerSlot"
              className="mb-3 block text-base font-semibold"
            >
              How much do you charge per ad slot?
            </Label>
            <InputGroup>
              <InputGroupAddon>
                <DollarSign />
              </InputGroupAddon>
              <InputGroupInput
                id="pricePerSlot"
                type="number"
                min="1"
                step="1"
                placeholder="500"
                {...register("pricePerSlot")}
                className="pl-11"
              />
              <InputGroupAddon align="inline-end">USD</InputGroupAddon>
            </InputGroup>
            <ErrorMessage message={errors.pricePerSlot?.message} />

            {selectedRange && (
              <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-text-secondary">
                  Most writers with{" "}
                  <strong className="text-white">{selectedRange.label}</strong>{" "}
                  subscribers charge{" "}
                  <strong className="text-primary">
                    ${selectedRange.recommendedPrice}
                  </strong>{" "}
                  per slot
                </p>
              </div>
            )}
          </div>

          <div>
            <Label
              htmlFor="weeklySlots"
              className="mb-3 block text-base font-semibold"
            >
              How many ad slots do you allow per newsletter?
            </Label>
            <div>
              <Select
                value={weeklySlots}
                onValueChange={(value) => setValue("weeklySlots", value)}
              >
                <SelectTrigger className="relative h-12 pl-11">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <SelectValue placeholder="Select weekly slots" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 slot per week</SelectItem>
                  <SelectItem value="2">2 slots per week</SelectItem>
                  <SelectItem value="3">3 slots per week</SelectItem>
                  <SelectItem value="4">4 slots per week</SelectItem>
                  <SelectItem value="5">5 slots per week</SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage message={errors.weeklySlots?.message} />
            </div>
            <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-surface-dark border border-border">
              <Info className="w-4 h-4 text-text-secondary mt-0.5 shrink-0" />
              <p className="text-sm text-text-secondary">
                We recommend{" "}
                <strong className="text-white">starting with 1 slot</strong> to
                maintain newsletter quality and reader experience
              </p>
            </div>
          </div>

          {monthlyPotential > 0 && (
            <div className="p-6 rounded-2xl bg-linear-to-br from-primary/20 to-purple-600/20 border-2 border-primary/30">
              <div className="flex items-center gap-3 mb-3">
                {/*<div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>*/}
                <h3 className="text-lg font-semibold">
                  Monthly Revenue Potential
                </h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold gradient-text">
                  ${monthlyPotential.toLocaleString()}
                </span>
                <span className="text-text-secondary">/month</span>
              </div>
              <p className="text-sm text-text-secondary mt-2">
                Based on {weeklySlots} slot
                {parseInt(weeklySlots) > 1 ? "s" : ""} per week at $
                {pricePerSlot} each
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => router.push("/")}
            >
              Back
            </Button>
            <Button
              type="submit"
              size="lg"
              className="flex-1 group"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
}
