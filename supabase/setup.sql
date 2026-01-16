-- ============================================
-- DentaVoice COMPLETE Database Setup
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- ============================================
-- DROP EXISTING (if re-running)
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
DROP FUNCTION IF EXISTS get_user_practice_id CASCADE;
DROP FUNCTION IF EXISTS is_admin CASCADE;

-- ============================================
-- CORE TABLES
-- ============================================

-- Practices (dental offices / tenants)
CREATE TABLE IF NOT EXISTS practices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Basic Info
    name TEXT NOT NULL,
    owner_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    website TEXT,
    timezone TEXT DEFAULT 'America/Denver',
    
    -- Phone Setup
    ai_phone_number TEXT,
    twilio_phone_sid TEXT,
    forwarding_configured BOOLEAN DEFAULT false,
    
    -- Vapi Setup
    vapi_assistant_id TEXT,
    
    -- Operating Config
    hours JSONB DEFAULT '{
        "monday": {"open": "08:00", "close": "17:00", "closed": false},
        "tuesday": {"open": "08:00", "close": "17:00", "closed": false},
        "wednesday": {"open": "08:00", "close": "17:00", "closed": false},
        "thursday": {"open": "08:00", "close": "17:00", "closed": false},
        "friday": {"open": "08:00", "close": "17:00", "closed": false},
        "saturday": {"open": null, "close": null, "closed": true},
        "sunday": {"open": null, "close": null, "closed": true}
    }'::jsonb,
    
    -- Business Rules
    insurance_accepted JSONB DEFAULT '[]'::jsonb,
    services_offered JSONB DEFAULT '["General", "Cleaning", "Emergency"]'::jsonb,
    accepts_new_patients BOOLEAN DEFAULT true,
    callback_promise TEXT DEFAULT 'within 2 hours',
    emergency_instructions TEXT,
    
    -- AI Configuration
    ai_name TEXT DEFAULT 'Sophie',
    ai_voice TEXT DEFAULT 'female_2',
    ai_greeting TEXT,
    ai_personality TEXT DEFAULT 'warm',
    
    -- Notifications
    notification_emails JSONB DEFAULT '[]'::jsonb,
    notification_phones JSONB DEFAULT '[]'::jsonb,
    notify_on_new_call BOOLEAN DEFAULT true,
    notify_on_emergency BOOLEAN DEFAULT true,
    daily_summary_enabled BOOLEAN DEFAULT false,
    daily_summary_time TEXT DEFAULT '18:00',
    
    -- Account Status
    status TEXT DEFAULT 'onboarding' 
        CHECK (status IN ('onboarding', 'pilot', 'active', 'paused', 'churned')),
    plan TEXT DEFAULT 'free_trial' 
        CHECK (plan IN ('free_trial', 'basic', 'pro')),
    trial_ends_at TIMESTAMPTZ,
    onboarded_at TIMESTAMPTZ,
    
    -- Billing
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    
    -- Internal
    notes TEXT
);

-- Users (practice staff members)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'staff' CHECK (role IN ('owner', 'staff', 'admin')),
    last_login_at TIMESTAMPTZ
);

-- Calls (AI receptionist call logs)
CREATE TABLE IF NOT EXISTS calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    practice_id UUID REFERENCES practices(id) ON DELETE CASCADE NOT NULL,
    
    caller_name TEXT,
    caller_phone TEXT,
    caller_verified BOOLEAN DEFAULT false,
    verification_method TEXT,
    
    duration_seconds INTEGER,
    transcript TEXT,
    transcript_hash TEXT,
    recording_url TEXT,
    recording_backup_url TEXT,
    vapi_call_id TEXT UNIQUE,
    
    reason TEXT,
    patient_type TEXT CHECK (patient_type IN ('new', 'existing', 'unknown')),
    appointment_requested BOOLEAN DEFAULT false,
    preferred_days TEXT,
    preferred_times TEXT,
    urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent', 'emergency')),
    ai_summary TEXT,
    
    status TEXT DEFAULT 'pending' 
        CHECK (status IN ('pending', 'called_back', 'scheduled', 'no_action', 'spam')),
    callback_at TIMESTAMPTZ,
    callback_by TEXT,
    notes TEXT
);

