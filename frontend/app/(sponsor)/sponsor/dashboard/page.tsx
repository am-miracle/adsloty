// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   CampaignCard,
//   CampaignData,
// } from "@/components/sponsor-dashboard/campaign-card";
// import { Button } from "@/components/ui/button";
// import gsap from "gsap";
// import Link from "next/link";

// export default function SponsorDashboardPage() {
//   const router = useRouter();
//   const statsCardsRef = useRef<(HTMLDivElement | null)[]>([]);

//   const [campaigns] = useState<CampaignData[]>([
//     {
//       id: "1",
//       newsletterName: "Tech Weekly",
//       status: "active",
//       publishDate: "Oct 24, 2023",
//       subscribers: 15000,
//       estimatedReach: "~600-750 clicks",
//       amount: 250,
//       adCopy:
//         "Discover the best AI-powered productivity tools to supercharge your workflow. Limited time 50% off for new users!",
//     },
//     {
//       id: "2",
//       newsletterName: "Startup Digest",
//       status: "scheduled",
//       publishDate: "Nov 5, 2023",
//       subscribers: 22000,
//       estimatedReach: "~880-1100 clicks",
//       amount: 350,
//       adCopy:
//         "Join 10,000+ entrepreneurs using our platform to scale faster. Free trial available.",
//     },
//     {
//       id: "3",
//       newsletterName: "Developer's Corner",
//       status: "draft",
//       publishDate: "Nov 12, 2023",
//       subscribers: 8500,
//       estimatedReach: "~340-425 clicks",
//       amount: 180,
//       adCopy: "",
//     },
//   ]);

//   useEffect(() => {
//     const cards = statsCardsRef.current.filter((card) => card !== null);
//     cards.forEach((card, index) => {
//       if (card) {
//         gsap.fromTo(
//           card,
//           { opacity: 0, y: 20 },
//           {
//             opacity: 1,
//             y: 0,
//             duration: 0.6,
//             delay: index * 0.1,
//             ease: "power3.out",
//           },
//         );
//       }
//     });
//   }, []);

//   const handleViewCampaign = (id: string) => {
//     router.push(`/sponsor/campaigns/${id}`);
//   };

//   const handleEditCampaign = (id: string) => {
//     router.push(`/sponsor/campaigns/${id}/edit`);
//   };

//   const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
//   const totalSpent = campaigns.reduce((sum, c) => sum + c.amount, 0);
//   const avgClickRate = 3.8;

//   return (
//     <>
//       <div className="space-y-8">
//         <div>
//           <h1 className="text-3xl font-bold mb-2">
//             Sponsor <span className="gradient-text">Dashboard</span>
//           </h1>
//           <p className="text-text-secondary">
//             Manage your advertising campaigns and track performance
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div
//             ref={(el) => {
//               statsCardsRef.current[0] = el;
//             }}
//             className="glass-strong rounded-2xl p-6 border border-border hover:border-primary/50 transition-all"
//           >
//             <div className="mb-3">
//               <div className="text-text-secondary text-sm">
//                 Active Campaigns
//               </div>
//             </div>
//             <div className="text-3xl font-bold mb-1">{activeCampaigns}</div>
//             <div className="text-sm text-green-400">+2 this month</div>
//           </div>

//           <div
//             ref={(el) => {
//               statsCardsRef.current[1] = el;
//             }}
//             className="glass-strong rounded-2xl p-6 border border-border hover:border-primary/50 transition-all"
//           >
//             <div className="mb-3">
//               <div className="text-text-secondary text-sm">Total Spent</div>
//             </div>
//             <div className="text-3xl font-bold mb-1">
//               ${totalSpent.toLocaleString()}
//             </div>
//             <div className="text-sm text-text-secondary">
//               Across {campaigns.length} campaigns
//             </div>
//           </div>

//           <div
//             ref={(el) => {
//               statsCardsRef.current[2] = el;
//             }}
//             className="glass-strong rounded-2xl p-6 border border-border hover:border-primary/50 transition-all"
//           >
//             <div className="mb-3">
//               <div className="text-text-secondary text-sm">Avg Click Rate</div>
//             </div>
//             <div className="text-3xl font-bold mb-1">{avgClickRate}%</div>
//             <div className="text-sm text-green-400">+0.5% vs industry avg</div>
//           </div>

//           <div
//             ref={(el) => {
//               statsCardsRef.current[3] = el;
//             }}
//             className="glass-strong rounded-2xl p-6 border border-border hover:border-primary/50 transition-all"
//           >
//             <div className="mb-3">
//               <div className="text-text-secondary text-sm">Scheduled</div>
//             </div>
//             <div className="text-3xl font-bold mb-1">
//               {campaigns.filter((c) => c.status === "scheduled").length}
//             </div>
//             <div className="text-sm text-text-secondary">
//               Upcoming campaigns
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-bold">Your Campaigns</h2>
//           <Button>
//             <Link href={"/newsletters"}>Browse Newsletters</Link>
//           </Button>
//         </div>

