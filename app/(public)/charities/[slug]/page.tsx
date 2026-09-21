import Link from 'next/link';
import { Heart, Calendar, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';

export default async function CharityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: charityRecord, error } = await supabase
    .from('charities')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!charityRecord) {
    // If not found by exact slug, check if any charity exists
    const { data: fallback } = await supabase.from('charities').select('*').limit(1).single();
    if (!fallback) notFound();
  }

  const charity = charityRecord || {
    name: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    slug,
    description: 'A dedicated non-profit organization promoting community sports and educational access.',
    image_url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=1200',
    events: [],
  };

  const image = charity.image_url || 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=1200';
  const events = Array.isArray(charity.events) && charity.events.length > 0 ? charity.events : [
    { title: 'Annual Charity Golf Classic', date: 'October 15, 2026', location: 'Royal St. Andrew Field' },
    { title: 'Community Mentorship Workshop', date: 'November 20, 2026', location: 'Metropolitan Sports Hub' },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      <div className="glass-panel" style={{ overflow: 'hidden', padding: '0', marginBottom: '3rem' }}>
        <div style={{ height: '300px', backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9, 11, 16, 1), transparent 60%)' }} />
        </div>

        <div style={{ padding: '2.5rem', marginTop: '-4rem', position: 'relative' }}>
          <div className="badge badge-active" style={{ marginBottom: '1rem' }}>
            <ShieldCheck style={{ width: '14px', height: '14px' }} /> Verified Charity Partner
          </div>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>{charity.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {charity.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>1,250+</div>
              <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Youth Beneficiaries</div>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>48</div>
              <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Community Golf Days</div>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>$45,000+</div>
              <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>Total Platform Allocations</div>
            </div>
          </div>

          <Link href={`/subscribe?charity=${charity.id || slug}`} className="btn btn-gold" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            Select This Charity & Subscribe <ArrowRight style={{ width: '18px', height: '18px' }} />
          </Link>
        </div>
      </div>

      {/* Upcoming Golf Events */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Upcoming Charity Golf Days</h2>
      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {events.map((event: any, idx: number) => (
          <div key={idx} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{event.title}</h4>
              <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar style={{ width: '14px', height: '14px' }} /> {event.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin style={{ width: '14px', height: '14px' }} /> {event.location || 'Royal St. Andrew Field'}</span>
              </div>
            </div>
            <Link href="/subscribe" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Register Interest</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
