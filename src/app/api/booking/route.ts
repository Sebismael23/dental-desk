import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Use service role for email sending (server-side only)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const GOAL_LABELS: Record<string, string> = {
    missed_calls: 'Too many missed calls / Revenue loss',
    staffing: 'Staff is overwhelmed / Short-staffed',
    emergency: 'Need After-Hours Emergency Triage',
    demo: 'Just wants to see a Demo',
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, phone, goal, details } = body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !goal) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Insert into Supabase
        const { data, error } = await supabaseAdmin
            .from('booking_requests')
            .insert({
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                goal,
                details: details || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to save booking request' },
                { status: 500 }
            );
        }

        // Send notification email (using Supabase Edge Function or direct SMTP)
        // For now, log the request - you can integrate with Resend, SendGrid, etc.
        console.log('📧 NEW BOOKING REQUEST:');
        console.log(`   Name: ${firstName} ${lastName}`);
        console.log(`   Email: ${email}`);
        console.log(`   Phone: ${phone}`);
        console.log(`   Goal: ${GOAL_LABELS[goal]}`);
        console.log(`   Details: ${details || 'None provided'}`);

        // TODO: Send actual email notification
        // You can use Resend, SendGrid, or Supabase Edge Functions
        // Example with fetch to a webhook or email service:
        // await fetch('https://api.resend.com/emails', {...})

        return NextResponse.json({
            success: true,
            message: 'Booking request received',
            id: data.id
        });

    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
