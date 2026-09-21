'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Heart, Sparkles, ArrowRight, ShieldCheck, Zap, Users, Gift, RefreshCw, CheckCircle2, Play } from 'lucide-react';
import { ScoreService } from '@/domain/scores/score.service';
import { ScoreRecord } from '@/domain/scores/score.types';

const initialDemoScores: ScoreRecord[] = [
  { id: '1', userId: 'u-1', score: 39, scoreDate: '2026-09-15', createdAt: '', updatedAt: '' },
  { id: '2', userId: 'u-1', score: 34, scoreDate: '2026-09-10', createdAt: '', updatedAt: '' },
  { id: '3', userId: 'u-1', score: 31, scoreDate: '2026-09-05', createdAt: '', updatedAt: '' },
  { id: '4', userId: 'u-1', score: 37, scoreDate: '2026-08-29', createdAt: '', updatedAt: '' },
  { id: '5', userId: 'u-1', score: 28, scoreDate: '2026-08-20', createdAt: '', updatedAt: '' },
];

export default function HomePage() {
  const [interactiveContribution, setInteractiveContribution] = useState(15);
  const [demoScores, setDemoScores] = useState<ScoreRecord[]>(initialDemoScores);
  const [simulatedInput, setSimulatedInput] = useState<number>(42);
  const [evictedNotice, setEvictedNotice] = useState<string | null>(null);

  const monthlySubscriptionPrice = 15; // $15
  const charityAmount = ((monthlySubscriptionPrice * interactiveContribution) / 100).toFixed(2);
  const prizePoolContribution = ((monthlySubscriptionPrice * 50) / 100).toFixed(2);

  const handleSimulateAddScore = () => {
    try {
      const randomDate = `2026-09-${16 + Math.floor(Math.random() * 10)}`;
      const result = ScoreService.processNewScore(demoScores, {
        userId: 'u-1',
        score: simulatedInput,
        scoreDate: randomDate,
      });

      setDemoScores(result.retainedScores);
      if (result.evictedScoreId) {
        setEvictedNotice(`Score ${simulatedInput} added! Oldest score (${demoScores[demoScores.length - 1]?.score}) was evicted by 5-Rolling Rule.`);
      } else {
        setEvictedNotice(`Score ${simulatedInput} logged!`);
      }
      setSimulatedInput(Math.floor(Math.random() * 20) + 25);
    } catch (e: any) {
      setEvictedNotice(e.message);
    }
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '7rem 1.5rem 6rem',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 15%, rgba(0, 242, 254, 0.16) 0%, rgba(139, 92, 246, 0.08) 45%, rgba(5, 7, 14, 1) 85%)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Floating Pill Badge */}
          <div className="badge badge-cyan animate-pulse-glow" style={{ marginBottom: '1.75rem' }}>
            <Sparkles style={{ width: '14px', height: '14px' }} />
            Next-Gen Subscription Platform
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
              lineHeight: 1.08,
              marginBottom: '1.5rem',
              fontWeight: 900,
            }}
          >
            Turn Every Golf Score Into <br />
            <span className="gradient-text-cyan">Charity Impact</span> & <span className="gradient-text-gold">Monthly Rewards</span>
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '1.25rem',
              maxWidth: '780px',
              margin: '0 auto 3rem',
              lineHeight: 1.6,
            }}
          >
            Digital Heroes bridges athletic performance with non-profit fundraising. Maintain your 5 latest Stableford scores (1–45), support causes you love, and automatically enter transparent monthly prize draws.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link href="/subscribe" className="btn btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1.05rem' }}>
              Become a Digital Hero <ArrowRight style={{ width: '18px', height: '18px' }} />
            </Link>
            <Link href="/how-it-works" className="btn btn-secondary" style={{ padding: '1rem 2.25rem', fontSize: '1.05rem' }}>
              How It Works
            </Link>
          </div>

          {/* Live Platform Ticker Banner */}
          <div
            className="glass-panel"
            style={{
              maxWidth: '900px',
              margin: '4.5rem auto 0',
              padding: '1.75rem 2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                Live Prize Pool
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900 }} className="gradient-text-gold">
                $12,450.00
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>Includes $2,400 Rollover Jackpot</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                Guaranteed Charity Allocation
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F43F5E' }}>
                10% – 50%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Direct non-profit pledge</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                Match Distribution Tiers
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                40% / 35% / 25%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>5, 4, and 3 match splits</div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC INTERACTIVE SCORE BALL SIMULATOR */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '3rem 2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <div className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>
                <RefreshCw style={{ width: '14px', height: '14px' }} /> Interactive Core Rule Demo
              </div>
              <h2 style={{ fontSize: '2.2rem' }}>5-Score Rolling Engine</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
                Test entering scores below (1–45) to watch how the platform maintains your newest 5 scores and evicts the oldest!
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="number"
                min={1}
                max={45}
                value={simulatedInput}
                onChange={(e) => setSimulatedInput(Number(e.target.value))}
                className="input-field"
                style={{ width: '100px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 700 }}
              />
              <button onClick={handleSimulateAddScore} className="btn btn-primary" style={{ padding: '0.85rem 1.4rem' }}>
                <Play style={{ width: '16px', height: '16px' }} /> Add Score
              </button>
            </div>
          </div>

          {evictedNotice && (
            <div style={{ background: 'rgba(0, 242, 254, 0.12)', border: '1px solid rgba(0, 242, 254, 0.3)', color: 'var(--accent-cyan)', padding: '0.85rem 1.25rem', borderRadius: '12px', marginBottom: '1.75rem', fontSize: '0.9rem', fontWeight: 600 }}>
              💡 {evictedNotice}
            </div>
          )}

          {/* Retained 5 Scores Pills List */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', paddingTop: '1rem' }}>
            {demoScores.map((record, index) => (
              <div key={record.id} style={{ textAlign: 'center' }}>
                <div className={`score-pill ${index === 0 ? 'score-pill-gold' : ''}`} style={{ margin: '0 auto' }}>
                  {record.score}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.6rem', color: index === 0 ? 'var(--accent-gold)' : 'var(--text-main)' }}>
                  {index === 0 ? '★ Newest' : `Score #${index + 1}`}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{record.scoreDate}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE CHARITY CALCULATOR */}
      <section
        style={{
          padding: '5rem 1.5rem',
          background: 'rgba(10, 14, 26, 0.9)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '3rem 2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Heart style={{ width: '28px', height: '28px', color: '#F43F5E' }} />
              <h2 style={{ fontSize: '2.2rem' }}>Interactive Impact Simulator</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
              Adjust the slider to see how your monthly subscription ($15) is allocated to your chosen charity and the monthly prize pool.
            </p>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 600 }}>
                <span>Charity Contribution Pledge:</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F43F5E' }}>{interactiveContribution}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                value={interactiveContribution}
                onChange={(e) => setInteractiveContribution(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#F43F5E',
                  height: '8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-subtle)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                <span>10% Mandatory Minimum</span>
                <span>50% Max Pledge</span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem',
                paddingTop: '2rem',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #F43F5E' }}>
                <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  Charity Donation
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F43F5E' }}>${charityAmount} /mo</div>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-gold)' }}>
                <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  Prize Pool Allocation
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-gold)' }}>${prizePoolContribution} /mo</div>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-cyan)' }}>
                <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  Monthly Subscription
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>${monthlySubscriptionPrice}.00 /mo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '7rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Ready to Become a Digital Hero?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2.5rem' }}>
            Join scores of golfers supporting impactful causes while qualifying for monthly prize draw rewards.
          </p>
          <Link href="/subscribe" className="btn btn-gold" style={{ padding: '1rem 2.75rem', fontSize: '1.1rem' }}>
            Start Your Subscription <ArrowRight style={{ width: '20px', height: '20px' }} />
          </Link>
        </div>
      </section>
    </div>
  );
}
