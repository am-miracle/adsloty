import { z } from "zod";

export const settingsSchema = z.object({
  pricing: z.object({
    pricePerSlot: z.string(),
    weeklySlots: z.string(),
    autoApproval: z.boolean(),
    minimumNotice: z.string(),
  }),

  widget: z.object({
    enabled: z.boolean(),
    widgetColor: z.string(),
    buttonText: z.string(),
  }),

  notifications: z.object({
    newBooking: z.boolean(),
    bookingApproaching: z.boolean(),
    paymentReceived: z.boolean(),
    payoutCompleted: z.boolean(),
    weeklySummary: z.boolean(),
    marketing: z.boolean(),
  }),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
