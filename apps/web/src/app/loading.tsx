import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="space-y-8 p-6">
      <Skeleton className="h-10 w-3/4" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}