'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ListingWithImages, ListingWithOwner, ListingType } from '@/types'

export interface ListingFilters {
  type?: ListingType
  city?: string
  priceMin?: number
  priceMax?: number
  q?: string
  limit?: number
  offset?: number
}

export async function getListings(filters: ListingFilters = {}): Promise<ListingWithImages[]> {
  const supabase = await createClient()

  // Auto-exclude listings that are currently booked out
  const today = new Date().toISOString().split('T')[0]
  const { data: bookedListings } = await supabase
    .from('bookings')
    .select('listing_id')
    .eq('status', 'confirmed')
    .lte('check_in', today)
    .gt('check_out', today)

  const excludedIds = bookedListings?.map(b => b.listing_id) || []

  let query = supabase
    .from('listings')
    .select('*, listing_images(*)')
    .eq('is_published', true)

  if (excludedIds.length > 0) {
    query = query.not('id', 'in', `(${excludedIds.join(',')})`)
  }

  query = query.order('created_at', { ascending: false })

  if (filters.type) {
    query = query.eq('type', filters.type)
  }

  if (filters.city) {
    query = query.ilike('city', `%${filters.city}%`)
  }

  if (filters.priceMin) {
    query = query.gte('price', filters.priceMin)
  }

  if (filters.priceMax) {
    query = query.lte('price', filters.priceMax)
  }

  if (filters.q) {
    query = query.or(`title.ilike.%${filters.q}%,description.ilike.%${filters.q}%,location.ilike.%${filters.q}%`)
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 12) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching listings:', error)
    return []
  }

  return (data as ListingWithImages[]) || []
}

export async function getListingById(id: string): Promise<ListingWithOwner | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('listings')
    .select('*, listing_images(*), profiles(*)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching listing:', error)
    return null
  }

  return data as ListingWithOwner
}

export async function getMyListings(): Promise<ListingWithImages[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('listings')
    .select('*, listing_images(*)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching my listings:', error)
    return []
  }

  return (data as ListingWithImages[]) || []
}

export async function createListing(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const type = formData.get('type') as ListingType
  const location = formData.get('location') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const country = formData.get('country') as string || 'Nigeria'
  const bedrooms = parseInt(formData.get('bedrooms') as string) || 0
  const bathrooms = parseInt(formData.get('bathrooms') as string) || 0
  const maxGuests = parseInt(formData.get('maxGuests') as string) || 1
  const amenitiesStr = formData.get('amenities') as string
  const amenities = amenitiesStr ? amenitiesStr.split(',') : []
  const isPublished = formData.get('isPublished') === 'true'
  const landlordPhone = formData.get('landlordPhone') as string || null

  const { data, error } = await supabase
    .from('listings')
    .insert({
      owner_id: user.id,
      title,
      description,
      price,
      type,
      location,
      city,
      state,
      country,
      bedrooms,
      bathrooms,
      max_guests: maxGuests,
      amenities,
      landlord_phone: landlordPhone,
      is_published: isPublished,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Handle image uploads
  const images = formData.getAll('images') as File[]
  const validImages = images.filter(img => img.size > 0)
  
  if (validImages.length > 0) {
    for (let i = 0; i < validImages.length; i++) {
      const file = validImages[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${data.id}/${Date.now()}_${i}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('listing-images')
          .getPublicUrl(fileName)

        await supabase.from('listing_images').insert({
          listing_id: data.id,
          url: urlData.publicUrl,
          position: i,
          is_cover: i === 0,
        })
      } else {
        console.error('Error uploading image:', uploadError)
      }
    }
  }

  revalidatePath('/listings')
  revalidatePath('/dashboard/listings')
  return data
}

export async function updateListing(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const updates: Record<string, unknown> = {}
  const fields = ['title', 'description', 'type', 'location', 'city', 'state', 'country', 'landlord_phone']
  fields.forEach(field => {
    const val = formData.get(field === 'landlord_phone' ? 'landlordPhone' : field)
    if (val !== null) updates[field] = val
  })

  const price = formData.get('price')
  if (price) updates.price = parseFloat(price as string)

  const bedrooms = formData.get('bedrooms')
  if (bedrooms) updates.bedrooms = parseInt(bedrooms as string)

  const bathrooms = formData.get('bathrooms')
  if (bathrooms) updates.bathrooms = parseInt(bathrooms as string)

  const maxGuests = formData.get('maxGuests')
  if (maxGuests) updates.max_guests = parseInt(maxGuests as string)

  const amenitiesStr = formData.get('amenities')
  if (amenitiesStr) updates.amenities = (amenitiesStr as string).split(',')

  const isPublished = formData.get('isPublished')
  if (isPublished !== null) updates.is_published = isPublished === 'true'

  const { error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) throw new Error(error.message)

  // Handle new image uploads
  const images = formData.getAll('images') as File[]
  const validImages = images.filter(img => img.size > 0)
  
  if (validImages.length > 0) {
    // Get current max position
    const { data: currentImages } = await supabase
      .from('listing_images')
      .select('position')
      .eq('listing_id', id)
      .order('position', { ascending: false })
      .limit(1)
    
    let startPos = (currentImages && currentImages.length > 0) ? currentImages[0].position + 1 : 0

    for (let i = 0; i < validImages.length; i++) {
      const file = validImages[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${id}/${Date.now()}_${i}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file)

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('listing-images')
          .getPublicUrl(fileName)

        await supabase.from('listing_images').insert({
          listing_id: id,
          url: urlData.publicUrl,
          position: startPos + i,
          is_cover: startPos + i === 0,
        })
      }
    }
  }

  revalidatePath('/listings')
  revalidatePath(`/listings/${id}`)
  revalidatePath('/dashboard/listings')
}

export async function deleteListing(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/listings')
  revalidatePath('/dashboard/listings')
}

export async function togglePublish(id: string, isPublished: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('listings')
    .update({ is_published: isPublished })
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/listings')
  revalidatePath('/dashboard/listings')
}
