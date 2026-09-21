'use client';

import { useState } from 'react';
import { useAuth, UserRole } from '@/lib/auth/auth-context';
import { Shield, UserCheck, UserX, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export function DemoRoleSwitcher() {
  const { role, setRole } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const rolesList: { id: UserRole; label: string; icon: any; color: string }[] = [
    { id: 'guest', label: 'Guest (Public Visitor)', icon: UserX, color: '#94A3B8' },
    { id: 'subscriber', label: 'Subscriber (Logged-in)', icon: UserCheck, color: 'var(--accent-cyan)' },
    { id: 'admin', label: 'Admin (Administrator)', icon: Shield, color: '#FFB800' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 9999,
        fontFamily: 'var(--font-body)',
      }}
    >
      <div
        className="glass-panel"
        style={{
          padding: collapsed ? '0.5rem 1rem' : '1rem',
          minWidth: collapsed ? 'auto' : '260px',
          background: 'rgba(15, 23, 42, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles style={{ width: '16px', height: '16px', color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)' }}>
              Demo Role: <span style={{ color: rolesList.find((r) => r.id === role)?.color }}>{role.toUpperCase()}</span>
            </span>
          </div>

          <button style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', display: 'flex' }}>
            {collapsed ? <ChevronUp style={{ width: '16px', height: '16px' }} /> : <ChevronDown style={{ width: '16px', height: '16px' }} />}
          </button>
        </div>

        {!collapsed && (
          <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginBottom: '0.2rem' }}>
              Switch navigation state for testing:
            </div>
            {rolesList.map((r) => {
              const Icon = r.icon;
              const isSelected = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 700 : 500,
                    border: isSelected ? `1px solid ${r.color}` : '1px solid transparent',
                    background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    color: isSelected ? r.color : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                >
                  <Icon style={{ width: '14px', height: '14px', color: r.color }} />
                  {r.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
