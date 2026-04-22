import { createClient } from '@/lib/supabase/server'
import { getMyBookings, getBookingsForMyListings, updateBookingStatus } from '@/lib/actions/bookings'
import { formatPrice, formatDate } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { CalendarDays } from 'lucide-react'
import BookingStatusButton from './booking-status-button'

export const metadata = {
  title: 'Bookings',
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAgent = profile?.role === 'agent' || profile?.role === 'admin'
  const myBookings = await getMyBookings()
  const incomingBookings = isAgent ? await getBookingsForMyListings() : []

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>

      {/* Incoming Bookings (for agents) */}
      {isAgent && incomingBookings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Incoming Requests</h2>
          <div className="space-y-3">
            {incomingBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{booking.listings?.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Guest: {booking.profiles?.full_name} · {booking.guests_count} guest{booking.guests_count > 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                      <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4" /> {formatDate(booking.check_in)} → {formatDate(booking.check_out)}</span>
                      <span className="font-semibold">{formatPrice(booking.total_price)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {booking.status}
                    </span>
                    {booking.status === 'pending' && (
                      <BookingStatusButton bookingId={booking.id} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Bookings */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">My Bookings</h2>
        {myBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No bookings yet</h3>
            <p className="text-sm text-slate-500">Your booking history will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-40 h-32 sm:h-auto shrink-0 bg-slate-100">
                    {booking.listings?.listing_images?.[0]?.url && (
                      <img src={booking.listings.listing_images[0].url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{booking.listings?.title || 'Property'}</h3>
                        <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                          <span>{formatDate(booking.check_in)} → {formatDate(booking.check_out)}</span>
                          <span>{booking.guests_count} guest{booking.guests_count > 1 ? 's' : ''}</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 mt-2">{formatPrice(booking.total_price)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                        booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
