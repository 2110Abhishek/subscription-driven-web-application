import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Create User in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: 'subscriber' },
    });

    if (authError) {
      // Check if user already exists
      if (authError.message.toLowerCase().includes('already registered')) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
      }
      throw authError;
    }

    const userId = authData.user.id;

    // 2. Insert Profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      email,
      full_name: fullName || email.split('@')[0],
      role: 'subscriber',
    });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    // 3. Create Subscription Record (Active)
    const { error: subError } = await supabase.from('subscriptions').insert({
      user_id: userId,
      provider: 'stripe',
      provider_subscription_id: `sub_${Date.now()}`,
      plan: 'monthly',
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
    });

    if (subError) {
      console.error('Subscription creation error:', subError);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email,
        name: fullName || email.split('@')[0],
        role: 'subscriber',
      },
    });
  } catch (err: any) {
    console.error('Sign up handler error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
