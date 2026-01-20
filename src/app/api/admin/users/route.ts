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

const ROLE_HIERARCHY = { super_admin: 3, admin: 2, viewer: 1 };

// GET: Fetch all admin users
export async function GET() {
    try {
        const { data: users, error } = await getSupabaseAdmin()
            .from('admin_users')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching admin users:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ users });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST: Create a new admin user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, full_name, role } = body;

        // Validate required fields
        if (!email || !password || !role) {
            return NextResponse.json(
                { error: 'Email, password, and role are required' },
                { status: 400 }
            );
        }

        // Validate role
        if (!['admin', 'viewer'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role. Only admin and viewer can be created.' },
                { status: 400 }
            );
        }

        // Create auth user
        const { data: authData, error: authError } = await getSupabaseAdmin().auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email
        });

        if (authError) {
            console.error('Error creating auth user:', authError);
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        if (!authData.user) {
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }

        // Create admin_users record
        const { data: adminUser, error: adminError } = await getSupabaseAdmin()
            .from('admin_users')
            .insert({
                id: authData.user.id,
                email,
                full_name: full_name || null,
                role,
            })
            .select()
            .single();

        if (adminError) {
            // Rollback: delete the auth user if admin_users insert fails
            await getSupabaseAdmin().auth.admin.deleteUser(authData.user.id);
            console.error('Error creating admin user record:', adminError);
            return NextResponse.json({ error: adminError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            user: adminUser,
            message: 'Admin user created successfully'
        });

    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE: Remove an admin user
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Delete from admin_users table
        const { error: adminError } = await getSupabaseAdmin()
            .from('admin_users')
            .delete()
            .eq('id', id);

        if (adminError) {
            console.error('Error deleting admin user record:', adminError);
            return NextResponse.json({ error: adminError.message }, { status: 500 });
        }

        // Delete auth user
        const { error: authError } = await getSupabaseAdmin().auth.admin.deleteUser(id);

        if (authError) {
            console.error('Error deleting auth user:', authError);
            // Continue anyway, admin_users record is already deleted
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH: Update an admin user's role
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, role, full_name } = body;

        if (!id) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const updates: Record<string, unknown> = {};
        if (role && ['admin', 'viewer'].includes(role)) {
            updates.role = role;
        }
        if (full_name !== undefined) {
            updates.full_name = full_name;
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
        }

        const { data, error } = await getSupabaseAdmin()
            .from('admin_users')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating admin user:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, user: data });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
