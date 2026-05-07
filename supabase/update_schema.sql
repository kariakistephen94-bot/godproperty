-- ============================================
-- Update Schema: Safe Migration
-- ============================================

-- 1. Safely add 'lodge' to listing_type enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'listing_type' AND e.enumlabel = 'lodge') THEN
        ALTER TYPE listing_type ADD VALUE 'lodge';
    END IF;
END
$$;

-- 2. Safely update listing_images table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listing_images' AND column_name='type') THEN
        ALTER TABLE listing_images ADD COLUMN type TEXT NOT NULL DEFAULT 'image';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listing_images' AND column_name='thumbnail_url') THEN
        ALTER TABLE listing_images ADD COLUMN thumbnail_url TEXT;
    END IF;
END
$$;

-- 3. Safely add landlord_phone to listings table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='landlord_phone') THEN
        ALTER TABLE listings ADD COLUMN landlord_phone TEXT;
    END IF;
END
$$;

-- 4. Add comments
COMMENT ON COLUMN listing_images.type IS 'Type of media: either image or video';
COMMENT ON COLUMN listing_images.thumbnail_url IS 'Generated thumbnail for video content (optional)';
