import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are both required.' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Authenticate with Supabase Auth using client credentials
    const anonSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: authData, error: authError } = await anonSupabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'Invalid email address or password. Please try again.' },
        { status: 401 }
      );
    }

    // 2. Look up the verified user profile
    const adminSupabase = createAdminClient();
    const { data: profile, error: pError } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (pError || !profile) {
      // Fallback query by email if id mapping is slightly different
      const { data: profByEmail } = await adminSupabase
        .from('profiles')
        .select('*')
        .ilike('email', trimmedEmail)
        .maybeSingle();

      if (!profByEmail) {
        return NextResponse.json(
          { error: 'User profile not found. Please contact support.' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: profByEmail.id,
          email: profByEmail.email,
          name: profByEmail.full_name || profByEmail.email.split('@')[0],
          role: profByEmail.role || 'subscriber',
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.full_name || profile.email.split('@')[0],
        role: profile.role || 'subscriber',
      },
    });
  } catch (err: any) {
    console.error('Login API error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
