import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSettings() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </div>
  );
}
