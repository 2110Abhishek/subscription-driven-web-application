const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rtarqmgeppylhnvotmpm.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('--- Starting Supabase Real Data Seeding ---');

  // 1. Create Auth Users & Profiles
  const usersToCreate = [
    { email: 'alex@example.com', password: 'Password123!', full_name: 'Alex Morgan', role: 'subscriber' },
    { email: 'david@example.com', password: 'Password123!', full_name: 'David Miller', role: 'subscriber' },
    { email: 'michael@example.com', password: 'Password123!', full_name: 'Michael Vance', role: 'subscriber' },
    { email: 'sarah@example.com', password: 'Password123!', full_name: 'Sarah Jenkins', role: 'admin' },
    { email: 'admin@digitalheroes.co.in', password: 'Password123!', full_name: 'Sarah Jenkins', role: 'admin' },
  ];

  const userMap = {};

  for (const u of usersToCreate) {
    // Check if user already exists
    const { data: listRes } = await supabase.auth.admin.listUsers();
    const existing = listRes?.users?.find((existingUser) => existingUser.email === u.email);

    let userId = existing?.id;
    if (!userId) {
      const { data: newAuth, error: authErr } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name, role: u.role },
      });
      if (authErr) {
        console.error(`Failed to create auth user ${u.email}:`, authErr);
        continue;
      }
      userId = newAuth.user.id;
      console.log(`Created auth user: ${u.email} -> ${userId}`);
    } else {
      console.log(`Auth user already exists: ${u.email} -> ${userId}`);
    }

    userMap[u.email] = userId;

    // Upsert Profile
    const { error: profErr } = await supabase.from('profiles').upsert({
      id: userId,
      email: u.email,
      full_name: u.full_name,
      role: u.role,
    });
    if (profErr) {
      console.error(`Failed to upsert profile for ${u.email}:`, profErr);
    } else {
      console.log(`Upserted profile for: ${u.full_name} (${u.role})`);
    }
  }

  // 2. Insert Subscriptions
  console.log('\n--- Seeding Subscriptions ---');
  const subsData = [
    {
      user_id: userMap['alex@example.com'],
      provider: 'stripe',
      provider_subscription_id: 'sub_101',
      plan: 'monthly',
      status: 'active',
      current_period_start: new Date(Date.now() - 15 * 86400000).toISOString(),
      current_period_end: new Date(Date.now() + 15 * 86400000).toISOString(),
    },
    {
      user_id: userMap['david@example.com'],
      provider: 'stripe',
      provider_subscription_id: 'sub_102',
      plan: 'yearly',
      status: 'active',
      current_period_start: new Date(Date.now() - 40 * 86400000).toISOString(),
      current_period_end: new Date(Date.now() + 325 * 86400000).toISOString(),
    },
    {
      user_id: userMap['michael@example.com'],
      provider: 'stripe',
      provider_subscription_id: 'sub_103',
      plan: 'monthly',
      status: 'lapsed',
      current_period_start: new Date(Date.now() - 60 * 86400000).toISOString(),
      current_period_end: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ];

  for (const sub of subsData) {
    if (!sub.user_id) continue;
    const { error: subErr } = await supabase
      .from('subscriptions')
      .upsert(sub, { onConflict: 'provider_subscription_id' });
    if (subErr) console.error('Subscription error:', subErr);
    else console.log(`Upserted subscription: ${sub.provider_subscription_id}`);
  }

  // 3. Insert Scores
  console.log('\n--- Seeding Scores ---');
  const scoresData = [
    { user_id: userMap['alex@example.com'], score: 39, score_date: '2026-08-05' },
    { user_id: userMap['alex@example.com'], score: 34, score_date: '2026-08-12' },
    { user_id: userMap['alex@example.com'], score: 31, score_date: '2026-08-18' },
    { user_id: userMap['alex@example.com'], score: 37, score_date: '2026-08-25' },
    { user_id: userMap['alex@example.com'], score: 28, score_date: '2026-08-30' },
    { user_id: userMap['david@example.com'], score: 42, score_date: '2026-08-06' },
    { user_id: userMap['david@example.com'], score: 38, score_date: '2026-08-14' },
    { user_id: userMap['david@example.com'], score: 35, score_date: '2026-08-20' },
    { user_id: userMap['david@example.com'], score: 33, score_date: '2026-08-26' },
    { user_id: userMap['david@example.com'], score: 30, score_date: '2026-08-31' },
  ];

  for (const sc of scoresData) {
    if (!sc.user_id) continue;
    const { error: scErr } = await supabase
      .from('scores')
      .upsert(sc, { onConflict: 'user_id,score_date' });
    if (scErr) console.error('Score insert error:', scErr);
  }
  console.log('Seeded player Stableford scores.');

  // 4. Insert Real Draw
  console.log('\n--- Seeding Draws ---');
  const { data: existingDraws } = await supabase.from('draws').select('*').limit(1);
  let drawId;

  if (existingDraws && existingDraws.length > 0) {
    drawId = existingDraws[0].id;
    console.log(`Using existing draw: ${drawId}`);
  } else {
    const { data: newDraw, error: dErr } = await supabase
      .from('draws')
      .insert({
        draw_date: '2026-08-31',
        status: 'published',
        engine_type: 'random',
        draw_numbers: [39, 34, 31, 15, 22],
        published_at: '2026-08-31T20:00:00Z',
      })
      .select()
      .single();

    if (dErr) {
      console.error('Failed to create draw:', dErr);
    } else {
      drawId = newDraw.id;
      console.log(`Created real draw: ${drawId}`);

      // Insert Prize Pool
      await supabase.from('prize_pools').insert({
        draw_id: drawId,
        total_pool_amount: 1065000, // $10,650.00
        five_match_pool: 426000,    // $4,260.00 (40%)
        four_match_pool: 372750,    // $3,727.50 (35%)
        three_match_pool: 266250,   // $2,662.50 (25%)
        rolled_over_amount: 240000, // $2,400.00
      });
      console.log('Inserted prize pool for draw.');
    }
  }

  // 5. Insert Real Winners & Proofs
  if (drawId && userMap['alex@example.com'] && userMap['david@example.com']) {
    console.log('\n--- Seeding Winners & Proofs ---');
    const { data: existingWinners } = await supabase.from('winners').select('*');

    if (!existingWinners || existingWinners.length === 0) {
      const { data: w1, error: w1Err } = await supabase
        .from('winners')
        .insert({
          draw_id: drawId,
          user_id: userMap['alex@example.com'],
          match_tier: 3,
          prize_amount: 11660, // $116.60
          status: 'proof_submitted',
          payout_status: 'pending',
        })
        .select()
        .single();

      if (w1Err) console.error('Winner 1 error:', w1Err);
      else {
        console.log(`Created winner 1: ${w1.id}`);
        await supabase.from('winner_proofs').insert({
          winner_id: w1.id,
          user_id: userMap['alex@example.com'],
          file_name: 'golf_scores_screenshot_aug2026.png',
          file_path: 'proofs/golf_scores_screenshot_aug2026.png',
          status: 'pending',
        });
        console.log('Inserted proof for winner 1.');
      }

      const { data: w2, error: w2Err } = await supabase
        .from('winners')
        .insert({
          draw_id: drawId,
          user_id: userMap['david@example.com'],
          match_tier: 4,
          prize_amount: 87500, // $875.00
          status: 'verified',
          payout_status: 'pending',
        })
        .select()
        .single();

      if (w2Err) console.error('Winner 2 error:', w2Err);
      else {
        console.log(`Created winner 2: ${w2.id}`);
        await supabase.from('winner_proofs').insert({
          winner_id: w2.id,
          user_id: userMap['david@example.com'],
          file_name: 'miller_golf_app_scores.jpg',
          file_path: 'proofs/miller_golf_app_scores.jpg',
          status: 'approved',
        });
        console.log('Inserted proof for winner 2.');
      }
    } else {
      console.log(`Existing winners already found (${existingWinners.length}).`);
    }
  }

  console.log('\n--- Seeding Complete Successfully! ---');
}

main().catch(console.error);
