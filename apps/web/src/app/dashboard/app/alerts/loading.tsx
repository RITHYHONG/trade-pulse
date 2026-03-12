import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAlerts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </div>
  );
}
