// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   CampaignCard,
//   CampaignData,
// } from "@/components/sponsor-dashboard/campaign-card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, Filter } from "lucide-react";

// export default function CampaignsPage() {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");

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
//     {
//       id: "4",
//       newsletterName: "Marketing Mastery",
//       status: "completed",
//       publishDate: "Oct 10, 2023",
//       subscribers: 18000,
//       estimatedReach: "~720-900 clicks",
//       amount: 300,
//       adCopy:
//         "Transform your marketing strategy with data-driven insights. Book a free consultation today!",
//     },
//     {
//       id: "5",
//       newsletterName: "SaaS Insights",
//       status: "completed",
//       publishDate: "Sep 28, 2023",
//       subscribers: 12000,
//       estimatedReach: "~480-600 clicks",
//       amount: 220,
//       adCopy:
//         "Scale your SaaS business faster with proven growth strategies. Join our masterclass.",
//     },
//   ]);

//   const filteredCampaigns = campaigns.filter((campaign) => {
//     const matchesSearch = campaign.newsletterName
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const matchesStatus =
//       statusFilter === "all" || campaign.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const handleViewCampaign = (id: string) => {
//     router.push(`/sponsor/campaigns/${id}`);
//   };

//   const handleEditCampaign = (id: string) => {
//     router.push(`/sponsor/campaigns/${id}/edit`);
//   };

//   return (
//     <>
//       <div className="space-y-8">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">
//               My <span className="gradient-text">Campaigns</span>
//             </h1>
//             <p className="text-text-secondary">
//               Manage and track all your advertising campaigns
//             </p>
//           </div>
//           <Button onClick={() => router.push("/newsletters")}>
//             Create New Campaign
//           </Button>
//         </div>

//         <div className="glass-strong rounded-2xl p-6 border border-border">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
//               <Input
//                 type="text"
//                 placeholder="Search campaigns..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-9"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <Filter className="w-4 h-4 text-text-secondary" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-4 py-2 rounded-lg bg-surface-border border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
//               >
//                 <option value="all">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="scheduled">Scheduled</option>
//                 <option value="draft">Draft</option>
//                 <option value="completed">Completed</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="glass-strong rounded-xl p-4 border border-border">
//             <div className="text-sm text-text-secondary mb-1">
//               Total Campaigns
//             </div>
//             <div className="text-2xl font-bold">{campaigns.length}</div>
//           </div>
//           <div className="glass-strong rounded-xl p-4 border border-border">
//             <div className="text-sm text-text-secondary mb-1">
//               Total Investment
//             </div>
//             <div className="text-2xl font-bold">
//               $
//               {campaigns.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
//             </div>
//           </div>
//         </div>

//         {filteredCampaigns.length > 0 ? (
//           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//             {filteredCampaigns.map((campaign) => (
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
//             <p className="text-text-secondary">
//               No campaigns found matching your filters
//             </p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  CampaignCard,
  CampaignData,
} from "@/components/sponsor-dashboard/campaign-card";
import { Notification, NotificationType } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface NotificationState {
  show: boolean;
  type: NotificationType;
  message: string;
}

