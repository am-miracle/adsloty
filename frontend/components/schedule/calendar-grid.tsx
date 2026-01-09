"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CalendarSlot {
  date: Date;
  status: "available" | "booked" | "blackout" | "pending";
  booking?: {
    id: string;
    company: string;
    amount: number;
  };
}

interface CalendarGridProps {
  slots: CalendarSlot[];
  onDateClick: (date: Date) => void;
  onAddBlackout: (date: Date) => void;
  selectedDate: Date | null;
}

export function CalendarGrid({
  slots,
  onDateClick,
  onAddBlackout,
  selectedDate,
}: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<(HTMLDivElement | null)[]>([]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const getSlotForDate = (date: Date | null): CalendarSlot | undefined => {
    if (!date) return undefined;
    return slots.find(
      (slot) =>
        slot.date.getFullYear() === date.getFullYear() &&
        slot.date.getMonth() === date.getMonth() &&
        slot.date.getDate() === date.getDate(),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-primary/20 border-primary/50 text-primary";
      case "pending":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
      case "blackout":
        return "bg-red-500/20 border-red-500/50 text-red-400";
      case "available":
        return "bg-green-500/20 border-green-500/50 text-green-400";
      default:
        return "bg-surface-dark border-border text-text-secondary";
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }

    if (calendarRef.current) {
      gsap.to(calendarRef.current, {
        opacity: 0,
        x: direction === "prev" ? 20 : -20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setCurrentMonth(newMonth);
          gsap.fromTo(
            calendarRef.current,
            { opacity: 0, x: direction === "prev" ? -20 : 20 },
            { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
          );
        },
      });
    } else {
      setCurrentMonth(newMonth);
    }
  };

  useEffect(() => {
    cellsRef.current.forEach((cell, index) => {
      if (cell) {
        gsap.fromTo(
          cell,
          { opacity: 0, scale: 0.8, y: 10 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            delay: index * 0.01,
            ease: "back.out(1.7)",
          },
        );
      }
    });
  }, [currentMonth]);

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="glass-strong rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div ref={calendarRef} className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-text-secondary py-2"
          >
            {day}
          </div>
        ))}

        {days.map((date, index) => {
          const slot = getSlotForDate(date);
          const isPast =
            date && date < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <div
              key={index}
              ref={(el) => {
                cellsRef.current[index] = el;
              }}
              className={`
                aspect-square rounded-lg border-2 transition-all relative group
                ${
                  date
                    ? `cursor-pointer hover:scale-105 hover:shadow-lg ${
                        slot
                          ? getStatusColor(slot.status)
                          : isPast
                            ? "bg-surface-dark/50 border-border/50 text-text-secondary/50"
                            : "bg-surface-dark border-border hover:border-primary/50"
                      }`
                    : "bg-transparent border-transparent"
                }
                ${isToday(date) ? "ring-2 ring-primary" : ""}
                ${isSelected(date) ? "ring-2 ring-white" : ""}
              `}
              onClick={() => {
                if (date && !isPast) {
                  onDateClick(date);
                }
              }}
            >
              {date && (
                <>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                    <span
                      className={`text-lg font-bold ${
                        isPast ? "text-text-secondary/50" : ""
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {slot?.booking && (
                      <span className="text-[10px] font-medium mt-0.5 truncate w-full text-center">
                        {slot.booking.company}
                      </span>
                    )}
                    {slot?.status === "blackout" && (
                      <span className="text-[10px] font-medium mt-0.5">
                        Unavailable
                      </span>
                    )}
                  </div>

                  {date && !isPast && !slot && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddBlackout(date);
                      }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/20 border border-red-500/50
                        flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Add blackout date"
                    >
                      <X className="w-3 h-3 text-red-400" />
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500/20 border-2 border-green-500/50" />
          <span className="text-sm text-text-secondary">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20 border-2 border-primary/50" />
          <span className="text-sm text-text-secondary">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500/20 border-2 border-yellow-500/50" />
          <span className="text-sm text-text-secondary">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500/20 border-2 border-red-500/50" />
          <span className="text-sm text-text-secondary">Blackout</span>
        </div>
      </div>
    </div>
  );
}
