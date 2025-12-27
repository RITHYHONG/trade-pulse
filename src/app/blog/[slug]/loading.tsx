import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen text-white">
      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-3/4" />
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>

        {/* Content */}
        <div className="space-y-6 mb-12">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-12">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>

        {/* Related Posts Section */}
        <section>
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}