import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    const supabase = createAdminClient();

    let profile = null;
    if (email) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      profile = prof;
    }

    if (!profile) {
      const { data: first } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
      profile = first;
    }

    if (!profile) {
      return NextResponse.json({ winnings: [], totalFormatted: '$0.00' });
    }

    // Fetch user winnings
    const { data: userWinnings, error } = await supabase
      .from('winners')
      .select('*, draws(*), winner_proofs(*)')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const totalCents = (userWinnings || []).reduce((acc, curr) => acc + (curr.prize_amount || 0), 0);
    const totalFormatted = `$${(totalCents / 100).toFixed(2)}`;

    return NextResponse.json({
      winnings: userWinnings || [],
      totalFormatted,
      latest: userWinnings?.[0] || null,
    });
  } catch (err: any) {
    console.error('Winnings get error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, fileName, winnerId } = await req.json();
    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    let targetWinnerId = winnerId;
    if (!targetWinnerId) {
      // Find latest winning record for user
      const { data: win } = await supabase
        .from('winners')
        .select('id')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      targetWinnerId = win?.id;
    }

    if (!targetWinnerId) {
      // If no winner record exists yet, create one for demo/testing verification flow
      const { data: draw } = await supabase.from('draws').select('id').order('draw_date', { ascending: false }).limit(1).maybeSingle();
      const drawId = draw?.id || 'd1111111-1111-1111-1111-111111111111';

      const { data: newWin, error: winErr } = await supabase.from('winners').insert({
        draw_id: drawId,
        user_id: profile.id,
        match_tier: 3,
        prize_amount: 11660,
        status: 'proof_submitted',
        payout_status: 'pending',
      }).select().single();

      if (winErr) throw winErr;
      targetWinnerId = newWin.id;
    }

    // Insert or update winner_proofs
    const { data: proof, error: pErr } = await supabase
      .from('winner_proofs')
      .upsert({
        winner_id: targetWinnerId,
        user_id: profile.id,
        file_name: fileName || 'score_verification_proof.png',
        file_path: `/uploads/proofs/${profile.id}/${fileName || 'proof.png'}`,
        status: 'pending',
      }, { onConflict: 'winner_id' })
      .select()
      .single();

    if (pErr) throw pErr;

    // Update winner status to proof_submitted
    await supabase
      .from('winners')
      .update({ status: 'proof_submitted' })
      .eq('id', targetWinnerId);

    return NextResponse.json({ success: true, proof });
  } catch (err: any) {
    console.error('Submit proof error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
