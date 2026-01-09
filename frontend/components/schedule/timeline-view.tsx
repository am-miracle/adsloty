"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TimelineBooking {
  id: string;
  date: Date;
  company: string;
  amount: number;
  status: "booked" | "pending";
  fitScore?: number;
}

interface TimelineViewProps {
  bookings: TimelineBooking[];
  onViewDetails: (id: string) => void;
}

export function TimelineView({ bookings, onViewDetails }: TimelineViewProps) {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    itemsRef.current.forEach((item, index) => {
      if (item) {
        gsap.fromTo(
          item,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            delay: index * 0.1,
            ease: "power3.out",
          },
        );
      }
    });
  }, [bookings]);

  const groupedBookings = bookings.reduce(
    (acc, booking) => {
      const monthYear = `${booking.date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })}`;
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(booking);
      return acc;
    },
    {} as Record<string, TimelineBooking[]>,
  );

  const getFitScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="glass-strong rounded-2xl border border-border p-6">
      <h2 className="text-2xl font-bold mb-6">Booking Timeline</h2>

      {Object.keys(groupedBookings).length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No bookings scheduled yet</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedBookings).map(([monthYear, monthBookings]) => (
            <div key={monthYear}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-border" />
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                  {monthYear}
                </h3>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="relative pl-8 space-y-4">
                <div className="absolute left-2.75 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-primary/50 to-transparent" />

                {monthBookings.map((booking) => (
                  <div
                    key={booking.id}
                    ref={(el) => {
                      itemsRef.current.push(el);
                    }}
                    className="relative"
                  >
                    <div className="absolute left-8 top-3 w-6 h-6 rounded-full bg-primary border-4 border-surface-dark" />

                    <div
                      className={`glass rounded-xl p-4 border transition-all hover:border-primary/50 cursor-pointer group ${
                        booking.status === "pending"
                          ? "border-yellow-500/30"
                          : "border-border"
                      }`}
                      onClick={() => onViewDetails(booking.id)}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                            {booking.company}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-text-secondary mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {booking.date.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === "booked"
                              ? "bg-primary/20 text-primary"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {booking.status === "booked"
                            ? "Confirmed"
                            : "Pending"}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="font-semibold">
                            ${booking.amount.toFixed(2)}
                          </span>
                        </div>

                        {booking.fitScore && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span
                              className={`font-semibold ${getFitScoreColor(
                                booking.fitScore,
                              )}`}
                            >
                              {booking.fitScore}% Fit
                            </span>
                          </div>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(booking.id);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
