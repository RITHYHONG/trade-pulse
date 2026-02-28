import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingWatchlistSymbol() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-20" />
      <Skeleton className="h-48" />
    </div>
  );
}
