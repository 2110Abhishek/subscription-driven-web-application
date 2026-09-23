'use client';

import { useState, useEffect } from 'react';
import { Heart, Check, Save } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { SubscriptionService } from '@/services/subscription.service';
import { defaultCharities } from '@/services/charity.service';

export default function DashboardCharityPage() {
  const { user } = useAuth();
  const [charities, setCharities] = useState<any[]>(defaultCharities);
  const [selectedId, setSelectedId] = useState<string>(defaultCharities[0].id);
  const [pct, setPct] = useState(15);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // 1. Initial values from active subscription state
    const currentSub = SubscriptionService.getCurrentSubscription();
    if (currentSub?.charityId) {
      setSelectedId(currentSub.charityId);
    }
    if (currentSub?.contributionPercentage) {
      setPct(currentSub.contributionPercentage);
    }

    // 2. Fetch list of verified charities from API
    async function loadCharities() {
      try {
        const email = user?.email || 'agchoudhari2110@gmail.com';
        const res = await fetch(`/api/subscriber/charity?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.charities && data.charities.length > 0) {
            setCharities(data.charities);
            if (!currentSub?.charityId && data.selectedCharityId) {
              setSelectedId(data.selectedCharityId);
            }
            if (!currentSub?.contributionPercentage && data.contributionPercentage) {
              setPct(data.contributionPercentage);
            }
          }
        }
      } catch (err) {
        // Fallback to default verified charities
      } finally {
        setLoading(false);
      }
    }
    loadCharities();
  }, [user?.email]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const selectedObj = charities.find((c) => c.id === selectedId);
      const charityName = selectedObj?.name || 'Golf For Good Foundation';

      // 1. Persist to active subscription in localStorage
      const currentSub = SubscriptionService.getCurrentSubscription();
      if (currentSub) {
        currentSub.charityId = selectedId;
        currentSub.charityName = charityName;
        currentSub.contributionPercentage = pct;
        localStorage.setItem('digital_heroes_active_subscription', JSON.stringify(currentSub));
      }

      // 2. Persist to API in background
      const email = user?.email || 'agchoudhari2110@gmail.com';
      await fetch('/api/subscriber/charity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          charityId: selectedId,
          contributionPercentage: pct,
        }),
      }).catch(() => {});

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Failed to save charity pledge:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Your Charity Allocation</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Direct a portion of your subscription fee to causes you care about (minimum 10%).
        </p>
      </div>

      {saved && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check style={{ width: '18px', height: '18px' }} />
          <span>Charity pledge settings saved successfully to your account!</span>
        </div>
      )}

      {/* Contribution Slider */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart style={{ width: '20px', height: '20px', color: '#F43F5E' }} />
            Contribution Percentage
          </h3>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F43F5E' }}>{pct}%</span>
        </div>

        <input
          type="range"
          min={10}
          max={50}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#F43F5E', height: '8px', cursor: 'pointer', marginBottom: '0.5rem' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
          <span>10% Mandatory Minimum</span>
          <span>50% Max</span>
        </div>
      </div>

      {/* Charity Selection Grid */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Select Beneficiary Charity</h3>

        {loading ? (
          <div style={{ color: 'var(--text-subtle)', padding: '1rem' }}>Loading verified charities...</div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {charities.map((c) => {
              const isSelected = c.id === selectedId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className="glass-card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    border: isSelected ? '1px solid #F43F5E' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'rgba(244, 63, 94, 0.08)' : undefined,
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{c.name}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.description || c.desc}</p>
                  </div>
                  {isSelected && (
                    <div className="badge badge-active" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#F43F5E' }}>
                      <Check style={{ width: '14px', height: '14px' }} /> Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button onClick={handleSave} disabled={saving} className="btn btn-gold" style={{ marginTop: '2rem', padding: '0.75rem 2rem' }}>
          <Save style={{ width: '18px', height: '18px' }} /> {saving ? 'Saving...' : 'Save Charity Pledge'}
        </button>
      </div>
    </div>
  );
}
