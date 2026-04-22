'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Application error:', error) }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-zinc-500 mb-6">We encountered an unexpected error. Please try again.</p>
        <button onClick={reset} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-800 btn-press transition-all">
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      </div>
    </div>
  )
}
