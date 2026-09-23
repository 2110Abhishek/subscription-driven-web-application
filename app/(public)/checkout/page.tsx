'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Heart, ArrowLeft, ArrowRight, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';
import { SubscriptionService, PendingSubscription, ActiveSubscription } from '@/services/subscription.service';

export default function CheckoutReviewPage() {
  const router = useRouter();
  const [sub, setSub] = useState<PendingSubscription | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [alreadySubscribed, setAlreadySubscribed] = useState<ActiveSubscription | null>(null);
  const [blockReason, setBlockReason] = useState<string | null>(null);

  useEffect(() => {
    // Check if user already has an active subscription this month
    const check = SubscriptionService.canSubscribeThisMonth();
    if (!check.allowed && check.currentSub) {
      setAlreadySubscribed(check.currentSub);
      setBlockReason(check.reason || 'You already have an active subscription for this month.');
    }

    const pending = SubscriptionService.getPendingSubscription();
    if (!pending) {
      // If no subscription selected yet, fallback to default monthly setup
      const fallback: PendingSubscription = {
        plan: 'monthly',
        charityId: '11111111-1111-1111-1111-111111111111',
        charityName: 'Golf For Good Foundation',
        contributionPercentage: 15,
        charityAmount: '2.25',
        price: 15,
        timestamp: new Date().toISOString(),
      };
      SubscriptionService.savePendingSubscription(fallback);
      setSub(fallback);
    } else {
      setSub(pending);
    }
  }, []);

  const handleProceedToPayment = () => {
    const check = SubscriptionService.canSubscribeThisMonth();
    if (!check.allowed) {
      setErrorMsg(check.reason || 'You already have an active subscription for this month.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Please accept the subscription terms and conditions to proceed.');
      return;
    }
    router.push('/payment');
  };

  if (!sub) {
    return (
      <div style={{ maxWidth: '700px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading checkout details...</p>
      </div>
    );
  }

  const planTitle = sub.plan === 'yearly' ? 'Yearly Hero Plan' : 'Monthly Hero Plan';
  const frequencyLabel = sub.plan === 'yearly' ? 'year' : 'month';
  const priceFormatted = `$${sub.price.toFixed(2)}`;

  return (
    <div style={{ maxWidth: '750px', margin: '4rem auto', padding: '0 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/subscribe"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to Plan Selection
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <ShieldCheck style={{ width: '22px', height: '22px', color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Checkout Review · Step 2 of 3
          </span>
        </div>

        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Review Your Subscription</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Please verify your plan, charity selection, and billing frequency before proceeding to payment.
        </p>

        {/* Duplicate Subscription Warning */}
        {alreadySubscribed && (
          <div
            className="glass-card"
            style={{
              padding: '1.25rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 184, 0, 0.4)',
              background: 'rgba(255, 184, 0, 0.05)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <AlertTriangle style={{ width: '24px', height: '24px', color: '#FFB800', flexShrink: 0 }} />
            <div style={{ fontSize: '0.9rem', color: '#FFB800' }}>
              {blockReason} Only 1 subscription is permitted per month.
            </div>
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: '#F87171',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Detailed Breakdown Card */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', display: 'grid', gap: '1.25rem' }}>
          {/* Plan & Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{planTitle}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Billed per {frequencyLabel}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{priceFormatted}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>/ {frequencyLabel}</div>
            </div>
          </div>

          {/* Charity Allocation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-main)' }}>
                <Heart style={{ width: '16px', height: '16px', color: '#F43F5E' }} /> Beneficiary Charity
              </div>
              <div style={{ fontSize: '0.85rem', color: '#F43F5E', fontWeight: 600, marginTop: '0.2rem' }}>
                {sub.charityName}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{sub.contributionPercentage}%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>${sub.charityAmount} / cycle</div>
            </div>
          </div>

          {/* Order Summary Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.25rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Due Today</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{priceFormatted}</span>
          </div>
        </div>

        {/* Terms Agreement */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            style={{ marginTop: '0.2rem', accentColor: 'var(--accent-cyan)', width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <span>
            I agree to the Digital Heroes platform terms of service. I understand that a minimum of 10% of my subscription fee will be allocated to my selected non-profit partner, and that subscriptions are limited to one per billing month.
          </span>
        </label>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            href="/subscribe"
            className="btn btn-secondary"
            style={{ flex: 1, padding: '0.85rem', justifyContent: 'center' }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back
          </Link>
          {alreadySubscribed ? (
            <Link
              href="/dashboard"
              className="btn btn-primary"
              style={{ flex: 2, padding: '0.85rem', justifyContent: 'center', fontSize: '1.05rem' }}
            >
              Go to Dashboard <ArrowRight style={{ width: '16px', height: '16px' }} />
            </Link>
          ) : (
            <button
              onClick={handleProceedToPayment}
              className="btn btn-gold"
              style={{ flex: 2, padding: '0.85rem', justifyContent: 'center', fontSize: '1.05rem' }}
            >
              <Lock style={{ width: '16px', height: '16px' }} /> Proceed to Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
