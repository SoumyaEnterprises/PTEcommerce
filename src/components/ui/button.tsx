"use client";

import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-blue text-white shadow-[0_0_24px_rgba(59,130,246,0.3)] hover:bg-[#2563eb] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)]",
  outline: "bg-transparent text-text border border-border-2 hover:bg-blue/10 hover:border-blue-2",
  ghost: "bg-transparent text-text-2 border border-border hover:text-text hover:border-border-2",
  danger: "bg-red text-white hover:bg-[#dc2626] shadow-[0_0_24px_rgba(239,68,68,0.25)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-sm gap-2",
  icon: "p-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
