import * as React from "react";
import { cn } from "@/lib/utils";

interface GradientSectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?:
    | "trust"
    | "saffron"
    | "ocean"
    | "sunset"
    | "aurora"
    | "midnight"
    | "soft"
    | "mint";
  intensity?: "subtle" | "medium" | "strong";
  direction?: "to-br" | "to-bl" | "to-tr" | "to-tl" | "to-r" | "to-b";
  pattern?: "none" | "dots" | "lines" | "grid" | "waves";
  children: React.ReactNode;
}

const GradientSection = React.forwardRef<HTMLElement, GradientSectionProps>(
  (
    {
      className,
      variant = "trust",
      intensity = "medium",
      direction = "to-br",
      pattern = "none",
      children,
      ...props
    },
    ref
  ) => {
    const gradients = {
      trust: {
        subtle: `bg-gradient-to-${direction} from-blue-50 via-blue-100/50 to-blue-50`,
        medium: `bg-gradient-to-${direction} from-blue-100 via-blue-200/50 to-blue-100`,
        strong: `bg-gradient-to-${direction} from-blue-600 via-blue-700 to-blue-800`,
      },
      saffron: {
        subtle: `bg-gradient-to-${direction} from-orange-50 via-orange-100/50 to-orange-50`,
        medium: `bg-gradient-to-${direction} from-orange-100 via-orange-200/50 to-orange-100`,
        strong: `bg-gradient-to-${direction} from-orange-500 via-orange-600 to-orange-700`,
      },
      ocean: {
        subtle: `bg-gradient-to-${direction} from-cyan-50 via-blue-50 to-teal-50`,
        medium: `bg-gradient-to-${direction} from-cyan-200 via-blue-200 to-teal-200`,
        strong: `bg-gradient-to-${direction} from-cyan-600 via-blue-600 to-teal-600`,
      },
      sunset: {
        subtle: `bg-gradient-to-${direction} from-pink-50 via-orange-50 to-amber-50`,
        medium: `bg-gradient-to-${direction} from-pink-200 via-orange-200 to-amber-200`,
        strong: `bg-gradient-to-${direction} from-pink-500 via-orange-500 to-amber-500`,
      },
      aurora: {
        subtle: `bg-gradient-to-${direction} from-purple-50 via-pink-50 to-cyan-50`,
        medium: `bg-gradient-to-${direction} from-purple-200 via-pink-200 to-cyan-200`,
        strong: `bg-gradient-to-${direction} from-purple-600 via-pink-500 to-cyan-500`,
      },
      midnight: {
        subtle: `bg-gradient-to-${direction} from-slate-800 via-slate-900 to-slate-950`,
        medium: `bg-gradient-to-${direction} from-slate-900 via-slate-950 to-black`,
        strong: `bg-gradient-to-${direction} from-indigo-950 via-slate-950 to-black`,
      },
      soft: {
        subtle: `bg-gradient-to-${direction} from-gray-50 via-white to-gray-50`,
        medium: `bg-gradient-to-${direction} from-gray-100 via-white to-gray-100`,
        strong: `bg-gradient-to-${direction} from-gray-200 via-gray-100 to-gray-200`,
      },
      mint: {
        subtle: `bg-gradient-to-${direction} from-green-50 via-emerald-50 to-teal-50`,
        medium: `bg-gradient-to-${direction} from-green-100 via-emerald-100 to-teal-100`,
        strong: `bg-gradient-to-${direction} from-green-600 via-emerald-600 to-teal-600`,
      },
    };

    const patterns = {
      none: "",
      dots: "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-200/20 via-transparent to-transparent bg-[length:20px_20px]",
      lines: "bg-[linear-gradient(to_right,_#80808008_1px,_transparent_1px)] bg-[length:40px_100%]",
      grid: "bg-[linear-gradient(to_right,_#80808008_1px,_transparent_1px),linear-gradient(to_bottom,_#80808008_1px,_transparent_1px)] bg-[size:40px_40px]",
      waves: "",
    };

    const isDark = variant === "midnight" || (intensity === "strong" && variant !== "soft");

    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          gradients[variant][intensity],
          patterns[pattern],
          isDark ? "text-white" : "text-gray-900",
          className
        )}
        {...props}
      >
        {pattern === "waves" && (
          <div className="absolute inset-0 opacity-30">
            <svg
              className="absolute bottom-0 left-0 w-full"
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="currentColor"
                className={isDark ? "text-white/10" : "text-black/5"}
              />
            </svg>
          </div>
        )}
        <div className="relative z-10">{children}</div>
      </section>
    );
  }
);
GradientSection.displayName = "GradientSection";

export { GradientSection };
