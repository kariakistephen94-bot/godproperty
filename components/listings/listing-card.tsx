'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MapPin, Bed, Bath, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import type { ListingWithImages } from '@/types'

interface ListingCardProps {
  listing: ListingWithImages
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [liked, setLiked] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const images = listing.listing_images?.sort((a, b) => a.position - b.position) || []
  const coverImage = images[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format'
  const allImages = images.length > 0 ? images.map(img => img.url) : [coverImage]

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-white border border-zinc-100 hover:shadow-xl hover:shadow-zinc-200/60 transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
          <img
            src={allImages[currentImage]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />

          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm",
              listing.type === 'airbnb' ? 'bg-red-600 text-white' :
              listing.type === 'land' ? 'bg-emerald-600 text-white' :
              listing.type === 'materials' ? 'bg-blue-600 text-white' :
              'bg-white text-zinc-800'
            )}>
              {listing.type === 'airbnb' ? 'SHORT STAY' :
               listing.type === 'land' ? 'LAND' :
               listing.type === 'materials' ? 'MATERIAL' :
               'RENTAL'}
            </span>
          </div>

          {/* Like */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked) }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-sm"
          >
            <Heart className={cn("w-[18px] h-[18px] transition-all", liked ? "fill-red-500 text-red-500" : "text-zinc-600")} />
          </button>

          {/* Image Nav */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImage(Math.max(0, currentImage - 1)) }}
                className={cn("absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow", currentImage === 0 && "hidden")}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImage(Math.min(allImages.length - 1, currentImage + 1)) }}
                className={cn("absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow", currentImage === allImages.length - 1 && "hidden")}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {allImages.slice(0, 5).map((_, i) => (
                  <div key={i} className={cn("h-1.5 rounded-full transition-all", currentImage === i ? "bg-white w-4" : "bg-white/50 w-1.5")} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-zinc-900 truncate text-[15px] leading-tight">{listing.title}</h3>
            <div className="flex items-center gap-0.5 shrink-0 text-zinc-700">
              <Star className="w-3.5 h-3.5 fill-current text-red-500" />
              <span className="text-sm font-medium">4.9</span>
            </div>
          </div>

          <p className="flex items-center gap-1 text-zinc-500 text-sm mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{listing.city || listing.location}</span>
          </p>

          {listing.type !== 'land' && listing.type !== 'materials' && (
            <div className="flex items-center gap-3 text-[13px] text-zinc-400 mt-2">
              {listing.bedrooms > 0 && (
                <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}</span>
              )}
              {listing.bathrooms > 0 && (
                <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}</span>
              )}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-zinc-100">
            <span className="text-lg font-bold text-zinc-900">{formatPrice(listing.price, listing.type)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
