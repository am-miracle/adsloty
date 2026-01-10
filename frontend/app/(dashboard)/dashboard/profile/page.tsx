"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { Upload, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Notification, NotificationType } from "@/components/ui/notification";

const profileSchema = z.object({
  newsletterName: z.string().min(2, "Newsletter name is required"),
  substackUrl: z.string().min(3, "Newsletter URL is required"),
  subscriberCount: z.string(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://via.placeholder.com/150/5b13ec/ffffff?text=TB",
  );

  const [notification, setNotification] = useState({
    show: false,
    type: "success" as NotificationType,
    message: "",
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      newsletterName: "The Daily Tech Brief",
      substackUrl: "techbrief.substack.com",
      subscriberCount: "10000",
      bio: "A daily newsletter covering the latest in technology, startups, and innovation.",
    },
  });

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
    );

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out" },
    );
  }, []);

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Profile data:", data);
    setNotification({
      show: true,
      type: "success",
      message: "Profile updated successfully!",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
      setNotification({
        show: true,
        type: "success",
        message: "Avatar uploaded successfully!",
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <div ref={headerRef}>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-text-secondary">
            Manage your newsletter information and public profile
          </p>
        </div>

        <div ref={formRef}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="glass-strong rounded-2xl border border-border p-8 space-y-10"
            >
              <div>
                <h2 className="text-xl font-bold mb-6">
                  Newsletter Information
                </h2>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="newsletterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Newsletter Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="substackUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Newsletter URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="techbrief.substack.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subscriberCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscriber Count</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1000">1,000 – 5,000</SelectItem>
                            <SelectItem value="5000">5,000 – 10,000</SelectItem>
                            <SelectItem value="10000">
                              10,000 – 25,000
                            </SelectItem>
                            <SelectItem value="25000">
                              25,000 – 50,000
                            </SelectItem>
                            <SelectItem value="50000">50,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            className="resize-none"
                            placeholder="Tell sponsors about your newsletter..."
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-text-secondary mt-1">
                          This will be visible to sponsors
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <h2 className="text-xl font-bold mb-6">Avatar / Logo</h2>

                <div className="flex items-center gap-6">
                  <div className="relative group">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Avatar"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full object-cover border-2 border-border"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-surface-dark border flex items-center justify-center">
                        <User className="w-10 h-10 text-text-secondary" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-text-secondary mb-3">
                      Recommended size: 400×400px
                    </p>
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <span className="inline-flex px-4 py-2 border border-border rounded-lg text-sm cursor-pointer hover:border-primary/50 transition">
                        Upload New Image
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-border">
                <Button type="submit" size="lg">
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        />
      )}
    </>
  );
}
