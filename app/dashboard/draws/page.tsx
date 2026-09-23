'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Calendar, CheckCircle2, Award, ArrowRight, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { SubscriptionService } from '@/services/subscription.service';

export default function DashboardDrawsPage() {
  const { user } = useAuth();
  const [retainedScores, setRetainedScores] = useState<number[]>([]);
  const [drawHistory, setDrawHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(true);

  useEffect(() => {
    const localSub = SubscriptionService.getCurrentSubscription();
    setIsSubscribed(user?.isSubscribed || localSub?.status === 'active');

    const fetchDrawData = async () => {
      setLoading(true);
      try {
        const email = user?.email || 'agchoudhari2110@gmail.com';
        const res = await fetch(`/api/subscriber/data?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.scores) {
          setRetainedScores(data.scores.map((s: any) => s.score));
        }
        if (data.drawHistory) {
          setDrawHistory(data.drawHistory);
        }
      } catch (err) {
        console.error('Failed to load draw data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrawData();
  }, [user]);

  const hasFullTicket = retainedScores.length === 5;
  const isEligible = isSubscribed && hasFullTicket;

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Monthly Draw Participation</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Your 5 retained Stableford scores act as your entry numbers for upcoming monthly prize draws.
        </p>
      </div>

      {/* Upcoming Active Draw Ticket */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          borderLeft: isEligible
            ? '4px solid var(--accent-emerald)'
            : '4px solid var(--accent-cyan)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={isEligible ? 'badge badge-active' : 'badge badge-warning'}>
                {isEligible
                  ? 'ACTIVE TICKET — ELIGIBLE'
                  : !isSubscribed
                  ? 'SUBSCRIPTION REQUIRED'
                  : 'WAITING FOR 5 SCORES'}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                {retainedScores.length}/5 scores recorded
              </span>
            </div>
            <h3 style={{ fontSize: '1.4rem', marginTop: '0.5rem' }}>September 2026 Monthly Draw Entry</h3>
          </div>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar style={{ width: '16px', height: '16px' }} /> Draw Date: Sept 30, 2026
          </div>
        </div>

        {/* Ticket Numbers or Prompt */}
        {retainedScores.length > 0 ? (
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              {isEligible
                ? 'Your 5 active entry numbers generated from your newest retained Stableford scores:'
                : `You currently have ${retainedScores.length} score(s). Add ${5 - retainedScores.length} more score(s) to complete your 5-number draw ticket:`}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {retainedScores.map((score, i) => (
                <div key={i} className="score-pill">
                  {score}
                </div>
              ))}
              {Array.from({ length: Math.max(0, 5 - retainedScores.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="score-pill"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px dashed var(--border-subtle)',
                    color: 'var(--text-subtle)',
                  }}
                >
                  ?
                </div>
              ))}
            </div>

            {!isEligible && (
              <div style={{ marginTop: '1.5rem' }}>
                <Link href="/dashboard/scores" className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem', display: 'inline-flex' }}>
                  + Add Remaining Scores to Qualify
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No Stableford scores entered yet in your account.</p>
            <Link href="/dashboard/scores" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', display: 'inline-flex' }}>
              + Enter Scores to Activate Ticket
            </Link>
          </div>
        )}
      </div>

      {/* Historical Draw Results */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Your Draw History</h3>

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {drawHistory.length > 0 ? (
            drawHistory.map((draw) => (
              <div
                key={draw.id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  display: 'grid',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{draw.drawDate}</span>
                  <span className={draw.prizeTier !== 'No Match' ? 'badge badge-active' : 'badge badge-secondary'}>
                    {draw.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Drawn Numbers:</span>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                      {draw.drawNumbers.map((num: number, idx: number) => (
                        <div key={idx} className="score-pill score-pill-small" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Your Matched:</span>
                    <div style={{ fontWeight: 700, marginTop: '0.4rem', color: draw.matchedCount >= 3 ? 'var(--accent-gold)' : 'var(--text-main)' }}>
                      {draw.matchedCount > 0 ? `${draw.matchedCount} Matches (${draw.matchedNumbers.join(', ')})` : 'None'}
                    </div>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Prize Won:</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
                      {draw.prizeAmount}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No completed draw results recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
