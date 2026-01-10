"use client";

import { ReactNode, useRef } from "react";
import gsap from "gsap";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon?: ReactNode;
}

export function StatCard({ title, value, subtitle, trend, icon }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -4,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, { y: 0, duration: 0.3 });
    }
  };

  return (
    <div
      ref={cardRef}
      className="glass-strong rounded-2xl p-6 border border-border hover:border-primary/50 transition-all cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-text-secondary text-sm">{title}</div>
        {icon && <div className="text-text-secondary">{icon}</div>}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      {subtitle && (
        <div className="text-sm text-text-secondary">{subtitle}</div>
      )}
      {trend && (
        <div
          className={`text-sm ${trend.isPositive ? "text-green-400" : "text-red-400"}`}
        >
          {trend.value}
        </div>
      )}
    </div>
  );
}
