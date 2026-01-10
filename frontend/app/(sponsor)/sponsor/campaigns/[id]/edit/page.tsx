"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import gsap from "gsap";
import { Notification, NotificationType } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Upload, Save } from "lucide-react";
import Image from "next/image";

interface NotificationState {
  show: boolean;
  type: NotificationType;
  message: string;
}

interface EditFormData {
  adCopy: string;
  adImage: File | null;
  clickUrl: string;
  altText: string;
  notes: string;
}

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: "success",
    message: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    "https://via.placeholder.com/800x200/5b13ec/ffffff?text=Current+Ad+Image",
  );
  const [isLoading, setIsLoading] = useState(false);

  // Mock campaign data - in real app, fetch based on params.id
  const [campaign] = useState({
    id: "3",
    newsletterName: "Indie Hackers Digest",
    publishDate: "Jan 25, 2025",
    amount: 250,
    fee: 12.5,
    total: 262.5,
  });

  const [formData, setFormData] = useState<EditFormData>({
    adCopy: "",
    adImage: null,
    clickUrl: "",
    altText: "",
    notes: "",
  });

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
    }
  }, []);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showNotification("error", "Image must be less than 2MB");
        return;
      }

      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        showNotification("error", "Image must be JPG, PNG, or GIF");
        return;
      }

      setFormData({ ...formData, adImage: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        showNotification("success", "Image updated");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.adCopy && formData.adCopy.length < 50) {
      showNotification("error", "Ad copy must be at least 50 characters");
      return;
    }

    if (formData.altText && formData.altText.length < 10) {
      showNotification("error", "Alt text must be at least 10 characters");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      showNotification("success", "Campaign updated successfully!");
      setTimeout(() => {
        router.push(`/sponsor/campaigns/${params.id}`);
      }, 1500);
    }, 1500);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <PageBreadcrumb
          items={[
            { label: "My Campaigns", href: "/sponsor/campaigns" },
            {
              label: campaign.newsletterName,
              href: `/sponsor/campaigns/${params.id}`,
            },
            { label: "Edit Campaign" },
          ]}
        />

        <div className="glass-strong rounded-xl p-8 border border-border">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Edit Campaign</h1>
            <p className="text-text-secondary">
              {campaign.newsletterName} - {campaign.publishDate}
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Ad Image</label>
              <p className="text-sm text-text-secondary mb-3">
                Max 2MB, 800x200px recommended
              </p>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="space-y-3">
                <div className="border border-border rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview || ""}
                    alt="Ad preview"
                    width={100}
                    height={200}
                    className="w-full h-50"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Change Image
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Ad Copy (optional)
              </label>
              <p className="text-sm text-text-secondary mb-2">
                Update your ad description (min 50 characters if provided)
              </p>
              <textarea
                value={formData.adCopy}
                onChange={(e) =>
                  setFormData({ ...formData, adCopy: e.target.value })
                }
                rows={4}
                placeholder="Describe your product or service..."
                className="w-full px-4 py-2.5 bg-surface-border rounded-lg border border-border
                  text-white placeholder:text-text-secondary
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                  resize-none"
              />
              {formData.adCopy && (
                <p className="text-xs text-text-secondary mt-1">
                  {formData.adCopy.length} characters
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Click URL (optional)
              </label>
              <p className="text-sm text-text-secondary mb-2">
                Update where this ad links to
              </p>
              <input
                type="url"
                value={formData.clickUrl}
                onChange={(e) =>
                  setFormData({ ...formData, clickUrl: e.target.value })
                }
                placeholder="https://example.com/campaign"
                className="w-full px-4 py-2.5 bg-surface-border rounded-lg border border-border
                  text-white placeholder:text-text-secondary
                  focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Alt Text (optional)
              </label>
              <p className="text-sm text-text-secondary mb-2">
                Update accessibility description (min 10 characters if provided)
              </p>
              <input
                type="text"
                value={formData.altText}
                onChange={(e) =>
                  setFormData({ ...formData, altText: e.target.value })
                }
                placeholder="e.g., Acme Analytics - AI-powered analytics platform"
                className="w-full px-4 py-2.5 bg-surface-border rounded-lg border border-border
                  text-white placeholder:text-text-secondary
                  focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Notes (optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                placeholder="Any special instructions for the publisher..."
                className="w-full px-4 py-2.5 bg-surface-border rounded-lg border border-border
                  text-white placeholder:text-text-secondary
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                  resize-none"
              />
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-4">Booking Summary</h3>
              <div className="bg-surface-border/30 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Ad Slot</span>
                  <span className="font-medium">
                    ${campaign.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Processing Fee</span>
                  <span className="font-medium">
                    ${campaign.fee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="font-semibold">Total Paid</span>
                  <span className="font-bold text-primary text-lg">
                    ${campaign.total.toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-text-secondary mt-3">
                Changes to this draft campaign will not incur additional charges
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/sponsor/campaigns/${params.id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
    </>
  );
}