//         {campaigns.length > 0 ? (
//           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//             {campaigns.map((campaign) => (
//               <CampaignCard
//                 key={campaign.id}
//                 campaign={campaign}
//                 onView={handleViewCampaign}
//                 onEdit={handleEditCampaign}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="glass-strong rounded-2xl p-12 border border-border text-center">
//             <div className="max-w-md mx-auto">
//               <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
//               <p className="text-text-secondary mb-6">
//                 Start advertising by browsing newsletters and booking your first
//                 campaign
//               </p>
//               <Button onClick={() => router.push("/newsletters")}>
//                 Browse Newsletters
//               </Button>
//             </div>
//           </div>
//         )}

//         <div className="glass-strong rounded-2xl p-6 border border-border">
//           <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Button
//               variant="outline"
//               className="justify-start"
//               onClick={() => router.push("/newsletters")}
//             >
//               Browse Newsletters
//             </Button>
//             <Button
//               variant="outline"
//               className="justify-start"
//               onClick={() => router.push("/sponsor/campaigns")}
//             >
//               View All Campaigns
//             </Button>
//             <Button
//               variant="outline"
//               className="justify-start"
//               onClick={() => router.push("/sponsor/billing")}
//             >
//               Manage Billing
//             </Button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { StatCard } from "@/components/sponsor-dashboard/stat-card";
import {
  CampaignCard,
  CampaignData,
} from "@/components/sponsor-dashboard/campaign-card";
import {
  NewsletterCard,
  NewsletterData,
} from "@/components/sponsor-dashboard/newsletter-card";
import { QuickActionsSponsor } from "@/components/sponsor-dashboard/quick-actions-sponsor";
import { Notification, NotificationType } from "@/components/ui/notification";
import { DataTable, Column } from "@/components/ui/data-table";
import Link from "next/link";

interface InvoiceRow {
  id: string;
  newsletter: string;
  date: string;
  amount: string;
  status: string;
}

interface NotificationState {
  show: boolean;
  type: NotificationType;
  message: string;
}

