"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Mail, Lock, User, Building, Globe, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const writerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    newsletterName: z.string().min(2, "Newsletter name is required"),
    newsletterUrl: z.url("Invalid URL format"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const sponsorSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    companyName: z.string().min(2, "Company name is required"),
    website: z.union([z.literal(""), z.url("Invalid URL format")]).optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type WriterFormData = z.infer<typeof writerSchema>;
type SponsorFormData = z.infer<typeof sponsorSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"writer" | "sponsor">(
    "writer",
  );
  const [showVerification, setShowVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const writerForm = useForm<WriterFormData>({
    resolver: zodResolver(writerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      newsletterName: "",
      newsletterUrl: "",
    },
  });

  const sponsorForm = useForm<SponsorFormData>({
    resolver: zodResolver(sponsorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      website: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: WriterFormData | SponsorFormData) => {
    console.log("Sign up:", { ...data, accountType });

    setUserEmail(data.email);
    setShowVerification(true);

    setTimeout(() => {
      if (accountType === "writer") {
        router.push("/onboard/pricing");
      } else {
        router.push("/dashboard");
      }
    }, 3000);
  };

  if (showVerification) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent a verification link to your email address."
      >
        <div className="glass-strong rounded-3xl p-8 md:p-10 border-2 border-primary/20 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
          <p className="text-text-secondary mb-6">
            We sent a verification link to{" "}
            <strong className="text-white">{userEmail}</strong>
          </p>
          <p className="text-sm text-text-secondary mb-8">
            Click the link in the email to verify your account. This helps us
            keep Adsloty secure.
          </p>
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() =>
                accountType === "writer"
                  ? router.push("/onboard/pricing")
                  : router.push("/dashboard")
              }
            >
              Continue to{" "}
              {accountType === "writer" ? "Onboarding" : "Dashboard"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowVerification(false)}
            >
              Back to Sign Up
            </Button>
          </div>
          <p className="text-xs text-text-secondary mt-6">
            Didn&apos;t receive the email?{" "}
            <button className="text-primary hover:underline">
              Resend verification
            </button>
          </p>
        </div>
      </AuthLayout>
    );
  }

  const writerFields = [
    {
      name: "firstName" as const,
      label: "First Name",
      placeholder: "John",
      icon: User,
    },
    {
      name: "lastName" as const,
      label: "Last Name",
      placeholder: "Doe",
      icon: User,
    },
    {
      name: "email" as const,
      label: "Email Address",
      placeholder: "john@example.com",
      icon: Mail,
    },
    {
      name: "newsletterName" as const,
      label: "Newsletter Name",
      placeholder: "Tech Weekly",
      icon: FileText,
    },
    {
      name: "newsletterUrl" as const,
      label: "Newsletter URL",
      placeholder: "https://techweekly.com",
      icon: Globe,
    },
    {
      name: "password" as const,
      label: "Password",
      placeholder: "••••••••",
      icon: Lock,
      type: "password" as const,
    },
    {
      name: "confirmPassword" as const,
      label: "Confirm Password",
      placeholder: "••••••••",
      icon: Lock,
      type: "password" as const,
    },
  ];

  const sponsorFields = [
    {
      name: "firstName" as const,
      label: "First Name",
      placeholder: "John",
      icon: User,
    },
    {
      name: "lastName" as const,
      label: "Last Name",
      placeholder: "Doe",
      icon: User,
    },
    {
      name: "email" as const,
      label: "Email Address",
      placeholder: "john@example.com",
      icon: Mail,
    },
    {
      name: "companyName" as const,
      label: "Company Name",
      placeholder: "Acme Inc",
      icon: Building,
    },
    {
      name: "website" as const,
      label: "Website (optional)",
      placeholder: "https://acme.com",
      icon: Globe,
    },
    {
      name: "password" as const,
      label: "Password",
      placeholder: "••••••••",
      icon: Lock,
      type: "password" as const,
    },
    {
      name: "confirmPassword" as const,
      label: "Confirm Password",
      placeholder: "••••••••",
      icon: Lock,
      type: "password" as const,
    },
  ];

  return (
    <AuthLayout
      title="Start Your Journey"
      subtitle="Join thousands of newsletter creators and sponsors making advertising simple and profitable."
    >
      <div className="glass-strong rounded-3xl p-8 md:p-10 border-2 border-primary/20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-sm text-text-secondary">
            Choose your account type and get started
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => setAccountType("writer")}
            className={`p-4 rounded-xl border-2 transition-all ${
              accountType === "writer"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <User className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-sm font-semibold">Writer</div>
            <div className="text-xs text-text-secondary">Sell ad slots</div>
          </button>
          <button
            onClick={() => setAccountType("sponsor")}
            className={`p-4 rounded-xl border-2 transition-all ${
              accountType === "sponsor"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Building className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-sm font-semibold">Sponsor</div>
            <div className="text-xs text-text-secondary">Buy ad slots</div>
          </button>
        </div>

        {accountType === "writer" ? (
          <Form {...writerForm}>
            <form
              onSubmit={writerForm.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-3">
                {writerFields
                  .filter(
                    (f) =>
                      f.name !== "email" &&
                      f.name !== "password" &&
                      f.name !== "confirmPassword",
                  )
                  .map(({ name, label, placeholder, icon: Icon }) => (
                    <FormField
                      key={name}
                      control={writerForm.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <div className="relative">
                            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary z-10" />
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={placeholder}
                                className="pl-11"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
              </div>

              {writerFields
                .filter(
                  (f) =>
                    f.name === "email" ||
                    f.name === "password" ||
                    f.name === "confirmPassword",
                )
                .map(({ name, label, placeholder, icon: Icon, type }) => (
                  <FormField
                    key={name}
                    control={writerForm.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary z-10" />
                          <FormControl>
                            <Input
                              {...field}
                              type={type ?? "text"}
                              placeholder={placeholder}
                              className="pl-11"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  className="mt-1 w-4 h-4 rounded border-border accent-primary"
                  required
                />
                <label htmlFor="terms" className="text-sm text-text-secondary">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full group"
                size="lg"
                disabled={writerForm.formState.isSubmitting}
              >
                {writerForm.formState.isSubmitting
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...sponsorForm}>
            <form
              onSubmit={sponsorForm.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-3">
                {sponsorFields
                  .filter(
                    (f) => f.name === "firstName" || f.name === "lastName",
                  )
                  .map(({ name, label, placeholder, icon: Icon }) => (
                    <FormField
                      key={name}
                      control={sponsorForm.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <div className="relative">
                            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary z-10" />
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={placeholder}
                                className="pl-11"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
              </div>

              {sponsorFields
                .filter(
                  (f) =>
                    f.name === "email" ||
                    f.name === "companyName" ||
                    f.name === "website" ||
                    f.name === "password" ||
                    f.name === "confirmPassword",
                )
                .map(({ name, label, placeholder, icon: Icon, type }) => (
                  <FormField
                    key={name}
                    control={sponsorForm.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary z-10" />
                          <FormControl>
                            <Input
                              {...field}
                              type={type ?? "text"}
                              placeholder={placeholder}
                              className="pl-11"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  className="mt-1 w-4 h-4 rounded border-border accent-primary"
                  required
                />
                <label htmlFor="terms" className="text-sm text-text-secondary">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full group"
                size="lg"
                disabled={sponsorForm.formState.isSubmitting}
              >
                {sponsorForm.formState.isSubmitting
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>
            </form>
          </Form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="text-center text-xs text-text-secondary mb-4">
            Or continue with
          </div>
          <Button
            variant="outline"
            type="button"
            size="default"
            className="w-full"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
