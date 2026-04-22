import { GridSkeleton } from '@/components/ui/skeleton'

export default function ListingsLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-14 skeleton rounded-2xl" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="h-8 w-48 skeleton mb-2" />
          <div className="h-4 w-32 skeleton" />
        </div>
        <GridSkeleton count={8} />
      </div>
    </div>
  )
}
