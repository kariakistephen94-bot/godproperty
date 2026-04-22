import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getListingById } from '@/lib/actions/listings'
import EditListingForm from './edit-listing-form'

export const metadata = {
  title: 'Edit Listing',
}

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const listing = await getListingById(id)

  if (!listing) notFound()
  if (listing.owner_id !== user.id) redirect('/dashboard/listings')

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Listing</h1>
      <EditListingForm listing={listing} />
    </div>
  )
}
