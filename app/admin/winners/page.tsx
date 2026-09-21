'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Eye, CreditCard, ShieldCheck, FileText, RefreshCw } from 'lucide-react';

interface WinnerRecord {
  id: string;
  userName: string;
  userEmail: string;
  drawDate: string;
  matchTier: '3-Match' | '4-Match' | '5-Match';
  prizeAmount: string;
  proofFile: string | null;
  status: 'unverified' | 'proof_submitted' | 'verified' | 'rejected';
  payoutStatus: 'pending' | 'paid';
}

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<WinnerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [inspectModal, setInspectModal] = useState<WinnerRecord | null>(null);

  const fetchWinners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      const data = await res.json();
      if (data.winners) {
        setWinners(data.winners);
      }
    } catch (err) {
      console.error('Failed to load winners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  const handleApprove = async (id: string) => {
    setWinners(
      winners.map((w) => (w.id === id ? { ...w, status: 'verified' } : w))
    );
    setInspectModal(null);

    // Persist real status update to Supabase
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_winner_status', winnerId: id, status: 'verified' }),
      });
    } catch (err) {
      console.error('Failed to persist approval:', err);
    }
  };

  const handleReject = async (id: string) => {
    setWinners(
      winners.map((w) => (w.id === id ? { ...w, status: 'rejected' } : w))
    );
    setInspectModal(null);

    // Persist real rejection to Supabase
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_winner_status', winnerId: id, status: 'rejected' }),
      });
    } catch (err) {
      console.error('Failed to persist rejection:', err);
    }
  };

  const handleMarkPaid = async (id: string) => {
    setWinners(
      winners.map((w) => (w.id === id ? { ...w, payoutStatus: 'paid' } : w))
    );

    // Persist real payout update to Supabase
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_winner_status', winnerId: id, payoutStatus: 'paid' }),
      });
    } catch (err) {
      console.error('Failed to persist payout status:', err);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Winner Proof Verification</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Inspect winner score screenshots, review submitted demo proof, and update simulated payout status.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Pending & Verified Winner Queue</h3>

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {winners.map((w) => (
            <div key={w.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{w.userName}</span>
                  <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>({w.userEmail})</span>
                  <span className="badge badge-purple">{w.matchTier}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Draw Date: {w.drawDate} | Prize: <strong style={{ color: 'var(--accent-gold)' }}>{w.prizeAmount}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Proof Status</div>
                  <span className={`badge ${w.status === 'verified' ? 'badge-active' : w.status === 'rejected' ? 'badge-warning' : 'badge-cyan'}`}>
                    {w.status}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Simulated Payout</div>
                  <span className={`badge ${w.payoutStatus === 'paid' ? 'badge-active' : 'badge-warning'}`}>
                    {w.payoutStatus}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {w.proofFile && (
                    <button onClick={() => setInspectModal(w)} className="btn btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                      <Eye style={{ width: '14px', height: '14px' }} /> Inspect Proof
                    </button>
                  )}

                  {w.status === 'verified' && w.payoutStatus === 'pending' && (
                    <button onClick={() => handleMarkPaid(w.id)} className="btn btn-gold" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                      <CreditCard style={{ width: '14px', height: '14px' }} /> Mark Demo Paid
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspect Proof Modal */}
      {inspectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1.5rem' }}>
          <div className="glass-panel" style={{ maxWidth: '550px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Inspect Score Proof Screenshot</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Submitted by <strong>{inspectModal.userName}</strong> for <strong>{inspectModal.drawDate}</strong> ({inspectModal.prizeAmount} prize).
            </p>

            <div style={{ height: '220px', background: '#0F172A', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <FileText style={{ width: '48px', height: '48px', color: 'var(--accent-cyan)' }} />
              <div style={{ fontWeight: 600 }}>{inspectModal.proofFile}</div>
              <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Simulated Score Verification Document</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setInspectModal(null)} className="btn btn-secondary">Close</button>
              <button onClick={() => handleReject(inspectModal.id)} className="btn btn-danger">
                <XCircle style={{ width: '16px', height: '16px' }} /> Reject Proof
              </button>
              <button onClick={() => handleApprove(inspectModal.id)} className="btn btn-primary">
                <CheckCircle2 style={{ width: '16px', height: '16px' }} /> Approve Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
