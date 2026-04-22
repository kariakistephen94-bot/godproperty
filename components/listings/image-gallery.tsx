'use client'

import { useState } from 'react'
import type { ListingImage } from '@/types'
import { ChevronLeft, ChevronRight, X, Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: ListingImage[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const placeholderImages = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format',
  ]

  const displayImages = images.length > 0 ? images.map(img => img.url) : placeholderImages

  return (
    <>
      {/* Gallery Grid */}
      <div className="rounded-2xl overflow-hidden cursor-pointer" onClick={() => setLightboxOpen(true)}>
        {displayImages.length === 1 ? (
          <img src={displayImages[0]} alt={title} className="w-full h-[400px] sm:h-[500px] object-cover" />
        ) : (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[300px] sm:h-[400px] lg:h-[480px]">
            <div className="col-span-2 row-span-2">
              <img src={displayImages[0]} alt={title} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
            </div>
            {displayImages.slice(1, 5).map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt={`${title} ${i + 2}`} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                {i === 3 && displayImages.length > 5 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">+{displayImages.length - 5}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Show all button */}
        <button className="absolute bottom-4 right-4 px-4 py-2 bg-white rounded-lg shadow-md text-sm font-medium text-slate-700 flex items-center gap-2 hover:shadow-lg transition-shadow">
          <Grid3X3 className="w-4 h-4" /> Show all photos
        </button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(Math.max(0, currentIndex - 1)) }}
            className={cn("absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors", currentIndex === 0 && "opacity-30 cursor-default")}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={displayImages[currentIndex]}
            alt={`${title} ${currentIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(Math.min(displayImages.length - 1, currentIndex + 1)) }}
            className={cn("absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors", currentIndex === displayImages.length - 1 && "opacity-30 cursor-default")}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-4 text-white text-sm">
            {currentIndex + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </>
  )
}
