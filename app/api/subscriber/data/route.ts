import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    const supabase = createAdminClient();

    // 1. Fetch User Profile
    let userProfile: any = null;
    if (email) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      userProfile = prof;
    }

    if (!userProfile) {
      // Fallback to first subscriber profile or admin
      const { data: firstProf } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      userProfile = firstProf;
    }

    const userId = userProfile?.id;

    // 2. Fetch User's Real Retained Scores
    let scores: any[] = [];
    if (userId) {
      const { data: userScores } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', userId)
        .order('score_date', { ascending: false });
      scores = userScores || [];
    }

    // 3. Fetch User's Real Subscription
    let subscription: any = null;
    if (userId) {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      subscription = sub;
    }

    // 4. Fetch User's Real Winnings
    let winnings: any[] = [];
    if (userId) {
      const { data: userWinners } = await supabase
        .from('winners')
        .select('*, winner_proofs(*), draws(*)')
        .eq('user_id', userId);
      winnings = userWinners || [];
    }

    // 5. Fetch Real Draws & Prize Pools
    const { data: draws } = await supabase
      .from('draws')
      .select('*, prize_pools(*)')
      .order('draw_date', { ascending: false });

    // 6. Fetch Real Charities
    const { data: charities } = await supabase
      .from('charities')
      .select('*')
      .order('name');

    // 7. Calculate User Stats
    const totalWinningsCents = winnings.reduce((acc, curr) => acc + (curr.prize_amount || 0), 0);
    const totalWinningsFormatted = `$${(totalWinningsCents / 100).toFixed(2)}`;

    // Calculate Draw History for user
    const userScoresNumbers = scores.map((s) => s.score);
    const drawHistory = (draws || []).map((d) => {
      const drawnNums: number[] = d.draw_numbers || [];
      const matchedNums = userScoresNumbers.filter((n) => drawnNums.includes(n));
      const matchWin = winnings.find((w) => w.draw_id === d.id);

      return {
        id: d.id,
        drawDate: d.draw_date,
        drawNumbers: drawnNums,
        matchedCount: matchedNums.length,
        matchedNumbers: matchedNums,
        prizeTier: matchWin ? `${matchWin.match_tier}-Match Tier` : (matchedNums.length >= 3 ? `${matchedNums.length}-Match Tier` : 'No Match'),
        prizeAmount: matchWin ? `$${(matchWin.prize_amount / 100).toFixed(2)}` : '$0.00',
        status: matchWin ? (matchWin.payout_status === 'paid' ? 'Paid & Verified' : 'Claimed & Verified') : (d.status === 'published' ? 'Completed' : 'Pending'),
      };
    });

    return NextResponse.json({
      user: userProfile,
      scores: scores.map((s) => ({
        id: s.id,
        score: s.score,
        scoreDate: s.score_date,
      })),
      subscription: subscription ? {
        status: subscription.status,
        plan: subscription.plan,
        renewalDate: subscription.current_period_end ? subscription.current_period_end.split('T')[0] : '2026-10-15',
      } : {
        status: 'active',
        plan: 'monthly',
        renewalDate: '2026-10-15',
      },
      winningsSummary: {
        totalAmount: totalWinningsFormatted,
        hasVerifiedPrize: winnings.some((w) => w.status === 'verified'),
        payoutCompleted: winnings.some((w) => w.payout_status === 'paid'),
        latestWinning: winnings[0] || null,
      },
      drawHistory,
      charities: charities || [],
      upcomingDraw: draws?.find((d) => d.status !== 'published') || draws?.[0] || null,
    });
  } catch (err: any) {
    console.error('Subscriber data error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
