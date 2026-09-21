import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { email, score, scoreDate, action, scoreId } = await req.json();

    const supabase = createAdminClient();

    // Find user profile
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const userId = userProfile.id;

    if (action === 'delete' && scoreId) {
      const { error: delErr } = await supabase
        .from('scores')
        .delete()
        .eq('id', scoreId)
        .eq('user_id', userId);

      if (delErr) throw delErr;
      return NextResponse.json({ success: true, message: 'Score deleted' });
    }

    // Validate score number (1-45)
    const numScore = Number(score);
    if (isNaN(numScore) || numScore < 1 || numScore > 45) {
      return NextResponse.json({ error: 'Stableford score must be between 1 and 45' }, { status: 400 });
    }

    if (!scoreDate) {
      return NextResponse.json({ error: 'Score date is required' }, { status: 400 });
    }

    // Check for duplicate date
    const { data: existingOnDate } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', userId)
      .eq('score_date', scoreDate)
      .maybeSingle();

    if (existingOnDate && (!scoreId || existingOnDate.id !== scoreId)) {
      return NextResponse.json({ error: `A score has already been recorded for ${scoreDate}` }, { status: 400 });
    }

    if (scoreId) {
      // Update existing
      const { data: updated, error: upErr } = await supabase
        .from('scores')
        .update({ score: numScore, score_date: scoreDate })
        .eq('id', scoreId)
        .eq('user_id', userId)
        .select()
        .single();

      if (upErr) throw upErr;
      return NextResponse.json({ success: true, score: updated });
    }

    // Insert new score
    const { data: inserted, error: inErr } = await supabase
      .from('scores')
      .insert({
        user_id: userId,
        score: numScore,
        score_date: scoreDate,
      })
      .select()
      .single();

    if (inErr) throw inErr;

    // Rolling 5 eviction: Fetch all scores for user ordered newest first
    const { data: allUserScores } = await supabase
      .from('scores')
      .select('id, score_date, score')
      .eq('user_id', userId)
      .order('score_date', { ascending: false });

    let evictedNotice = null;
    if (allUserScores && allUserScores.length > 5) {
      // Delete scores beyond the top 5 newest
      const toDelete = allUserScores.slice(5);
      const oldestEvicted = toDelete[0];
      for (const oldScore of toDelete) {
        await supabase.from('scores').delete().eq('id', oldScore.id);
      }
      evictedNotice = `Rolling 5 rule enforced: Oldest score from ${oldestEvicted.score_date} (${oldestEvicted.score}) was automatically evicted.`;
    }

    return NextResponse.json({
      success: true,
      score: inserted,
      evictionNotice: evictedNotice,
    });
  } catch (err: any) {
    console.error('Scores API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
