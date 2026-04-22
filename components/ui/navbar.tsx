'use client'

import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { logout } from '@/lib/actions/auth'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, ChevronDown, Home, Search, LayoutDashboard, MessageSquare, LogOut, User, Plus } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'

export default function Navbar() {
  const { user, profile, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isAgent = profile?.role === 'agent' || profile?.role === 'admin'

  return (
    <header className="sticky top-0 z-50 glass border-b border-zinc-200/60">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="GodProperty" className="w-50 h-50 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/listings">Explore</NavLink>
            {user && (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
              </>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-32 h-10 skeleton rounded-xl" />
            ) : user ? (
              <div className="flex items-center gap-2">
                {isAgent && (
                  <Link href="/dashboard/listings/new" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors btn-press">
                    <Plus className="w-4 h-4" /> List
                  </Link>
                )}

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-zinc-200 hover:shadow-md hover:border-zinc-300 transition-all duration-200"
                  >
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-white" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                        {getInitials(profile?.full_name || 'U')}
                      </div>
                    )}
                    <ChevronDown className={cn("w-4 h-4 text-zinc-400 transition-transform duration-200", dropdownOpen && "rotate-180")} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl shadow-zinc-200/60 border border-zinc-100 py-2 animate-fade-in-scale origin-top-right">
                      <div className="px-4 py-3 border-b border-zinc-100">
                        <p className="text-sm font-semibold text-zinc-900">{profile?.full_name}</p>
                        <p className="text-xs text-zinc-500 capitalize mt-0.5">{profile?.role} account</p>
                      </div>
                      <div className="py-1">
                        <DropdownLink href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} onClick={() => setDropdownOpen(false)}>Dashboard</DropdownLink>
                        <DropdownLink href="/dashboard" icon={<User className="w-4 h-4" />} onClick={() => setDropdownOpen(false)}>Profile</DropdownLink>
                      </div>
                      <div className="border-t border-zinc-100 pt-1">
                        <form action={logout}>
                          <button type="submit" className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full rounded-lg mx-1 transition-colors">
                            <LogOut className="w-4 h-4" /> Sign out
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="px-4 py-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-all">
                  Log in
                </Link>
                <Link href="/auth/signup" className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl shadow-md shadow-red-600/25 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30 btn-press transition-all">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl hover:bg-zinc-100 transition-colors">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-white z-50 md:hidden animate-slide-down shadow-2xl rounded-b-2xl">
            <div className="px-4 py-5 space-y-1">
              <MobileNavLink href="/" onClick={() => setMobileOpen(false)} icon={<Home className="w-5 h-5" />}>Home</MobileNavLink>
              <MobileNavLink href="/listings" onClick={() => setMobileOpen(false)} icon={<Search className="w-5 h-5" />}>Explore</MobileNavLink>
              {user && (
                <>
                  <MobileNavLink href="/dashboard" onClick={() => setMobileOpen(false)} icon={<LayoutDashboard className="w-5 h-5" />}>Dashboard</MobileNavLink>
                </>
              )}
              <div className="border-t border-zinc-100 pt-4 mt-4">
                {user ? (
                  <form action={logout}>
                    <button type="submit" className="flex items-center gap-3 w-full px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 font-medium transition-colors">
                      <LogOut className="w-5 h-5" /> Sign out
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="text-center py-3 text-sm font-semibold text-zinc-700 border border-zinc-200 rounded-xl hover:bg-zinc-50">
                      Log in
                    </Link>
                    <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="text-center py-3 text-sm font-semibold text-white bg-red-600 rounded-xl">
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="px-3.5 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100/70 transition-all duration-150">
      {children}
    </Link>
  )
}

function DropdownLink({ href, icon, onClick, children }: { href: string; icon: React.ReactNode; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg mx-1 transition-colors">
      <span className="text-zinc-400">{icon}</span> {children}
    </Link>
  )
}

function MobileNavLink({ href, onClick, icon, children }: { href: string; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-3 px-4 py-3 text-zinc-700 rounded-xl hover:bg-zinc-50 transition-colors">
      <span className="text-zinc-400">{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  )
}
