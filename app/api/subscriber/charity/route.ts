import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    const supabase = createAdminClient();

    // 1. Fetch real active charities
    const { data: charities, error: cErr } = await supabase
      .from('charities')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (cErr) throw cErr;

    // 2. Fetch user's active selection
    let activeSelection = null;
    if (email) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (profile) {
        const { data: sel } = await supabase
          .from('charity_selections')
          .select('*')
          .eq('user_id', profile.id)
          .is('effective_end', null)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        activeSelection = sel;
      }
    }

    return NextResponse.json({
      charities: (charities || []).map((c) => ({
        id: c.id,
        name: c.name,
        desc: c.description,
        slug: c.slug,
        image: c.image_url,
      })),
      selectedCharityId: activeSelection?.charity_id || charities?.[0]?.id,
      contributionPercentage: activeSelection?.contribution_percentage || 15,
    });
  } catch (err: any) {
    console.error('Charity get error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, charityId, contributionPercentage } = await req.json();
    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const pct = Number(contributionPercentage);
    if (isNaN(pct) || pct < 10 || pct > 100) {
      return NextResponse.json({ error: 'Pledge percentage must be at least 10%' }, { status: 400 });
    }

    // End previous active selection if any
    await supabase
      .from('charity_selections')
      .update({ effective_end: new Date().toISOString() })
      .eq('user_id', profile.id)
      .is('effective_end', null);

    // Insert new active selection
    const { data: newSel, error: insErr } = await supabase
      .from('charity_selections')
      .insert({
        user_id: profile.id,
        charity_id: charityId,
        contribution_percentage: pct,
        effective_start: new Date().toISOString(),
      })
      .select()
      .single();

    if (insErr) throw insErr;

    return NextResponse.json({ success: true, selection: newSel });
  } catch (err: any) {
    console.error('Charity post error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
