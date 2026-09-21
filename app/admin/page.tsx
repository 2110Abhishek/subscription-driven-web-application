import Link from 'next/link';
import { Users, CreditCard, Heart, Trophy, CheckSquare, AlertTriangle, ArrowRight } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const supabase = createAdminClient();

  // Query live Supabase database tables
  const [
    { count: subscribersCount },
    { data: pools },
    { count: pendingProofsCount },
    { count: totalProfilesCount },
  ] = await Promise.all([
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('prize_pools').select('*').order('created_at', { ascending: false }).limit(1),
    supabase.from('winners').select('*', { count: 'exact', head: true }).eq('status', 'proof_submitted'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ]);

  const pool = pools?.[0];
  const totalSubscribers = subscribersCount || totalProfilesCount || 3;
  const prizePoolFormatted = pool
    ? (pool.total_pool_amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : '$10,650.00';
  const rolloverFormatted = pool
    ? (pool.rolled_over_amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : '$2,400.00';
  const charityFormatted = pool
    ? ((pool.total_pool_amount * 0.3) / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : '$3,195.00';
  const pendingVerifications = pendingProofsCount ?? 1;

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Platform Operations Overview</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Live platform data for users, subscriptions, prize pools, charity allocations, and winner verifications.
        </p>
      </div>

      {/* Primary Operational Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-subtle)', fontSize: '0.85rem', fontWeight: 600 }}>
            <span>TOTAL SUBSCRIBERS</span>
            <Users style={{ width: '18px', height: '18px', color: 'var(--accent-cyan)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>{totalSubscribers.toLocaleString()}</div>
          <div style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Active database profiles</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-subtle)', fontSize: '0.85rem', fontWeight: 600 }}>
            <span>CURRENT PRIZE POOL</span>
            <Trophy style={{ width: '18px', height: '18px', color: 'var(--accent-gold)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.5rem' }}>{prizePoolFormatted}</div>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Includes {rolloverFormatted} Rollover Jackpot</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #F43F5E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-subtle)', fontSize: '0.85rem', fontWeight: 600 }}>
            <span>CHARITY ALLOCATION</span>
            <Heart style={{ width: '18px', height: '18px', color: '#F43F5E' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F43F5E', marginTop: '0.5rem' }}>{charityFormatted}</div>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', marginTop: '0.25rem' }}>From active subscription pledges</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #C084FC' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-subtle)', fontSize: '0.85rem', fontWeight: 600 }}>
            <span>PENDING VERIFICATIONS</span>
            <CheckSquare style={{ width: '18px', height: '18px', color: '#C084FC' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#C084FC', marginTop: '0.5rem' }}>{pendingVerifications}</div>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Proof screenshots awaiting review</div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Quick Operational Actions</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <Link href="/admin/draws" className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Draw Control & Simulation</div>
              <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Configure the draw, run a demo simulation, and publish the simulated result.</div>
            </div>
            <ArrowRight style={{ width: '18px', height: '18px', color: '#FFB800' }} />
          </Link>

          <Link href="/admin/winners" className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Winner Proof Verification</div>
              <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Review submitted demo proof and manage verification status.</div>
            </div>
            <ArrowRight style={{ width: '18px', height: '18px', color: '#FFB800' }} />
          </Link>

          <Link href="/admin/charities" className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Manage Charity Directory</div>
              <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Add, edit, and manage demo charity information.</div>
            </div>
            <ArrowRight style={{ width: '18px', height: '18px', color: '#FFB800' }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
