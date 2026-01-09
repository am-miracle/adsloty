"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Banknote, CreditCard, Info, Shield } from "lucide-react";
import { useState } from "react";

const bankTransferSchema = z.object({
  payoutMethod: z.literal("bank_transfer"),
  accountHolderName: z.string().min(2, "Account holder name is required"),
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(4, "Account number is required"),
  routingNumber: z.string().min(9, "Routing number must be 9 digits").max(9),
  accountType: z.enum(["checking", "savings"]),
  minimumPayout: z.string().min(1, "Please select minimum payout"),
});

const paypalSchema = z.object({
  payoutMethod: z.literal("paypal"),
  paypalEmail: z.string().email("Invalid email address"),
  minimumPayout: z.string().min(1, "Please select minimum payout"),
});

const wiseSchema = z.object({
  payoutMethod: z.literal("wise"),
  wiseEmail: z.string().email("Invalid email address"),
  minimumPayout: z.string().min(1, "Please select minimum payout"),
});

const payoutSchema = z.discriminatedUnion("payoutMethod", [
  bankTransferSchema,
  paypalSchema,
  wiseSchema,
]);

type PayoutFormData = z.infer<typeof payoutSchema>;

export default function PayoutDetailsPage() {
  const router = useRouter();
  const [payoutMethod, setPayoutMethod] = useState<string>("bank_transfer");

  const form = useForm<PayoutFormData>({
    resolver: zodResolver(payoutSchema),
    defaultValues: {
      payoutMethod: "bank_transfer",
      minimumPayout: "100",
    },
  });

  const onSubmit = async (data: PayoutFormData) => {
    console.log("Payout details:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/onboard/widget");
  };

  const handleSkip = () => {
    router.push("/onboard/widget");
  };

  const steps = [
    { number: 1, title: "Pricing", completed: true },
    { number: 2, title: "Payout", completed: false },
    { number: 3, title: "Widget", completed: false },
  ];

  return (
    <OnboardingLayout currentStep={2} totalSteps={3} steps={steps}>
      <div className="glass-strong rounded-3xl p-8 md:p-12 border-2 border-primary/20">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="gradient-text">Payout</span> Details
          </h1>
          <p className="text-text-secondary text-lg">
            Choose how you&apos;d like to receive payments from sponsors
          </p>
        </div>

        <div className="mb-8 p-6 rounded-2xl bg-primary/10 border border-primary/20">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Your information is secure</h3>
              <p className="text-sm text-text-secondary">
                All banking details are encrypted and stored securely. We never
                share your information with third parties.
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="payoutMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Payout Method
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setPayoutMethod(value);
                      form.reset({
                        payoutMethod: value,
                        minimumPayout: "100",
                      } as any);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select payout method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4" />
                          Bank Transfer (ACH)
                        </div>
                      </SelectItem>
                      <SelectItem value="paypal">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          PayPal
                        </div>
                      </SelectItem>
                      <SelectItem value="wise">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Wise (formerly TransferWise)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {payoutMethod === "bank_transfer" && (
              <>
                <FormField
                  control={form.control}
                  name="accountHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="John Doe"
                          className="h-12"
                        />
                      </FormControl>
                      <FormDescription>
                        Name as it appears on your bank account
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Chase Bank"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="123456789"
                            maxLength={9}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="0000000000"
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="checking">Checking</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {payoutMethod === "paypal" && (
              <FormField
                control={form.control}
                name="paypalEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PayPal Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your@email.com"
                        className="h-12"
                      />
                    </FormControl>
                    <FormDescription>
                      Payments will be sent to this PayPal account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {payoutMethod === "wise" && (
              <FormField
                control={form.control}
                name="wiseEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wise Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your@email.com"
                        className="h-12"
                      />
                    </FormControl>
                    <FormDescription>
                      Email associated with your Wise account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="minimumPayout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Minimum Payout Threshold
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="relative h-12">
                        <SelectValue placeholder="Select minimum payout" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="50">$50</SelectItem>
                      <SelectItem value="100">$100</SelectItem>
                      <SelectItem value="250">$250</SelectItem>
                      <SelectItem value="500">$500</SelectItem>
                      <SelectItem value="1000">$1,000</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    We&apos;ll send payouts once your balance reaches this
                    amount
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-4 rounded-xl bg-surface-dark border border-border">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-text-secondary mt-0.5 shrink-0" />
                <div className="text-sm text-text-secondary">
                  <p className="mb-2">
                    <strong className="text-white">Payout Schedule:</strong>{" "}
                    Payments are processed weekly on Fridays
                  </p>
                  <p>
                    <strong className="text-white">Processing Time:</strong>{" "}
                    Bank transfers take 2-3 business days, PayPal/Wise are
                    instant
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={handleSkip}
              >
                I&apos;ll do this later
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1 group"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving..." : "Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </OnboardingLayout>
  );
}
