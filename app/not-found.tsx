import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-[120px] font-black text-zinc-100 leading-none mb-2">404</div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Page not found</h2>
        <p className="text-sm text-zinc-500 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 btn-press transition-all">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link href="/listings" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-all">
            <Search className="w-4 h-4" /> Browse Listings
          </Link>
        </div>
      </div>
    </div>
  )
}
