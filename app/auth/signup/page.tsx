'use client'

import { useActionState } from 'react'
import { signup, type AuthState } from '@/lib/actions/auth'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Home, Search } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const initialState: AuthState = {}
  const [state, formAction, pending] = useActionState(signup, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-zinc-50">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="GodProperty" className="w-12 h-12 object-contain drop-shadow-md" />
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900">Create your account</h1>
          <p className="text-sm text-zinc-500 mt-1">Join GodProperty to find your next home</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 p-7">
          {state.error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-zinc-700 mb-1.5">Full name</label>
              <input id="fullName" name="fullName" type="text" autoComplete="name" required placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required placeholder="Min. 6 characters" minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all pr-11" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 mb-1.5">Confirm password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" />
            </div>

            {/* Role defaults to user */}
            <input type="hidden" name="role" value="user" />

            <button type="submit" disabled={pending}
              className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold shadow-lg shadow-red-600/25 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed btn-press transition-all flex items-center justify-center gap-2">
              {pending ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  Creating...
                </span>
              ) : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-red-600 hover:text-red-700">Log in</Link>
        </p>
      </div>
    </div>
  )
}
