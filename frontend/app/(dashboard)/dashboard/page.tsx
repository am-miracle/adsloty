"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { DataTable, Column } from "@/components/ui/data-table";
import {
  AdRequestCard,
  AdRequestData,
} from "@/components/dashboard/ad-request-card";
import {
  AvailabilityCard,
  AvailabilitySlot,
} from "@/components/dashboard/availability-card";
import {
  NewsletterStatsCard,
  NewsletterStats,
} from "@/components/dashboard/newsletter-stats-card";
import { Notification, NotificationType } from "@/components/ui/notification";
import { QuickActions } from "@/components/dashboard/quick-actions";
import {
  ReviewBookingModal,
  BookingData,
} from "@/components/dashboard/review-booking-modal";
import {
  animateStatsCards,
  animateAdRequestCard,
  animateAvailabilitySlots,
  animateNumberCounter,
  animatePercentageCounter,
  animateFadeIn,
} from "@/lib/dashboard-animations";

interface ActivityRow {
  id: string;
  sponsor: string;
  sponsorInitial: string;
  sponsorColor: string;
  date: string;
  status: string;
  amount: string;
}

interface NotificationState {
  show: boolean;
  type: NotificationType;
  message: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const statsCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const adCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const availabilitySlotsRef = useRef<HTMLDivElement>(null);
  const statsCardRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const revenueRef = useRef<HTMLDivElement>(null);
  const subscribersRef = useRef<HTMLDivElement>(null);
  const openRateRef = useRef<HTMLDivElement>(null);

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: "success",
    message: "",
  });

  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingBalance] = useState(145.5);

  const [adRequests, setAdRequests] = useState<AdRequestData[]>([
    {
      id: "1",
      companyName: "GrowthMasters Inc.",
      requestedDate: "Oct 24, 2023",
      adCopy:
        "Stop wasting hours on manual SEO audits. GrowthMasters AI scans your site in seconds and delivers actionable insights to boost your ranking. Join 10,000+ marketers who've seen a 3x increase in organic traffic.",
      fitScore: 94,
      tone: "Professional, Urgent",
      clarity: "High",
      estimatedClicks: "~450-500",
      companyInitial: "G",
    },
    {
      id: "2",
      companyName: "LaunchPad Tools",
      requestedDate: "Oct 31, 2023",
      adCopy:
        "Get the best deals on software this Black Friday. We aggregate thousands of deals from 500+ SaaS companies. Never miss a discount again!",
      fitScore: 78,
      tone: "Casual, Promotional",
      clarity: "Medium",
      estimatedClicks: "~300-400",
      companyInitial: "L",
      bgColor: "bg-indigo-500/20 border-indigo-500/30",
    },
    {
      id: "3",
      companyName: "DataViz Pro",
      requestedDate: "Nov 5, 2023",
      adCopy:
        "Transform your data into beautiful, interactive dashboards in minutes. No coding required. Trusted by 50,000+ data professionals worldwide.",
      fitScore: 88,
      tone: "Professional, Benefits-focused",
      clarity: "High",
      estimatedClicks: "~380-450",
      companyInitial: "D",
      bgColor: "bg-purple-500/20 border-purple-500/30",
    },
  ]);

  const availabilitySlots: AvailabilitySlot[] = [
    { date: "Oct 17", label: "Today", status: "booked" },
    { date: "Oct 24", label: "Next Slot", status: "open" },
    { date: "Oct 31", label: "Later", status: "pending", requestCount: 2 },
    { date: "Nov 07", label: "Later", status: "empty" },
    { date: "Nov 14", label: "Later", status: "open" },
  ];

  const newsletterStats: NewsletterStats = {
    subscribers: 12450,
    openRate: 42.5,
    clickRate: 3.8,
    adPrice: 250,
  };

  const [activityData, setActivityData] = useState<ActivityRow[]>([
    {
      id: "1",
      sponsor: "DevTools Pro",
      sponsorInitial: "D",
      sponsorColor: "bg-purple-500/20 text-purple-400",
      date: "Oct 10, 2023",
      status: "published",
      amount: "$250.00",
    },
    {
      id: "2",
      sponsor: "SaaS Weekly",
      sponsorInitial: "S",
      sponsorColor: "bg-blue-500/20 text-blue-400",
      date: "Oct 03, 2023",
      status: "payout_sent",
      amount: "$250.00",
    },
    {
      id: "3",
      sponsor: "FinTech Daily",
      sponsorInitial: "F",
      sponsorColor: "bg-orange-500/20 text-orange-400",
      date: "Sep 26, 2023",
      status: "payout_sent",
      amount: "$250.00",
    },
    {
      id: "4",
      sponsor: "CloudHost Pro",
      sponsorInitial: "C",
      sponsorColor: "bg-green-500/20 text-green-400",
      date: "Sep 19, 2023",
      status: "published",
      amount: "$250.00",
    },
    {
      id: "5",
      sponsor: "MarketHub",
      sponsorInitial: "M",
      sponsorColor: "bg-pink-500/20 text-pink-400",
      date: "Sep 12, 2023",
      status: "payout_sent",
      amount: "$250.00",
    },
    {
      id: "6",
      sponsor: "TechReview",
      sponsorInitial: "T",
      sponsorColor: "bg-cyan-500/20 text-cyan-400",
      date: "Sep 05, 2023",
      status: "published",
      amount: "$250.00",
    },
    {
      id: "7",
      sponsor: "StartupNews",
      sponsorInitial: "S",
      sponsorColor: "bg-red-500/20 text-red-400",
      date: "Aug 29, 2023",
      status: "payout_sent",
      amount: "$250.00",
    },
    {
      id: "8",
      sponsor: "CodeMaster",
      sponsorInitial: "C",
      sponsorColor: "bg-yellow-500/20 text-yellow-400",
      date: "Aug 22, 2023",
      status: "published",
      amount: "$250.00",
    },
  ]);

  useEffect(() => {
    const cards = statsCardsRef.current.filter((card) => card !== null);
    if (cards.length > 0) {
      animateStatsCards(cards as HTMLElement[]);
    }

    adCardsRef.current.forEach((card, index) => {
      if (card) {
        animateAdRequestCard(card, index);
      }
    });

    if (availabilitySlotsRef.current) {
      const slots = availabilitySlotsRef.current.querySelectorAll(
        "[data-slot]",
      ) as NodeListOf<HTMLElement>;
      animateAvailabilitySlots(Array.from(slots));
    }

    if (statsCardRef.current) {
      animateFadeIn(statsCardRef.current, 0.3);
    }

    if (tableRef.current) {
      animateFadeIn(tableRef.current, 0.5);
    }

    if (revenueRef.current) {
      animateNumberCounter(revenueRef.current, 0, 12450, 2);
    }
    if (subscribersRef.current) {
      animateNumberCounter(subscribersRef.current, 0, 12450, 2);
    }
    if (openRateRef.current) {
      animatePercentageCounter(openRateRef.current, 0, 42.5, 2);
    }
  }, []);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message });
  };

  const handleApprove = (id: string) => {
    const request = adRequests.find((r) => r.id === id);
    if (request) {
      setAdRequests((prev) => prev.filter((r) => r.id !== id));

      const newActivity: ActivityRow = {
        id: Date.now().toString(),
        sponsor: request.companyName,
        sponsorInitial: request.companyInitial || request.companyName.charAt(0),
        sponsorColor: request.bgColor || "bg-gray-500/20 text-gray-400",
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        status: "published",
        amount: "$250.00",
      };
      setActivityData((prev) => [newActivity, ...prev]);

      showNotification(
        "success",
        `Successfully approved ad request from ${request.companyName}`,
      );
    }
  };

  const handleReject = (id: string, reason: string) => {
    const request = adRequests.find((r) => r.id === id);
    if (request) {
      setAdRequests((prev) => prev.filter((r) => r.id !== id));
      showNotification(
        "info",
        `Rejected ad request from ${request.companyName}. Reason: ${reason}`,
      );
    }
  };

  const handleMessage = (id: string) => {
    const request = adRequests.find((r) => r.id === id);
    if (request) {
      showNotification(
        "info",
        `Opening message thread with ${request.companyName}`,
      );
      setTimeout(() => {
        router.push(`/dashboard/messages/${id}`);
      }, 1000);
    }
  };

  const handleViewAnalytics = () => {
    showNotification("info", "Loading detailed analytics...");
    setTimeout(() => {
      router.push("/dashboard/analytics");
    }, 1000);
  };

  const handleViewBookings = () => {
    showNotification("info", "Loading all bookings...");
    setTimeout(() => {
      router.push("/dashboard/requests");
    }, 800);
  };

  const handleAddBlackoutDate = () => {
    showNotification("info", "Opening calendar...");
    setTimeout(() => {
      router.push("/dashboard/schedule?action=blackout");
    }, 800);
  };

  const handleGetWidgetCode = () => {
    showNotification("info", "Opening widget settings...");
    setTimeout(() => {
      router.push("/dashboard/settings?tab=widget");
    }, 800);
  };

  const handleRequestPayout = () => {
    showNotification("success", "Payout request submitted successfully!");
    setTimeout(() => {
      router.push("/dashboard/payouts?action=request");
    }, 800);
  };

  const mockBookings: BookingData[] = [
    {
      id: "booking-1",
      company: "Acme Marketing Tools",
      contactEmail: "john@acmemarketing.com",
      weekStarting: "Monday, January 13, 2025",
      amount: 50.0,
      fee: 2.5,
      imageUrl:
        "https://via.placeholder.com/800x200/5b13ec/ffffff?text=Acme+Marketing+Tools",
      clickUrl: "https://acmemarketing.com/promo",
      altText: "Try Acme Marketing Tools free for 30 days",
      bookedOn: "January 8, 2025 at 2:30 PM",
    },
  ];

  const handleReviewBooking = (bookingId: string) => {
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsModalOpen(true);
    }
  };

  const handleApproveBooking = (id: string) => {
    showNotification(
      "success",
      "✓ Ad approved! Download the image to add to your newsletter.",
    );
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleRejectBooking = (id: string, reason: string) => {
    showNotification(
      "info",
      "Ad rejected. Sponsor will be refunded within 5-7 days.",
    );
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const activityColumns: Column<ActivityRow>[] = [
    {
      key: "sponsor",
      header: "Sponsor",
      render: (value, row) => (
        <div className="flex items-center gap-3 font-medium">
          <div
            className={`size-6 rounded flex items-center justify-center text-xs ${row.sponsorColor}`}
          >
            {row.sponsorInitial}
          </div>
          {value}
        </div>
      ),
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
          published: {
            label: "Published",
            color: "bg-green-500/10 text-green-400",
          },
          payout_sent: {
            label: "Payout Sent",
            color: "bg-green-500/10 text-green-400",
          },
          pending: {
            label: "Pending",
            color: "bg-yellow-500/10 text-yellow-400",
          },
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

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">John</span>
          </h1>
          <p className="text-text-secondary">
            Here&apos;s what&apos;s happening with your newsletter today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            ref={(el) => {
              statsCardsRef.current[0] = el;
            }}
            className="glass-strong rounded-2xl p-6 border border-border hover:border-primary/50 transition-all cursor-pointer group"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                y: -4,
                duration: 0.3,
                ease: "power2.out",
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { y: 0, duration: 0.3 });
            }}
          >
            <div className="text-text-secondary text-sm mb-2">
              Total Revenue
            </div>
            <div ref={revenueRef} className="text-3xl font-bold mb-1">
              $12,450
            </div>
            <div className="text-sm text-green-400">+12% from last month</div>
          </div>

          <div
            ref={(el) => {
              statsCardsRef.current[1] = el;
            }}
            className="glass-strong rounded-2xl p-6 border border-border hover:border-primary/50 transition-all cursor-pointer"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                y: -4,
                duration: 0.3,
                ease: "power2.out",
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { y: 0, duration: 0.3 });
            }}
          >
            <div className="text-text-secondary text-sm mb-2">
              Active Campaigns
            </div>
            <div className="text-3xl font-bold mb-1">8</div>
            <div className="text-sm text-text-secondary">
              {adRequests.length} pending approval
            </div>
          </div>

          <div
            ref={(el) => {
              statsCardsRef.current[2] = el;
            }}
            className="glass-strong rounded-2xl p-6 border border-border hover:border-primary/50 transition-all cursor-pointer"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                y: -4,
                duration: 0.3,
                ease: "power2.out",
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { y: 0, duration: 0.3 });
            }}
          >
            <div className="text-text-secondary text-sm mb-2">
              Available Slots
            </div>
            <div className="text-3xl font-bold mb-1">4</div>
            <div className="text-sm text-text-secondary">Next 30 days</div>
          </div>

          <div
            ref={(el) => {
              statsCardsRef.current[3] = el;
            }}
            className="glass-strong rounded-2xl p-6 border border-border hover:border-primary/50 transition-all cursor-pointer"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                y: -4,
                duration: 0.3,
                ease: "power2.out",
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { y: 0, duration: 0.3 });
            }}
          >
            <div className="text-text-secondary text-sm mb-2">
              Pending Payouts
            </div>
            <div className="text-3xl font-bold mb-1">$2,340</div>
            <div className="text-sm text-primary">Ready to withdraw</div>
          </div>
        </div>

        {/*<QuickActions
          pendingBalance={pendingBalance}
          onViewBookings={handleViewBookings}
          onAddBlackoutDate={handleAddBlackoutDate}
          onGetWidgetCode={handleGetWidgetCode}
          onRequestPayout={handleRequestPayout}
        />*/}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                Pending Ad Requests
                <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-bold">
                  {adRequests.length} New
                </span>
              </h3>
              <Link
                href="/dashboard/requests"
                className="text-primary text-sm font-semibold hover:underline"
              >
                View All
              </Link>
            </div>

            {adRequests.length > 0 ? (
              adRequests.map((request, index) => (
                <div
                  key={request.id}
                  ref={(el) => {
                    adCardsRef.current[index] = el;
                  }}
                >
                  <AdRequestCard
                    request={request}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onMessage={handleMessage}
                  />
                </div>
              ))
            ) : (
              <div className="glass-strong rounded-2xl p-12 border border-border text-center">
                <p className="text-text-secondary">
                  No pending ad requests at the moment
                </p>
              </div>
            )}

            <div className="glass-strong rounded-2xl p-6 border border-border">
              <h4 className="text-lg font-semibold mb-4">
                Test Review Booking Modal
              </h4>
              <button
                onClick={() => handleReviewBooking("booking-1")}
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
              >
                Review Sample Booking
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div ref={availabilitySlotsRef}>
              <AvailabilityCard slots={availabilitySlots} />
            </div>
            <div ref={statsCardRef}>
              <NewsletterStatsCard
                stats={newsletterStats}
                onViewAnalytics={handleViewAnalytics}
              />
            </div>
          </div>
        </div>

        <div ref={tableRef} className="flex flex-col gap-4">
          <h3 className="text-xl font-bold">Recent Activity</h3>
          <DataTable
            data={activityData}
            columns={activityColumns}
            searchable={true}
            searchPlaceholder="Search sponsors..."
            filterable={true}
            filterOptions={[
              { label: "Published", value: "published" },
              { label: "Payout Sent", value: "payout_sent" },
              { label: "Pending", value: "pending" },
            ]}
            filterLabel="Filter by status"
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

      {selectedBooking && (
        <ReviewBookingModal
          booking={selectedBooking}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApprove={handleApproveBooking}
          onReject={handleRejectBooking}
        />
      )}
    </>
  );
}
