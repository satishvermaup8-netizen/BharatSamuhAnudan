import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "lighter" | "dark" | "colored";
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: "low" | "medium" | "high";
  borderStyle?: "solid" | "subtle" | "glow" | "none";
  hoverEffect?: boolean;
  glowColor?: string;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant = "light",
      blur = "md",
      opacity = "medium",
      borderStyle = "subtle",
      hoverEffect = true,
      glowColor,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      light: "bg-white/80",
      lighter: "bg-white/50",
      dark: "bg-slate-950/80",
      colored: "bg-gradient-to-br from-white/90 to-white/60",
    };

    const blurStyles = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
    };

    const opacityStyles = {
      low: "",
      medium: "",
      high: "",
    };

    const borderStyles = {
      solid: variant === "dark" ? "border border-white/20" : "border border-white/60",
      subtle:
        variant === "dark"
          ? "border border-white/10"
          : "border border-white/40",
      glow: glowColor
        ? `border border-${glowColor}/30 shadow-[0_0_30px_rgba(var(--glow-color),0.15)]`
        : variant === "dark"
        ? "border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        : "border border-white/50 shadow-[0_0_30px_rgba(0,0,0,0.05)]",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl overflow-hidden transition-all duration-300",
          variantStyles[variant],
          blurStyles[blur],
          opacityStyles[opacity],
          borderStyles[borderStyle],
          hoverEffect && "hover:shadow-2xl",
          variant === "light" && hoverEffect && "hover:bg-white/90",
          variant === "lighter" && hoverEffect && "hover:bg-white/70",
          variant === "dark" && "text-white",
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";

const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-2 p-6", className)} {...props} />
));
GlassCardHeader.displayName = "GlassCardHeader";

const GlassCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold tracking-tight", className)}
    {...props}
  />
));
GlassCardTitle.displayName = "GlassCardTitle";

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm opacity-80", className)} {...props} />
));
GlassCardDescription.displayName = "GlassCardDescription";

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
GlassCardContent.displayName = "GlassCardContent";

const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
GlassCardFooter.displayName = "GlassCardFooter";

const GlassOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { position?: "top" | "bottom" | "full" }
>(({ className, position = "full", ...props }, ref) => {
  const positionStyles = {
    top: "bg-gradient-to-b from-white/90 to-transparent",
    bottom: "bg-gradient-to-t from-white/90 to-transparent",
    full: "bg-white/60 backdrop-blur-sm",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 transition-opacity duration-300",
        positionStyles[position],
        className
      )}
      {...props}
    />
  );
});
GlassOverlay.displayName = "GlassOverlay";

export {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
  GlassOverlay,
};
