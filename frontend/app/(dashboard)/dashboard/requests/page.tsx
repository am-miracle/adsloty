"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import {
  ReviewBookingModal,
  BookingData,
} from "@/components/dashboard/review-booking-modal";
import { Notification, NotificationType } from "@/components/ui/notification";
import {
  Calendar,
  Grid3x3,
  List,
  Search,
  Filter,
  Download,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type ViewMode = "list" | "grid" | "calendar";
type FilterStatus = "all" | "pending" | "approved" | "published" | "rejected";

interface BookingWithStatus extends BookingData {
  status: "pending" | "approved" | "published" | "rejected";
  adCopy?: string;
  fitScore?: number;
}

export default function BookingsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "success" as NotificationType,
    message: "",
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [bookings, setBookings] = useState<BookingWithStatus[]>([
    {
      id: "booking-1",
      company: "TechFlow Analytics",
      contactEmail: "sarah@techflow.io",
      weekStarting: "Monday, January 13, 2025",
      amount: 250.0,
      fee: 12.5,
      imageUrl:
        "https://via.placeholder.com/800x200/5b13ec/ffffff?text=TechFlow+Analytics",
      clickUrl: "https://techflow.io/special-offer",
      altText: "Advanced analytics for modern teams - 30% off",
      bookedOn: "January 8, 2025 at 2:30 PM",
      status: "pending",
      adCopy:
        "Transform your data into insights with TechFlow Analytics. Get 30% off your first 3 months.",
      fitScore: 94,
    },
    {
      id: "booking-2",
      company: "CloudHost Pro",
      contactEmail: "john@cloudhost.com",
      weekStarting: "Monday, January 20, 2025",
      amount: 250.0,
      fee: 12.5,
      imageUrl:
        "https://via.placeholder.com/800x200/22c55e/ffffff?text=CloudHost+Pro",
      clickUrl: "https://cloudhost.com/promo",
      altText: "Lightning-fast cloud hosting for developers",
      bookedOn: "January 9, 2025 at 10:15 AM",
      status: "approved",
      adCopy:
        "Deploy your apps in seconds with CloudHost Pro. 99.9% uptime guaranteed.",
      fitScore: 88,
    },
    {
      id: "booking-3",
      company: "DesignKit Studio",
      contactEmail: "emily@designkit.co",
      weekStarting: "Monday, January 27, 2025",
      amount: 250.0,
      fee: 12.5,
      imageUrl:
        "https://via.placeholder.com/800x200/f59e0b/ffffff?text=DesignKit+Studio",
      clickUrl: "https://designkit.co/launch",
      altText: "Professional design assets for your next project",
      bookedOn: "January 10, 2025 at 4:45 PM",
      status: "published",
      adCopy:
        "1000+ premium design assets ready to use. Built for modern designers.",
      fitScore: 91,
    },
    {
      id: "booking-4",
      company: "DevTools Plus",
      contactEmail: "mike@devtools.dev",
      weekStarting: "Monday, February 3, 2025",
      amount: 250.0,
      fee: 12.5,
      imageUrl:
        "https://via.placeholder.com/800x200/ef4444/ffffff?text=DevTools+Plus",
      clickUrl: "https://devtools.dev/offer",
      altText: "Supercharge your development workflow",
      bookedOn: "January 11, 2025 at 9:20 AM",
      status: "rejected",
      adCopy: "The ultimate toolkit for developers. Try it free for 14 days!",
      fitScore: 76,
    },
    {
      id: "booking-5",
      company: "MarketGrowth AI",
      contactEmail: "alex@marketgrowth.ai",
      weekStarting: "Monday, February 10, 2025",
      amount: 250.0,
      fee: 12.5,
      imageUrl:
        "https://via.placeholder.com/800x200/8b5cf6/ffffff?text=MarketGrowth+AI",
      clickUrl: "https://marketgrowth.ai/demo",
      altText: "AI-powered marketing automation",
      bookedOn: "January 12, 2025 at 1:30 PM",
      status: "pending",
      adCopy:
        "Automate your marketing campaigns with AI. See 3x ROI in 30 days.",
      fitScore: 89,
    },
    {
      id: "booking-6",
      company: "SecureVault",
      contactEmail: "lisa@securevault.com",
      weekStarting: "Monday, February 17, 2025",
      amount: 250.0,
      fee: 12.5,
      imageUrl:
        "https://via.placeholder.com/800x200/06b6d4/ffffff?text=SecureVault",
      clickUrl: "https://securevault.com/enterprise",
      altText: "Enterprise-grade password management",
      bookedOn: "January 13, 2025 at 11:00 AM",
      status: "approved",
      adCopy:
        "Keep your team secure with enterprise password management. 50% off annual plans.",
      fitScore: 92,
    },
  ]);

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    approved: bookings.filter((b) => b.status === "approved").length,
    published: bookings.filter((b) => b.status === "published").length,
    totalRevenue: bookings
      .filter((b) => b.status === "published")
      .reduce((sum, b) => sum + b.amount, 0),
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;
    const matchesSearch =
      booking.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
  }, []);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30, rotateX: -15 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            delay: index * 0.05,
            ease: "power3.out",
          },
        );
      }
    });
  }, [filteredBookings, viewMode]);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message });
  };

  const handleReviewBooking = (booking: BookingWithStatus) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleApproveBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "approved" as const } : b,
      ),
    );
    showNotification("success", "Booking approved successfully!");
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleRejectBooking = (id: string, reason: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "rejected" as const } : b,
      ),
    );
    showNotification("info", `Booking rejected. Sponsor will be refunded.`);
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleExportData = () => {
    showNotification("info", "Exporting bookings data...");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "published":
        return <TrendingUp className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "approved":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "published":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getFitScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <>
      <div className="space-y-6">
        <div ref={headerRef} className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Ad Requests & <span className="gradient-text">Bookings</span>
              </h1>
              <p className="text-text-secondary">
                Manage all your advertising campaigns in one place
              </p>
            </div>
            <Button
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>

          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="glass-strong rounded-xl p-4 border border-border">
              <div className="text-text-secondary text-xs mb-1">
                Total Bookings
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="glass-strong rounded-xl p-4 border border-yellow-500/30 bg-yellow-500/5">
              <div className="text-text-secondary text-xs mb-1">Pending</div>
              <div className="text-2xl font-bold text-yellow-400">
                {stats.pending}
              </div>
            </div>
            <div className="glass-strong rounded-xl p-4 border border-blue-500/30 bg-blue-500/5">
              <div className="text-text-secondary text-xs mb-1">Approved</div>
              <div className="text-2xl font-bold text-blue-400">
                {stats.approved}
              </div>
            </div>
            <div className="glass-strong rounded-xl p-4 border border-green-500/30 bg-green-500/5">
              <div className="text-text-secondary text-xs mb-1">Published</div>
              <div className="text-2xl font-bold text-green-400">
                {stats.published}
              </div>
            </div>
            <div className="glass-strong rounded-xl p-4 border border-primary/30 bg-primary/5">
              <div className="text-text-secondary text-xs mb-1">Revenue</div>
              <div className="text-2xl font-bold text-primary">
                ${stats.totalRevenue}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-2xl border border-border p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Search by company or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as FilterStatus)
                  }
                  className="pl-9 pr-4 py-2.5 bg-surface-dark border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-2 glass rounded-lg p-1 border border-border">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:text-white"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:text-white"
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "calendar"
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:text-white"
                  }`}
                  title="Calendar View"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-text-secondary text-sm">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-3">
              {filteredBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className="glass rounded-xl p-4 border border-border hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => handleReviewBooking(booking)}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                            {booking.company}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <Mail className="w-3.5 h-3.5" />
                            {booking.contactEmail}
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                            booking.status,
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          <span className="capitalize">{booking.status}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-text-secondary">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.weekStarting}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-text-secondary">
                          <span className="font-semibold text-white">
                            ${booking.amount.toFixed(2)}
                          </span>
                        </div>
                        {booking.fitScore && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                              <TrendingUp className="w-2.5 h-2.5 text-primary" />
                            </div>
                            <span
                              className={`font-bold text-sm ${getFitScoreColor(
                                booking.fitScore,
                              )}`}
                            >
                              {booking.fitScore}% Fit
                            </span>
                          </div>
                        )}
                      </div>

                      {booking.adCopy && (
                        <p className="mt-3 text-sm text-text-secondary line-clamp-2">
                          {booking.adCopy}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 md:min-w-30 md:items-stretch">
                      {booking.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveBooking(booking.id);
                            }}
                            className="flex-1 md:w-full"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReviewBooking(booking);
                            }}
                            className="flex-1 md:w-full"
                          >
                            Review
                          </Button>
                        </>
                      )}
                      {booking.status === "approved" && (
                        <div className="text-xs text-center text-blue-400 font-medium py-2">
                          Ready to publish
                        </div>
                      )}
                      {booking.status === "published" && (
                        <div className="text-xs text-center text-green-400 font-medium py-2">
                          Live in newsletter
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className="glass rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => handleReviewBooking(booking)}
                >
                  <div className="aspect-4/1 relative bg-surface-dark">
                    <Image
                      src={booking.imageUrl}
                      alt={booking.altText}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(
                        booking.status,
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                      {booking.company}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {booking.weekStarting}
                    </div>

                    {booking.adCopy && (
                      <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                        {booking.adCopy}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">${booking.amount}</span>
                      </div>
                      {booking.fitScore && (
                        <span
                          className={`text-sm font-bold ${getFitScoreColor(
                            booking.fitScore,
                          )}`}
                        >
                          {booking.fitScore}% Fit
                        </span>
                      )}
                    </div>

                    {booking.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveBooking(booking.id);
                          }}
                          className="flex-1"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReviewBooking(booking);
                          }}
                          className="flex-1"
                        >
                          Review
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-text-secondary">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>

              <div className="glass rounded-xl p-6 border border-border">
                <div className="space-y-3">
                  {filteredBookings.map((booking, index) => (
                    <div
                      key={booking.id}
                      ref={(el) => {
                        cardsRef.current[index] = el;
                      }}
                      className="flex items-center gap-4 p-3 bg-surface-dark rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer"
                      onClick={() => handleReviewBooking(booking)}
                    >
                      <div className="shrink-0">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex flex-col items-center justify-center">
                          <div className="text-xs text-text-secondary">
                            {new Date(booking.weekStarting).toLocaleDateString(
                              "en-US",
                              { month: "short" },
                            )}
                          </div>
                          <div className="text-lg font-bold">
                            {new Date(booking.weekStarting).getDate()}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold truncate">
                            {booking.company}
                          </h4>
                          <div
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              booking.status,
                            )}`}
                          >
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                        </div>
                        <div className="text-sm text-text-secondary truncate">
                          {booking.adCopy}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-lg font-bold">
                          ${booking.amount}
                        </div>
                        {booking.fitScore && (
                          <div
                            className={`text-xs font-medium ${getFitScoreColor(
                              booking.fitScore,
                            )}`}
                          >
                            {booking.fitScore}% Fit
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
