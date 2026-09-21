'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Upload, CheckCircle2, Clock, ShieldCheck, FileCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export default function DashboardWinningsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [proofFileName, setProofFileName] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchWinnings = async () => {
    try {
      const email = user?.email || 'agchoudhari2110@gmail.com';
      const res = await fetch(`/api/subscriber/winnings?email=${encodeURIComponent(email)}`);
      const json = await res.json();
      if (json && !json.error) {
        setData(json);
        if (json.latest?.winner_proofs) {
          setProofUploaded(true);
          setProofFileName(json.latest.winner_proofs.file_name || 'score_proof.png');
        }
      }
    } catch (err) {
      console.error('Error fetching winnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinnings();
  }, [user?.email]);

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      setStatusMsg(null);

      try {
        const email = user?.email || 'agchoudhari2110@gmail.com';
        const res = await fetch('/api/subscriber/winnings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            fileName: file.name,
            winnerId: data?.latest?.id,
          }),
        });

        const resJson = await res.json();
        if (resJson.success) {
          setProofUploaded(true);
          setProofFileName(file.name);
          setStatusMsg('Proof submitted successfully! Admin will review your screenshot.');
          await fetchWinnings();
        }
      } catch (err) {
        console.error('Upload error:', err);
      } finally {
        setUploading(false);
      }
    }
  };

  const totalFormatted = data?.totalFormatted || '$0.00';
  const latestWin = data?.latest;
  const verificationStatus = latestWin?.status || 'unverified';
  const payoutStatus = latestWin?.payout_status || 'pending';

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Your Winnings & Score Verification</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Track prize distributions and submit score proof screenshots for admin review.
        </p>
      </div>

      {statusMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 style={{ width: '18px', height: '18px' }} />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Total Winnings Summary */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Total Cumulative Winnings</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{totalFormatted}</div>
        </div>

        <div>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Verification Status</div>
          <div style={{ marginTop: '0.4rem' }}>
            {verificationStatus === 'verified' ? (
              <span className="badge badge-active">Verified by Admin</span>
            ) : verificationStatus === 'proof_submitted' ? (
              <span className="badge badge-warning">Proof Submitted / Under Review</span>
            ) : (
              <span className="badge badge-purple">No Pending Verification</span>
            )}
          </div>
        </div>

        <div>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Payout Settlement</div>
          <div style={{ marginTop: '0.4rem' }}>
            {payoutStatus === 'paid' ? (
              <span className="badge badge-cyan">Payout Completed</span>
            ) : (
              <span className="badge badge-warning">Processing Upon Verification</span>
            )}
          </div>
        </div>
      </div>

      {/* Winner Proof Upload Form */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Upload style={{ width: '20px', height: '20px', color: 'var(--accent-gold)' }} />
          Submit Winner Proof Screenshot
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          If you win a prize tier, upload a clear screenshot of your score history from your official golf app for verification.
        </p>

        <div style={{ border: '2px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '2.5rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)' }}>
          {proofUploaded ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <FileCheck style={{ width: '40px', height: '40px', color: 'var(--accent-emerald)' }} />
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#34D399' }}>Proof Uploaded & Stored in Database!</div>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>{proofFileName}</p>
              <span className="badge badge-warning" style={{ marginTop: '0.5rem' }}>Awaiting Admin Approval</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <Upload style={{ width: '36px', height: '36px', color: 'var(--text-subtle)' }} />
              <div style={{ fontWeight: 600 }}>Upload Golf App Screenshot</div>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Supports PNG, JPG, or PDF up to 5MB.</p>
              <label className="btn btn-secondary" style={{ marginTop: '0.75rem', cursor: 'pointer' }}>
                {uploading ? 'Uploading to database...' : 'Choose File'}
                <input type="file" accept="image/*,.pdf" onChange={handleProofUpload} style={{ display: 'none' }} />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
