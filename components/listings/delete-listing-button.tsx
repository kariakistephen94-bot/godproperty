'use client'

import { useState } from 'react'
import { deleteListing } from '@/lib/actions/listings'
import { useRouter } from 'next/navigation'

import { Trash2 } from 'lucide-react'

interface DeleteListingButtonProps {
  id: string
  variant?: 'default' | 'icon'
}

export default function DeleteListingButton({ id, variant = 'default' }: DeleteListingButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      await deleteListing(id)
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete listing')
      setLoading(false)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleDelete}
        disabled={loading}
        title="Delete Listing"
        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex-1 py-3 px-4 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all text-sm disabled:opacity-50"
    >
      {loading ? 'Deleting...' : 'Delete Listing'}
    </button>
  )
}
