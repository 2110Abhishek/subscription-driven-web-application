'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Heart, Award, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    scores: { id: string; score: number; scoreDate: string }[];
    subscription: { status: string; plan: string; renewalDate: string };
    winningsSummary: { totalAmount: string; hasVerifiedPrize: boolean; payoutCompleted: boolean };
    charities: any[];
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const email = user?.email || 'agchoudhari2110@gmail.com';
        const res = await fetch(`/api/subscriber/data?email=${encodeURIComponent(email)}`);
        const json = await res.json();
        if (json && !json.error) {
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.email]);

  const scores = data?.scores || [];
  const totalWinnings = data?.winningsSummary?.totalAmount || '$0.00';
  const renewalDate = data?.subscription?.renewalDate || 'October 15, 2026';
  const charityName = data?.charities?.[0]?.name || 'Golf For Good Foundation';

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          background: 'radial-gradient(circle at 90% 10%, rgba(0, 242, 254, 0.15) 0%, rgba(18, 22, 34, 0.95) 70%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>
              Welcome Back, {user?.name || 'Hero'}!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Your active subscription is current. Renewal on {renewalDate}.
            </p>
          </div>
          <Link href="/dashboard/scores" className="btn btn-primary">
            + Enter New Score
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', fontWeight: 600 }}>RETAINED SCORES</span>
            <Trophy style={{ width: '18px', height: '18px', color: 'var(--accent-gold)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{scores.length} / 5</div>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {scores.length === 5 ? 'Eligible for Monthly Draw' : `${5 - scores.length} more needed for entry`}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', fontWeight: 600 }}>CHARITY PLEDGE</span>
            <Heart style={{ width: '18px', height: '18px', color: '#F43F5E' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F43F5E' }}>15%</div>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {charityName}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', fontWeight: 600 }}>TOTAL WINNINGS</span>
            <Award style={{ width: '18px', height: '18px', color: 'var(--accent-cyan)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{totalWinnings}</div>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {data?.winningsSummary?.hasVerifiedPrize ? 'Verified Prize Pool' : 'Active Draw Participant'}
          </div>
        </div>
      </div>

      {/* Retained 5 Scores Preview */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem' }}>Your 5 Retained Scores</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Sorted newest first. Only your newest 5 scores are used for monthly draw eligibility.
            </p>
          </div>
          <Link href="/dashboard/scores" style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', fontWeight: 600 }}>
            Manage Scores →
          </Link>
        </div>

        {scores.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              No scores recorded yet. Submit your latest Stableford score (1–45) to build your 5-score draw ticket!
            </p>
            <Link href="/dashboard/scores" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              + Add First Score
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {scores.map((scoreRecord, idx) => (
              <div key={scoreRecord.id || idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div className="score-pill">{scoreRecord.score}</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  Score {idx + 1}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
