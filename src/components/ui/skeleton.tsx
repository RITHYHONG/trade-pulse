import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "h-24 w-full animate-pulse rounded-xl bg-slate-700/60",
        className,
      )}
      {...props}
    />
  );
}