'use client'

import { useState } from 'react'
import { createManualBooking } from '@/lib/actions/bookings'
import { CalendarDays, X, Plus, AlertCircle } from 'lucide-react'
import type { ListingWithImages } from '@/types'

interface ManualBookingFormProps {
  listings: ListingWithImages[]
}

export default function ManualBookingForm({ listings }: ManualBookingFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const listingId = formData.get('listingId') as string
    const checkIn = formData.get('checkIn') as string
    const checkOut = formData.get('checkOut') as string
    const guestsCount = parseInt(formData.get('guestsCount') as string)
    const totalPrice = parseFloat(formData.get('totalPrice') as string)
    const notes = formData.get('notes') as string

    try {
      const result = await createManualBooking(
        listingId,
        checkIn,
        checkOut,
        guestsCount,
        totalPrice,
        notes
      )

      if (result.success) {
        setIsOpen(false)
        // revalidatePath happens on server
      } else {
        setError(result.error || 'Failed to create booking')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm shadow-md shadow-red-600/20 hover:bg-red-700 btn-press transition-all"
      >
        <Plus className="w-4 h-4" /> New Manual Booking
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-red-600" />
                Manual Booking
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Property</label>
                <select
                  name="listingId"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                >
                  <option value="">Select a property...</option>
                  {listings.map(l => (
                    <option key={l.id} value={l.id}>{l.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Check In</label>
                  <input
                    type="date"
                    name="checkIn"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Check Out</label>
                  <input
                    type="date"
                    name="checkOut"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Guests</label>
                  <input
                    type="number"
                    name="guestsCount"
                    min="1"
                    defaultValue="1"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Total Price (₦)</label>
                  <input
                    type="number"
                    name="totalPrice"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="e.g. Guest name, special requests..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/25 hover:bg-red-700 disabled:opacity-50 btn-press transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Creating...' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
