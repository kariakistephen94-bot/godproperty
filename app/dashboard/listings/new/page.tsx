'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createListing } from '@/lib/actions/listings'
import { ALL_AMENITIES, AMENITY_LABELS } from '@/lib/utils'
import { ArrowLeft, ArrowRight, Upload, X, Home, Sparkles, MapPin, Hammer } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function NewListingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState<'rent' | 'airbnb' | 'land' | 'materials'>('rent')
  const [location, setLocation] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [bedrooms, setBedrooms] = useState('1')
  const [bathrooms, setBathrooms] = useState('1')
  const [maxGuests, setMaxGuests] = useState('2')
  const [landlordPhone, setLandlordPhone] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageFiles(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    )
  }

  const handleSubmit = async (publish: boolean) => {
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
      formData.set('landlordPhone', landlordPhone)
      formData.set('amenities', selectedAmenities.join(','))
      formData.set('isPublished', publish ? 'true' : 'false')

      imageFiles.forEach(file => formData.append('images', file))

      await createListing(formData)
      router.push('/dashboard/listings')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Create New Listing</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                step >= s ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-400"
              )}>
                {s}
              </div>
              {s < 3 && <div className={cn("w-12 h-0.5", step > s ? "bg-rose-500" : "bg-slate-200")} />}
            </div>
          ))}
          <span className="ml-2 text-sm text-slate-500">
            {step === 1 ? 'Details' : step === 2 ? 'Images & Amenities' : 'Review'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Property Type</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <button type="button" onClick={() => setType('rent')} className={cn(
                  "p-4 rounded-xl border-2 text-center transition-all",
                  type === 'rent' ? "border-rose-500 bg-rose-50" : "border-slate-200 hover:border-slate-300"
                )}>
                  <Home className="w-6 h-6 mx-auto mb-1" />
                  <span className="font-medium text-sm">Rental</span>
                </button>
                <button type="button" onClick={() => setType('airbnb')} className={cn(
                  "p-4 rounded-xl border-2 text-center transition-all",
                  type === 'airbnb' ? "border-rose-500 bg-rose-50" : "border-slate-200 hover:border-slate-300"
                )}>
                  <Sparkles className="w-6 h-6 mx-auto mb-1" />
                  <span className="font-medium text-sm">Short Stay</span>
                </button>
                <button type="button" onClick={() => setType('land')} className={cn(
                  "p-4 rounded-xl border-2 text-center transition-all",
                  type === 'land' ? "border-rose-500 bg-rose-50" : "border-slate-200 hover:border-slate-300"
                )}>
                  <MapPin className="w-6 h-6 mx-auto mb-1" />
                  <span className="font-medium text-sm">Land</span>
                </button>
                <button type="button" onClick={() => setType('materials')} className={cn(
                  "p-4 rounded-xl border-2 text-center transition-all",
                  type === 'materials' ? "border-rose-500 bg-rose-50" : "border-slate-200 hover:border-slate-300"
                )}>
                  <Hammer className="w-6 h-6 mx-auto mb-1" />
                  <span className="font-medium text-sm">Materials</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Modern 2-Bed Apartment in Lekki" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe your property..." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Price ({type === 'airbnb' ? 'per night' : type === 'materials' ? 'per unit' : type === 'land' ? 'per plot' : 'per month'})
              </label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Street address" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g., Lagos" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                <input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="e.g., Lagos" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
              </div>
              {type !== 'land' && type !== 'materials' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Bedrooms</label>
                    <input type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} min="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Bathrooms</label>
                    <input type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} min="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                  </div>
                </>
              )}
            </div>

            {type === 'airbnb' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Guests</label>
                <input type="number" value={maxGuests} onChange={e => setMaxGuests(e.target.value)} min="1" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
              </div>
            )}

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-bold text-rose-600 mb-1.5 uppercase tracking-wider">Landlord Number (Private)</label>
              <input type="tel" value={landlordPhone} onChange={e => setLandlordPhone(e.target.value)} placeholder="+234..." className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
              <p className="text-[11px] text-slate-500 mt-1">Only you and other admins can see this number. It will never be shown publicly.</p>
            </div>
          </div>
        )}

        {/* Step 2: Images & Amenities */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Photos</label>
              <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-rose-300 transition-colors">
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 mb-1">Drag and drop images or click to browse</p>
                <p className="text-xs text-slate-400">JPG, PNG, WebP up to 10MB each</p>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                  {imagePreviews.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-white/90 rounded-md text-xs font-medium">Cover</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_AMENITIES.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all text-left",
                      selectedAmenities.includes(amenity)
                        ? "border-rose-500 bg-rose-50 text-rose-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    )}
                  >
                    {AMENITY_LABELS[amenity]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Review Your Listing</h3>

            <div className="divide-y divide-slate-100">
              <ReviewItem label="Title" value={title} />
              <ReviewItem label="Type" value={type === 'airbnb' ? 'Short Stay' : type === 'land' ? 'Land' : type === 'materials' ? 'Materials' : 'Rental'} />
              <ReviewItem label="Price" value={`₦${price} ${type === 'airbnb' ? '/ night' : type === 'materials' ? '/ unit' : type === 'land' ? '/ plot' : '/ month'}`} />
              <ReviewItem label="Location" value={`${location}, ${city}, ${state}`} />
              {type !== 'land' && type !== 'materials' && (
                <>
                  <ReviewItem label="Bedrooms" value={bedrooms} />
                  <ReviewItem label="Bathrooms" value={bathrooms} />
                </>
              )}
              {type === 'airbnb' && <ReviewItem label="Max Guests" value={maxGuests} />}
              <ReviewItem label="Landlord Phone" value={landlordPhone || 'Not provided'} />
              <ReviewItem label="Amenities" value={selectedAmenities.map(a => AMENITY_LABELS[a]).join(', ') || 'None'} />
              <ReviewItem label="Photos" value={`${imageFiles.length} file(s)`} />
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
              <p>Your listing will be reviewed before being published. You can also save it as a draft.</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && (!title || !price || !city)}
              className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all"
              >
                {loading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right max-w-[60%]">{value}</span>
    </div>
  )
}
