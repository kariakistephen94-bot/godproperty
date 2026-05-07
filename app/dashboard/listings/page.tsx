import { getMyListings } from '@/lib/actions/listings'
import Link from 'next/link'
import { Plus, Edit, Eye, EyeOff, Trash2, MapPin, Bed, Bath } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import ListingActions from './listing-actions'
import DeleteListingButton from '@/components/listings/delete-listing-button'

export const metadata = {
  title: 'My Listings',
}

export default async function MyListingsPage() {
  const listings = await getMyListings()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Listings</h1>
          <p className="text-sm text-slate-500 mt-1">{listings.length} properties</p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm shadow-md shadow-rose-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus className="w-5 h-5" /> New Listing
        </Link>
      </div>

      {/* Listings Table/Cards */}
      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">🏠</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No listings yet</h3>
          <p className="text-slate-500 mb-6">Create your first property listing to get started.</p>
          <Link
            href="/dashboard/listings/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold shadow-md"
          >
            <Plus className="w-5 h-5" /> Create Listing
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => {
            const coverMedia = listing.listing_images?.find(img => img.is_cover)
              || listing.listing_images?.[0]
            
            const mediaUrl = coverMedia?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&auto=format'
            const isVideo = coverMedia?.type === 'video'

            return (
              <div key={listing.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  {/* Image/Video */}
                  <div className="sm:w-48 h-40 sm:h-auto shrink-0 bg-slate-100">
                    {isVideo ? (
                      <video src={mediaUrl} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                      <img src={mediaUrl} alt={listing.title} className="w-full h-full object-cover" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 truncate">{listing.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            listing.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {listing.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                          <MapPin className="w-3.5 h-3.5" /> {listing.city || listing.location}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                          <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {listing.bedrooms}</span>
                          <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {listing.bathrooms}</span>
                          <span className="capitalize">
                            {listing.type === 'airbnb' ? 'Short Stay' : 
                             listing.type === 'land' ? 'Land' : 
                             listing.type === 'materials' ? 'Building Materials' : 
                             listing.type === 'lodge' ? 'Lodge' : 'Rental'}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{formatPrice(listing.price, listing.type)}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <ListingActions listingId={listing.id} isPublished={listing.is_published} />
                        <div className="hidden sm:block">
                          <DeleteListingButton id={listing.id} variant="icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
