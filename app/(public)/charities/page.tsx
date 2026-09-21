'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Search, Calendar, ArrowRight } from 'lucide-react';

export default function CharitiesPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadCharities() {
      try {
        const res = await fetch('/api/charities');
        const data = await res.json();
        if (data && data.charities) {
          setCharities(data.charities);
        }
      } catch (err) {
        console.error('Failed to load charities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCharities();
  }, []);

  const filteredCharities = charities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="badge badge-active" style={{ marginBottom: '1rem' }}>
          <Heart style={{ width: '14px', height: '14px' }} />
          Verified Non-Profit Directory
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Support Causes That Matter</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto' }}>
          Every Digital Heroes subscription guarantees at least 10% of revenue goes directly to your selected charity partner.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '500px', margin: '0 auto 3rem', position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)', width: '18px', height: '18px' }} />
        <input
          type="text"
          placeholder="Search charities by name or cause..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '2.75rem' }}
        />
      </div>

      {/* Charity Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-subtle)', padding: '3rem' }}>
          Loading charities from database...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {filteredCharities.map((charity) => (
            <div key={charity.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', backgroundImage: `url(${charity.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18, 22, 34, 0.95), transparent)' }} />
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>{charity.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {charity.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.85rem', marginBottom: '1.5rem', background: 'rgba(255, 184, 0, 0.08)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                    <Calendar style={{ width: '14px', height: '14px' }} />
                    <span>{charity.upcomingEvent}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link href={`/charities/${charity.slug}`} className="btn btn-secondary" style={{ flex: 1, padding: '0.65rem' }}>
                    Learn More
                  </Link>
                  <Link href={`/subscribe?charity=${charity.id}`} className="btn btn-primary" style={{ padding: '0.65rem 1rem' }}>
                    Support <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
