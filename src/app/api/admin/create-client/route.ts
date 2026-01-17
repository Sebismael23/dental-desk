import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Use service role for admin operations (can create users)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// Generate a secure temporary password
function generateTempPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            practiceName,
            ownerName,
            email,
            phone,
            plan = 'free_trial',
            // Optional customization
            aiName = 'Sophie',
            aiVoice = 'female_2',
            hours,
            servicesOffered,
            insuranceAccepted,
            emergencyInstructions,
        } = body;

        // Validate required fields
        if (!practiceName || !ownerName || !email) {
            return NextResponse.json(
                { error: 'Missing required fields (practiceName, ownerName, email)' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: 'A user with this email already exists' },
                { status: 400 }
            );
        }

        // 1. Generate temporary password
        const tempPassword = generateTempPassword();

        // 2. Create auth user with Supabase Admin API
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: tempPassword,
            email_confirm: true, // Skip email confirmation (concierge model)
            user_metadata: {
                practice_name: practiceName,
                owner_name: ownerName,
            }
        });

        if (authError) {
            console.error('Auth error:', authError);
            return NextResponse.json(
                { error: `Failed to create auth user: ${authError.message}` },
                { status: 500 }
            );
        }

        // 3. Create practice record
        const { data: practice, error: practiceError } = await supabaseAdmin
            .from('practices')
            .insert({
                name: practiceName,
                owner_name: ownerName,
                email,
                phone: phone || null,
                plan,
                status: 'onboarding',
                trial_ends_at: plan === 'free_trial'
                    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                    : null,
                ai_name: aiName,
                ai_voice: aiVoice,
                hours: hours || undefined,
                services_offered: servicesOffered || undefined,
                insurance_accepted: insuranceAccepted || undefined,
                emergency_instructions: emergencyInstructions || null,
            })
            .select()
            .single();

        if (practiceError) {
            // Rollback: delete auth user if practice creation fails
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            console.error('Practice error:', practiceError);
            return NextResponse.json(
                { error: `Failed to create practice: ${practiceError.message}` },
                { status: 500 }
            );
        }

        // 4. Create user record linked to practice
        const { error: userError } = await supabaseAdmin
            .from('users')
            .insert({
                id: authData.user.id,
                email,
                practice_id: practice.id,
                role: 'owner',
                full_name: ownerName,
            });

        if (userError) {
            // Rollback: delete auth user and practice
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            await supabaseAdmin.from('practices').delete().eq('id', practice.id);
            console.error('User error:', userError);
            return NextResponse.json(
                { error: `Failed to create user record: ${userError.message}` },
                { status: 500 }
            );
        }

        // 5. Generate placeholder AI phone number
        const areaCode = '801';
        const aiPhoneNumber = `(${areaCode}) 555-${Math.floor(1000 + Math.random() * 9000)}`;

        // 6. Update practice with AI phone and Vapi ID
        await supabaseAdmin
            .from('practices')
            .update({
                ai_phone_number: aiPhoneNumber,
                vapi_assistant_id: `vapi_${practice.id.substring(0, 8)}`,
                status: 'pilot'
            })
            .eq('id', practice.id);

        // 7. Return success with credentials
        return NextResponse.json({
            success: true,
            message: 'Client created successfully',
            credentials: {
                loginUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dentavoice.com'}/login`,
                email,
                tempPassword,
            },
            practice: {
                id: practice.id,
                name: practiceName,
                aiPhoneNumber,
            },
            user: {
                id: authData.user.id,
                email,
                name: ownerName,
            }
        });

    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
