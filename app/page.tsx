import Link from 'next/link'
import { getListings } from '@/lib/actions/listings'
import ListingGrid from '@/components/listings/listing-grid'
import { Search, Shield, Zap, Heart, ArrowRight, Home, Sparkles, Star, Users, Building, MapPin, Hammer, Plus } from 'lucide-react'

export default async function HomePage() {
  const featuredListings = await getListings({ limit: 8 })

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Beautiful home interior" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Light Overlay */}
        <div className="absolute inset-0 bg-white/85 z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent z-0" />

        {/* Subtle dot pattern over the image */}
        <div className="absolute inset-0 dot-pattern opacity-10 z-0 text-black" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-red-100 shadow-sm text-red-600 text-sm font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              Nigeria&apos;s #1 Property Platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-zinc-900 leading-[0.95] tracking-tight mb-6 animate-slide-up">
              Find Your
              <br />
              <span className="text-gradient-red bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-600 mb-10 max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Discover rentals and short stays that feel like home. Browse our exclusive catalog of premium properties and contact us for bookings.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/listings"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-red-600 text-white font-bold text-base shadow-lg shadow-red-600/30 hover:bg-red-700 btn-press transition-all"
              >
                <Search className="w-5 h-5" />
                Explore Properties
              </Link>
              <Link
                href="/list-with-us"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border border-zinc-200 text-zinc-900 font-bold text-base shadow-sm hover:bg-zinc-50 btn-press transition-all"
              >
                <Plus className="w-5 h-5 text-red-600" />
                List With Us
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 pt-10 border-t border-zinc-200/60 grid grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {[
              { value: '2,500+', label: 'Properties', icon: <Building className="w-5 h-5" /> },
              { value: '10K+', label: 'Happy Tenants', icon: <Users className="w-5 h-5" /> },
              { value: '500+', label: 'Verified Agents', icon: <Shield className="w-5 h-5" /> },
              { value: '4.9', label: 'Average Rating', icon: <Star className="w-5 h-5" /> },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center text-red-500">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-black text-zinc-900">{stat.value}</div>
                  <div className="text-xs font-medium text-zinc-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORY CARDS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link href="/listings?type=rent" className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-8 sm:p-10 shadow-lg shadow-zinc-200/40 hover:shadow-xl hover:shadow-zinc-200/60 hover:-translate-y-1 transition-all duration-300">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-5 group-hover:scale-110 transition-transform duration-300">
                <Home className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Monthly Rentals</h3>
              <p className="text-zinc-500 mb-5 text-sm leading-relaxed">Find apartments, houses, and studios for long-term rental across Nigeria.</p>
              <span className="inline-flex items-center gap-1.5 text-red-600 font-semibold text-sm group-hover:gap-3 transition-all">
                Browse Rentals <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-red-50/50 rounded-full group-hover:scale-[2] transition-transform duration-500" />
          </Link>

          <Link href="/listings?type=airbnb" className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-8 sm:p-10 shadow-lg shadow-zinc-200/40 hover:shadow-xl hover:shadow-zinc-200/60 hover:-translate-y-1 transition-all duration-300">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-5 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Short Stays</h3>
              <p className="text-zinc-500 mb-5 text-sm leading-relaxed">Browse unique stays for vacations, getaways, and business trips.</p>
              <span className="inline-flex items-center gap-1.5 text-orange-600 font-semibold text-sm group-hover:gap-3 transition-all">
                Browse Stays <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-orange-50/50 rounded-full group-hover:scale-[2] transition-transform duration-500" />
          </Link>

          <Link href="/listings?category=land" className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-8 shadow-lg shadow-zinc-200/40 hover:shadow-xl hover:shadow-zinc-200/60 hover:-translate-y-1 transition-all duration-300">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Land Sales</h3>
              <p className="text-zinc-500 mb-5 text-sm leading-relaxed">Secure prime plots of land for residential, commercial, or agricultural use.</p>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-sm group-hover:gap-3 transition-all">
                View Lands <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-50/50 rounded-full group-hover:scale-[2] transition-transform duration-500" />
          </Link>

          <Link href="/listings?category=materials" className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-8 shadow-lg shadow-zinc-200/40 hover:shadow-xl hover:shadow-zinc-200/60 hover:-translate-y-1 transition-all duration-300">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 group-hover:scale-110 transition-transform duration-300">
                <Hammer className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Building Materials</h3>
              <p className="text-zinc-500 mb-5 text-sm leading-relaxed">High-quality sourced materials directly from manufacturers for your projects.</p>
              <span className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                Shop Materials <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-50/50 rounded-full group-hover:scale-[2] transition-transform duration-500" />
          </Link>
        </div>
      </section>

      {/* ===== FEATURED LISTINGS ===== */}
      {featuredListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-2">Curated for you</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">Featured Properties</h2>
            </div>
            <Link href="/listings" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 hover:gap-2.5 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ListingGrid listings={featuredListings} />
          <div className="sm:hidden mt-8 text-center">
            <Link href="/listings" className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600">
              View all properties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ===== WHY CHOOSE US ===== */}
      <section className="bg-red-50/30 py-20 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-2">Why GodProperty?</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">Everything you need in one place</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="w-7 h-7" />,
                title: 'Verified Listings',
                desc: 'Every property is manually reviewed to ensure quality, accuracy, and legitimacy.',
                color: 'bg-emerald-50 text-emerald-600',
              },
              {
                icon: <Zap className="w-7 h-7" />,
                title: 'Hassle-free Booking',
                desc: 'We handle everything for you. Just call or WhatsApp us to secure your next home.',
                color: 'bg-amber-50 text-amber-600',
              },
              {
                icon: <Shield className="w-7 h-7" />,
                title: 'Secure Processing',
                desc: 'All booking requests and payments are handled securely through our trusted platform.',
                color: 'bg-red-50 text-red-600',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LANDLORD CTA ===== */}
      <section className="bg-zinc-900 py-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/10 skew-x-12 translate-x-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Are you a Landlord or Developer?</h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Join hundreds of property owners who trust GodProperty to manage their listings and find verified tenants. We handle the stress, you get the results.
              </p>
            </div>
            <Link 
              href="/list-with-us" 
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-red-600 text-white font-black hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all btn-press"
            >
              List Your Property With Us
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl py-16 px-8 sm:px-16 shadow-2xl shadow-red-600/20 group">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Beautiful property" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          
          {/* Overlay to make text pop */}
          <div className="absolute inset-0 bg-red-950/70 z-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-transparent z-0" />

          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-300 mb-3 drop-shadow-sm">Your next home awaits</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white drop-shadow-sm">Ready to move in?</h2>
            <p className="text-red-50 mb-8 max-w-lg leading-relaxed text-lg drop-shadow-sm">
              Browse our exclusive catalog of properties today. Call Us to easily save favorites and securely request viewings.
            </p>
            <a
              href="tel:+2348107920394"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-red-700 font-bold shadow-xl hover:bg-zinc-50 btn-press transition-all"
            >
              Contact Us <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
