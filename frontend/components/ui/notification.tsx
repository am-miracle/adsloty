"use client";

import { useEffect, useRef } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { animateNotification } from "@/lib/dashboard-animations";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
}

export function Notification({ type, message, onClose }: NotificationProps) {
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notificationRef.current) {
      animateNotification(notificationRef.current);
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      iconColor: "text-green-400",
    },
    error: {
      icon: XCircle,
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      iconColor: "text-red-400",
    },
    info: {
      icon: Info,
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      iconColor: "text-blue-400",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      iconColor: "text-yellow-400",
    },
  };

  const { icon: Icon, bg, border, iconColor } = config[type];

  return (
    <div
      ref={notificationRef}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 ${bg} border ${border} backdrop-blur-lg rounded-xl px-4 py-3 shadow-lg max-w-md`}
    >
      <Icon className={`w-5 h-5 ${iconColor} shrink-0`} />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-text-secondary hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
