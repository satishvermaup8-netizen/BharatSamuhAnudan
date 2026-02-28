import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description?: string;
  iconSize?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "gradient" | "outlined" | "filled" | "glass";
  colorScheme?: "trust" | "saffron" | "mint" | "purple" | "rose" | "amber";
  action?: React.ReactNode;
  onActionClick?: () => void;
  hoverEffect?: boolean;
}

const IconCard = React.forwardRef<HTMLDivElement, IconCardProps>(
  (
    {
      className,
      icon: Icon,
      title,
      description,
      iconSize = "md",
      variant = "default",
      colorScheme = "trust",
      action,
      onActionClick,
      hoverEffect = true,
      ...props
    },
    ref
  ) => {
    const colorSchemes = {
      trust: {
        bg: "bg-blue-50",
        icon: "text-blue-600",
        border: "border-blue-200",
        gradient: "from-blue-500 to-blue-700",
        filled: "bg-blue-600",
      },
      saffron: {
        bg: "bg-orange-50",
        icon: "text-orange-600",
        border: "border-orange-200",
        gradient: "from-orange-500 to-orange-700",
        filled: "bg-orange-600",
      },
      mint: {
        bg: "bg-green-50",
        icon: "text-green-600",
        border: "border-green-200",
        gradient: "from-green-500 to-green-700",
        filled: "bg-green-600",
      },
      purple: {
        bg: "bg-purple-50",
        icon: "text-purple-600",
        border: "border-purple-200",
        gradient: "from-purple-500 to-purple-700",
        filled: "bg-purple-600",
      },
      rose: {
        bg: "bg-rose-50",
        icon: "text-rose-600",
        border: "border-rose-200",
        gradient: "from-rose-500 to-rose-700",
        filled: "bg-rose-600",
      },
      amber: {
        bg: "bg-amber-50",
        icon: "text-amber-600",
        border: "border-amber-200",
        gradient: "from-amber-500 to-amber-700",
        filled: "bg-amber-600",
      },
    };

    const iconSizes = {
      sm: "h-8 w-8 p-1.5",
      md: "h-12 w-12 p-2.5",
      lg: "h-14 w-14 p-3",
      xl: "h-16 w-16 p-4",
    };

    const iconSizesInner = {
      sm: "h-5 w-5",
      md: "h-7 w-7",
      lg: "h-8 w-8",
      xl: "h-10 w-10",
    };

    const scheme = colorSchemes[colorScheme];

    const variantStyles = {
      default: `bg-white border border-gray-100 shadow-sm ${hoverEffect ? "hover:shadow-md" : ""}`,
      gradient: `bg-gradient-to-br ${scheme.gradient} text-white border-0`,
      outlined: `bg-transparent border-2 ${scheme.border} ${hoverEffect ? "hover:bg-white" : ""}`,
      filled: `${scheme.filled} text-white border-0`,
      glass: "bg-white/70 backdrop-blur-md border border-white/50 shadow-lg",
    };

    const isGradientOrFilled = variant === "gradient" || variant === "filled";

    return (
      <div
        ref={ref}
        className={cn(
          "group relative rounded-2xl p-6 transition-all duration-300",
          variantStyles[variant],
          hoverEffect && "hover:-translate-y-1",
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex-shrink-0 rounded-xl transition-transform duration-300",
              variant === "gradient" || variant === "filled"
                ? "bg-white/20"
                : variant === "outlined"
                ? `${scheme.bg} ${scheme.icon}`
                : `${scheme.bg} ${scheme.icon}`,
              iconSizes[iconSize],
              hoverEffect && "group-hover:scale-110"
            )}
          >
            <Icon className={iconSizesInner[iconSize]} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-semibold tracking-tight",
                isGradientOrFilled ? "text-white" : "text-gray-900"
              )}
            >
              {title}
            </h3>
            {description && (
              <p
                className={cn(
                  "mt-1 text-sm leading-relaxed",
                  isGradientOrFilled ? "text-white/80" : "text-gray-500"
                )}
              >
                {description}
              </p>
            )}
          </div>
          {action && (
            <button
              onClick={onActionClick}
              className={cn(
                "flex-shrink-0 transition-all duration-200 hover:scale-105 active:scale-95",
                isGradientOrFilled
                  ? "text-white/70 hover:text-white"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              {action}
            </button>
          )}
        </div>
      </div>
    );
  }
);
IconCard.displayName = "IconCard";

export { IconCard };