export default function CampaignsPage() {
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: "success",
    message: "",
  });

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "scheduled" | "completed" | "draft"
  >("all");

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
    {
      id: "4",
      newsletterName: "Product Hunt Daily",
      status: "completed",
      publishDate: "Jan 8, 2025",
      subscribers: 58000,
      estimatedReach: "23k-28k opens",
      amount: 420,
      adCopy:
        "Launch your product to 50,000+ early adopters. Special launch pricing available now!",
    },
    {
      id: "5",
      newsletterName: "Startup Grind",
      status: "completed",
      publishDate: "Dec 30, 2024",
      subscribers: 35000,
      estimatedReach: "15k-18k opens",
      amount: 300,
      adCopy:
        "Scale your startup faster with our growth toolkit. Trusted by 1,000+ founders.",
    },
    {
      id: "6",
      newsletterName: "Developer Weekly",
      status: "active",
      publishDate: "Jan 17, 2025",
      subscribers: 52000,
      estimatedReach: "21k-25k opens",
      amount: 380,
      adCopy:
        "Build better apps with our developer tools. Free trial for the first 100 signups!",
    },
    {
      id: "7",
      newsletterName: "Design Insider",
      status: "scheduled",
      publishDate: "Jan 22, 2025",
      subscribers: 29000,
      estimatedReach: "12k-15k opens",
      amount: 270,
      adCopy:
        "Create stunning designs in minutes with our AI-powered design tool. No design skills required.",
    },
    {
      id: "8",
      newsletterName: "SaaS Growth Tips",
      status: "completed",
      publishDate: "Dec 22, 2024",
      subscribers: 38000,
      estimatedReach: "16k-20k opens",
      amount: 320,
      adCopy:
        "Grow your MRR by 3x with our proven playbook. Download the free guide today.",
    },
  ]);

  const filteredCampaigns =
    statusFilter === "all"
      ? campaigns
      : campaigns.filter((c) => c.status === statusFilter);

  const stats = {
    active: campaigns.filter((c) => c.status === "active").length,
    scheduled: campaigns.filter((c) => c.status === "scheduled").length,
    completed: campaigns.filter((c) => c.status === "completed").length,
    draft: campaigns.filter((c) => c.status === "draft").length,
  };

  useEffect(() => {
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
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

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(
        "[data-campaign-card]",
      ) as NodeListOf<HTMLElement>;

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
  }, [filteredCampaigns]);

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

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Campaigns</h1>
            <p className="text-text-secondary">
              Manage and track all your advertising campaigns
            </p>
          </div>
          <Button>
            <Link href={"/newsletters"} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Campaign
            </Link>
          </Button>
        </div>

        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setStatusFilter("all")}
            className={`glass-strong rounded-xl p-4 border transition-all text-left ${
              statusFilter === "all"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="text-text-secondary text-sm mb-1">Total</div>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </button>

          <button
            onClick={() => setStatusFilter("active")}
            className={`glass-strong rounded-xl p-4 border transition-all text-left ${
              statusFilter === "active"
                ? "border-green-500 bg-green-500/10"
                : "border-border hover:border-green-500/50"
            }`}
          >
            <div className="text-text-secondary text-sm mb-1">Active</div>
            <div className="text-2xl font-bold text-green-400">
              {stats.active}
            </div>
          </button>

          <button
            onClick={() => setStatusFilter("scheduled")}
            className={`glass-strong rounded-xl p-4 border transition-all text-left ${
              statusFilter === "scheduled"
                ? "border-blue-500 bg-blue-500/10"
                : "border-border hover:border-blue-500/50"
            }`}
          >
            <div className="text-text-secondary text-sm mb-1">Scheduled</div>
            <div className="text-2xl font-bold text-blue-400">
              {stats.scheduled}
            </div>
          </button>

          <button
            onClick={() => setStatusFilter("draft")}
            className={`glass-strong rounded-xl p-4 border transition-all text-left ${
              statusFilter === "draft"
                ? "border-yellow-500 bg-yellow-500/10"
                : "border-border hover:border-yellow-500/50"
            }`}
          >
            <div className="text-text-secondary text-sm mb-1">Drafts</div>
            <div className="text-2xl font-bold text-yellow-400">
              {stats.draft}
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-text-secondary">
            Showing{" "}
            <span className="font-semibold text-white">
              {filteredCampaigns.length}
            </span>{" "}
            campaign
            {filteredCampaigns.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} data-campaign-card>
              <CampaignCard
                campaign={campaign}
                onView={handleViewCampaign}
                onEdit={handleEditCampaign}
              />
            </div>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="glass-strong rounded-2xl p-12 border border-border text-center">
            <p className="text-text-secondary text-lg mb-2">
              No campaigns found
            </p>
            <p className="text-text-secondary text-sm mb-4">
              {statusFilter === "all"
                ? "Create your first campaign to get started"
                : `No ${statusFilter} campaigns at the moment`}
            </p>
            {statusFilter === "all" && (
              <Button className="mt-4">
                <Link href={"/newsletters"} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Campaign
                </Link>
              </Button>
            )}
          </div>
        )}
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
