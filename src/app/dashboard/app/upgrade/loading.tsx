import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingUpgrade() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
  );
}
