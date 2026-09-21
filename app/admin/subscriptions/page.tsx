'use client';

import { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';

interface SubscriptionRecord {
  id: string;
  user: string;
  plan: string;
  provider: string;
  status: string;
  periodEnd: string;
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.subscriptions) {
          setSubscriptions(data.subscriptions);
        }
      })
      .catch((err) => console.error('Failed to load subscriptions:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Subscription Audit & Provider Metadata</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Inspect active Stripe subscriptions and webhook sync states.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-subtle)' }}>
              <th style={{ padding: '0.75rem' }}>Sub ID</th>
              <th style={{ padding: '0.75rem' }}>Subscriber</th>
              <th style={{ padding: '0.75rem' }}>Plan</th>
              <th style={{ padding: '0.75rem' }}>Provider</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem' }}>Renewal Date</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{s.id}</td>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>{s.user}</td>
                <td style={{ padding: '0.75rem' }}>{s.plan}</td>
                <td style={{ padding: '0.75rem' }}>{s.provider}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${s.status === 'active' ? 'badge-active' : 'badge-warning'}`}>{s.status}</span>
                </td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{s.periodEnd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
