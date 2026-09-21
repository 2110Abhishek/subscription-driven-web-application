'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Trophy, Heart, Sparkles, User, ShieldCheck, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { role, user, logout } = useAuth();

  // Base public items
  const baseNavItems = [
    { name: 'How It Works', href: '/how-it-works', icon: Sparkles },
    { name: 'Charities', href: '/charities', icon: Heart },
    { name: 'Monthly Draws', href: '/draws', icon: Trophy },
  ];

  // Dynamic role-based navigation items - Dashboard / Admin placed at first
  const roleNavItems = [];
  if (role === 'subscriber') {
    roleNavItems.push({ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard });
  } else if (role === 'admin') {
    roleNavItems.push({ name: 'Admin', href: '/admin', icon: ShieldCheck });
  }
  roleNavItems.push(...baseNavItems);

  const handleSignOut = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(9, 11, 16, 0.9)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--accent-cyan-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0, 242, 254, 0.3)',
            }}
          >
            <Trophy style={{ width: '22px', height: '22px', color: '#040D1A' }} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            DIGITAL <span className="gradient-text-cyan">HEROES</span>
          </span>
        </Link>

        {/* Center Navigation Links */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {roleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const isAdminItem = item.href === '/admin';

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  padding: '0.45rem 0.9rem',
                  borderRadius: '8px',
                  color: isAdminItem
                    ? '#FFB800'
                    : isActive
                    ? 'var(--accent-cyan)'
                    : 'var(--text-muted)',
                  border: isAdminItem
                    ? '1px solid rgba(255, 184, 0, 0.3)'
                    : isActive
                    ? '1px solid var(--accent-cyan)'
                    : '1px solid transparent',
                  background: isAdminItem
                    ? 'rgba(255, 184, 0, 0.1)'
                    : isActive
                    ? 'rgba(0, 242, 254, 0.08)'
                    : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon style={{ width: '16px', height: '16px' }} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {role === 'guest' ? (
            <>
              <Link href="/login" className="btn btn-secondary" style={{ padding: '0.55rem 1.1rem' }}>
                <User style={{ width: '16px', height: '16px' }} />
                Sign In
              </Link>
              <Link href="/subscribe" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem' }}>
                Subscribe Now
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-subtle)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: role === 'admin' ? '#FFB800' : 'var(--accent-emerald)',
                  }}
                />
                {role === 'admin' ? `${user?.name || 'Abhishek Choudhari'} · Admin` : (user?.name || 'Subscriber')}
              </span>

              <button
                onClick={handleSignOut}
                className="btn btn-secondary"
                style={{ padding: '0.55rem 1rem' }}
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'none',
          }}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: '1rem 1.5rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(9, 11, 16, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {roleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const isAdminItem = item.href === '/admin';

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isAdminItem ? '#FFB800' : isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    border: isAdminItem
                      ? '1px solid rgba(255, 184, 0, 0.3)'
                      : isActive
                      ? '1px solid var(--accent-cyan)'
                      : '1px solid transparent',
                    background: isAdminItem
                      ? 'rgba(255, 184, 0, 0.1)'
                      : isActive
                      ? 'rgba(0, 242, 254, 0.1)'
                      : 'transparent',
                  }}
                >
                  <Icon style={{ width: '18px', height: '18px' }} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div
            style={{
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {role === 'guest' ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <User style={{ width: '16px', height: '16px' }} />
                  Sign In
                </Link>
                <Link
                  href="/subscribe"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Subscribe Now
                </Link>
              </>
            ) : (
              <button
                onClick={handleSignOut}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