export default function SponsorDashboardPage() {
  const router = useRouter();
  const statsCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const campaignsRef = useRef<HTMLDivElement>(null);
  const newslettersRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: "success",
    message: "",
  });

  const [campaigns] = useState<CampaignData[]>([
    {
      id: "1",
      newsletterName: "Tech Crunch Weekly",
      status: "active",
      publishDate: "Jan 15, 2025",
      subscribers: 45000,
      estimatedReach: "18k-22k opens",
      amount: 350,
      adCopy:
        "Boost your SaaS growth with our AI-powered analytics platform. Get 30% off your first month!",
      imageUrl: "/placeholder-ad.jpg",
    },
    {
      id: "2",
      newsletterName: "Marketing Brew",
      status: "scheduled",
      publishDate: "Jan 20, 2025",
      subscribers: 32000,
      estimatedReach: "12k-15k opens",
      amount: 280,
      adCopy:
        "Transform your marketing with automated workflows. Join 10,000+ marketers today.",
    },
    {
      id: "3",
      newsletterName: "Indie Hackers Digest",
      status: "draft",
      publishDate: "Jan 25, 2025",
      subscribers: 28000,
      estimatedReach: "10k-13k opens",
      amount: 250,
      adCopy: "",
    },
  ]);

  const [featuredNewsletters] = useState<NewsletterData[]>([
    {
      id: "1",
      name: "Developer Weekly",
      description:
        "Curated news and insights for modern developers. Covering web development, DevOps, and software engineering best practices.",
      category: "Technology",
      subscribers: 52000,
      openRate: 48.5,
      clickRate: 4.2,
      pricePerSlot: 380,
      availableSlots: 3,
      nextAvailableDate: "Feb 1",
      featured: true,
    },
    {
      id: "2",
      name: "SaaS Growth Tips",
      description:
        "Weekly strategies and tactics to grow your SaaS business. From customer acquisition to retention.",
      category: "Business",
      subscribers: 38000,
      openRate: 52.3,
      clickRate: 5.1,
      pricePerSlot: 320,
      availableSlots: 2,
      nextAvailableDate: "Jan 28",
      featured: true,
    },
  ]);

  const [invoiceData] = useState<InvoiceRow[]>([
    {
      id: "INV-001",
      newsletter: "Tech Crunch Weekly",
      date: "Jan 8, 2025",
      amount: "$350.00",
      status: "paid",
    },
    {
      id: "INV-002",
      newsletter: "Marketing Brew",
      date: "Jan 5, 2025",
      amount: "$280.00",
      status: "paid",
    },
    {
      id: "INV-003",
      newsletter: "Startup Digest",
      date: "Dec 28, 2024",
      amount: "$250.00",
      status: "paid",
    },
    {
      id: "INV-004",
      newsletter: "Product Hunt Daily",
      date: "Dec 20, 2024",
      amount: "$400.00",
      status: "paid",
    },
    {
      id: "INV-005",
      newsletter: "Design Weekly",
      date: "Dec 15, 2024",
      amount: "$290.00",
      status: "paid",
    },
  ]);

  useEffect(() => {
    const cards = statsCardsRef.current.filter((card) => card !== null);
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
      );
    }

    if (quickActionsRef.current) {
      gsap.fromTo(
        quickActionsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out" },
      );
    }

    if (campaignsRef.current) {
      gsap.fromTo(
        campaignsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power3.out" },
      );
    }

    if (newslettersRef.current) {
      gsap.fromTo(
        newslettersRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power3.out" },
      );
    }

    if (tableRef.current) {
      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: "power3.out" },
      );
    }
  }, []);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message });
  };

  const handleViewCampaign = (id: string) => {
    showNotification("info", "Loading campaign details...");
    setTimeout(() => {
      router.push(`/sponsor/campaigns/${id}`);
    }, 800);
  };

  const handleEditCampaign = (id: string) => {
    showNotification("info", "Opening campaign editor...");
    setTimeout(() => {
      router.push(`/sponsor/campaigns/${id}/edit`);
    }, 800);
  };

  const handleBookSlot = (id: string) => {
    showNotification("info", "Opening booking form...");
    setTimeout(() => {
      router.push(`/sponsor/book/${id}`);
    }, 800);
  };

  const handleViewNewsletterDetails = (id: string) => {
    showNotification("info", "Loading newsletter details...");
    setTimeout(() => {
      router.push(`/newsletters/${id}`);
    }, 800);
  };

  const handleViewCampaigns = () => {
    router.push("/sponsor/campaigns");
  };

  const handleViewBilling = () => {
    router.push("/sponsor/billing");
  };

  const handleViewAnalytics = () => {
    showNotification("info", "Analytics coming soon!");
  };

  const invoiceColumns: Column<InvoiceRow>[] = [
    {
      key: "id",
      header: "Invoice ID",
      render: (value) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      key: "newsletter",
      header: "Newsletter",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "date",
      header: "Date",
      render: (value) => <span className="text-text-secondary">{value}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => {
        const statusConfig: Record<string, { label: string; color: string }> = {
          paid: { label: "Paid", color: "bg-green-500/10 text-green-400" },
          pending: {
            label: "Pending",
            color: "bg-yellow-500/10 text-yellow-400",
          },
          failed: { label: "Failed", color: "bg-red-500/10 text-red-400" },
        };

        const config = statusConfig[value] || statusConfig.pending;

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${config.color}`}
          >
            <span className="size-1.5 rounded-full bg-current"></span>
            {config.label}
          </span>
        );
      },
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (value) => <span className="font-medium">{value}</span>,
    },
  ];

  const activeCampaignsCount = campaigns.filter(
    (c) => c.status === "active" || c.status === "scheduled",
  ).length;
  const totalSpent = invoiceData.reduce((sum, inv) => {
    const amount = parseFloat(inv.amount.replace("$", "").replace(",", ""));
    return sum + amount;
  }, 0);

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">Acme Inc.</span>
          </h1>
          <p className="text-text-secondary">
            Manage your advertising campaigns and discover new opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            ref={(el) => {
              statsCardsRef.current[0] = el;
            }}
          >
            <StatCard
              title="Active Campaigns"
              value={activeCampaignsCount}
              subtitle={`${campaigns.length} total campaigns`}
            />
          </div>

          <div
            ref={(el) => {
              statsCardsRef.current[1] = el;
            }}
          >
            <StatCard
              title="Total Spent"
              value={`$${totalSpent.toLocaleString()}`}
              trend={{ value: "+18% this month", isPositive: true }}
            />
          </div>

          <div
            ref={(el) => {
              statsCardsRef.current[2] = el;
            }}
          >
            <StatCard
              title="Total Reach"
              value="185k"
              subtitle="Across all campaigns"
            />
          </div>

          <div
            ref={(el) => {
              statsCardsRef.current[3] = el;
            }}
          >
            <StatCard
              title="Avg. Click Rate"
              value="4.2%"
              trend={{ value: "+0.8% vs last month", isPositive: true }}
            />
          </div>
        </div>

        <div ref={quickActionsRef}>
          <QuickActionsSponsor
            onViewCampaigns={handleViewCampaigns}
            onViewBilling={handleViewBilling}
            onViewAnalytics={handleViewAnalytics}
          />
        </div>

        <div ref={campaignsRef}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Active Campaigns</h3>
            <button
              onClick={handleViewCampaigns}
              className="text-primary text-sm font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {campaigns.slice(0, 3).map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onView={handleViewCampaign}
                onEdit={handleEditCampaign}
              />
            ))}
          </div>
        </div>

        <div ref={newslettersRef}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Featured Newsletters</h3>
            <Link
              href="/newsletters"
              className="text-primary text-sm font-semibold hover:underline"
            >
              Browse All
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredNewsletters.map((newsletter) => (
              <NewsletterCard
                key={newsletter.id}
                newsletter={newsletter}
                onBookSlot={handleBookSlot}
                onViewDetails={handleViewNewsletterDetails}
              />
            ))}
          </div>
        </div>

        <div ref={tableRef}>
          <h3 className="text-xl font-bold mb-4">Recent Invoices</h3>
          <DataTable
            data={invoiceData}
            columns={invoiceColumns}
            searchable={true}
            searchPlaceholder="Search invoices..."
            itemsPerPage={5}
          />
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
