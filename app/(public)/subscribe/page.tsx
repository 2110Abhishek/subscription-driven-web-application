'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Sparkles, Check, ArrowRight } from 'lucide-react';
import { SubscriptionService } from '@/services/subscription.service';

export default function SubscribePage() {
  const router = useRouter();
  const [charities, setCharities] = useState<any[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedCharity, setSelectedCharity] = useState('');
  const [contributionPct, setContributionPct] = useState(15);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Billed {billingCycle}. Cancel anytime.</p>
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

        <button
          onClick={handleProceedToReview}
          disabled={loading}
          className="btn btn-gold"
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', justifyContent: 'center' }}
        >
          {loading ? 'Loading Review...' : 'Continue to Checkout Review'} <ArrowRight style={{ width: '20px', height: '20px' }} />
        </button>
      </div>
    </div>
  );
}
