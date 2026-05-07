import Link from 'next/link'
import { getListings } from '@/lib/actions/listings'
import ListingGrid from '@/components/listings/listing-grid'
import ListingCard from '@/components/listings/listing-card'
import { Search, Shield, Zap, Heart, ArrowRight, Home, Sparkles, Star, Users, Building, MapPin, Hammer, Plus } from 'lucide-react'

export default async function HomePage() {
  const [featuredListings, landListings, materialListings, lodgeListings, airbnbListings] = await Promise.all([
    getListings({ limit: 8 }),
    getListings({ type: 'land', limit: 4 }),
    getListings({ type: 'materials', limit: 4 }),
    getListings({ type: 'lodge', limit: 4 }),
    getListings({ type: 'airbnb', limit: 4 }),
  ])

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link href="/listings?type=rent" className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-6 shadow-lg shadow-zinc-200/40 hover:shadow-xl hover:shadow-zinc-200/60 hover:-translate-y-1 transition-all duration-300">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">Rentals</h3>
              <p className="text-zinc-500 mb-4 text-xs leading-relaxed">Apartments and houses for long-term rent.</p>
              <span className="inline-flex items-center gap-1.5 text-red-600 font-semibold text-xs group-hover:gap-3 transition-all">
                Browse <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          <Link href="/listings?type=airbnb" className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-6 shadow-lg shadow-zinc-200/40 hover:shadow-xl hover:shadow-zinc-200/60 hover:-translate-y-1 transition-all duration-300">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">Short Stays</h3>
              <p className="text-zinc-500 mb-4 text-xs leading-relaxed">Unique stays for vacations and business.</p>
              <span className="inline-flex items-center gap-1.5 text-orange-600 font-semibold text-xs group-hover:gap-3 transition-all">
                Browse <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          <Link href="/listings?type=lodge" className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-6 shadow-lg shadow-zinc-200/40 hover:shadow-xl hover:shadow-zinc-200/60 hover:-translate-y-1 transition-all duration-300">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">Lodges</h3>
              <p className="text-zinc-500 mb-4 text-xs leading-relaxed">Student accommodation and hostels.</p>
              <span className="inline-flex items-center gap-1.5 text-purple-600 font-semibold text-xs group-hover:gap-3 transition-all">
                Browse <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          <Link href="/listings?type=land" className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-6 shadow-lg shadow-zinc-200/40 hover:shadow-xl hover:shadow-zinc-200/60 hover:-translate-y-1 transition-all duration-300">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">Lands</h3>
              <p className="text-zinc-500 mb-4 text-xs leading-relaxed">Prime plots for your next project.</p>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-xs group-hover:gap-3 transition-all">
                Browse <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          <Link href="/listings?type=materials" className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-6 shadow-lg shadow-zinc-200/40 hover:shadow-xl hover:shadow-zinc-200/60 hover:-translate-y-1 transition-all duration-300">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Hammer className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">Materials</h3>
              <p className="text-zinc-500 mb-4 text-xs leading-relaxed">High-quality sourced materials.</p>
              <span className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-xs group-hover:gap-3 transition-all">
                Browse <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ===== LAND SHOWCASE (9:16) ===== */}
      {landListings.length > 0 && (
        <section className="bg-white py-24 overflow-hidden border-t border-zinc-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-3">Investment Opportunities</p>
                <h2 className="text-3xl sm:text-5xl font-black text-zinc-900">Land Showcase</h2>
              </div>
              <Link href="/listings?type=land" className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
                View All Lands <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {landListings.map((land) => (
                <Link key={land.id} href={`/listings/${land.id}`} className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500">
                  {land.listing_images?.[0]?.type === 'video' ? (
                    <video 
                      src={land.listing_images[0].url} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      muted playsInline loop autoPlay
                    />
                  ) : (
                    <img 
                      src={land.listing_images?.[0]?.url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format'} 
                      alt={land.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 text-[10px] font-bold text-white mb-3 uppercase tracking-wider shadow-lg shadow-red-600/30">
                      <Zap className="w-3 h-3 fill-current" /> Fast Selling
                    </div>
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-1 line-clamp-2 leading-tight group-hover:text-red-300 transition-colors">{land.title}</h3>
                    <p className="text-zinc-200 text-xs sm:text-sm flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3 text-red-400" /> {land.city}
                    </p>
                    <div className="text-white font-black text-lg">
                      ₦{land.price.toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== LODGE RENTALS (Student Focus) ===== */}
      {lodgeListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold mb-4">
                <Users className="w-3.5 h-3.5" /> For Students & Professionals
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">Premium Lodge Rentals</h2>
              <p className="text-zinc-500 mt-2 max-w-xl">Find comfortable, affordable, and secure lodges near your campus or workplace.</p>
            </div>
            <Link href="/listings?type=lodge" className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:gap-3 transition-all">
              Browse All Lodges <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ListingGrid listings={lodgeListings} />
        </section>
      )}

      {/* ===== BUILDING MATERIALS ===== */}
      {materialListings.length > 0 && (
        <section className="bg-zinc-50 py-24 border-y border-zinc-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-3">Quality Guaranteed</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">Building Materials</h2>
              </div>
              <Link href="/listings?type=materials" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                View Catalog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {materialListings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== AIRBNB / SHORT STAYS ===== */}
      {airbnbListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-3">Vacation & Business</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">Luxury Short Stays</h2>
            </div>
            <Link href="/listings?type=airbnb" className="inline-flex items-center gap-2 text-sm font-bold text-red-600">
              Explore Airbnb <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ListingGrid listings={airbnbListings} />
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
