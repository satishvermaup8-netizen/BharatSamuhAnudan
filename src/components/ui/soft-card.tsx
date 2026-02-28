import * as React from "react";
import { cn } from "@/lib/utils";

interface SoftCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "subtle";
  padding?: "none" | "sm" | "md" | "lg";
  radius?: "sm" | "md" | "lg" | "xl" | "2xl";
  hover?: boolean;
}

const SoftCard = React.forwardRef<HTMLDivElement, SoftCardProps>(
  (
    { className, variant = "default", padding = "md", radius = "xl", hover = true, ...props },
    ref
  ) => {
    const variantStyles = {
      default: "bg-white shadow-sm border border-gray-100",
      elevated: "bg-white shadow-lg shadow-gray-200/50 border border-gray-100",
      outlined: "bg-transparent border-2 border-gray-200",
      subtle: "bg-gray-50/80 border border-gray-100",
    };

    const paddingStyles = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const radiusStyles = {
      sm: "rounded-lg",
      md: "rounded-xl",
      lg: "rounded-2xl",
      xl: "rounded-3xl",
      "2xl": "rounded-[2rem]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-out",
          variantStyles[variant],
          paddingStyles[padding],
          radiusStyles[radius],
          hover && "hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1",
          className
        )}
        {...props}
      />
    );
  }
);
SoftCard.displayName = "SoftCard";

const SoftCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-2", className)} {...props} />
));
SoftCardHeader.displayName = "SoftCardHeader";

const SoftCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold tracking-tight text-gray-900", className)}
    {...props}
  />
));
SoftCardTitle.displayName = "SoftCardTitle";

const SoftCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-500 leading-relaxed", className)} {...props} />
));
SoftCardDescription.displayName = "SoftCardDescription";

const SoftCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-4", className)} {...props} />
));
SoftCardContent.displayName = "SoftCardContent";

const SoftCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-4 pt-4 border-t border-gray-100", className)} {...props} />
));
SoftCardFooter.displayName = "SoftCardFooter";

export {
  SoftCard,
  SoftCardHeader,
  SoftCardTitle,
  SoftCardDescription,
  SoftCardContent,
  SoftCardFooter,
};
