// ============================================
// Database Types — mirrors supabase/schema.sql
// ============================================

export type UserRole = 'user' | 'agent' | 'admin'
export type ListingType = 'rent' | 'airbnb' | 'land' | 'materials' | 'lodge'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  avatar_url: string | null
  phone: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  owner_id: string
  title: string
  description: string
  price: number
  type: ListingType
  location: string
  city: string
  state: string
  country: string
  amenities: string[]
  bedrooms: number
  bathrooms: number
  max_guests: number
  landlord_phone: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface ListingImage {
  id: string
  listing_id: string
  url: string
  type: 'image' | 'video'
  thumbnail_url: string | null
  position: number
  is_cover: boolean
  created_at: string
}

export interface Booking {
  id: string
  listing_id: string
  guest_id: string
  check_in: string
  check_out: string
  total_price: number
  guests_count: number
  status: BookingStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  listing_id: string | null
  created_at: string
  updated_at: string
}

export interface ConversationParticipant {
  conversation_id: string
  user_id: string
  joined_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

// Supabase Database type for client generics
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string }
        Update: Partial<Profile>
      }
      listings: {
        Row: Listing
        Insert: Omit<Listing, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Listing, 'id' | 'created_at' | 'updated_at'>>
      }
      listing_images: {
        Row: ListingImage
        Insert: Omit<ListingImage, 'id' | 'created_at'>
        Update: Partial<Omit<ListingImage, 'id' | 'created_at'>>
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>
      }
      conversations: {
        Row: Conversation
        Insert: Partial<Omit<Conversation, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Omit<Conversation, 'id' | 'created_at' | 'updated_at'>>
      }
      conversation_participants: {
        Row: ConversationParticipant
        Insert: Omit<ConversationParticipant, 'joined_at'>
        Update: Partial<ConversationParticipant>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at' | 'is_read'>
        Update: Partial<Omit<Message, 'id' | 'created_at'>>
      }
    }
    Enums: {
      user_role: UserRole
      listing_type: ListingType
      booking_status: BookingStatus
    }
  }
}
