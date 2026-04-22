'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Booking, BookingWithListing, BookingWithGuest } from '@/types'

export async function createBooking(
  listingId: string,
  checkIn: string,
  checkOut: string,
  guestsCount: number = 1,
  totalPrice: number
): Promise<{ success: boolean; error?: string; booking?: Booking }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'You must be logged in to book' }

  // Check availability (no overlapping confirmed/pending bookings)
  const { data: conflicts } = await supabase
    .from('bookings')
    .select('id')
    .eq('listing_id', listingId)
    .in('status', ['pending', 'confirmed'])
    .lt('check_in', checkOut)
    .gt('check_out', checkIn)

  if (conflicts && conflicts.length > 0) {
    return { success: false, error: 'These dates are not available' }
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      listing_id: listingId,
      guest_id: user.id,
      check_in: checkIn,
      check_out: checkOut,
      guests_count: guestsCount,
      total_price: totalPrice,
      status: 'pending',
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath(`/listings/${listingId}`)
  revalidatePath('/dashboard/bookings')
  return { success: true, booking: data }
}

export async function getBookingsForListing(listingId: string): Promise<Booking[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('listing_id', listingId)
    .in('status', ['pending', 'confirmed'])

  if (error) {
    console.error('Error fetching bookings:', error)
    return []
  }

  return data || []
}

export async function getMyBookings(): Promise<BookingWithListing[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('bookings')
    .select('*, listings(*, listing_images(*))')
    .eq('guest_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching my bookings:', error)
    return []
  }

  return (data as BookingWithListing[]) || []
}

export async function getBookingsForMyListings(): Promise<BookingWithGuest[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('bookings')
    .select('*, profiles(*), listings(*)')
    .eq('listings.owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings for my listings:', error)
    return []
  }

  return (data as BookingWithGuest[]) || []
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'confirmed' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/bookings')
  return { success: true }
}

export async function createManualBooking(
  listingId: string,
  checkIn: string,
  checkOut: string,
  guestsCount: number = 1,
  totalPrice: number,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Unauthorized' }

  // Check if user is agent/admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'agent' && profile?.role !== 'admin') {
    return { success: false, error: 'Only agents and admins can create manual bookings' }
  }

  // Check availability
  const { data: conflicts } = await supabase
    .from('bookings')
    .select('id')
    .eq('listing_id', listingId)
    .in('status', ['pending', 'confirmed'])
    .lt('check_in', checkOut)
    .gt('check_out', checkIn)

  if (conflicts && conflicts.length > 0) {
    return { success: false, error: 'This property is already booked for these dates' }
  }

  const { error } = await supabase
    .from('bookings')
    .insert({
      listing_id: listingId,
      guest_id: user.id, // Recorded under the agent's ID
      check_in: checkIn,
      check_out: checkOut,
      guests_count: guestsCount,
      total_price: totalPrice,
      status: 'confirmed',
      notes: notes || 'Manual booking created by agent'
    })

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/bookings')
  revalidatePath(`/listings/${listingId}`)
  revalidatePath('/')
  return { success: true }
}
