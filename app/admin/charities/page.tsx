'use client';

import { useState, useEffect } from 'react';
import { Heart, Plus, Edit2, Trash2 } from 'lucide-react';

interface CharityItem {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  totalAllocated?: string;
}

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<CharityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.charities) {
          setCharities(
            data.charities.map((c: any) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              is_active: c.is_active,
              totalAllocated: '$1,065.00',
            }))
          );
        }
      })
      .catch((err) => console.error('Failed to load charities:', err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Charity Directory Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Add, update, or deactivate partner non-profit organizations.</p>
        </div>
        <button className="btn btn-gold">
          <Plus style={{ width: '18px', height: '18px' }} /> Add New Charity
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-subtle)' }}>
              <th style={{ padding: '0.75rem' }}>Charity Name</th>
              <th style={{ padding: '0.75rem' }}>Slug</th>
              <th style={{ padding: '0.75rem' }}>Total Allocated</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {charities.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '0.75rem', color: 'var(--accent-cyan)' }}>{c.slug}</td>
                <td style={{ padding: '0.75rem', color: '#F43F5E', fontWeight: 700 }}>{c.totalAllocated || '$1,065.00'}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${c.is_active ? 'badge-active' : 'badge-warning'}`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', marginRight: '0.5rem' }}>
                    <Edit2 style={{ width: '14px', height: '14px' }} />
                  </button>
                  <button className="btn btn-danger" style={{ padding: '0.35rem 0.65rem' }}>
                    <Trash2 style={{ width: '14px', height: '14px' }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
