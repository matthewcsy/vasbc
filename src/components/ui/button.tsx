import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "destructive" | "ghost";
  size?: "sm" | "default" | "lg";
  asChild?: boolean;
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-[#D06B4A] text-[#FDFBF7] hover:bg-[#B55737] shadow-sm",
  secondary: "bg-[#314F40] text-[#FDFBF7] hover:bg-[#233A2D] shadow-sm",
  outline:
    "border border-[#E8E1D3] bg-[#FDFBF7] text-[#3A2E2A] hover:bg-[#F0EBE1] shadow-sm",
  destructive: "bg-rose-600 text-white hover:bg-rose-500 shadow-sm",
  ghost: "text-[#3A2E2A] hover:bg-[#F0EBE1]",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1 text-xs",
  default: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D06B4A] disabled:pointer-events-none disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (asChild) {
    if (!React.isValidElement(children)) {
      throw new Error(
        "Button with asChild requires one valid React element child, e.g. <Button asChild><Link /></Button>.",
      );
    }

    const child = children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: cn(classes, child.props.className),
    });
  }

  return (
    <button
      type={type}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
