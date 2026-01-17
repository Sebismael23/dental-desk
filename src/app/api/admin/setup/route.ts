import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Use service role for admin operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// POST: Create the initial super admin account
// This is a one-time setup endpoint
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, full_name, setup_key } = body;

        // Simple protection - require a setup key
        if (setup_key !== 'DENTAVOICE_SETUP_2026') {
            return NextResponse.json({ error: 'Invalid setup key' }, { status: 403 });
        }

        // Check if any super_admin already exists
        const { data: existingAdmin } = await supabaseAdmin
            .from('admin_users')
            .select('id')
            .eq('role', 'super_admin')
            .limit(1);

        if (existingAdmin && existingAdmin.length > 0) {
            return NextResponse.json(
                { error: 'Super admin already exists. Use /admin-login to sign in.' },
                { status: 400 }
            );
        }

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Create auth user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });

        if (authError) {
            console.error('Error creating auth user:', authError);
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        if (!authData.user) {
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }

        // Create admin_users record as super_admin
        const { data: adminUser, error: adminError } = await supabaseAdmin
            .from('admin_users')
            .insert({
                id: authData.user.id,
                email,
                full_name: full_name || 'Super Admin',
                role: 'super_admin',
            })
            .select()
            .single();

        if (adminError) {
            // Rollback: delete the auth user if admin_users insert fails
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            console.error('Error creating admin user record:', adminError);
            return NextResponse.json({ error: adminError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Super Admin account created successfully!',
            user: {
                id: adminUser.id,
                email: adminUser.email,
                full_name: adminUser.full_name,
                role: adminUser.role,
            }
        });

    } catch (err) {
        console.error('Setup error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
