'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { SubscriptionService, ActiveSubscription } from '@/services/subscription.service';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const txParam = searchParams.get('tx');
  const [sub, setSub] = useState<ActiveSubscription | null>(null);

  useEffect(() => {
    const currentSub = SubscriptionService.getCurrentSubscription();
    if (currentSub) {
      setSub(currentSub);
    }
  }, []);

  const planName = sub?.plan === 'yearly' ? 'Yearly Hero Plan' : 'Monthly Hero Plan';
  const priceFormatted = sub?.plan === 'yearly' ? '$150.00 / year' : '$15.00 / month';
  const charityName = sub?.charityName || 'Golf For Good Foundation';
  const contributionPct = sub?.contributionPercentage || 15;
  const transactionId = txParam || sub?.demoTransactionId || 'DH-DEMO-SUCCESS';

  return (
    <div style={{ maxWidth: '650px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
        {/* Success Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(52, 211, 153, 0.15)',
            border: '2px solid var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <CheckCircle2 style={{ width: '36px', height: '36px', color: 'var(--accent-emerald)' }} />
        </div>

        <div className="badge badge-active" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
          <Sparkles style={{ width: '14px', height: '14px' }} /> Subscription Activated
        </div>

        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Payment Successful!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2.5rem' }}>
          Welcome to the Digital Heroes platform. Your subscription has been confirmed and is now active.
        </p>

        {/* Subscription Summary Card */}
        <div
          className="glass-card"
          style={{
            padding: '1.75rem',
            textAlign: 'left',
            display: 'grid',
            gap: '1rem',
            marginBottom: '2.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Subscription Plan</span>
            <span style={{ fontWeight: 700 }}>{planName}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Billing Rate</span>
            <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{priceFormatted}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Beneficiary Charity</span>
            <span style={{ fontWeight: 700, color: '#F43F5E', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Heart style={{ width: '14px', height: '14px' }} /> {charityName}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Charity Allocation</span>
            <span style={{ fontWeight: 700 }}>{contributionPct}% of subscription fee</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Subscription Status</span>
            <span className="badge badge-active">Active</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Transaction Reference</span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent-gold)' }}>
              {transactionId}
            </span>
          </div>
        </div>

        {/* Clear Action Forward */}
        <Link
          href="/dashboard"
          className="btn btn-primary"
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', justifyContent: 'center' }}
        >
          Go to Subscriber Dashboard <ArrowRight style={{ width: '20px', height: '20px' }} />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>Loading confirmation...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