-- Booking Requests (from landing page)
CREATE TABLE IF NOT EXISTS booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    
    goal TEXT NOT NULL CHECK (goal IN ('missed_calls', 'staffing', 'emergency', 'demo')),
    details TEXT,
    
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'no_response')),
    contacted_at TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ,
    notes TEXT,
    
    source TEXT DEFAULT 'landing_page',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's practice_id
CREATE OR REPLACE FUNCTION get_user_practice_id()
RETURNS UUID AS $$
    SELECT practice_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PRACTICES policies
DROP POLICY IF EXISTS "Users can view their own practice" ON practices;
CREATE POLICY "Users can view their own practice"
    ON practices FOR SELECT
    USING (id = get_user_practice_id() OR is_admin());

DROP POLICY IF EXISTS "Service role can do anything with practices" ON practices;
CREATE POLICY "Service role can do anything with practices"
    ON practices FOR ALL
    USING (true)
    WITH CHECK (true);

-- USERS policies
DROP POLICY IF EXISTS "Users can view their own record" ON users;
CREATE POLICY "Users can view their own record"
    ON users FOR SELECT
    USING (id = auth.uid() OR practice_id = get_user_practice_id() OR is_admin());

DROP POLICY IF EXISTS "Service role can do anything with users" ON users;
CREATE POLICY "Service role can do anything with users"
    ON users FOR ALL
    USING (true)
    WITH CHECK (true);

-- CALLS policies
DROP POLICY IF EXISTS "Users can view their practice's calls" ON calls;
CREATE POLICY "Users can view their practice's calls"
    ON calls FOR SELECT
    USING (practice_id = get_user_practice_id() OR is_admin());

DROP POLICY IF EXISTS "Service role can do anything with calls" ON calls;
CREATE POLICY "Service role can do anything with calls"
    ON calls FOR ALL
    USING (true)
    WITH CHECK (true);

-- BOOKING_REQUESTS policies (public insert allowed)
DROP POLICY IF EXISTS "Anyone can insert booking requests" ON booking_requests;
CREATE POLICY "Anyone can insert booking requests"
    ON booking_requests FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can view all booking requests" ON booking_requests;
CREATE POLICY "Service role can view all booking requests"
    ON booking_requests FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Service role can update booking requests" ON booking_requests;
CREATE POLICY "Service role can update booking requests"
    ON booking_requests FOR UPDATE
    USING (true);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_calls_practice_id ON calls(practice_id);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_practice_id ON users(practice_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status, created_at DESC);

-- ============================================
-- AUTO-CREATE USER TRIGGER (for signup)
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_practice_id UUID;
BEGIN
    -- If user has practice info in metadata, create practice first
    IF NEW.raw_user_meta_data->>'practice_name' IS NOT NULL THEN
        INSERT INTO practices (
            name, 
            owner_name, 
            email,
            trial_ends_at
        )
        VALUES (
            NEW.raw_user_meta_data->>'practice_name',
            NEW.raw_user_meta_data->>'owner_name',
            NEW.email,
            now() + INTERVAL '30 days'
        )
        RETURNING id INTO new_practice_id;
        
        -- Create user record linked to practice
        INSERT INTO users (id, email, practice_id, role, full_name)
        VALUES (
            NEW.id, 
            NEW.email, 
            new_practice_id, 
            'owner',
            NEW.raw_user_meta_data->>'owner_name'
        );
    ELSE
        -- Create user without practice (admin or staff invited later)
        INSERT INTO users (id, email, role)
        VALUES (NEW.id, NEW.email, 'staff');
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the signup
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION handle_new_user();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Allow authenticated users to use the helper functions
GRANT EXECUTE ON FUNCTION get_user_practice_id() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Allow anon users to insert booking requests
GRANT INSERT ON booking_requests TO anon;
GRANT INSERT ON booking_requests TO authenticated;

-- ============================================
-- DONE!
-- ============================================
SELECT 'Database setup complete! Tables created: practices, users, calls, booking_requests' AS status;
