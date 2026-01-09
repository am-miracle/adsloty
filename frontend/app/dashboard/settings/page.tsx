"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SettingsSection } from "@/components/settings/settings-section";
import { PricingSettings } from "@/components/settings/pricing-settings";
import { WidgetSettings } from "@/components/settings/widget-settings";
import { WidgetPreviewModal } from "@/components/settings/widget-preview-modal";
import { PaymentSettings } from "@/components/settings/payment-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { AccountSettings } from "@/components/settings/account-settings";
import { Notification, NotificationType } from "@/components/ui/notification";

export default function SettingsPage() {
  const [notification, setNotification] = useState({
    show: false,
    type: "success" as NotificationType,
    message: "",
  });

  const [isWidgetPreviewOpen, setIsWidgetPreviewOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [pricingSettings, setPricingSettings] = useState({
    pricePerSlot: "250.00",
    weeklySlots: "1",
    autoApproval: false,
    minimumNotice: "2",
  });

  const [widgetSettings, setWidgetSettings] = useState({
    enabled: true,
    widgetColor: "#5b13ec",
    buttonText: "Book Ad Slot",
  });

  const [paymentSettings] = useState({
    isConnected: true,
    provider: "LemonSqueezy",
    accountEmail: "sarah@example.com",
    payoutSchedule: "Weekly",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newBooking: true,
    bookingApproaching: true,
    paymentReceived: true,
    payoutCompleted: true,
    weeklySummary: false,
    marketing: false,
  });

  const [accountSettings] = useState({
    email: "sarah@example.com",
    plan: "Free",
    platformFee: 10,
  });

  const widgetCode = `<script src="https://adsloty.com/widget.js"
        data-writer-id="abc123xyz">
</script>`;

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
    }

    sectionsRef.current.forEach((section, index) => {
      if (section) {
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
      }
    });
  }, []);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message });
  };

  const handleCopyWidget = () => {
    navigator.clipboard.writeText(widgetCode);
    showNotification("success", "Widget code copied to clipboard!");
  };

  const handleSavePricing = () => {
    showNotification("success", "Pricing settings saved successfully!");
  };

  const handleSaveWidget = () => {
    showNotification("success", "Widget settings saved successfully!");
  };

  const handleSaveNotifications = () => {
    showNotification("success", "Notification preferences saved!");
  };

  const handleDisconnectPayment = () => {
    if (
      confirm(
        "Are you sure you want to disconnect your payment account? This will prevent you from receiving payments.",
      )
    ) {
      showNotification("info", "Payment account disconnected");
    }
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you absolutely sure? This action is permanent and cannot be undone. All your data will be deleted.",
      )
    ) {
      showNotification("error", "Account deletion initiated");
    }
  };

  return (
    <DashboardLayout>
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
              data={pricingSettings}
              onChange={setPricingSettings}
              onSave={handleSavePricing}
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
              data={widgetSettings}
              widgetCode={widgetCode}
              onChange={setWidgetSettings}
              onSave={handleSaveWidget}
              onCopy={handleCopyWidget}
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
              data={paymentSettings}
              onViewDashboard={() =>
                window.open("https://app.lemonsqueezy.com/dashboard", "_blank")
              }
              onDisconnect={handleDisconnectPayment}
              onConnect={() =>
                showNotification("info", "Redirecting to LemonSqueezy...")
              }
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
              data={notificationSettings}
              onChange={setNotificationSettings}
              onSave={handleSaveNotifications}
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
              data={accountSettings}
              onChangeEmail={() =>
                showNotification("info", "Opening email change form...")
              }
              onChangePassword={() =>
                showNotification("info", "Opening password change form...")
              }
              onUpgrade={() =>
                showNotification("info", "Redirecting to upgrade page...")
              }
              onDeleteAccount={handleDeleteAccount}
            />
          </SettingsSection>
        </div>
      </div>

      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      <WidgetPreviewModal
        isOpen={isWidgetPreviewOpen}
        onClose={() => setIsWidgetPreviewOpen(false)}
        newsletterName="The Daily Tech Brief"
        pricePerSlot={pricingSettings.pricePerSlot}
      />
    </DashboardLayout>
  );
}
