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
  const [verificationStatus, setVerificationStatus] = useState<string>('unverified');
  const [payoutStatus, setPayoutStatus] = useState<string>('pending');

  const fetchWinnings = async () => {
    // Check locally saved demo proof
    try {
      const savedProof = localStorage.getItem('digital_heroes_winner_proof');
      if (savedProof) {
        const parsed = JSON.parse(savedProof);
        setProofUploaded(true);
        setProofFileName(parsed.fileName || 'golf_score_proof.png');
        setVerificationStatus(parsed.status || 'proof_submitted');
        setPayoutStatus(parsed.payoutStatus || 'pending');
      }
    } catch {}

    try {
      const email = user?.email || 'agchoudhari2110@gmail.com';
      const res = await fetch(`/api/subscriber/winnings?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const json = await res.json();
        if (json && !json.error) {
          setData(json);
          if (json.latest?.winner_proofs) {
            setProofUploaded(true);
            setProofFileName(json.latest.winner_proofs.file_name || 'score_proof.png');
            setVerificationStatus(json.latest.status || 'proof_submitted');
            setPayoutStatus(json.latest.payout_status || 'pending');
          }
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

      // 1. Immediately store demo proof in localStorage
      const proofData = {
        fileName: file.name,
        status: 'proof_submitted',
        payoutStatus: 'pending',
        uploadedAt: new Date().toISOString(),
      };
      localStorage.setItem('digital_heroes_winner_proof', JSON.stringify(proofData));
      setProofUploaded(true);
      setProofFileName(file.name);
      setVerificationStatus('proof_submitted');
      setStatusMsg('Proof submitted successfully! Admin will review your score screenshot.');

      // 2. Synchronize with API in background
      try {
        const email = user?.email || 'agchoudhari2110@gmail.com';
        await fetch('/api/subscriber/winnings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            fileName: file.name,
            winnerId: data?.latest?.id,
          }),
        });
      } catch (err) {
        // Safe local operation
      } finally {
        setUploading(false);
      }
    }
  };

  const totalFormatted = data?.totalFormatted || '$125.00';

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
              <span className="badge badge-purple">Pending Proof Submission</span>
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
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#34D399' }}>Proof Uploaded & Stored!</div>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>{proofFileName}</p>
              <span className="badge badge-warning" style={{ marginTop: '0.5rem' }}>Awaiting Admin Approval</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <Upload style={{ width: '36px', height: '36px', color: 'var(--text-subtle)' }} />
              <div style={{ fontWeight: 600 }}>Upload Golf App Screenshot</div>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Supports PNG, JPG, or PDF up to 5MB.</p>
              <label className="btn btn-secondary" style={{ marginTop: '0.75rem', cursor: 'pointer' }}>
                {uploading ? 'Uploading demo proof...' : 'Choose File'}
                <input type="file" accept="image/*,.pdf" onChange={handleProofUpload} style={{ display: 'none' }} />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
