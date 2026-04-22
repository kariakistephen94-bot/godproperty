'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateListing } from '@/lib/actions/listings'
import { ALL_AMENITIES, AMENITY_LABELS, cn } from '@/lib/utils'
import { ArrowLeft, Home, Sparkles } from 'lucide-react'
import type { ListingWithOwner } from '@/types'

interface EditListingFormProps {
  listing: ListingWithOwner
}

export default function EditListingForm({ listing }: EditListingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState(listing.title)
  const [description, setDescription] = useState(listing.description)
  const [price, setPrice] = useState(listing.price.toString())
  const [type, setType] = useState(listing.type)
  const [location, setLocation] = useState(listing.location)
  const [city, setCity] = useState(listing.city)
  const [state, setState] = useState(listing.state)
  const [bedrooms, setBedrooms] = useState(listing.bedrooms.toString())
  const [bathrooms, setBathrooms] = useState(listing.bathrooms.toString())
  const [maxGuests, setMaxGuests] = useState(listing.max_guests.toString())
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(listing.amenities || [])

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.set('title', title)
      formData.set('description', description)
      formData.set('price', price)
      formData.set('type', type)
      formData.set('location', location)
      formData.set('city', city)
      formData.set('state', state)
      formData.set('bedrooms', bedrooms)
      formData.set('bathrooms', bathrooms)
      formData.set('maxGuests', maxGuests)
      formData.set('amenities', selectedAmenities.join(','))

      await updateListing(listing.id, formData)
      router.push('/dashboard/listings')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-5">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Property Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setType('rent')} className={cn("p-4 rounded-xl border-2 text-center transition-all", type === 'rent' ? "border-rose-500 bg-rose-50" : "border-slate-200")}>
              <Home className="w-6 h-6 mx-auto mb-1" /><span className="font-medium">Rental</span>
            </button>
            <button type="button" onClick={() => setType('airbnb')} className={cn("p-4 rounded-xl border-2 text-center transition-all", type === 'airbnb' ? "border-rose-500 bg-rose-50" : "border-slate-200")}>
              <Sparkles className="w-6 h-6 mx-auto mb-1" /><span className="font-medium">Short Stay</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Price ({type === 'airbnb' ? 'per night' : 'per month'})</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
            <input type="text" value={state} onChange={e => setState(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bedrooms</label>
            <input type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} min="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bathrooms</label>
            <input type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} min="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Amenities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ALL_AMENITIES.map(amenity => (
              <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)} className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all text-left",
                selectedAmenities.includes(amenity) ? "border-rose-500 bg-rose-50 text-rose-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
              )}>
                {AMENITY_LABELS[amenity]}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button type="button" onClick={() => router.back()} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
            <ArrowLeft className="w-4 h-4" /> Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
