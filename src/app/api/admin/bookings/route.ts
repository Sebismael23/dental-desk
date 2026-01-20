import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Lazy initialization to avoid build-time errors
let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin() {
    if (!supabaseAdmin) {
        supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }
    return supabaseAdmin;
}

// GET: Fetch all booking requests
export async function GET() {
    try {
        const { data: bookings, error } = await getSupabaseAdmin()
            .from('booking_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching bookings:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ bookings });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH: Update a booking request status
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, notes } = body;

        console.log('PATCH booking - id:', id, 'status:', status, 'notes:', notes);

        if (!id || !status) {
            return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
        }

        const updates: Record<string, unknown> = { status };
        if (status === 'contacted') {
            updates.contacted_at = new Date().toISOString();
        }
        if (status === 'scheduled' && body.scheduled_for) {
            updates.scheduled_for = body.scheduled_for;
        }
        if (notes) {
            updates.notes = notes;
        }

        console.log('Updating with - status:', status);

        const { data, error } = await getSupabaseAdmin()
            .from('booking_requests')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Supabase error message:', error.message);
            console.error('Supabase error code:', error.code);
            console.error('Supabase error details:', error.details);
            console.error('Supabase error hint:', error.hint);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log('Update success, data length:', data?.length);

        return NextResponse.json({ success: true, booking: data?.[0] || null });
    } catch (err) {
        console.error('API catch error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE: Remove a booking request
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const { error } = await getSupabaseAdmin()
            .from('booking_requests')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting booking:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
