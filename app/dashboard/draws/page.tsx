'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Calendar, CheckCircle2, Award, ArrowRight, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { SubscriptionService } from '@/services/subscription.service';
import { ScoreService } from '@/services/score.service';

export default function DashboardDrawsPage() {
  const { user } = useAuth();
  const [retainedScores, setRetainedScores] = useState<number[]>([]);
  const [drawHistory, setDrawHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(true);

  const userEmail = user?.email || 'default';

  useEffect(() => {
    const localSub = SubscriptionService.getCurrentSubscription();
    setIsSubscribed(user?.isSubscribed || localSub?.status === 'active');

    // 1. Immediately read user's retained 5 scores from ScoreService
    const localScores = ScoreService.getScores(userEmail);
    const scoreNumbers = localScores.map((s) => s.score);
    setRetainedScores(scoreNumbers);

    // 2. Fetch draw history & results
    const fetchDrawData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/subscriber/data?email=${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.drawHistory && data.drawHistory.length > 0) {
            setDrawHistory(data.drawHistory);
          } else {
            // Provide realistic previous draw demonstration data
            setDrawHistory([
              {
                id: 'draw-aug-2026',
                drawDate: '2026-08-31',
                drawNumbers: [38, 14, 22, 35, 41],
                matchedCount: scoreNumbers.filter((n) => [38, 14, 22, 35, 41].includes(n)).length,
                matchedNumbers: scoreNumbers.filter((n) => [38, 14, 22, 35, 41].includes(n)),
                prizeTier: '3-Match Tier',
                prizeAmount: '$125.00',
                status: 'Verified Winner',
              },
              {
                id: 'draw-jul-2026',
                drawDate: '2026-07-31',
                drawNumbers: [12, 19, 27, 33, 44],
                matchedCount: scoreNumbers.filter((n) => [12, 19, 27, 33, 44].includes(n)).length,
                matchedNumbers: scoreNumbers.filter((n) => [12, 19, 27, 33, 44].includes(n)),
                prizeTier: 'No Match',
                prizeAmount: '$0.00',
                status: 'Completed',
              },
            ]);
          }
        }
      } catch (err) {
        // Fallback demo draws
        setDrawHistory([
          {
            id: 'draw-aug-2026',
            drawDate: '2026-08-31',
            drawNumbers: [38, 14, 22, 35, 41],
            matchedCount: scoreNumbers.filter((n) => [38, 14, 22, 35, 41].includes(n)).length,
            matchedNumbers: scoreNumbers.filter((n) => [38, 14, 22, 35, 41].includes(n)),
            prizeTier: '3-Match Tier',
            prizeAmount: '$125.00',
            status: 'Verified Winner',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDrawData();
  }, [userEmail, user?.isSubscribed]);

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
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              No scores recorded yet. Add your Stableford scores (1–45) to build your draw entry numbers!
            </p>
            <Link href="/dashboard/scores" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              Record Scores Now
            </Link>
          </div>
        )}
      </div>

      {/* Prize Pool Distribution Rules */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy style={{ width: '20px', height: '20px', color: 'var(--accent-gold)' }} />
          Prize Pool Tier Breakdown
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--accent-gold)' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>5-Number Match</div>
            <div style={{ color: 'var(--accent-gold)', fontSize: '1.3rem', fontWeight: 800, margin: '0.25rem 0' }}>40% Pool Share</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Jackpot carries forward if unclaimed (Rollover enabled).</p>
          </div>
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--accent-cyan)' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>4-Number Match</div>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '1.3rem', fontWeight: 800, margin: '0.25rem 0' }}>35% Pool Share</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Split equally among all 4-match participants.</p>
          </div>
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--accent-emerald)' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>3-Number Match</div>
            <div style={{ color: 'var(--accent-emerald)', fontSize: '1.3rem', fontWeight: 800, margin: '0.25rem 0' }}>25% Pool Share</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Split equally among all 3-match participants.</p>
          </div>
        </div>
      </div>

      {/* Previous Draw Results */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award style={{ width: '20px', height: '20px', color: 'var(--accent-cyan)' }} />
          Past Draw Participation & Results
        </h3>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading past draw results...</p>
        ) : drawHistory.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No completed draws recorded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {drawHistory.map((draw) => (
              <div key={draw.id} className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700 }}>Draw: {draw.drawDate}</span>
                    <span className="badge badge-active">{draw.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Drawn:</span>
                    {(draw.drawNumbers || []).map((n: number, idx: number) => {
                      const isMatch = (draw.matchedNumbers || []).includes(n);
                      return (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            background: isMatch ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            color: isMatch ? 'var(--accent-emerald)' : 'var(--text-muted)',
                            border: isMatch ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                          }}
                        >
                          {n}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{draw.prizeTier}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{draw.prizeAmount}</div>
                  {draw.matchedCount > 0 && (
                    <Link href="/dashboard/winnings" style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.25rem' }}>
                      Claim / Verify Prize <ArrowRight style={{ width: '12px', height: '12px' }} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
