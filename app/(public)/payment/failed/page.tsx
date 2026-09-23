'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentFailedPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '2px solid #EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <AlertCircle style={{ width: '36px', height: '36px', color: '#EF4444' }} />
        </div>

        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: '#EF4444' }}>Payment Failed</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>
          Unable to complete the demo payment. Your subscription remains inactive.
        </p>

        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', textAlign: 'left', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div style={{ fontWeight: 600, color: '#FCA5A5', marginBottom: '0.4rem' }}>Reason:</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            The demo card provided was declined by simulated gateway rules (cards ending in 0000 simulate declines).
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            href="/payment"
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.85rem', justifyContent: 'center' }}
          >
            <RefreshCw style={{ width: '16px', height: '16px' }} /> Try Again
          </Link>
          <Link
            href="/checkout"
            className="btn btn-secondary"
            style={{ flex: 1, padding: '0.85rem', justifyContent: 'center' }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
