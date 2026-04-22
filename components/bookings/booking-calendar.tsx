'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { createBooking } from '@/lib/actions/bookings'
import { formatPrice, calculateNights } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Booking } from '@/types'

interface BookingCalendarProps {
  listingId: string
  pricePerNight: number
  existingBookings: Booking[]
}

export default function BookingCalendar({ listingId, pricePerNight, existingBookings }: BookingCalendarProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const bookedRanges = existingBookings.map(b => ({ start: new Date(b.check_in), end: new Date(b.check_out) }))
  const isDateBooked = (date: Date) => bookedRanges.some(range => date >= range.start && date < range.end)
  const isDateDisabled = (date: Date) => date < today || isDateBooked(date)

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date); setCheckOut(null)
    } else {
      if (date > checkIn) setCheckOut(date)
      else { setCheckIn(date); setCheckOut(null) }
    }
  }

  const isInRange = (date: Date) => checkIn && checkOut ? date > checkIn && date < checkOut : false

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0
  const totalPrice = nights * pricePerNight
  const serviceFee = Math.round(totalPrice * 0.05)

  const handleBook = async () => {
    if (!user) { router.push(`/auth/login?redirect=/listings/${listingId}`); return }
    if (!checkIn || !checkOut) return
    setLoading(true); setError('')
    const result = await createBooking(listingId, checkIn.toISOString().split('T')[0], checkOut.toISOString().split('T')[0], guests, totalPrice + serviceFee)
    setLoading(false)
    if (result.success) setSuccess(true)
    else setError(result.error || 'Booking failed')
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-lg font-bold text-zinc-900 mb-2">Booking Requested!</h3>
        <p className="text-sm text-zinc-500 mb-5">The host will confirm shortly.</p>
        <button onClick={() => router.push('/dashboard/bookings')} className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors">View Bookings</button>
      </div>
    )
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const days: (Date | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i))

  return (
    <div className="space-y-4">
      {/* Date inputs */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Check-in</div>
          <div className="text-sm text-zinc-900 mt-0.5 font-medium">{checkIn ? checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Add date'}</div>
        </div>
        <div className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Check-out</div>
          <div className="text-sm text-zinc-900 mt-0.5 font-medium">{checkOut ? checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Add date'}</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="border border-zinc-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-bold text-zinc-900">{monthName}</span>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>

        <div className="grid grid-cols-7 gap-0.5 text-center">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-[10px] font-semibold text-zinc-400 py-1.5">{d}</div>
          ))}
          {days.map((date, i) => {
            if (!date) return <div key={`e-${i}`} />
            const disabled = isDateDisabled(date)
            const isStart = checkIn && date.getTime() === checkIn.getTime()
            const isEnd = checkOut && date.getTime() === checkOut.getTime()
            const inRange = isInRange(date)
            return (
              <button key={i} onClick={() => handleDateClick(date)} disabled={disabled}
                className={cn("w-full aspect-square rounded-lg text-[13px] font-medium transition-all",
                  disabled && "text-zinc-300 cursor-not-allowed line-through",
                  !disabled && "hover:bg-zinc-100 text-zinc-700 cursor-pointer",
                  (isStart || isEnd) && "!bg-red-600 !text-white font-bold",
                  inRange && "!bg-red-50 text-red-700"
                )}>
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Guests */}
      <div className="flex items-center justify-between p-3 border border-zinc-200 rounded-xl">
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Guests</div>
          <div className="text-sm text-zinc-900 font-medium">{guests} guest{guests > 1 ? 's' : ''}</div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setGuests(Math.max(1, guests - 1))} disabled={guests <= 1}
            className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:border-zinc-400 disabled:opacity-30 transition-colors"><Minus className="w-3.5 h-3.5" /></button>
          <span className="text-sm font-semibold w-3 text-center">{guests}</span>
          <button onClick={() => setGuests(guests + 1)}
            className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:border-zinc-400 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Price */}
      {nights > 0 && (
        <div className="space-y-2 pt-3 border-t border-zinc-100">
          <div className="flex justify-between text-sm"><span className="text-zinc-500">{formatPrice(pricePerNight)} × {nights} night{nights > 1 ? 's' : ''}</span><span className="text-zinc-900">{formatPrice(totalPrice)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-zinc-500">Service fee</span><span className="text-zinc-900">{formatPrice(serviceFee)}</span></div>
          <div className="flex justify-between font-bold pt-2 border-t border-zinc-100"><span>Total</span><span>{formatPrice(totalPrice + serviceFee)}</span></div>
        </div>
      )}

      {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">{error}</div>}

      <button onClick={handleBook} disabled={!checkIn || !checkOut || loading}
        className="w-full py-3.5 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed btn-press transition-all">
        {loading ? 'Reserving...' : !checkIn ? 'Select dates' : 'Reserve'}
      </button>
    </div>
  )
}
