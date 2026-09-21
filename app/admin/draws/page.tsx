'use client';

import { useState, useEffect } from 'react';
import { DrawService } from '@/domain/draws/draw.service';
import { DrawEngineType, DrawSimulationResult } from '@/domain/draws/draw.types';
import { Trophy, Play, CheckCircle2, Shield, RefreshCw, AlertCircle, Users } from 'lucide-react';

export default function AdminDrawsPage() {
  const [engineType, setEngineType] = useState<DrawEngineType>('random');
  const [revenuePool, setRevenuePool] = useState<number>(10000); // $10,000
  const [jackpotRollover, setJackpotRollover] = useState<number>(2400); // $2,400 carried forward
  const [participants, setParticipants] = useState<any[]>([]);
  const [simulationResult, setSimulationResult] = useState<DrawSimulationResult | null>(null);
  const [published, setPublished] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/data');
        const json = await res.json();
        if (json && json.participants) {
          setParticipants(json.participants);
        }
      } catch (err) {
        console.error('Failed to load participants:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSimulate = () => {
    setPublished(false);
    setStatusMsg(null);

    // Call pure domain simulation service with real participants
    const sim = DrawService.simulateDraw(
      `draw-${Date.now()}`,
      participants.length > 0 ? participants : [
        { userId: '11111111-1111-1111-1111-111111111111', scoresSnapshot: [39, 34, 31, 37, 28] }
      ],
      revenuePool,
      jackpotRollover,
      engineType
    );

    setSimulationResult(sim);
    setStatusMsg(`Simulation generated for ${participants.length} active platform subscribers!`);
  };

  const handlePublish = async () => {
    if (!simulationResult) return;
    setPublishing(true);

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish_draw',
          drawData: simulationResult,
        }),
      });

      if (res.ok) {
        setPublished(true);
        setStatusMsg(
          `Official monthly draw results published to database! ${simulationResult.winners.fiveMatchWinners.length + simulationResult.winners.fourMatchWinners.length + simulationResult.winners.threeMatchWinners.length} winners recorded in Supabase.`
        );
      }
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Draw Control & Simulation</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Configure draw parameters, test outcomes against registered platform subscribers, and publish verified draw results to Supabase.
        </p>
      </div>

      {statusMsg && (
        <div style={{ background: published ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 242, 254, 0.15)', border: `1px solid ${published ? '#34D399' : 'var(--accent-cyan)'}`, color: published ? '#34D399' : 'var(--accent-cyan)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 style={{ width: '18px', height: '18px' }} />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Participants Summary */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users style={{ width: '20px', height: '20px', color: 'var(--accent-cyan)' }} />
          <div>
            <div style={{ fontWeight: 700 }}>Active Platform Subscribers: {participants.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real registered subscribers in database with active score tickets</div>
          </div>
        </div>
        <span className="badge badge-active">{participants.length} Active Tickets</span>
      </div>

      {/* Draw Configuration Form */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Draw Parameters</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Randomization Engine
            </label>
            <select
              value={engineType}
              onChange={(e) => setEngineType(e.target.value as DrawEngineType)}
              className="input-field"
            >
              <option value="random" style={{ background: '#0F172A' }}>Cryptographic Random (crypto.getRandomValues)</option>
              <option value="algorithmic" style={{ background: '#0F172A' }}>Score-Frequency Weighted Algorithmic</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Subscription Revenue Pool ($)
            </label>
            <input
              type="number"
              value={revenuePool}
              onChange={(e) => setRevenuePool(Number(e.target.value))}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Carried-Over 5-Match Jackpot ($)
            </label>
            <input
              type="number"
              value={jackpotRollover}
              onChange={(e) => setJackpotRollover(Number(e.target.value))}
              className="input-field"
            />
          </div>
        </div>

        <button onClick={handleSimulate} className="btn btn-primary" style={{ padding: '0.8rem 1.75rem' }}>
          <Play style={{ width: '18px', height: '18px' }} /> Run Draw Simulation
        </button>
      </div>

      {/* Simulation Result Output */}
      {simulationResult && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>SIMULATION RESULT</span>
              <h3 style={{ fontSize: '1.5rem' }}>Simulated Draw Outcome</h3>
            </div>

            <button
              onClick={handlePublish}
              disabled={published || publishing}
              className="btn btn-gold"
              style={{ padding: '0.8rem 1.75rem' }}
            >
              <Shield style={{ width: '18px', height: '18px' }} />
              {published ? 'Published & Saved to Database' : publishing ? 'Saving to Database...' : 'Publish Official Draw Results'}
            </button>
          </div>

          {/* Drawn 5 Numbers */}
          <div style={{ background: 'rgba(0, 242, 254, 0.08)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>Drawn 5 Numbers:</span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {simulationResult.drawNumbers.map((num, idx) => (
                <div key={idx} className="score-pill" style={{ background: 'var(--accent-gold-gradient)', color: '#1A0F00' }}>
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Tier Split Calculations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>5-Match Jackpot Tier (40%)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                ${simulationResult.prizePoolAllocation.fiveMatchPool}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Winners: {simulationResult.winners.fiveMatchWinners.length}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>4-Match Tier (35%)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                ${simulationResult.prizePoolAllocation.fourMatchPool}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Winners: {simulationResult.winners.fourMatchWinners.length}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>3-Match Tier (25%)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#C084FC' }}>
                ${simulationResult.prizePoolAllocation.threeMatchPool}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Winners: {simulationResult.winners.threeMatchWinners.length}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Next Rollover Jackpot</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34D399' }}>
                ${simulationResult.carriedOverJackpot}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {simulationResult.carriedOverJackpot > 0 ? 'Carried forward' : 'Distributed'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
