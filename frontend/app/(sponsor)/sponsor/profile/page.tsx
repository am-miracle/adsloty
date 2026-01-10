"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import Image from "next/image";

import { Notification, NotificationType } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Upload, User, Mail, Building, Globe, Save } from "lucide-react";

import { z } from "zod";
import { Label } from "@/components/ui/label";

export const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  companyName: z.string().min(1),
  website: z.url(),
  bio: z.string().optional(),
  industry: z.string(),
  companySize: z.string(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface NotificationState {
  show: boolean;
  type: NotificationType;
  message: string;
}

export default function SponsorProfilePage() {
  const formRef = useRef<HTMLFormElement>(null);

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: "success",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "john@acme.com",
      companyName: "Acme Inc.",
      website: "https://acme.com",
      bio: "We build amazing SaaS products that help businesses grow faster.",
      industry: "Technology",
      companySize: "11-50",
    },
  });

  const industry = useWatch({
    control: form.control,
    name: "industry",
  });

  const companySize = useWatch({
    control: form.control,
    name: "companySize",
  });

  useEffect(() => {
    if (!formRef.current) return;

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
    );
  }, []);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showNotification("error", "Logo must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
      showNotification("success", "Logo uploaded successfully");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showNotification("success", "Profile updated successfully!");
      console.log(values);
    }, 1500);
  };

  return (
    <>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-text-secondary">
            Manage your company profile and public information
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8"
        >
          <div className="glass-strong rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Company Logo</h3>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-xl bg-linear-to-br from-primary/20 to-purple-500/20 border border-primary/30 flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Company logo"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building className="w-10 h-10 text-primary" />
                )}
              </div>

              <div>
                <Label htmlFor="logo-upload">
                  <Button type="button" variant="outline" asChild>
                    <span className="flex items-center gap-2 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </span>
                  </Button>
                </Label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <p className="text-sm text-text-secondary mt-2">
                  PNG, JPG or SVG. Max size 2MB.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-xl p-6 border border-border space-y-4">
            <h3 className="text-lg font-semibold mb-4">Company Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                icon={User}
                label="First Name"
                {...form.register("firstName")}
              />

              <InputField
                icon={User}
                label="Last Name"
                {...form.register("lastName")}
              />

              <InputField
                icon={Mail}
                label="Email Address"
                type="email"
                {...form.register("email")}
              />

              {/* Company Name */}
              <InputField
                icon={Building}
                label="Company Name"
                {...form.register("companyName")}
              />

              <InputField
                icon={Globe}
                label="Website"
                {...form.register("website")}
              />

              <div>
                <Label className="block text-sm font-medium mb-2">
                  {" "}
                  Industry{" "}
                </Label>
                <Select
                  value={industry}
                  onValueChange={(v) => form.setValue("industry", v)}
                >
                  <SelectTrigger className="bg-surface-border border-border">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Technology",
                      "Finance",
                      "Healthcare",
                      "Education",
                      "Ecommerce",
                      "Marketing",
                      "Other",
                    ].map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium mb-2">
                  {" "}
                  Company Size{" "}
                </Label>
                <Select
                  value={companySize}
                  onValueChange={(v) => form.setValue("companySize", v)}
                >
                  <SelectTrigger className="bg-surface-border border-border">
                    <SelectValue placeholder="Company Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {["1-10", "11-50", "51-200", "201-500", "501+"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s} employees
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-2">
                Company Bio
              </Label>
              <Textarea
                {...form.register("bio")}
                rows={4}
                className="resize-none"
                placeholder="Tell us about your company..."
              />
              <p className="text-sm text-text-secondary mt-1">
                Visible to publishers when booking campaigns
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification((n) => ({ ...n, show: false }))}
        />
      )}
    </>
  );
}

function InputField({ icon: Icon, label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <Input {...props} className="pl-10 bg-surface-border border-border" />
      </div>
    </div>
  );
}
