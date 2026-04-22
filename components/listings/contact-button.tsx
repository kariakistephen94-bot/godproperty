'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { MessageSquare } from 'lucide-react'

interface ContactButtonProps {
  listingId: string
  ownerId: string
}

export default function ContactButton({ listingId, ownerId }: ContactButtonProps) {
  const { user } = useAuth()
  const router = useRouter()

  const handleContact = async () => {
    if (!user) {
      router.push(`/auth/login?redirect=/listings/${listingId}`)
      return
    }

    // Navigate to messages — the conversation will be created on the messages page
    router.push(`/messages?listing=${listingId}&to=${ownerId}`)
  }

  return (
    <button
      onClick={handleContact}
      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
    >
      <MessageSquare className="w-5 h-5" />
      Contact Agent
    </button>
  )
}
