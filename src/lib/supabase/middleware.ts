import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh the auth token
    const { data: { user } } = await supabase.auth.getUser();

    // Route categorization
    const pathname = request.nextUrl.pathname;
    const isClientAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
    const isDashboard = pathname.startsWith('/dashboard');
    const isAdmin = pathname.startsWith('/admin') && !pathname.startsWith('/admin-login');
    const isAdminLogin = pathname.startsWith('/admin-login');

    // Admin routes protection
    if (isAdmin) {
        if (!user) {
            // Not logged in - redirect to admin login
            const url = request.nextUrl.clone();
            url.pathname = '/admin-login';
            return NextResponse.redirect(url);
        }

        // Check if user is in admin_users table
        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id, role')
            .eq('id', user.id)
            .single();

        if (!adminUser) {
            // User is authenticated but not an admin - sign out and redirect
            await supabase.auth.signOut();
            const url = request.nextUrl.clone();
            url.pathname = '/admin-login';
            url.searchParams.set('error', 'unauthorized');
            return NextResponse.redirect(url);
        }

        // User is authenticated admin - allow access
        return supabaseResponse;
    }

    // Admin login page - redirect to admin if already logged in as admin
    if (isAdminLogin && user) {
        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single();

        if (adminUser) {
            // Already logged in as admin - redirect to admin dashboard
            const url = request.nextUrl.clone();
            url.pathname = '/admin';
            return NextResponse.redirect(url);
        }
    }

    // Client dashboard protection
    if (!user && isDashboard) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Redirect authenticated clients away from client auth pages
    if (user && isClientAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
