'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Sparkles, Check, ArrowRight, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { SubscriptionService, ActiveSubscription } from '@/services/subscription.service';

export default function SubscribePage() {
  const router = useRouter();
  const [charities, setCharities] = useState<any[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedCharity, setSelectedCharity] = useState('');
  const [contributionPct, setContributionPct] = useState(15);
  const [loading, setLoading] = useState(false);
  const [existingSub, setExistingSub] = useState<ActiveSubscription | null>(null);
  const [subLimitReason, setSubLimitReason] = useState<string | null>(null);

  const checkSubscriptionStatus = () => {
    const check = SubscriptionService.canSubscribeThisMonth();
    if (!check.allowed && check.currentSub) {
      setExistingSub(check.currentSub);
      setSubLimitReason(check.reason || 'You already have an active subscription for this month.');
    } else {
      setExistingSub(null);
      setSubLimitReason(null);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();

    async function load() {
      try {
        const res = await fetch('/api/charities');
        const data = await res.json();
        const list = data?.charities || [];
        setCharities(list);

        // Check for existing pending subscription selections
        const pending = SubscriptionService.getPendingSubscription();
        if (pending) {
          setBillingCycle(pending.plan || 'monthly');
          setSelectedCharity(pending.charityId || (list[0]?.id ?? ''));
          setContributionPct(pending.contributionPercentage || 15);
        } else if (list.length > 0) {
          setSelectedCharity(list[0].id);
        }
      } catch (e) {
        console.error('Failed to load charities:', e);
      }
    }
    load();
  }, []);

  const price = billingCycle === 'monthly' ? 15 : 150;
  const charityAmount = ((price * contributionPct) / 100).toFixed(2);

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();

    // Guard: Prevent subscribing more than once per month
    const check = SubscriptionService.canSubscribeThisMonth();
    if (!check.allowed) {
      setSubLimitReason(check.reason || 'You already have an active subscription for this month.');
      return;
    }

    setLoading(true);

    const selectedCharityObj = charities.find((c) => c.id === selectedCharity);
    const charityName = selectedCharityObj?.name || 'Golf For Good Foundation';

    // Save pending subscription choices before proceeding to checkout
    SubscriptionService.savePendingSubscription({
      plan: billingCycle,
      charityId: selectedCharity,
      charityName,
      contributionPercentage: contributionPct,
      charityAmount,
      price,
    });

    router.push('/checkout');
  };

  const handleCancelExisting = () => {
    if (confirm('Cancel your existing subscription for testing? This will allow you to subscribe again.')) {
      SubscriptionService.cancelSubscription();
      checkSubscriptionStatus();
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '1rem', background: 'rgba(255, 184, 0, 0.15)', color: '#FFB800' }}>
          <Sparkles style={{ width: '14px', height: '14px' }} />
          Join The Digital Heroes Platform
        </div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Select Your Subscription Plan</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Choose your billing frequency, select your beneficiary charity, and review before payment.
        </p>

        {/* Existing Active Subscription Notice (1 subscription per month rule) */}
        {existingSub && (
          <div
            className="glass-card"
            style={{
              maxWidth: '700px',
              margin: '2rem auto 0',
              padding: '1.5rem',
              textAlign: 'left',
              border: '1px solid rgba(255, 184, 0, 0.4)',
              background: 'rgba(255, 184, 0, 0.05)',
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <AlertTriangle style={{ width: '28px', height: '28px', color: '#FFB800', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ color: '#FFB800', margin: '0 0 0.5rem', fontSize: '1.1rem' }}>
                  Active Subscription Already Exists For This Month
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 1rem', lineHeight: '1.5' }}>
                  {subLimitReason} You are currently on the{' '}
                  <strong style={{ color: '#FFF' }}>{existingSub.plan === 'yearly' ? 'Yearly' : 'Monthly'} Hero Plan</strong>.
                  Only one subscription is permitted per billing month.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link href="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                    Go to Your Dashboard <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </Link>
                  <button
                    type="button"
                    onClick={handleCancelExisting}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    <RefreshCw style={{ width: '14px', height: '14px' }} /> Reset / Cancel for Demo Testing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Toggle */}
        <div style={{
          display: 'inline-flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-full)',
          marginTop: '2rem',
          border: '1px solid var(--border-subtle)',
        }}>
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`btn ${billingCycle === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
          >
            Monthly Billing ($15/mo)
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`btn ${billingCycle === 'yearly' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
          >
            Yearly Billing ($150/yr) <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Save 16%)</span>
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
        {/* Step 1: Selected Plan Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem' }}>{billingCycle === 'monthly' ? 'Monthly Hero Plan' : 'Yearly Hero Plan'}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Billed {billingCycle}. Limited to 1 subscription per month.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>${price}</span>
            <span style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}> / {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
          </div>
        </div>

        {/* Step 2: Charity Selection */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            Select Your Charity Partner (Required):
          </label>
          <select
            value={selectedCharity}
            onChange={(e) => setSelectedCharity(e.target.value)}
            className="input-field"
            style={{ marginBottom: '1.5rem', cursor: 'pointer' }}
          >
            {charities.map((c) => (
              <option key={c.id} value={c.id} style={{ background: '#0F172A', color: '#FFF' }}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Contribution Slider */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Heart style={{ width: '16px', height: '16px', color: '#F43F5E' }} /> Charity Allocation %:
              </span>
              <span style={{ color: '#F43F5E', fontWeight: 800 }}>{contributionPct}% (${charityAmount} / cycle)</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={contributionPct}
              onChange={(e) => setContributionPct(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#F43F5E', height: '6px', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
              <span>10% Mandatory Minimum</span>
              <span>50% Voluntary Maximum</span>
            </div>
          </div>
        </div>

        {/* Included Features */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>What's Included:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check style={{ width: '16px', height: '16px', color: 'var(--accent-emerald)' }} /> 5 Rolling Stableford Scores</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check style={{ width: '16px', height: '16px', color: 'var(--accent-emerald)' }} /> Monthly Draw Entry</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check style={{ width: '16px', height: '16px', color: 'var(--accent-emerald)' }} /> Guaranteed Charity Contribution</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check style={{ width: '16px', height: '16px', color: 'var(--accent-emerald)' }} /> Proof Screenshot Verification</div>
          </div>
        </div>

        {/* Action Button */}
        {existingSub ? (
          <div>
            <button
              disabled
              className="btn btn-secondary"
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', justifyContent: 'center', opacity: 0.6, cursor: 'not-allowed' }}
            >
              Subscription Already Active This Month
            </button>
            <p style={{ textAlign: 'center', color: '#FFB800', fontSize: '0.85rem', marginTop: '0.75rem' }}>
              You already have an active subscription for this month. Reset above or visit your dashboard.
            </p>
          </div>
        ) : (
          <button
            onClick={handleProceedToReview}
            disabled={loading}
            className="btn btn-gold"
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', justifyContent: 'center' }}
          >
            {loading ? 'Loading Review...' : 'Continue to Checkout Review'} <ArrowRight style={{ width: '20px', height: '20px' }} />
          </button>
        )}
      </div>
    </div>
  );
}
