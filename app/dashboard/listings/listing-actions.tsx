'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { togglePublish, deleteListing } from '@/lib/actions/listings'
import { Edit, Eye, EyeOff, Trash2, MoreVertical } from 'lucide-react'
import Link from 'next/link'

interface ListingActionsProps {
  listingId: string
  isPublished: boolean
}

export default function ListingActions({ listingId, isPublished }: ListingActionsProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleTogglePublish = async () => {
    setLoading(true)
    await togglePublish(listingId, !isPublished)
    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing?')) return
    setLoading(true)
    await deleteListing(listingId)
    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-slate-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 animate-fade-in">
            <Link
              href={`/dashboard/listings/${listingId}/edit`}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <Edit className="w-4 h-4" /> Edit
            </Link>
            <button
              onClick={handleTogglePublish}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 w-full transition-colors disabled:opacity-50"
            >
              {isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPublished ? 'Unpublish' : 'Publish'}
            </button>
            <div className="border-t border-slate-100 my-1" />
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}
