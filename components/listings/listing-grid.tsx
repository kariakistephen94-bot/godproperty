import ListingCard from './listing-card'
import type { ListingWithImages } from '@/types'

interface ListingGridProps {
  listings: ListingWithImages[]
  emptyMessage?: string
}

export default function ListingGrid({ listings, emptyMessage = 'No listings found' }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">{emptyMessage}</h3>
        <p className="text-slate-500">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing, i) => (
        <div key={listing.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
          <ListingCard listing={listing} />
        </div>
      ))}
    </div>
  )
}
