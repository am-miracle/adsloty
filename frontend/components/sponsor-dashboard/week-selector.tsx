"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface WeekSlot {
  date: Date;
  weekLabel: string;
  price: number;
  available: boolean;
}

interface WeekSelectorProps {
  slots: WeekSlot[];
  onSelectWeek: (slot: WeekSlot) => void;
}

export function WeekSelector({ slots, onSelectWeek }: WeekSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonthSlots = slots.filter((slot) => {
    return (
      slot.date.getMonth() === currentMonth.getMonth() &&
      slot.date.getFullYear() === currentMonth.getFullYear()
    );
  });

  const nextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const prevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {currentMonthSlots.map((slot, index) => (
          <button
            key={index}
            onClick={() => slot.available && onSelectWeek(slot)}
            disabled={!slot.available}
            className={`p-4 rounded-lg border transition-all text-left ${
              slot.available
                ? "border-border hover:border-primary bg-surface-border/30 hover:bg-surface-border cursor-pointer"
                : "border-border bg-surface-border/10 opacity-50 cursor-not-allowed"
            }`}
          >
            <div className="font-semibold mb-1">{slot.weekLabel}</div>
            {slot.available ? (
              <div className="text-sm text-primary font-medium">
                ${slot.price}
              </div>
            ) : (
              <div className="text-sm text-red-400">Booked</div>
            )}
          </button>
        ))}
      </div>

      {currentMonthSlots.length === 0 && (
        <div className="text-center py-8 text-text-secondary">
          No slots available for this month
        </div>
      )}
    </div>
  );
}
