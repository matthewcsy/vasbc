import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "destructive";
  asChild?: boolean;
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-slate-900 text-white hover:bg-slate-800 shadow-sm dark:bg-slate-100 dark:text-slate-900",
  secondary: "bg-emerald-700 text-white hover:bg-emerald-600 shadow-sm",
  outline:
    "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 shadow-sm",
  destructive: "bg-rose-600 text-white hover:bg-rose-500 shadow-sm",
};

export function Button({
  className,
  variant = "default",
  type = "button",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-60",
    variantClasses[variant],
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
