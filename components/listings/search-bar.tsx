'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [location, setLocation] = useState(searchParams.get('city') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [type, setType] = useState(searchParams.get('type') || '')
  const [priceMin, setPriceMin] = useState(searchParams.get('price_min') || '')
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') || '')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (location) params.set('city', location)
    if (type) params.set('type', type)
    if (priceMin) params.set('price_min', priceMin)
    if (priceMax) params.set('price_max', priceMax)
    router.push(`/listings?${params.toString()}`)
  }

  const handleClear = () => {
    setQuery(''); setLocation(''); setType(''); setPriceMin(''); setPriceMax('')
    router.push('/listings')
  }

  const hasFilters = query || location || type || priceMin || priceMax

  return (
    <div className="w-full">
      {/* Main Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center">
          <div className="flex-1 flex items-center gap-2 px-4">
            <Search className="w-5 h-5 text-zinc-400 shrink-0" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search properties..." className="w-full py-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none bg-transparent" />
          </div>

          <div className="w-px h-8 bg-zinc-200 hidden sm:block" />

          <div className="hidden sm:flex flex-1 items-center gap-2 px-4">
            <span className="text-zinc-400 text-sm shrink-0">📍</span>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="City or area" className="w-full py-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none bg-transparent" />
          </div>

          <div className="flex items-center gap-1.5 px-2">
            <button onClick={() => setShowFilters(!showFilters)}
              className={cn("p-2.5 rounded-xl transition-all", showFilters ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100")}>
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <button onClick={handleSearch}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm shadow-sm hover:bg-red-700 btn-press transition-all">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-3 bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:hidden">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or area"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Type</label>
              <div className="flex gap-1.5">
                {[{ value: '', label: 'All' }, { value: 'rent', label: 'Rent' }, { value: 'airbnb', label: 'Stay' }].map(opt => (
                  <button key={opt.value} onClick={() => setType(opt.value)}
                    className={cn("flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all border",
                      type === opt.value ? "bg-red-600 text-white border-red-600" : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300")}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Min Price</label>
              <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="₦0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Max Price</label>
              <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="No limit"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
            {hasFilters && (
              <button onClick={handleClear} className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700"><X className="w-4 h-4" /> Clear</button>
            )}
            <button onClick={handleSearch} className="ml-auto px-5 py-2 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
