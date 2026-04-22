// Re-export all types
export type {
  Database,
  Profile,
  Listing,
  ListingImage,
  Booking,
  Conversation,
  ConversationParticipant,
  Message,
  UserRole,
  ListingType,
  BookingStatus,
} from './database'

// Derived types — composed from base types for convenience

import type { Listing, ListingImage, Profile, Booking, Message, Conversation } from './database'

export interface ListingWithImages extends Listing {
  listing_images: ListingImage[]
}

export interface ListingWithOwner extends Listing {
  listing_images: ListingImage[]
  profiles: Profile
}

export interface BookingWithListing extends Booking {
  listings: Listing & { listing_images: ListingImage[] }
}

export interface BookingWithGuest extends Booking {
  profiles: Profile
  listings: Listing
}

export interface ConversationWithDetails extends Conversation {
  conversation_participants: {
    user_id: string
    profiles: Profile
  }[]
  messages: Message[]
}

export interface MessageWithSender extends Message {
  profiles: Profile
}
