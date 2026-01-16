import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Use service role for admin operations (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Fetch all practices
export async function GET() {
    try {
        const { data: practices, error } = await supabaseAdmin
            .from('practices')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching practices:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ practices });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST: Create a new practice (admin onboarding)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, ownerName, email, phone, plan } = body;

        // Validate required fields
        if (!name || !email) {
            return NextResponse.json(
                { error: 'Missing required fields (name, email)' },
                { status: 400 }
            );
        }

        // Create practice
        const { data: practice, error } = await supabaseAdmin
            .from('practices')
            .insert({
                name,
                owner_name: ownerName || null,
                email,
                phone: phone || null,
                plan: plan || 'free_trial',
                status: 'onboarding',
                trial_ends_at: plan === 'free_trial'
                    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                    : null,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating practice:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Generate placeholder phone number (real integration would call Twilio API)
        const areaCode = '801';
        const aiPhoneNumber = `(${areaCode}) 555-${Math.floor(1000 + Math.random() * 9000)}`;

        // Update practice with AI phone number and Vapi ID
        const { error: updateError } = await supabaseAdmin
            .from('practices')
            .update({
                ai_phone_number: aiPhoneNumber,
                vapi_assistant_id: `vapi_${practice.id.substring(0, 8)}`,
                status: 'pilot'
            })
            .eq('id', practice.id);

        if (updateError) {
            console.error('Error updating practice:', updateError);
        }

        return NextResponse.json({
            success: true,
            practice: { ...practice, ai_phone_number: aiPhoneNumber },
            message: 'Practice created successfully'
        });

    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH: Update a practice
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Practice ID required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('practices')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating practice:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, practice: data });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
