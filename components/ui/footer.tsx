import Link from 'next/link'
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white text-zinc-600 mt-auto border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">         
              <img src="/logo.png" alt="GodProperty" className="w-20 h-20 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
            </Link>
            <p className="text-sm leading-relaxed text-zinc-500">
              Your trusted platform for finding the perfect rental home or short-stay experience across Nigeria.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-5">Explore</h3>
            <ul className="space-y-3">
              {[
                { href: '/listings?type=rent', label: 'Rentals' },
                { href: '/listings?type=airbnb', label: 'Short Stays' },
                { href: '/listings?category=land', label: 'Land Sales' },
                { href: '/listings?category=materials', label: 'Building Materials' },
                { href: '/dashboard', label: 'Dashboard' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-600 hover:text-red-600 flex items-center gap-1 group transition-colors">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-red-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-5">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Safety', 'Terms of Service', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <span className="text-sm text-zinc-600 hover:text-red-600 cursor-pointer transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-5">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <Mail className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>hello@haven.ng</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Phone className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>+234 800 000 0000</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-100 mt-14 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} GodProperty. All rights reserved.
          </p>
          <p className="text-xs text-zinc-400">
            Built with Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  )
}
