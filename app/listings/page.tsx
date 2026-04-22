import { Suspense } from 'react'
import { getListings } from '@/lib/actions/listings'
import SearchBar from '@/components/listings/search-bar'
import ListingGrid from '@/components/listings/listing-grid'
import { GridSkeleton } from '@/components/ui/skeleton'
import type { ListingType } from '@/types'

export const metadata = {
  title: 'Explore Properties',
  description: 'Browse thousands of rentals and short stays. Filter by price, location, and type.',
}

export default async function ListingsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams
  const filters = {
    type: (params.type as ListingType) || undefined,
    city: (params.city as string) || undefined,
    priceMin: params.price_min ? Number(params.price_min) : undefined,
    priceMax: params.price_max ? Number(params.price_max) : undefined,
    q: (params.q as string) || undefined,
  }

  const listings = await getListings(filters)
  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Search */}
      <div className="bg-white border-b border-zinc-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Suspense fallback={<div className="h-14 skeleton rounded-2xl" />}>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {filters.type === 'rent' ? 'Rental Properties' : filters.type === 'airbnb' ? 'Short Stays' : 'All Properties'}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {listings.length} {listings.length === 1 ? 'property' : 'properties'} found
              {activeFilterCount > 0 && ` · ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`}
            </p>
          </div>
        </div>

        <Suspense fallback={<GridSkeleton />}>
          <ListingGrid listings={listings} />
        </Suspense>
      </div>
    </div>
  )
}
