export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-100">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

export function ListingDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-2/3 mb-4" />
      <Skeleton className="h-5 w-1/3 mb-8" />
      <div className="grid grid-cols-2 gap-2 mb-8">
        <Skeleton className="h-80 rounded-l-2xl rounded-r-none" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-[156px]" />
          <Skeleton className="h-[156px] rounded-tr-2xl" />
          <Skeleton className="h-[156px]" />
          <Skeleton className="h-[156px] rounded-br-2xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
