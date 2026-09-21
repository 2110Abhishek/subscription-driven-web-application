'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/auth/auth-context';
import { Trophy, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginAs } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const role = data.user.role as UserRole;
      loginAs(role, data.user.email, data.user.name);
      router.push(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleQuickAccess = (userEmail: string, userRole: UserRole, userName: string) => {
    loginAs(userRole, userEmail, userName);
    router.push(userRole === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div style={{ maxWidth: '460px', margin: '4rem auto', padding: '0 1.5rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'var(--accent-cyan-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Trophy style={{ width: '26px', height: '26px', color: '#040D1A' }} />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to manage scores, charity & draws</p>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-subtle)',
                  width: '16px',
                  height: '16px',
                }}
              />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-subtle)',
                  width: '16px',
                  height: '16px',
                }}
              />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ marginTop: '0.5rem', padding: '0.85rem' }}
          >
            {loading ? 'Signing In...' : 'Sign In'} <ArrowRight style={{ width: '18px', height: '18px' }} />
          </button>
        </form>

        {/* Real Quick Access Accounts */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textAlign: 'center', marginBottom: '0.75rem' }}>
            Quick Account Access
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => handleQuickAccess('agchoudhari2110@gmail.com', 'subscriber', 'Abhishek Choudhari')}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.65rem', justifyContent: 'center' }}
            >
              <UserCheck style={{ width: '14px', height: '14px', color: 'var(--accent-cyan)' }} />
              Subscriber
            </button>
            <button
              type="button"
              onClick={() => handleQuickAccess('admin@digitalheroes.co.in', 'admin', 'Abhishek Choudhari')}
              className="btn"
              style={{
                fontSize: '0.8rem',
                padding: '0.65rem',
                justifyContent: 'center',
                background: 'rgba(255, 184, 0, 0.1)',
                color: '#FFB800',
                border: '1px solid rgba(255, 184, 0, 0.25)',
              }}
            >
              <ShieldCheck style={{ width: '14px', height: '14px' }} />
              Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
