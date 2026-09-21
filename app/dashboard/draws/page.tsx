'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Calendar, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export default function DashboardDrawsPage() {
  const { user } = useAuth();
  const [retainedScores, setRetainedScores] = useState<number[]>([]);
  const [drawHistory, setDrawHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Monthly Draw Participation</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Your 5 retained Stableford scores act as your entry numbers for upcoming monthly prize draws.
        </p>
      </div>

      {/* Upcoming Active Draw Ticket */}
      <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-cyan)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <span className="badge badge-cyan">ACTIVE TICKET</span>
            <h3 style={{ fontSize: '1.4rem', marginTop: '0.5rem' }}>September 2026 Draw Entry</h3>
          </div>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar style={{ width: '16px', height: '16px' }} /> Draw Date: Sept 30, 2026
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Active entry numbers generated from your top 5 retained scores:
        </p>

        {retainedScores.length > 0 ? (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {retainedScores.map((score, i) => (
              <div key={i} className="score-pill">
                {score}
              </div>
            ))}
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
            drawHistory.map((draw, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem' }}>{draw.drawDate}</h4>
                  <span className={`badge ${draw.matchedCount > 0 ? 'badge-active' : 'badge-purple'}`}>
                    {draw.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Drawn Numbers:</div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
                      {draw.drawNumbers.map((n: number, i: number) => (
                        <span key={i} style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', fontSize: '0.85rem', fontWeight: 600 }}>
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Your Matched:</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: draw.matchedCount > 0 ? 'var(--accent-gold)' : 'var(--text-subtle)', marginTop: '0.25rem' }}>
                      {draw.matchedCount > 0 ? `${draw.matchedCount} Matches (${draw.matchedNumbers.join(', ')})` : 'None'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Prize Won:</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.1rem' }}>
                      {draw.prizeAmount}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No completed draw history for your account yet. Upcoming draw numbers will appear here after publication.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
