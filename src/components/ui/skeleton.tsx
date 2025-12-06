import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-700/60",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Helpful pre-made variations for common UI skeletons
export function SkeletonText({ className = 'h-4 w-full rounded-md', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn('bg-slate-700/50', className)} {...props} />;
}

export function SkeletonImage({ className = 'h-40 w-full rounded-md', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn('bg-slate-700/40', className)} {...props} />;
}