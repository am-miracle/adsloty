import { SponsorDashboardLayout } from "@/components/sponsor-dashboard/sponsor-dashboard-layout";

export default function SponsorDashboardPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SponsorDashboardLayout>{children}</SponsorDashboardLayout>;
}
