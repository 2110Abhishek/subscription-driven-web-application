'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Heart, ArrowLeft, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { SubscriptionService, PendingSubscription } from '@/services/subscription.service';

export default function CheckoutReviewPage() {
  const router = useRouter();
  const [sub, setSub] = useState<PendingSubscription | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
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
            marginBottom: '1rem',
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to Plan Selection
        </Link>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Review Your Subscription</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Verify your subscription tier and charitable contribution details before continuing to payment.
        </p>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {errorMsg}
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2.5rem', display: 'grid', gap: '2rem' }}>
        {/* Order Items Breakdown */}
        <div style={{ display: 'grid', gap: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{planTitle}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Billed every {frequencyLabel}. Cancel anytime.</div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {priceFormatted} <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>/ {frequencyLabel}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#F43F5E', fontSize: '0.95rem' }}>
                <Heart style={{ width: '16px', height: '16px' }} />
                Beneficiary Charity: {sub.charityName}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Guaranteed {sub.contributionPercentage}% allocation from your subscription fee
              </div>
            </div>
            <div style={{ textAlign: 'right', fontWeight: 700, color: '#F43F5E' }}>
              ${sub.charityAmount} <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>/ cycle</span>
            </div>
          </div>
        </div>

        {/* Total Cost Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Due Today</div>
            <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Includes full platform features & draw eligibility</div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {priceFormatted}
          </div>
        </div>

        {/* Terms Agreement */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            style={{ marginTop: '0.2rem', accentColor: 'var(--accent-cyan)', width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <span>
            I agree to the Digital Heroes platform terms of service. I understand that a minimum of 10% of my subscription fee will be allocated to my selected non-profit partner, and that I can cancel my subscription at any time.
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
          <button
            onClick={handleProceedToPayment}
            className="btn btn-gold"
            style={{ flex: 2, padding: '0.85rem', justifyContent: 'center', fontSize: '1.05rem' }}
          >
            <Lock style={{ width: '16px', height: '16px' }} /> Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
