"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Notification, NotificationType } from "@/components/ui/notification";
import { Upload, User } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  const [notification, setNotification] = useState({
    show: false,
    type: "success" as NotificationType,
    message: "",
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    newsletterName: "The Daily Tech Brief",
    substackUrl: "techbrief.substack.com",
    subscriberCount: "10000",
    bio: "A daily newsletter covering the latest in technology, startups, and innovation. We deliver curated tech news to 10,000+ subscribers every morning.",
    avatarUrl: "https://via.placeholder.com/150/5b13ec/ffffff?text=TB",
  });

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
    }

    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out" },
      );
    }
  }, []);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification("success", "Profile updated successfully!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatarUrl: reader.result as string });
        showNotification("success", "Avatar uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div ref={headerRef}>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-text-secondary">
            Manage your newsletter information and public profile
          </p>
        </div>

        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="glass-strong rounded-2xl border border-border p-8 space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-6">Newsletter Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Newsletter Name
                  </label>
                  <input
                    type="text"
                    value={formData.newsletterName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        newsletterName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-surface-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Newsletter URL
                  </label>
                  <input
                    type="text"
                    value={formData.substackUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, substackUrl: e.target.value })
                    }
                    placeholder="techbrief.substack.com"
                    className="w-full px-4 py-3 bg-surface-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subscriber Count
                  </label>
                  <select
                    value={formData.subscriberCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subscriberCount: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-surface-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                  >
                    <option value="1000">1,000 - 5,000</option>
                    <option value="5000">5,000 - 10,000</option>
                    <option value="10000">10,000 - 25,000</option>
                    <option value="25000">25,000 - 50,000</option>
                    <option value="50000">50,000+</option>
                  </select>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Bio (Optional)
                  </Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Tell sponsors about your newsletter and audience..."
                    rows={4}
                    className="w-full px-4 py-3 bg-surface-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    This will be visible to sponsors browsing newsletters
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-xl font-bold mb-6">Avatar / Logo</h2>

              <div className="flex items-center gap-6">
                <div className="relative group">
                  {formData.avatarUrl ? (
                    <Image
                      src={formData.avatarUrl}
                      alt="Newsletter avatar"
                      width={100}
                      height={100}
                      className="w-24 h-24 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-surface-dark border-2 border-border flex items-center justify-center">
                      <User className="w-12 h-12 text-text-secondary" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-text-secondary mb-3">
                    Upload a logo or avatar for your newsletter. Recommended
                    size: 400x400px
                  </p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <span className="inline-block px-4 py-2 bg-surface-dark border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer text-sm">
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
          </div>
        </form>
      </div>

      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
    </DashboardLayout>
  );
}
