"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";

import { SettingsSection } from "@/components/settings/settings-section";
import { PricingSettings } from "@/components/settings/pricing-settings";
import { WidgetSettings } from "@/components/settings/widget-settings";
import { PaymentSettings } from "@/components/settings/payment-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { AccountSettings } from "@/components/settings/account-settings";
import { WidgetPreviewModal } from "@/components/settings/widget-preview-modal";
import { Notification, NotificationType } from "@/components/ui/notification";
import {
  SettingsFormValues,
  settingsSchema,
} from "@/components/settings/setting";

export default function SettingsPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isWidgetPreviewOpen, setIsWidgetPreviewOpen] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    type: "success" as NotificationType,
    message: "",
  });

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      pricing: {
        pricePerSlot: "250.00",
        weeklySlots: "1",
        autoApproval: false,
        minimumNotice: "2",
      },
      widget: {
        enabled: true,
        widgetColor: "#5b13ec",
        buttonText: "Book Ad Slot",
      },
      notifications: {
        newBooking: true,
        bookingApproaching: true,
        paymentReceived: true,
        payoutCompleted: true,
        weeklySummary: false,
        marketing: false,
      },
    },
  });

  const widgetCode = `<script src="https://adsloty.com/widget.js" data-writer-id="abc123xyz"></script>`;

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
    );

    sectionsRef.current.forEach((section, index) => {
      if (!section) return;
      gsap.fromTo(
        section,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.1,
          ease: "power3.out",
        },
      );
    });
  }, []);

  const notify = (type: NotificationType, message: string) =>
    setNotification({ show: true, type, message });

  const pricePerSlot = useWatch({
    control: form.control,
    name: "pricing.pricePerSlot",
  });

  return (
    <>
      <Form {...form}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div ref={headerRef}>
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text">Settings</span>
            </h1>
            <p className="text-text-secondary">
              Configure your newsletter advertising preferences
            </p>
          </div>

          <div
            ref={(el) => {
              sectionsRef.current[0] = el;
            }}
          >
            <SettingsSection title="Pricing Settings">
              <PricingSettings
                form={form}
                onSave={() => notify("success", "Pricing settings saved")}
              />
            </SettingsSection>
          </div>

          <div
            ref={(el) => {
              sectionsRef.current[1] = el;
            }}
          >
            <SettingsSection title="Widget Settings">
              <WidgetSettings
                form={form}
                widgetCode={widgetCode}
                onSave={() => notify("success", "Widget settings saved")}
                onCopy={() => {
                  navigator.clipboard.writeText(widgetCode);
                  notify("success", "Widget code copied");
                }}
                onPreview={() => setIsWidgetPreviewOpen(true)}
              />
            </SettingsSection>
          </div>

          <div
            ref={(el) => {
              sectionsRef.current[2] = el;
            }}
          >
            <SettingsSection title="Payment Settings">
              <PaymentSettings
                data={{
                  isConnected: true,
                  provider: "LemonSqueezy",
                  accountEmail: "sarah@example.com",
                  payoutSchedule: "Weekly",
                }}
                onViewDashboard={() =>
                  window.open(
                    "https://app.lemonsqueezy.com/dashboard",
                    "_blank",
                  )
                }
                onDisconnect={() =>
                  notify("info", "Payment account disconnected")
                }
                onConnect={() => notify("info", "Redirecting to LemonSqueezy…")}
              />
            </SettingsSection>
          </div>

          <div
            ref={(el) => {
              sectionsRef.current[3] = el;
            }}
          >
            <SettingsSection title="Notification Settings">
              <NotificationSettings
                form={form}
                onSave={() =>
                  notify("success", "Notification preferences saved")
                }
              />
            </SettingsSection>
          </div>

          <div
            ref={(el) => {
              sectionsRef.current[4] = el;
            }}
          >
            <SettingsSection title="Account Settings">
              <AccountSettings
                data={{
                  email: "sarah@example.com",
                  plan: "Free",
                  platformFee: 10,
                }}
                onChangeEmail={() =>
                  notify("info", "Opening email change form…")
                }
                onChangePassword={() =>
                  notify("info", "Opening password change form…")
                }
                onUpgrade={() => notify("info", "Redirecting to upgrade page…")}
                onDeleteAccount={() =>
                  notify("error", "Account deletion initiated")
                }
              />
            </SettingsSection>
          </div>
        </div>
      </Form>

      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification((n) => ({ ...n, show: false }))}
        />
      )}

      <WidgetPreviewModal
        isOpen={isWidgetPreviewOpen}
        onClose={() => setIsWidgetPreviewOpen(false)}
        newsletterName="The Daily Tech Brief"
        pricePerSlot={pricePerSlot}
      />
    </>
  );
}
