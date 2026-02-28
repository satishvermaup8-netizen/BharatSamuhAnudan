import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
  {
    variants: {
      status: {
        success:
          "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200",
        error:
          "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200",
        warning:
          "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200",
        info:
          "bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200",
        pending:
          "bg-yellow-100 text-yellow-700 border border-yellow-200 hover:bg-yellow-200",
        processing:
          "bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200",
        approved:
          "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200",
        rejected:
          "bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-200",
        draft:
          "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200",
        active:
          "bg-cyan-100 text-cyan-700 border border-cyan-200 hover:bg-cyan-200",
        inactive:
          "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200",
        verified:
          "bg-teal-100 text-teal-700 border border-teal-200 hover:bg-teal-200",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
      dot: {
        true: "",
        false: "",
      },
      pulse: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      status: "info",
      size: "md",
      dot: true,
      pulse: false,
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  label?: string;
}

const statusDotColors: Record<string, string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
  pending: "bg-yellow-500",
  processing: "bg-purple-500",
  approved: "bg-emerald-500",
  rejected: "bg-rose-500",
  draft: "bg-gray-500",
  active: "bg-cyan-500",
  inactive: "bg-slate-500",
  verified: "bg-teal-500",
};

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  (
    { className, status, size, dot, pulse, label, children, ...props },
    ref
  ) => {
    const displayLabel = label || children || status;
    const dotColor = status ? statusDotColors[status] : "bg-blue-500";

    return (
      <span
        ref={ref}
        className={cn(statusBadgeVariants({ status, size, dot, pulse }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              dotColor,
              pulse && "animate-pulse-ring"
            )}
          />
        )}
        <span className="capitalize">{displayLabel}</span>
      </span>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "online" | "offline" | "away" | "busy";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  (
    { className, status, size = "md", showLabel = false, ...props },
    ref
  ) => {
    const statusConfig = {
      online: { color: "bg-green-500", label: "Online" },
      offline: { color: "bg-gray-400", label: "Offline" },
      away: { color: "bg-amber-500", label: "Away" },
      busy: { color: "bg-red-500", label: "Busy" },
    };

    const sizeClasses = {
      sm: "h-2 w-2",
      md: "h-3 w-3",
      lg: "h-4 w-4",
    };

    const config = statusConfig[status];

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        <span className="relative flex">
          <span
            className={cn(
              "relative inline-flex rounded-full",
              sizeClasses[size],
              config.color
            )}
          />
          {status === "online" && (
            <span
              className={cn(
                "absolute inline-flex rounded-full opacity-75 animate-ping",
                sizeClasses[size],
                config.color
              )}
            />
          )}
        </span>
        {showLabel && (
          <span className="text-sm text-gray-600">{config.label}</span>
        )}
      </div>
    );
  }
);
StatusIndicator.displayName = "StatusIndicator";

export { StatusBadge, StatusIndicator };
