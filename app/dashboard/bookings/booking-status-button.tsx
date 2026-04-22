'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateBookingStatus } from '@/lib/actions/bookings'
import { Check, X } from 'lucide-react'

export default function BookingStatusButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (status: 'confirmed' | 'cancelled') => {
    setLoading(true)
    await updateBookingStatus(bookingId, status)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex gap-1">
      <button
        onClick={() => handleUpdate('confirmed')}
        disabled={loading}
        className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 disabled:opacity-50 transition-colors"
        title="Confirm"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleUpdate('cancelled')}
        disabled={loading}
        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 transition-colors"
        title="Decline"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
