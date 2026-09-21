'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, RefreshCw, Sparkles, ShieldCheck, Play } from 'lucide-react';
import { RandomDrawEngine } from '@/domain/draws/draw.engine';

export default function DrawsInfoPage() {
  const [demoNumbers, setDemoNumbers] = useState<number[]>([12, 28, 34, 39, 44]);
  const [rolling, setRolling] = useState(false);

  const handleRollDraw = () => {
    setRolling(true);
    setTimeout(() => {
      setDemoNumbers(RandomDrawEngine.generateDrawNumbers());
      setRolling(false);
    }, 500);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="badge badge-purple" style={{ marginBottom: '1rem' }}>
          <Trophy style={{ width: '14px', height: '14px' }} />
          Monthly Rewards Engine
        </div>
        <h1 style={{ fontSize: '3.2rem', marginBottom: '1rem' }}>Draw Rules & Prize Distribution</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto' }}>
          Every month, active subscribers with 5 retained Stableford scores (1–45) automatically enter our prize draw.
        </p>
      </div>

      {/* Interactive Draw Roll Demo */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '4rem', textAlign: 'center' }}>
        <div className="badge badge-cyan" style={{ marginBottom: '1rem' }}>
          <Sparkles style={{ width: '14px', height: '14px' }} /> Live 5-Ball Random Generator Demo
        </div>
        <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Simulate a 5-Number Draw Roll</h3>

        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {demoNumbers.map((n, i) => (
            <div key={i} className="score-pill score-pill-gold" style={{ width: '56px', height: '56px', fontSize: '1.35rem' }}>
              {rolling ? '?' : n}
            </div>
          ))}
        </div>

        <button onClick={handleRollDraw} disabled={rolling} className="btn btn-gold" style={{ padding: '0.85rem 2rem' }}>
          <Play style={{ width: '18px', height: '18px' }} /> {rolling ? 'Rolling Numbers...' : 'Roll New 5 Draw Numbers'}
        </button>
      </div>

      {/* Prize Pool Distribution Tiers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="glass-panel" style={{ padding: '2.25rem', borderTop: '4px solid var(--accent-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-gold">JACKPOT TIER</span>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-gold)' }}>40%</span>
          </div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>5-Number Match</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Match all 5 drawn numbers with your 5 retained golf scores. If unclaimed, the entire 5-match jackpot rolls over into the next monthly draw!
          </p>
          <div style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 700 }}>
            ★ Includes Carried-Forward Rollover Jackpot
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2.25rem', borderTop: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-cyan">TIER 2</span>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>35%</span>
          </div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>4-Number Match</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Match any 4 drawn numbers with your retained scores. Multiple winners split the 35% tier pool equally. Does not roll over.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2.25rem', borderTop: '4px solid #C084FC' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-purple">TIER 3</span>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#C084FC' }}>25%</span>
          </div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>3-Number Match</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Match any 3 drawn numbers with your retained scores. Multiple winners split the 25% tier pool equally. Does not roll over.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link href="/subscribe" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
          Subscribe to Qualify for Next Draw
        </Link>
      </div>
    </div>
  );
}
