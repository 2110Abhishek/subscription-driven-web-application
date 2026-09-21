'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import {
  LayoutDashboard,
  Trophy,
  Heart,
  Award,
  CreditCard,
  User,
  ArrowRight,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, user, setRole } = useAuth();

  // If visitor is guest, demand subscriber authentication/demo login
  if (role === 'guest') {
    return (
      <div style={{ maxWidth: '560px', margin: '5rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(0, 242, 254, 0.15)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              border: '1px solid rgba(0, 242, 254, 0.3)',
            }}
          >
            <User style={{ width: '36px', height: '36px' }} />
          </div>

          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Subscriber Sign In Required</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            You need to be signed in as an active subscriber to access your score entry, charity pledge settings, and draw tickets.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => setRole('subscriber')}
              className="btn btn-primary"
              style={{ padding: '0.85rem', justifyContent: 'center' }}
            >
              Sign In as Subscriber Demo <ArrowRight style={{ width: '18px', height: '18px' }} />
            </button>

            <Link href="/login" className="btn btn-secondary" style={{ padding: '0.85rem', justifyContent: 'center' }}>
              Go to Sign In Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Scores (1-45)', href: '/dashboard/scores', icon: Trophy },
    { name: 'Charity & Pledge', href: '/dashboard/charity', icon: Heart },
    { name: 'Monthly Draws', href: '/dashboard/draws', icon: Award },
    { name: 'Winnings & Proof', href: '/dashboard/winnings', icon: CreditCard },
  ];

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2.5rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gap: '2rem',
      }}
    >
      {/* Sidebar Navigation */}
      <aside className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
        <div style={{ paddingBottom: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-subtle)', fontWeight: 600 }}>
            {role === 'admin' ? 'Administrator Portal' : 'Subscriber Portal'}
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.2rem' }}>
            {user?.name || (role === 'admin' ? 'Abhishek Choudhari' : 'Hero Subscriber')}
          </div>
          <span className={role === 'admin' ? 'badge badge-warning' : 'badge badge-active'} style={{ marginTop: '0.5rem' }}>
            {role === 'admin' ? 'Platform Administrator' : 'Active Hero Subscriber'}
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 242, 254, 0.25)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon style={{ width: '18px', height: '18px' }} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div>{children}</div>
    </div>
  );
}
