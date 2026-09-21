import { FileText, Download, TrendingUp, Heart, Trophy, Users } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Operational Reports & Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Simulated financial summaries, prize draw distribution stats, and charity settlement ledgers.</p>
        </div>
        <button className="btn btn-secondary">
          <Download style={{ width: '18px', height: '18px' }} /> Export Demo CSV
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>Monthly Prize Split Report</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            40% 5-match jackpot, 35% 4-match tier, 25% 3-match tier.
          </p>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>$10,650.00 Allocated</div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#F43F5E' }}>Charity Settlement Ledger</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Cumulative non-profit allocations across active subscribers.
          </p>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>$3,195.00 Distributed</div>
        </div>
      </div>
    </div>
  );
}
