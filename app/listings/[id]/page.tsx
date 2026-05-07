import { notFound } from 'next/navigation'
import { getListingById, deleteListing } from '@/lib/actions/listings'
import { getBookingsForListing } from '@/lib/actions/bookings'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, AMENITY_LABELS } from '@/lib/utils'
import BookingCalendar from '@/components/bookings/booking-calendar'

import ImageGallery from '@/components/listings/image-gallery'
import DeleteListingButton from '@/components/listings/delete-listing-button'
import { MapPin, Bed, Bath, Users, Star, Shield, UserCircle, Phone } from 'lucide-react'
import Link from 'next/link'

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
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === listing.owner_id

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

                <div className="space-y-4">
                  <p className="text-sm text-slate-500">
                    {listing.type === 'airbnb' ? 'To book this stay, please contact our support team directly.' :
                     listing.type === 'rent' ? 'For inquiries and to rent this property, please contact our support team.' :
                     listing.type === 'land' ? 'To secure this plot of land, please contact our support team.' :
                     listing.type === 'materials' ? 'To order this building material, please contact our sales team.' :
                     'For inquiries, please contact our support team.'}
                  </p>
                  <div className="flex flex-col gap-3">
                    <a href="tel:+2348107920394" className="flex items-center justify-center w-full py-3.5 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 btn-press transition-all gap-2">
                      <Phone className="w-5 h-5" />
                      Call Us
                    </a>
                    <a href="https://wa.me/2348107920394" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-3.5 rounded-xl bg-[#25D366] text-white font-bold shadow-lg shadow-[#25D366]/20 hover:bg-[#20bd5a] btn-press transition-all gap-2">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                      </svg>
                      WhatsApp Us
                    </a>
                  </div>
                </div>
              </div>

              {isOwner && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Owner Controls</h4>
                  <div className="flex gap-3">
                    <Link
                      href={`/dashboard/listings/${id}/edit`}
                      className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all text-center text-sm"
                    >
                      Edit Listing
                    </Link>
                    <DeleteListingButton id={id} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
