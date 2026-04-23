import { Phone, ArrowRight, Shield, Zap, CheckCircle2, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'List With Us | GodProperty',
  description: 'Apply to list your property with GodProperty. We handle everything from verification to booking.',
}

export default function ListWithUsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-zinc-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Real estate building" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-400 text-sm font-medium mb-6">
            Partner with Nigeria&apos;s finest
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            List Your Property <br />
            <span className="text-red-500">With GodProperty</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Maximize your property&apos;s potential. We handle the listings, the marketing, and the inquiries while you relax.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://wa.me/2348107920394?text=Hello,%20I%20want%20to%20list%20my%20property%20with%20GodProperty."
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us to Apply
            </a>
            <a 
              href="tel:+2348107920394"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-zinc-900 font-bold hover:bg-zinc-100 transition-all shadow-lg"
            >
              <Phone className="w-5 h-5" />
              Call Support
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-zinc-200/50 p-8 sm:p-12 border border-zinc-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-10 text-center">Simple 3-Step Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black">1</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Contact Us</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Reach out via WhatsApp or Phone with your property details.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black">2</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Verification</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Our team reviews and verifies the property for quality and legitimacy.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black">3</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Instant Listing</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">We list it on our platform and handle all client inquiries for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why partner with us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-6">Why List with <span className="text-red-600">GodProperty?</span></h2>
            <p className="text-zinc-500 mb-10 leading-relaxed">We aren&apos;t just a platform; we are your growth partners. We take the stress out of property management.</p>
            
            <div className="space-y-6">
              {[
                { title: 'Exclusive Network', desc: 'Get access to thousands of verified tenants and buyers looking for quality stays.' },
                { title: 'Zero Stress', desc: 'We handle all the phone calls, messages, and inquiries. You only hear from us when it&apos;s serious.' },
                { title: 'Secure Transactions', desc: 'All bookings and payments are processed with the highest security standards.' },
                { title: 'Professional Marketing', desc: 'Your property is showcased with premium design and high-quality photography.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                    <CheckCircle2 className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">{item.title}</h4>
                    <p className="text-sm text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Modern House" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl border border-zinc-100 hidden sm:block">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900">Verified Partner</div>
                  <div className="text-xs text-zinc-500">Trusted by 500+ Landlords</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-yellow-400">★</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-600 rounded-[3rem] p-8 sm:p-16 text-center text-white shadow-2xl shadow-red-600/30">
          <h2 className="text-3xl sm:text-4xl font-black mb-6">Ready to list your property?</h2>
          <p className="text-red-100 mb-10 max-w-xl mx-auto text-lg">
            Join our exclusive list of property owners and start earning today. One message is all it takes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <a 
              href="https://wa.me/2348107920394?text=Hello,%20I%20want%20to%20list%20my%20property%20with%20GodProperty."
              className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-white text-red-600 font-black hover:bg-zinc-50 transition-all shadow-xl"
            >
              Apply via WhatsApp
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
