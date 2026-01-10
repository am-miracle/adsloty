"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import {
  CalendarGrid,
  CalendarSlot,
} from "@/components/schedule/calendar-grid";
import {
  TimelineView,
  TimelineBooking,
} from "@/components/schedule/timeline-view";
import { BlackoutModal } from "@/components/schedule/blackout-modal";
import {
  BookingPreviewPanel,
  BookingDetails,
} from "@/components/schedule/booking-preview-panel";
import { Notification, NotificationType } from "@/components/ui/notification";
import {
  Calendar,
  List,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

type ViewMode = "calendar" | "timeline";

function ScheduleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isBlackoutModalOpen, setIsBlackoutModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(
    null,
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "success" as NotificationType,
    message: "",
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [calendarSlots, setCalendarSlots] = useState<CalendarSlot[]>([
    {
      date: new Date(2025, 0, 13),
      status: "booked",
      booking: { id: "booking-1", company: "TechFlow", amount: 250 },
    },
    {
      date: new Date(2025, 0, 20),
      status: "pending",
      booking: { id: "booking-2", company: "CloudHost", amount: 250 },
    },
    {
      date: new Date(2025, 0, 27),
      status: "booked",
      booking: { id: "booking-3", company: "DesignKit", amount: 250 },
    },
    {
      date: new Date(2025, 1, 3),
      status: "available",
    },
    {
      date: new Date(2025, 1, 10),
      status: "booked",
      booking: { id: "booking-4", company: "DevTools", amount: 250 },
    },
    {
      date: new Date(2025, 1, 17),
      status: "pending",
      booking: { id: "booking-5", company: "MarketAI", amount: 250 },
    },
    {
      date: new Date(2025, 1, 24),
      status: "blackout",
    },
  ]);

  const [timelineBookings] = useState<TimelineBooking[]>([
    {
      id: "booking-1",
      date: new Date(2025, 0, 13),
      company: "TechFlow Analytics",
      amount: 250,
      status: "booked",
      fitScore: 94,
    },
    {
      id: "booking-2",
      date: new Date(2025, 0, 20),
      company: "CloudHost Pro",
      amount: 250,
      status: "pending",
      fitScore: 88,
    },
    {
      id: "booking-3",
      date: new Date(2025, 0, 27),
      company: "DesignKit Studio",
      amount: 250,
      status: "booked",
      fitScore: 91,
    },
  ]);

  const bookingsData: BookingDetails[] = [
    {
      id: "booking-1",
      date: new Date(2025, 0, 13),
      company: "TechFlow Analytics",
      contactEmail: "sarah@techflow.io",
      amount: 250.0,
      fee: 12.5,
      status: "booked",
      fitScore: 94,
      adCopy:
        "Transform your data into insights with TechFlow Analytics. Get 30% off your first 3 months.",
      imageUrl:
        "https://via.placeholder.com/800x200/5b13ec/ffffff?text=TechFlow+Analytics",
      clickUrl: "https://techflow.io/special-offer",
      altText: "Advanced analytics for modern teams - 30% off",
      bookedOn: "January 8, 2025 at 2:30 PM",
    },
    {
      id: "booking-2",
      date: new Date(2025, 0, 20),
      company: "CloudHost Pro",
      contactEmail: "john@cloudhost.com",
      amount: 250.0,
      fee: 12.5,
      status: "pending",
      fitScore: 88,
      adCopy:
        "Deploy your apps in seconds with CloudHost Pro. 99.9% uptime guaranteed.",
      imageUrl:
        "https://via.placeholder.com/800x200/22c55e/ffffff?text=CloudHost+Pro",
      clickUrl: "https://cloudhost.com/promo",
      altText: "Lightning-fast cloud hosting for developers",
      bookedOn: "January 9, 2025 at 10:15 AM",
    },
    {
      id: "booking-3",
      date: new Date(2025, 0, 27),
      company: "DesignKit Studio",
      contactEmail: "emily@designkit.co",
      amount: 250.0,
      fee: 12.5,
      status: "booked",
      fitScore: 91,
      adCopy:
        "1000+ premium design assets ready to use. Built for modern designers.",
      imageUrl:
        "https://via.placeholder.com/800x200/f59e0b/ffffff?text=DesignKit+Studio",
      clickUrl: "https://designkit.co/launch",
      altText: "Professional design assets for your next project",
      bookedOn: "January 10, 2025 at 4:45 PM",
    },
    {
      id: "booking-4",
      date: new Date(2025, 1, 10),
      company: "DevTools Plus",
      contactEmail: "mike@devtools.dev",
      amount: 250.0,
      fee: 12.5,
      status: "booked",
      fitScore: 87,
      adCopy:
        "Supercharge your development workflow with DevTools Plus. Built for modern developers.",
      imageUrl:
        "https://via.placeholder.com/800x200/ef4444/ffffff?text=DevTools+Plus",
      clickUrl: "https://devtools.dev/offer",
      altText: "Professional development tools for teams",
      bookedOn: "February 5, 2025 at 3:20 PM",
    },
    {
      id: "booking-5",
      date: new Date(2025, 1, 17),
      company: "MarketGrowth AI",
      contactEmail: "alex@marketgrowth.ai",
      amount: 250.0,
      fee: 12.5,
      status: "pending",
      fitScore: 89,
      adCopy:
        "Automate your marketing campaigns with AI. See 3x ROI in 30 days with MarketGrowth AI.",
      imageUrl:
        "https://via.placeholder.com/800x200/8b5cf6/ffffff?text=MarketGrowth+AI",
      clickUrl: "https://marketgrowth.ai/demo",
      altText: "AI-powered marketing automation platform",
      bookedOn: "February 12, 2025 at 11:45 AM",
    },
  ];

  const stats = {
    totalBookings: calendarSlots.filter((s) => s.status === "booked").length,
    pendingBookings: calendarSlots.filter((s) => s.status === "pending").length,
    availableSlots: calendarSlots.filter((s) => s.status === "available")
      .length,
    blackoutDays: calendarSlots.filter((s) => s.status === "blackout").length,
  };

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
    }

    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.2,
        },
      );
    }

    const action = searchParams.get("action");
    if (action === "blackout") {
      const timer = setTimeout(() => {
        setIsBlackoutModalOpen(true);
        setSelectedDate(new Date());
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const slot = calendarSlots.find(
      (s) =>
        s.date.getFullYear() === date.getFullYear() &&
        s.date.getMonth() === date.getMonth() &&
        s.date.getDate() === date.getDate(),
    );

    if (slot?.booking) {
      const bookingDetails = bookingsData.find(
        (b) => b.id === slot.booking?.id,
      );
      if (bookingDetails) {
        setSelectedBooking(bookingDetails);
        setIsPreviewOpen(true);
      }
    } else if (slot?.status === "blackout") {
      showNotification(
        "info",
        "This date is marked as unavailable. Click to remove blackout.",
      );
    } else if (slot?.status === "available") {
      showNotification(
        "info",
        "This slot is available for bookings. Sponsors can book ads for this date.",
      );
    }
  };

  const handleAddBlackout = (date: Date) => {
    setSelectedDate(date);
    setIsBlackoutModalOpen(true);
  };

  const handleConfirmBlackout = (date: Date, reason: string) => {
    setCalendarSlots((prev) => [
      ...prev.filter(
        (s) =>
          !(
            s.date.getFullYear() === date.getFullYear() &&
            s.date.getMonth() === date.getMonth() &&
            s.date.getDate() === date.getDate()
          ),
      ),
      { date, status: "blackout" },
    ]);

    showNotification(
      "success",
      `Blackout date added for ${date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })}`,
    );
  };

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/requests?booking=${id}`);
  };

  const handleApproveBooking = (id: string) => {
    setCalendarSlots((prev) =>
      prev.map((slot) =>
        slot.booking?.id === id ? { ...slot, status: "booked" as const } : slot,
      ),
    );
    showNotification("success", "Booking approved successfully!");
  };

  const handleRejectBooking = (id: string) => {
    setCalendarSlots((prev) => prev.filter((slot) => slot.booking?.id !== id));
    showNotification("info", "Booking rejected. Sponsor will be refunded.");
  };

  const handleViewFullDetails = (id: string) => {
    setIsPreviewOpen(false);
    router.push(`/dashboard/requests?booking=${id}`);
  };

  return (
    <>
      <div className="space-y-6">
        <div ref={headerRef}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Content <span className="gradient-text">Schedule</span>
              </h1>
              <p className="text-text-secondary">
                Manage your newsletter publishing calendar and blackout dates
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  viewMode === "calendar"
                    ? "bg-primary text-white"
                    : "bg-surface-dark text-text-secondary hover:text-white"
                }`}
              >
                <Calendar className="w-4 h-4" />
                Calendar
              </button>
              <button
                onClick={() => setViewMode("timeline")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  viewMode === "timeline"
                    ? "bg-primary text-white"
                    : "bg-surface-dark text-text-secondary hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
                Timeline
              </button>
            </div>
          </div>

          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            <div className="glass-strong rounded-xl p-4 border border-primary/30 bg-primary/5">
              <div className="mb-2">
                <span className="text-text-secondary text-sm">Booked</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {stats.totalBookings}
              </div>
            </div>

            <div className="glass-strong rounded-xl p-4 border border-yellow-500/30 bg-yellow-500/5">
              <div className="mb-2">
                <span className="text-text-secondary text-sm">Pending</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {stats.pendingBookings}
              </div>
            </div>

            <div className="glass-strong rounded-xl p-4 border border-green-500/30 bg-green-500/5">
              <div className="mb-2">
                <span className="text-text-secondary text-sm">Available</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {stats.availableSlots}
              </div>
            </div>

            <div className="glass-strong rounded-xl p-4 border border-red-500/30 bg-red-500/5">
              <div className="mb-2">
                <span className="text-text-secondary text-sm">Blackout</span>
              </div>
              <div className="text-2xl font-bold text-red-400">
                {stats.blackoutDays}
              </div>
            </div>
          </div>
        </div>

        {viewMode === "calendar" ? (
          <div className="space-y-6">
            <CalendarGrid
              slots={calendarSlots}
              onDateClick={handleDateClick}
              onAddBlackout={handleAddBlackout}
              selectedDate={selectedDate}
            />
          </div>
        ) : (
          <TimelineView
            bookings={timelineBookings}
            onViewDetails={handleViewDetails}
          />
        )}
      </div>

      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      <BlackoutModal
        isOpen={isBlackoutModalOpen}
        selectedDate={selectedDate}
        onClose={() => setIsBlackoutModalOpen(false)}
        onConfirm={handleConfirmBlackout}
      />

      <BookingPreviewPanel
        booking={selectedBooking}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedBooking(null);
        }}
        onApprove={handleApproveBooking}
        onReject={handleRejectBooking}
        onViewFull={handleViewFullDetails}
      />
    </>
  );
}

export default function SchedulePage() {
  return (
    <Suspense
      fallback={
        <>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-secondary">Loading schedule...</p>
            </div>
          </div>
        </>
      }
    >
      <ScheduleContent />
    </Suspense>
  );
}
