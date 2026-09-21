import Link from 'next/link';
import { Heart, Trophy, Shield, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#05070A',
        borderTop: '1px solid var(--border-subtle)',
        padding: '4rem 1.5rem 2rem',
        marginTop: '6rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}
      >
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--accent-cyan-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trophy style={{ width: '18px', height: '18px', color: '#040D1A' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>
              DIGITAL <span className="gradient-text-cyan">HEROES</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Subscription-driven golf performance, charity fundraising, and transparent draw platform. Supporting global causes with every stroke.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--text-main)' }}>Platform</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <li><Link href="/how-it-works">How It Works</Link></li>
            <li><Link href="/charities">Charity Directory</Link></li>
            <li><Link href="/draws">Monthly Draw Rules</Link></li>
            <li><Link href="/subscribe">Subscription Plans</Link></li>
          </ul>
        </div>

        {/* User Portal */}
        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--text-main)' }}>Account & Admin</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <li><Link href="/dashboard">Subscriber Dashboard</Link></li>
            <li><Link href="/dashboard/scores">Score Entry (1-45)</Link></li>
            <li><Link href="/dashboard/winnings">Winnings & Proof Upload</Link></li>
            <li><Link href="/admin">Admin Control Panel</Link></li>
          </ul>
        </div>

        {/* Impact Note */}
        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--text-main)' }}>Charity Pledge</h4>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            Minimum 10% of all subscription revenue is directly allocated to user-selected charitable foundations. Tested & verified monthly.
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          color: 'var(--text-subtle)',
          fontSize: '0.85rem',
        }}
      >
        <p>© 2026 Digital Heroes (digitalheroes.co.in). All rights reserved.</p>
        <p>Built with Next.js, Supabase, and Stripe.</p>
      </div>
    </footer>
  );
}
