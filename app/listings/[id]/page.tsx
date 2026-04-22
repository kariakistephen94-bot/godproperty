import { notFound } from 'next/navigation'
import { getListingById } from '@/lib/actions/listings'
import { getBookingsForListing } from '@/lib/actions/bookings'
import { formatPrice, AMENITY_LABELS } from '@/lib/utils'
import BookingCalendar from '@/components/bookings/booking-calendar'

import ImageGallery from '@/components/listings/image-gallery'
import { MapPin, Bed, Bath, Users, Star, Shield, UserCircle } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) return { title: 'Not Found' }
  return {
    title: listing.title,
    description: listing.description?.slice(0, 160),
  }
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listing = await getListingById(id)

  if (!listing) notFound()

  const existingBookings = await getBookingsForListing(id)
  const images = listing.listing_images?.sort((a, b) => a.position - b.position) || []

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{listing.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9 · 24 reviews
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {listing.location}, {listing.city}
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        <ImageGallery images={images} title={listing.title} />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <div className="flex items-center justify-between pb-8 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {listing.type === 'airbnb' ? 'Entire place' : listing.type === 'land' ? 'Plot of land' : listing.type === 'materials' ? 'Building Material' : 'Rental property'} managed by GodProperty
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                  {listing.type !== 'land' && listing.type !== 'materials' && listing.bedrooms > 0 && (
                    <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {listing.bedrooms} bedroom{listing.bedrooms > 1 ? 's' : ''}</span>
                  )}
                  {listing.type !== 'land' && listing.type !== 'materials' && listing.bathrooms > 0 && (
                    <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}</span>
                  )}
                  {listing.type === 'airbnb' && (
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {listing.max_guests} guest{listing.max_guests > 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
              <div className="shrink-0">
                {listing.profiles?.avatar_url ? (
                  <img src={listing.profiles.avatar_url} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow" />
                ) : (
                  <UserCircle className="w-14 h-14 text-slate-300" />
                )}
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-4 pb-8 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900">Verified listing</h3>
                  <p className="text-sm text-slate-500">This property has been verified by our team.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pb-8 border-b border-slate-100">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">About this place</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>

            {/* Amenities */}
            {listing.amenities?.length > 0 && (
              <div className="pb-8 border-b border-slate-100">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">What this place offers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {listing.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3 py-2">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm">
                        {amenity === 'wifi' ? '📶' :
                         amenity === 'parking' ? '🅿️' :
                         amenity === 'pool' ? '🏊' :
                         amenity === 'gym' ? '💪' :
                         amenity === 'air_conditioning' ? '❄️' :
                         amenity === 'kitchen' ? '🍳' :
                         amenity === 'garden' ? '🌿' :
                         amenity === 'security' ? '🔒' :
                         amenity === 'generator' ? '⚡' :
                         amenity === 'beach_access' ? '🏖️' :
                         amenity === 'breakfast' ? '🥐' :
                         amenity === 'rooftop' ? '🌇' : '✓'}
                      </span>
                      <span className="text-slate-700">{AMENITY_LABELS[amenity] || amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Location</h3>
              <div className="rounded-2xl bg-slate-100 h-64 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <MapPin className="w-10 h-10 mx-auto mb-2" />
                  <p className="font-medium text-slate-600">{listing.location}</p>
                  <p className="text-sm">{listing.city}, {listing.state}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6">
                {listing.type !== 'rent' && (
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-2xl font-bold text-slate-900">{formatPrice(listing.price)}</span>
                    <span className="text-slate-500">
                      {listing.type === 'airbnb' ? '/ night' : listing.type === 'land' ? '/ plot' : listing.type === 'materials' ? '/ unit' : ''}
                    </span>
                  </div>
                )}

                {listing.type === 'airbnb' ? (
                  <BookingCalendar
                    listingId={listing.id}
                    pricePerNight={listing.price}
                    existingBookings={existingBookings}
                  />
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                      {listing.type === 'rent' ? 'For inquiries and to rent this property, please contact our support team.' :
                       listing.type === 'land' ? 'To secure this plot of land, please contact our support team.' :
                       listing.type === 'materials' ? 'To order this building material, please contact our sales team.' :
                       'For inquiries, please contact our support team.'}
                    </p>
                    <a href="tel:+2348000000000" className="flex items-center justify-center w-full py-3.5 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 btn-press transition-all">
                      Call Us
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
