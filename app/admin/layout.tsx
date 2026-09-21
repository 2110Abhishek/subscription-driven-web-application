'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Shield, Users, CreditCard, Trophy, Heart, FileText, CheckSquare, ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, user, setRole } = useAuth();

  // If user is not an admin, restrict access in frontend demo
  if (role !== 'admin') {
    return (
      <div style={{ maxWidth: '560px', margin: '5rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(255, 184, 0, 0.15)',
              color: '#FFB800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              border: '1px solid rgba(255, 184, 0, 0.3)',
            }}
          >
            <ShieldAlert style={{ width: '36px', height: '36px' }} />
          </div>

          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Access Restricted</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Administrator permission is required to view platform management tools. You are currently browsing as <strong>{role.toUpperCase()}</strong>.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => setRole('admin')}
              className="btn btn-gold"
              style={{ padding: '0.85rem', width: '100%', justifyContent: 'center' }}
            >
              <KeyRound style={{ width: '18px', height: '18px' }} />
              Switch to Admin Demo Mode
            </button>

            <Link href="/" className="btn btn-secondary" style={{ padding: '0.85rem', justifyContent: 'center' }}>
              <ArrowLeft style={{ width: '18px', height: '18px' }} />
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const adminNavItems = [
    { name: 'Admin Overview', href: '/admin', icon: Shield },
    { name: 'Draw Management', href: '/admin/draws', icon: Trophy },
    { name: 'Winner Verification', href: '/admin/winners', icon: CheckSquare },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Charity Management', href: '/admin/charities', icon: Heart },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    { name: 'Reports & Analytics', href: '/admin/reports', icon: FileText },
  ];

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
      {/* Admin Sidebar */}
      <aside className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
        <div style={{ paddingBottom: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#FFB800', fontWeight: 700, fontSize: '0.85rem' }}>
            <Shield style={{ width: '16px', height: '16px' }} /> ADMIN CONTROL CENTER
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem', marginTop: '0.3rem' }}>Platform Administrator</div>
          <span className="badge badge-warning" style={{ marginTop: '0.5rem', fontSize: '0.65rem' }}>ADMIN DEMO ACCESS</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {adminNavItems.map((item) => {
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
                  color: isActive ? '#FFB800' : 'var(--text-muted)',
                  background: isActive ? 'rgba(255, 184, 0, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(255, 184, 0, 0.3)' : '1px solid transparent',
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

      {/* Admin Content Workspace */}
      <div>{children}</div>
    </div>
  );
}
