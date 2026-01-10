"use client";

import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Bell, Lock } from "lucide-react";

const notificationsSchema = z.object({
  campaignUpdates: z.boolean(),
  performanceReports: z.boolean(),
  billingAlerts: z.boolean(),
  newNewsletters: z.boolean(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type NotificationsFormValues = z.infer<typeof notificationsSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      campaignUpdates: true,
      performanceReports: true,
      billingAlerts: true,
      newNewsletters: false,
    },
  });

  const notifications = useWatch({
    control: notificationsForm.control,
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const isSubmittingPassword = passwordForm.formState.isSubmitting;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Account <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-text-secondary">
          Manage your account preferences and security settings
        </p>
      </div>

      <Form {...notificationsForm}>
        <form className="glass-strong rounded-2xl p-6 border border-border space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Email Notifications</h3>
          </div>

          <NotificationToggle
            form={notificationsForm}
            name="campaignUpdates"
            title="Campaign Updates"
            description="Get notified when your campaigns go live or complete"
          />

          <NotificationToggle
            form={notificationsForm}
            name="performanceReports"
            title="Performance Reports"
            description="Weekly summary of your campaign performance"
          />

          <NotificationToggle
            form={notificationsForm}
            name="billingAlerts"
            title="Billing Alerts"
            description="Important updates about payments and invoices"
          />

          <NotificationToggle
            form={notificationsForm}
            name="newNewsletters"
            title="New Newsletters"
            description="Be the first to know when new newsletters join"
          />

          <Button
            type="button"
            className="mt-4"
            onClick={notificationsForm.handleSubmit((data) =>
              console.log("Notifications saved:", data),
            )}
          >
            Save Preferences
          </Button>
        </form>
      </Form>

      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit((data) =>
            console.log("Password updated:", data),
          )}
          className="glass-strong rounded-2xl p-6 border border-border space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Lock className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold">Change Password</h3>
          </div>

          <FormField
            control={passwordForm.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Current password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={passwordForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="New password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={passwordForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmittingPassword}
            className="w-full"
          >
            {isSubmittingPassword ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Form>

      <div className="glass-strong rounded-2xl p-6 border border-red-500/30">
        <h3 className="text-lg font-semibold mb-4 text-red-400">Danger Zone</h3>

        <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10">
          <div>
            <div className="font-medium">Delete Account</div>
            <div className="text-sm text-text-secondary">
              Permanently delete your account and all data
            </div>
          </div>

          <Button
            variant="outline"
            className="text-red-400 border-red-400 hover:bg-red-500/10"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Helper Component                              */
/* -------------------------------------------------------------------------- */

function NotificationToggle({
  form,
  name,
  title,
  description,
}: {
  form: any;
  name: keyof NotificationsFormValues;
  title: string;
  description: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between p-4 rounded-lg bg-surface-border/30">
          <div>
            <FormLabel className="font-medium">{title}</FormLabel>
            <p className="text-sm text-text-secondary">{description}</p>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
