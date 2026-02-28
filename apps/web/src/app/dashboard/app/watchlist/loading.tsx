import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingWatchlist() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[420px]" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}
