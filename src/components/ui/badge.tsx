import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[#FAEEE9] px-3 py-1 text-xs font-semibold text-[#D06B4A]",
        className,
      )}
    >
      {children}
    </span>
  );
}
