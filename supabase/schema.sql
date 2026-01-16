-- ============================================
-- DentaVoice Database Schema v2
-- With audit logging, immutability, metrics
-- ============================================

-- ============================================
-- CORE TABLES
-- ============================================

-- Practices (dental offices / tenants)
CREATE TABLE practices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Basic Info
    name TEXT NOT NULL,
    owner_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,                          -- Their main office number
    address TEXT,
    website TEXT,
    timezone TEXT DEFAULT 'America/Denver',
    
    -- Phone Setup
    ai_phone_number TEXT,                -- Twilio number assigned to this practice
    twilio_phone_sid TEXT,               -- Twilio SID for managing the number
    forwarding_configured BOOLEAN DEFAULT false,
    
    -- Vapi Setup
    vapi_assistant_id TEXT,              -- Vapi assistant reference
    
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
    ai_personality TEXT DEFAULT 'warm',  -- 'warm', 'professional', 'friendly'
    
    -- Notifications
    notification_emails JSONB DEFAULT '[]'::jsonb,  -- Array of email addresses
    notification_phones JSONB DEFAULT '[]'::jsonb,  -- Array of SMS numbers
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
    notes TEXT                           -- Your internal notes about this practice
);

-- Users (practice staff members)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'staff' CHECK (role IN ('owner', 'staff', 'admin')),
    last_login_at TIMESTAMPTZ
);

-- Calls (AI receptionist call logs)
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    practice_id UUID REFERENCES practices(id) ON DELETE CASCADE NOT NULL,
    
    -- Caller Info (IMMUTABLE after creation)
    caller_name TEXT,
    caller_phone TEXT,
    caller_verified BOOLEAN DEFAULT false,
    verification_method TEXT,            -- 'phone_match', 'security_questions', null
    
    -- Call Data (IMMUTABLE after creation)
    duration_seconds INTEGER,
    transcript TEXT,
    transcript_hash TEXT,                -- SHA256 for integrity verification
    recording_url TEXT,                  -- Vapi's URL (may expire)
    recording_backup_url TEXT,           -- Your Supabase Storage URL (permanent)
    vapi_call_id TEXT UNIQUE,
    
    -- Extracted Info (IMMUTABLE after creation)
    reason TEXT,
    patient_type TEXT CHECK (patient_type IN ('new', 'existing', 'unknown')),
    appointment_requested BOOLEAN DEFAULT false,
    preferred_days TEXT,
    preferred_times TEXT,
    urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent', 'emergency')),
    ai_summary TEXT,
    
    -- Mutable Fields (practice can update these)
    status TEXT DEFAULT 'pending' 
        CHECK (status IN ('pending', 'called_back', 'scheduled', 'no_action', 'spam')),
    callback_at TIMESTAMPTZ,
    callback_by TEXT,
    notes TEXT
);

-- ============================================
-- AUDIT LOG (Append-only, cannot be modified)
-- ============================================

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    -- What was affected
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    practice_id UUID REFERENCES practices(id),
    
    -- What happened
    action TEXT NOT NULL CHECK (action IN ('insert', 'update', 'delete', 'login', 'export')),
    
    -- Change details
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    
    -- Who did it
    performed_by UUID REFERENCES auth.users(id),
    performed_by_email TEXT,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    request_id TEXT                      -- For tracing
);

-- ============================================
-- METRICS TABLES
-- ============================================

-- Daily aggregated metrics (computed by cron job)
CREATE TABLE daily_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID REFERENCES practices(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    
    -- Call Volume
    total_calls INTEGER DEFAULT 0,
    calls_under_30s INTEGER DEFAULT 0,   -- Likely hang-ups
    calls_over_5m INTEGER DEFAULT 0,     -- Potentially problematic
    after_hours_calls INTEGER DEFAULT 0,
    
    -- Call Quality
    avg_duration_seconds INTEGER,
    total_duration_seconds INTEGER,
    
    -- Lead Capture
    names_captured INTEGER DEFAULT 0,
    phones_captured INTEGER DEFAULT 0,
    new_patient_leads INTEGER DEFAULT 0,
    existing_patient_calls INTEGER DEFAULT 0,
    appointment_requests INTEGER DEFAULT 0,
    
    -- Outcomes
    callbacks_created INTEGER DEFAULT 0,
    callbacks_completed INTEGER DEFAULT 0,
    
    -- Computed Rates
    capture_rate DECIMAL(5,2),           -- % of calls with name+phone
    callback_rate DECIMAL(5,2),          -- % of callbacks completed
    
    created_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(practice_id, date)
);

