import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimals?: number;
  startOnView?: boolean;
  easing?: "linear" | "easeOut" | "easeInOut";
}

const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);
const easeInOutQuart = (t: number): number =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

const AnimatedCounter = React.forwardRef<HTMLSpanElement, AnimatedCounterProps>(
  (
    {
      className,
      value,
      duration = 2000,
      delay = 0,
      prefix = "",
      suffix = "",
      separator = ",",
      decimals = 0,
      startOnView = true,
      easing = "easeOut",
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState(0);
    const [hasStarted, setHasStarted] = useState(!startOnView);
    const elementRef = useRef<HTMLSpanElement>(null);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const easingFunctions = {
      linear: (t: number) => t,
      easeOut: easeOutQuart,
      easeInOut: easeInOutQuart,
    };

    useEffect(() => {
      if (!startOnView) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setHasStarted(true);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }, [startOnView]);

    useEffect(() => {
      if (!hasStarted) return;

      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp + delay;
        }

        const elapsed = timestamp - startTimeRef.current;

        if (elapsed < 0) {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }

        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFunctions[easing](progress);
        const currentValue = easedProgress * value;

        setDisplayValue(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [hasStarted, value, duration, delay, easing]);

    const formatNumber = (num: number): string => {
      const fixed = num.toFixed(decimals);
      const parts = fixed.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      return parts.join(".");
    };

    return (
      <span
        ref={(node) => {
          elementRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
          }
        }}
        className={cn("tabular-nums", className)}
        {...props}
      >
        {prefix}
        {formatNumber(displayValue)}
        {suffix}
      </span>
    );
  }
);
AnimatedCounter.displayName = "AnimatedCounter";

interface StatCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  label: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "gradient" | "outlined";
  colorScheme?: "trust" | "saffron" | "mint" | "purple";
}

const StatCounter = React.forwardRef<HTMLDivElement, StatCounterProps>(
  (
    {
      className,
      value,
      label,
      icon,
      trend,
      variant = "default",
      colorScheme = "trust",
      ...props
    },
    ref
  ) => {
    const colorSchemes = {
      trust: "text-blue-600",
      saffron: "text-orange-600",
      mint: "text-green-600",
      purple: "text-purple-600",
    };

    const variantStyles = {
      default: "bg-white border border-gray-100 shadow-sm",
      gradient: "bg-gradient-to-br from-gray-50 to-white border border-gray-100",
      outlined: "bg-transparent border-2 border-gray-200",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={cn(
                  "text-3xl font-bold tracking-tight",
                  colorSchemes[colorScheme]
                )}
              >
                <AnimatedCounter
                  value={value}
                  separator=","
                  startOnView
                />
              </span>
              {trend && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.isPositive ? "+" : "-"}
                  {trend.value}%
                </span>
              )}
            </div>
          </div>
          {icon && (
            <div
              className={cn(
                "p-3 rounded-xl",
                colorSchemes[colorScheme].replace("text-", "bg-").replace("600", "100")
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }
);
StatCounter.displayName = "StatCounter";

export { AnimatedCounter, StatCounter };
