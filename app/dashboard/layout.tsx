import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, Home, CalendarDays, MessageSquare } from 'lucide-react'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/dashboard')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isAgent = profile?.role === 'agent' || profile?.role === 'admin'

  const navItems = [
    { href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview' },
    ...(isAgent ? [{ href: '/dashboard/listings', icon: <Home className="w-5 h-5" />, label: 'My Listings' }] : []),
    { href: '/dashboard/bookings', icon: <CalendarDays className="w-5 h-5" />, label: 'Bookings' },
  ]

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-60 shrink-0">
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden lg:sticky lg:top-24">
              {/* Profile */}
              <div className="p-5 border-b border-zinc-100 bg-gradient-to-br from-red-600 to-red-700 text-white">
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg mb-3">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <h3 className="font-semibold truncate">{profile?.full_name || 'User'}</h3>
                <p className="text-xs text-red-200 capitalize mt-0.5">{profile?.role} account</p>
              </div>

              {/* Nav */}
              <nav className="flex lg:flex-col p-2 gap-0.5 overflow-x-auto lg:overflow-visible">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors whitespace-nowrap">
                    <span className="text-zinc-400">{item.icon}</span>
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  )
}
