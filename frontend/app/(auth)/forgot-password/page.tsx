"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    console.log("Reset password for:", data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent you instructions to reset your password."
      >
        <div className="glass-strong rounded-3xl p-8 md:p-10 border-2 border-primary/20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Email Sent!</h2>
            <p className="text-text-secondary mb-2">
              We&apos;ve sent a password reset link to
            </p>
            <p className="text-white font-semibold mb-6">
              {form.getValues("email")}
            </p>
            <p className="text-sm text-text-secondary mb-8">
              Click the link in the email to reset your password. The link will
              expire in 1 hour.
            </p>

            <div className="space-y-3">
              <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={() => (window.location.href = "mailto:")}
              >
                Open Email App
                <Mail className="w-5 h-5" />
              </Button>
              <Link href="/sign-in">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Sign In
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-text-secondary">
                Didn&apos;t receive the email?{" "}
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-primary font-semibold hover:underline"
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="No worries, we'll send you reset instructions."
    >
      <div className="glass-strong rounded-3xl p-8 md:p-10 border-2 border-primary/20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Reset Your Password</h2>
          <p className="text-sm text-text-secondary">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary z-10" />
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        className="pl-11"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full group"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
              <Mail className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </Form>

        <div className="mt-6">
          <Link href="/sign-in">
            <Button
              type="button"
              variant="outline"
              size="default"
              className="w-full"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20">
          <p className="text-xs text-text-secondary text-center">
            Remember your password?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
