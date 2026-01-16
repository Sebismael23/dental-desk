-- ============================================
-- BOOKING REQUESTS TABLE
-- Run this in Supabase SQL Editor after existing schema
-- ============================================

-- Strategy call booking requests (from landing page)
CREATE TABLE IF NOT EXISTS booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Contact Info
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    
    -- Request Details
    goal TEXT NOT NULL CHECK (goal IN ('missed_calls', 'staffing', 'emergency', 'demo')),
    details TEXT,
    
    -- Status
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'no_response')),
    contacted_at TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ,
    notes TEXT,
    
    -- Tracking
    source TEXT DEFAULT 'landing_page',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT
);

-- Allow public inserts (no auth required for booking form)
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert booking requests"
    ON booking_requests FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Only admins can view booking requests"
    ON booking_requests FOR SELECT
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Only admins can update booking requests"
    ON booking_requests FOR UPDATE
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Index for admin dashboard
CREATE INDEX idx_booking_requests_status ON booking_requests(status, created_at DESC);
CREATE INDEX idx_booking_requests_created_at ON booking_requests(created_at DESC);
