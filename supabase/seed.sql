-- ============================================
-- Seed Data — Run AFTER schema.sql and signing up at least one user
-- ============================================
-- This script auto-detects the first user in your profiles table.
-- Make sure you've signed up via the app first!

DO $$
DECLARE
  owner_id UUID;
  listing_1 UUID;
  listing_2 UUID;
  listing_3 UUID;
  listing_4 UUID;
  listing_5 UUID;
  listing_6 UUID;
BEGIN
  -- Get the first user's ID
  SELECT id INTO owner_id FROM profiles ORDER BY created_at ASC LIMIT 1;

  IF owner_id IS NULL THEN
    RAISE EXCEPTION 'No users found! Sign up via the app first, then run this seed.';
  END IF;

  -- Also make sure this user is an agent so they can own listings
  UPDATE profiles SET role = 'agent' WHERE id = owner_id;

  -- Insert listings
  INSERT INTO listings (id, owner_id, title, description, price, type, location, city, state, country, amenities, bedrooms, bathrooms, max_guests, is_published)
  VALUES
    (gen_random_uuid(), owner_id, 'Modern Downtown Apartment', 'A stunning modern apartment in the heart of downtown with panoramic city views. Features floor-to-ceiling windows, hardwood floors, and a gourmet kitchen.', 2500.00, 'rent', '123 Main Street', 'Lagos', 'Lagos', 'Nigeria', ARRAY['wifi', 'parking', 'gym', 'pool', 'air_conditioning'], 2, 2, 4, true)
  RETURNING id INTO listing_1;

  INSERT INTO listings (id, owner_id, title, description, price, type, location, city, state, country, amenities, bedrooms, bathrooms, max_guests, is_published)
  VALUES
    (gen_random_uuid(), owner_id, 'Cozy Studio Near Beach', 'Perfect beachside getaway. Walk to the ocean in 5 minutes. Fully furnished with modern amenities.', 85.00, 'airbnb', '45 Ocean Drive', 'Lagos', 'Lagos', 'Nigeria', ARRAY['wifi', 'kitchen', 'washer', 'air_conditioning', 'beach_access'], 1, 1, 2, true)
  RETURNING id INTO listing_2;

  INSERT INTO listings (id, owner_id, title, description, price, type, location, city, state, country, amenities, bedrooms, bathrooms, max_guests, is_published)
  VALUES
    (gen_random_uuid(), owner_id, 'Luxury Villa with Pool', 'Spacious 4-bedroom villa with private pool, landscaped garden, and 24/7 security. Perfect for families.', 5000.00, 'rent', '78 Victoria Island', 'Lagos', 'Lagos', 'Nigeria', ARRAY['wifi', 'parking', 'pool', 'garden', 'security', 'air_conditioning', 'generator'], 4, 3, 8, true)
  RETURNING id INTO listing_3;

  INSERT INTO listings (id, owner_id, title, description, price, type, location, city, state, country, amenities, bedrooms, bathrooms, max_guests, is_published)
  VALUES
    (gen_random_uuid(), owner_id, 'Penthouse Suite', 'Top-floor penthouse with rooftop terrace. Breathtaking sunset views. Premium furnishing throughout.', 200.00, 'airbnb', '200 Eko Atlantic', 'Lagos', 'Lagos', 'Nigeria', ARRAY['wifi', 'parking', 'gym', 'pool', 'air_conditioning', 'rooftop'], 3, 2, 6, true)
  RETURNING id INTO listing_4;



  INSERT INTO listings (id, owner_id, title, description, price, type, location, city, state, country, amenities, bedrooms, bathrooms, max_guests, is_published)
  VALUES
    (gen_random_uuid(), owner_id, 'Tropical Garden Retreat', 'Escape to this serene garden retreat. Private bungalow surrounded by lush tropical plants. Outdoor shower included.', 120.00, 'airbnb', '5 Banana Island Road', 'Lagos', 'Lagos', 'Nigeria', ARRAY['wifi', 'garden', 'kitchen', 'air_conditioning', 'breakfast'], 2, 1, 4, true)
  RETURNING id INTO listing_6;

  -- Insert sample images for each listing
  INSERT INTO listing_images (listing_id, url, position, is_cover) VALUES
    (listing_1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format', 0, true),
    (listing_1, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format', 1, false),
    (listing_1, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format', 2, false),

    (listing_2, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format', 0, true),
    (listing_2, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format', 1, false),

    (listing_3, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format', 0, true),
    (listing_3, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format', 1, false),
    (listing_3, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format', 2, false),

    (listing_4, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format', 0, true),
    (listing_4, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format', 1, false),



    (listing_6, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format', 0, true),
    (listing_6, 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&auto=format', 1, false),
    (listing_6, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format', 2, false);

  RAISE NOTICE 'Seeded 6 listings with images for user %', owner_id;
END $$;
