-- ============================================
-- Real Estate Platform — Database Schema
-- ============================================
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. ENUM TYPES
-- ============================================

CREATE TYPE user_role AS ENUM ('user', 'agent', 'admin');
CREATE TYPE listing_type AS ENUM ('rent', 'airbnb', 'land', 'materials');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- 2. PROFILES (extends auth.users)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. LISTINGS
-- ============================================

CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  type listing_type NOT NULL DEFAULT 'rent',
  location TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  amenities TEXT[] NOT NULL DEFAULT '{}',
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  max_guests INTEGER NOT NULL DEFAULT 1,
  landlord_phone TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_listings_owner ON listings(owner_id);
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_published ON listings(is_published);
CREATE INDEX idx_listings_created ON listings(created_at DESC);

-- 4. LISTING IMAGES
-- ============================================

CREATE TABLE listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_listing_images_listing ON listing_images(listing_id);

-- 5. BOOKINGS
-- ============================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0),
  guests_count INTEGER NOT NULL DEFAULT 1,
  status booking_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

CREATE INDEX idx_bookings_listing ON bookings(listing_id);
CREATE INDEX idx_bookings_guest ON bookings(guest_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_bookings_status ON bookings(status);

-- 6. CONVERSATIONS
-- ============================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Junction table for conversation participants
CREATE TABLE conversation_participants (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX idx_conv_participants_user ON conversation_participants(user_id);

-- 7. MESSAGES
-- ============================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- 8. UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- LISTINGS policies
CREATE POLICY "Published listings are viewable by everyone"
  ON listings FOR SELECT USING (is_published = true OR owner_id = auth.uid());

CREATE POLICY "Agents can create listings"
  ON listings FOR INSERT WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
  );

CREATE POLICY "Owners can update their listings"
  ON listings FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their listings"
  ON listings FOR DELETE USING (owner_id = auth.uid());

-- LISTING_IMAGES policies
CREATE POLICY "Listing images are viewable by everyone"
  ON listing_images FOR SELECT USING (true);

CREATE POLICY "Listing owners can manage images"
  ON listing_images FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND owner_id = auth.uid())
  );

CREATE POLICY "Listing owners can delete images"
  ON listing_images FOR DELETE USING (
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND owner_id = auth.uid())
  );

-- BOOKINGS policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT USING (
    guest_id = auth.uid() OR
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND owner_id = auth.uid())
  );

CREATE POLICY "Authenticated users can create bookings"
  ON bookings FOR INSERT WITH CHECK (auth.uid() = guest_id);

CREATE POLICY "Booking participants can update status"
  ON bookings FOR UPDATE USING (
    guest_id = auth.uid() OR
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND owner_id = auth.uid())
  );

-- CONVERSATIONS policies
CREATE POLICY "Participants can view conversations"
  ON conversations FOR SELECT USING (
    EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = id AND user_id = auth.uid())
  );

CREATE POLICY "Authenticated users can create conversations"
  ON conversations FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- CONVERSATION PARTICIPANTS policies
CREATE POLICY "Participants can view participants"
  ON conversation_participants FOR SELECT USING (
    EXISTS (SELECT 1 FROM conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid())
  );

CREATE POLICY "Authenticated users can add participants"
  ON conversation_participants FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- MESSAGES policies
CREATE POLICY "Participants can view messages"
  ON messages FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can send messages"
  ON messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    )
  );

-- 10. REALTIME (enable for messages table)
-- ============================================
-- Run in Supabase Dashboard: Database → Replication → Enable for `messages` table
-- Or use: ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 11. STORAGE BUCKET
-- ============================================
-- Create in Supabase Dashboard: Storage → New Bucket → "listing-images" (public)
-- Or uncomment below if using Supabase CLI:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('listing-images', 'listing-images', true);
