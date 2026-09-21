import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  // Idempotent webhook event logging
  await supabaseAdmin.from('subscription_events').insert({
    provider_event_id: event.id,
    event_type: event.type,
    payload: event.data.object,
  });

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      const userId = session.client_reference_id;
      const subscriptionId = session.subscription;

      if (userId && subscriptionId) {
        await supabaseAdmin.from('subscriptions').upsert({
          user_id: userId,
          provider: 'stripe',
          provider_subscription_id: subscriptionId,
          plan: session.metadata?.plan || 'monthly',
          status: 'active',
          updated_at: new Date().toISOString(),
        });
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as any;
      await supabaseAdmin
        .from('subscriptions')
        .update({
          status: sub.status === 'active' ? 'active' : 'lapsed',
          cancel_at_period_end: sub.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        })
        .eq('provider_subscription_id', sub.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