-- Practice health scores (updated periodically)
CREATE TABLE practice_health (
    practice_id UUID PRIMARY KEY REFERENCES practices(id) ON DELETE CASCADE,
    
    -- Activity
    last_call_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    calls_last_7_days INTEGER DEFAULT 0,
    calls_last_30_days INTEGER DEFAULT 0,
    
    -- Engagement
    callback_completion_rate DECIMAL(5,2),
    avg_callback_time_hours DECIMAL(5,2),
    dashboard_logins_last_30_days INTEGER DEFAULT 0,
    
    -- Trends
    call_volume_trend DECIMAL(5,2),      -- % change week over week
    
    -- Churn Risk
    churn_risk_score INTEGER DEFAULT 0,  -- 0-100
    churn_risk_level TEXT DEFAULT 'low' CHECK (churn_risk_level IN ('low', 'medium', 'high')),
    churn_risk_reasons JSONB DEFAULT '[]'::jsonb,
    
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- OPTIONAL: Patient phone lookup (Phase 2)
-- ============================================

-- Only stores phone + first name for caller recognition
-- NOT full patient records (that stays in their PMS)
CREATE TABLE patient_phones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID REFERENCES practices(id) ON DELETE CASCADE NOT NULL,
    phone TEXT NOT NULL,
    first_name TEXT NOT NULL,
    patient_external_id TEXT,            -- Reference to their PMS patient ID
    created_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(practice_id, phone)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_phones ENABLE ROW LEVEL SECURITY;

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
CREATE POLICY "Users can view their own practice"
    ON practices FOR SELECT
    USING (id = get_user_practice_id() OR is_admin());

CREATE POLICY "Admins can insert practices"
    ON practices FOR INSERT
    WITH CHECK (is_admin() OR auth.uid() IS NOT NULL);  -- Allow during signup

CREATE POLICY "Owners/admins can update their practice"
    ON practices FOR UPDATE
    USING (id = get_user_practice_id() OR is_admin());

-- USERS policies
CREATE POLICY "Users can view their own practice's users"
    ON users FOR SELECT
    USING (practice_id = get_user_practice_id() OR is_admin() OR id = auth.uid());

CREATE POLICY "Allow insert during signup"
    ON users FOR INSERT
    WITH CHECK (true);  -- Trigger handles this

CREATE POLICY "Users can update their own record"
    ON users FOR UPDATE
    USING (id = auth.uid() OR is_admin());

-- CALLS policies
CREATE POLICY "Users can view their practice's calls"
    ON calls FOR SELECT
    USING (practice_id = get_user_practice_id() OR is_admin());

CREATE POLICY "Service role can insert calls"
    ON calls FOR INSERT
    WITH CHECK (true);  -- Webhook uses service role

CREATE POLICY "Users can update their practice's calls (limited fields)"
    ON calls FOR UPDATE
    USING (practice_id = get_user_practice_id() OR is_admin());

-- AUDIT_LOG policies (read-only for most users)
CREATE POLICY "Users can view their practice's audit log"
    ON audit_log FOR SELECT
    USING (practice_id = get_user_practice_id() OR is_admin());

CREATE POLICY "Only service role can insert audit log"
    ON audit_log FOR INSERT
    WITH CHECK (true);  -- Service role only

-- No update/delete policies for audit_log (append-only)

-- DAILY_METRICS policies
CREATE POLICY "Users can view their practice's metrics"
    ON daily_metrics FOR SELECT
    USING (practice_id = get_user_practice_id() OR is_admin());

-- PRACTICE_HEALTH policies
CREATE POLICY "Users can view their practice's health"
    ON practice_health FOR SELECT
    USING (practice_id = get_user_practice_id() OR is_admin());

-- PATIENT_PHONES policies
CREATE POLICY "Users can view their practice's patient phones"
    ON patient_phones FOR SELECT
    USING (practice_id = get_user_practice_id() OR is_admin());

CREATE POLICY "Users can manage their practice's patient phones"
    ON patient_phones FOR ALL
    USING (practice_id = get_user_practice_id() OR is_admin());

-- ============================================
-- INDEXES
-- ============================================

-- Calls
CREATE INDEX idx_calls_practice_id ON calls(practice_id);
CREATE INDEX idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX idx_calls_status ON calls(practice_id, status);
CREATE INDEX idx_calls_vapi_id ON calls(vapi_call_id);

-- Users
CREATE INDEX idx_users_practice_id ON users(practice_id);
CREATE INDEX idx_users_email ON users(email);

-- Audit Log
CREATE INDEX idx_audit_practice_id ON audit_log(practice_id);
CREATE INDEX idx_audit_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_audit_table_record ON audit_log(table_name, record_id);

-- Daily Metrics
CREATE INDEX idx_metrics_practice_date ON daily_metrics(practice_id, date DESC);

-- Patient Phones
CREATE INDEX idx_patient_phones_lookup ON patient_phones(practice_id, phone);

-- ============================================
-- IMMUTABILITY TRIGGERS
-- ============================================

-- Prevent modification of protected call fields
CREATE OR REPLACE FUNCTION protect_call_immutable_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- These fields cannot be changed after insert
    IF OLD.transcript IS DISTINCT FROM NEW.transcript THEN
        RAISE EXCEPTION 'transcript cannot be modified';
    END IF;
    IF OLD.transcript_hash IS DISTINCT FROM NEW.transcript_hash THEN
        RAISE EXCEPTION 'transcript_hash cannot be modified';
    END IF;
    IF OLD.recording_url IS DISTINCT FROM NEW.recording_url THEN
        RAISE EXCEPTION 'recording_url cannot be modified';
    END IF;
    IF OLD.recording_backup_url IS NOT NULL AND OLD.recording_backup_url IS DISTINCT FROM NEW.recording_backup_url THEN
        RAISE EXCEPTION 'recording_backup_url cannot be modified once set';
    END IF;
    IF OLD.caller_phone IS DISTINCT FROM NEW.caller_phone THEN
        RAISE EXCEPTION 'caller_phone cannot be modified';
    END IF;
    IF OLD.duration_seconds IS DISTINCT FROM NEW.duration_seconds THEN
        RAISE EXCEPTION 'duration_seconds cannot be modified';
    END IF;
    IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
        RAISE EXCEPTION 'created_at cannot be modified';
    END IF;
    IF OLD.vapi_call_id IS DISTINCT FROM NEW.vapi_call_id THEN
        RAISE EXCEPTION 'vapi_call_id cannot be modified';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calls_immutability
    BEFORE UPDATE ON calls
    FOR EACH ROW
    EXECUTE FUNCTION protect_call_immutable_fields();

-- Prevent any modification to audit log
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit log cannot be modified or deleted';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_immutability
    BEFORE UPDATE OR DELETE ON audit_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_audit_modification();

-- ============================================
-- AUDIT LOGGING TRIGGERS
-- ============================================

-- Log changes to calls table
CREATE OR REPLACE FUNCTION log_call_changes()
RETURNS TRIGGER AS $$
DECLARE
    changed TEXT[];
BEGIN
    -- Build list of changed fields
    changed := ARRAY[]::TEXT[];
    
    IF TG_OP = 'UPDATE' THEN
        IF OLD.status IS DISTINCT FROM NEW.status THEN
            changed := array_append(changed, 'status');
        END IF;
        IF OLD.callback_at IS DISTINCT FROM NEW.callback_at THEN
            changed := array_append(changed, 'callback_at');
        END IF;
        IF OLD.callback_by IS DISTINCT FROM NEW.callback_by THEN
            changed := array_append(changed, 'callback_by');
        END IF;
        IF OLD.notes IS DISTINCT FROM NEW.notes THEN
            changed := array_append(changed, 'notes');
        END IF;
    END IF;
    
    INSERT INTO audit_log (
        table_name,
        record_id,
        practice_id,
        action,
        old_values,
        new_values,
        changed_fields,
        performed_by,
        performed_by_email
    ) VALUES (
        'calls',
        COALESCE(NEW.id, OLD.id),
        COALESCE(NEW.practice_id, OLD.practice_id),
        LOWER(TG_OP),
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        CASE WHEN array_length(changed, 1) > 0 THEN changed ELSE NULL END,
        auth.uid(),
        (SELECT email FROM users WHERE id = auth.uid())
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER calls_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON calls
    FOR EACH ROW
    EXECUTE FUNCTION log_call_changes();

-- ============================================
-- AUTO-CREATE USER TRIGGER
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
            now() + INTERVAL '30 days'  -- 30-day trial
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
        
        -- Initialize practice health record
        INSERT INTO practice_health (practice_id)
        VALUES (new_practice_id);
    ELSE
        -- Create user without practice (admin or staff invited later)
        INSERT INTO users (id, email, role)
        VALUES (NEW.id, NEW.email, 'staff');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION handle_new_user();

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Generate transcript hash
CREATE OR REPLACE FUNCTION generate_transcript_hash(transcript TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(sha256(transcript::bytea), 'hex');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Verify transcript integrity
CREATE OR REPLACE FUNCTION verify_transcript_integrity(call_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    stored_hash TEXT;
    computed_hash TEXT;
    call_transcript TEXT;
BEGIN
    SELECT transcript_hash, transcript 
    INTO stored_hash, call_transcript
    FROM calls WHERE id = call_id;
    
    IF stored_hash IS NULL THEN
        RETURN NULL;  -- No hash stored
    END IF;
    
    computed_hash := generate_transcript_hash(call_transcript);
    RETURN stored_hash = computed_hash;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- METRICS COMPUTATION FUNCTION
-- ============================================

-- Run this daily via pg_cron or external cron
CREATE OR REPLACE FUNCTION compute_daily_metrics(target_date DATE DEFAULT CURRENT_DATE - 1)
RETURNS void AS $$
BEGIN
    INSERT INTO daily_metrics (
        practice_id,
        date,
        total_calls,
        calls_under_30s,
        calls_over_5m,
        after_hours_calls,
        avg_duration_seconds,
        total_duration_seconds,
        names_captured,
        phones_captured,
        new_patient_leads,
        existing_patient_calls,
        appointment_requests,
        callbacks_created,
        callbacks_completed,
        capture_rate,
        callback_rate
    )
    SELECT 
        c.practice_id,
        target_date,
        COUNT(*) as total_calls,
        COUNT(*) FILTER (WHERE c.duration_seconds < 30) as calls_under_30s,
        COUNT(*) FILTER (WHERE c.duration_seconds > 300) as calls_over_5m,
        0 as after_hours_calls,  -- TODO: Calculate based on practice hours
        AVG(c.duration_seconds)::INTEGER as avg_duration_seconds,
        SUM(c.duration_seconds) as total_duration_seconds,
        COUNT(*) FILTER (WHERE c.caller_name IS NOT NULL) as names_captured,
        COUNT(*) FILTER (WHERE c.caller_phone IS NOT NULL) as phones_captured,
        COUNT(*) FILTER (WHERE c.patient_type = 'new') as new_patient_leads,
        COUNT(*) FILTER (WHERE c.patient_type = 'existing') as existing_patient_calls,
        COUNT(*) FILTER (WHERE c.appointment_requested = true) as appointment_requests,
        COUNT(*) FILTER (WHERE c.status = 'pending') as callbacks_created,
        COUNT(*) FILTER (WHERE c.status = 'called_back') as callbacks_completed,
        ROUND(
            COUNT(*) FILTER (WHERE c.caller_name IS NOT NULL AND c.caller_phone IS NOT NULL)::DECIMAL 
            / NULLIF(COUNT(*), 0) * 100, 
            2
        ) as capture_rate,
        ROUND(
            COUNT(*) FILTER (WHERE c.status = 'called_back')::DECIMAL 
            / NULLIF(COUNT(*) FILTER (WHERE c.status IN ('pending', 'called_back')), 0) * 100,
            2
        ) as callback_rate
    FROM calls c
    WHERE DATE(c.created_at AT TIME ZONE 'UTC') = target_date
    GROUP BY c.practice_id
    ON CONFLICT (practice_id, date) DO UPDATE SET
        total_calls = EXCLUDED.total_calls,
        calls_under_30s = EXCLUDED.calls_under_30s,
        calls_over_5m = EXCLUDED.calls_over_5m,
        after_hours_calls = EXCLUDED.after_hours_calls,
        avg_duration_seconds = EXCLUDED.avg_duration_seconds,
        total_duration_seconds = EXCLUDED.total_duration_seconds,
        names_captured = EXCLUDED.names_captured,
        phones_captured = EXCLUDED.phones_captured,
        new_patient_leads = EXCLUDED.new_patient_leads,
        existing_patient_calls = EXCLUDED.existing_patient_calls,
        appointment_requests = EXCLUDED.appointment_requests,
        callbacks_created = EXCLUDED.callbacks_created,
        callbacks_completed = EXCLUDED.callbacks_completed,
        capture_rate = EXCLUDED.capture_rate,
        callback_rate = EXCLUDED.callback_rate;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- CHURN RISK CALCULATION
-- ============================================

CREATE OR REPLACE FUNCTION update_practice_health(target_practice_id UUID DEFAULT NULL)
RETURNS void AS $$
BEGIN
    INSERT INTO practice_health (
        practice_id,
        last_call_at,
        last_login_at,
        calls_last_7_days,
        calls_last_30_days,
        callback_completion_rate,
        churn_risk_score,
        churn_risk_level,
        churn_risk_reasons,
        updated_at
    )
    SELECT 
        p.id as practice_id,
        (SELECT MAX(created_at) FROM calls WHERE practice_id = p.id) as last_call_at,
        (SELECT MAX(last_login_at) FROM users WHERE practice_id = p.id) as last_login_at,
        (SELECT COUNT(*) FROM calls WHERE practice_id = p.id AND created_at > now() - INTERVAL '7 days') as calls_last_7_days,
        (SELECT COUNT(*) FROM calls WHERE practice_id = p.id AND created_at > now() - INTERVAL '30 days') as calls_last_30_days,
        (
            SELECT ROUND(
                COUNT(*) FILTER (WHERE status = 'called_back')::DECIMAL 
                / NULLIF(COUNT(*) FILTER (WHERE status IN ('pending', 'called_back')), 0) * 100,
                2
            )
            FROM calls WHERE practice_id = p.id AND created_at > now() - INTERVAL '30 days'
        ) as callback_completion_rate,
        -- Churn risk calculation
        (
            CASE 
                WHEN (SELECT MAX(created_at) FROM calls WHERE practice_id = p.id) < now() - INTERVAL '7 days' THEN 30
                ELSE 0
            END
            +
            CASE 
                WHEN (SELECT MAX(last_login_at) FROM users WHERE practice_id = p.id) < now() - INTERVAL '14 days' THEN 20
                ELSE 0
            END
            +
            CASE 
                WHEN (SELECT COUNT(*) FROM calls WHERE practice_id = p.id AND created_at > now() - INTERVAL '7 days') = 0 THEN 25
                ELSE 0
            END
        ) as churn_risk_score,
        CASE 
            WHEN (
                CASE 
                    WHEN (SELECT MAX(created_at) FROM calls WHERE practice_id = p.id) < now() - INTERVAL '7 days' THEN 30
                    ELSE 0
                END
                +
                CASE 
                    WHEN (SELECT MAX(last_login_at) FROM users WHERE practice_id = p.id) < now() - INTERVAL '14 days' THEN 20
                    ELSE 0
                END
            ) >= 50 THEN 'high'
            WHEN (
                CASE 
                    WHEN (SELECT MAX(created_at) FROM calls WHERE practice_id = p.id) < now() - INTERVAL '7 days' THEN 30
                    ELSE 0
                END
            ) >= 25 THEN 'medium'
            ELSE 'low'
        END as churn_risk_level,
        '[]'::jsonb as churn_risk_reasons,
        now() as updated_at
    FROM practices p
    WHERE p.status IN ('pilot', 'active')
      AND (target_practice_id IS NULL OR p.id = target_practice_id)
    ON CONFLICT (practice_id) DO UPDATE SET
        last_call_at = EXCLUDED.last_call_at,
        last_login_at = EXCLUDED.last_login_at,
        calls_last_7_days = EXCLUDED.calls_last_7_days,
        calls_last_30_days = EXCLUDED.calls_last_30_days,
        callback_completion_rate = EXCLUDED.callback_completion_rate,
        churn_risk_score = EXCLUDED.churn_risk_score,
        churn_risk_level = EXCLUDED.churn_risk_level,
        updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STORAGE BUCKETS (run in Supabase dashboard)
-- ============================================

-- Create bucket for call recordings backup
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('call-recordings', 'call-recordings', false);

-- Storage policy: practices can only access their own recordings
-- CREATE POLICY "Practices can access own recordings"
-- ON storage.objects FOR ALL
-- USING (bucket_id = 'call-recordings' AND (storage.foldername(name))[1] = get_user_practice_id()::text);

