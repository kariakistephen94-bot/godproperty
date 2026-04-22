import { createClient } from '@/lib/supabase/server'
import { getMyListings } from '@/lib/actions/listings'
import { getMyBookings, getBookingsForMyListings } from '@/lib/actions/bookings'
import { Home, CalendarDays, MessageSquare, TrendingUp, ArrowRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const isAgent = profile?.role === 'agent' || profile?.role === 'admin'
  const myListings = isAgent ? await getMyListings() : []
  const myBookings = await getMyBookings()
  const incomingBookings = isAgent ? await getBookingsForMyListings() : []
  const publishedCount = myListings.filter(l => l.is_published).length
  const pendingBookings = incomingBookings.filter(b => b.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Here&apos;s what&apos;s happening with your properties.</p>
        </div>
        {isAgent && (
          <Link href="/dashboard/listings/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm shadow-md shadow-red-600/20 hover:bg-red-700 btn-press transition-all shrink-0">
            <Plus className="w-4 h-4" /> New Listing
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isAgent && (
          <>
            <StatCard icon={<Home className="w-5 h-5" />} label="Active Listings" value={publishedCount} color="bg-red-50 text-red-600" />
            <StatCard icon={<CalendarDays className="w-5 h-5" />} label="Pending Requests" value={pendingBookings} color="bg-amber-50 text-amber-600" />
          </>
        )}
        <StatCard icon={<CalendarDays className="w-5 h-5" />} label="My Bookings" value={myBookings.length} color="bg-emerald-50 text-emerald-600" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Total Properties" value={myListings.length} color="bg-blue-50 text-blue-600" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isAgent && (
          <QuickAction href="/dashboard/listings/new" icon={<Home className="w-5 h-5" />} title="Create Listing" desc="Add a new property" color="bg-red-50 text-red-600" />
        )}
        <QuickAction href="/dashboard/bookings" icon={<CalendarDays className="w-5 h-5" />} title="Bookings" desc={isAgent ? 'Manage requests' : 'Your history'} color="bg-amber-50 text-amber-600" />
      </div>

      {/* Recent Bookings */}
      {myBookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-zinc-900">Recent Bookings</h2>
            <Link href="/dashboard/bookings" className="text-sm text-red-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-zinc-50">
            {myBookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-zinc-100 overflow-hidden shrink-0">
                    {booking.listings?.listing_images?.[0]?.url && (
                      <img src={booking.listings.listing_images[0].url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-zinc-900 truncate text-sm">{booking.listings?.title || 'Property'}</h4>
                    <p className="text-xs text-zinc-500">{formatDate(booking.check_in)} → {formatDate(booking.check_out)}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                  booking.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                  booking.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                  'bg-zinc-100 text-zinc-600'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
    </div>
  )
}

function QuickAction({ href, icon, title, desc, color }: { href: string; icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <Link href={href} className="group bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>{icon}</div>
      <h3 className="font-semibold text-zinc-900 text-sm flex items-center gap-1">
        {title}
        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </h3>
      <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
    </Link>
  )
}
