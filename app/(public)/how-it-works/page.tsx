import Link from 'next/link';
import { Sparkles, CheckCircle2, Trophy, Heart, Shield, RefreshCw } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Choose a Subscription Plan',
      desc: 'Select either a flexible monthly plan ($15/month) or a discounted yearly plan ($150/year). Your subscription fuels both charity donations and the monthly prize pool.',
      icon: Sparkles,
      color: 'var(--accent-cyan)',
    },
    {
      num: '02',
      title: 'Select Your Charity & Contribution %',
      desc: 'Pick your preferred registered non-profit. A mandatory minimum of 10% of your subscription goes directly to your charity. You can voluntarily increase your contribution up to 50%.',
      icon: Heart,
      color: '#F43F5E',
    },
    {
      num: '03',
      title: 'Enter Stableford Scores (1 to 45)',
      desc: 'Input your golf scores in Stableford format (range 1–45) with dates. The system keeps your latest 5 scores. When you log a 6th score, the oldest score is automatically replaced.',
      icon: RefreshCw,
      color: 'var(--accent-gold)',
    },
    {
      num: '04',
      title: 'Participate in Monthly Draws',
      desc: 'Each month, 5 winning numbers are drawn (using cryptographically secure random logic or algorithmic score frequency). Your 5 retained scores act as your entry tickets.',
      icon: Trophy,
      color: '#C084FC',
    },
    {
      num: '05',
      title: 'Match & Claim Prize Pool Tiers',
      desc: 'Matching numbers win shares of the prize pool: 5 matches win 40% (plus rollover jackpot!), 4 matches win 35%, and 3 matches win 25%. Ties in any tier split the pool equally.',
      icon: CheckCircle2,
      color: 'var(--accent-emerald)',
    },
    {
      num: '06',
      title: 'Winner Proof Verification & Payout',
      desc: 'If selected as a winner, upload a simple screenshot of your golf app score record. Once verified by our administrators, your prize money is marked paid.',
      icon: Shield,
      color: '#38BDF8',
    },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="badge badge-purple" style={{ marginBottom: '1rem' }}>
          <Sparkles style={{ width: '14px', height: '14px' }} />
          Clear & Transparent Platform Mechanics
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>How Digital Heroes Works</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto' }}>
          From your initial subscription to winner verification, every step of our system is auditable, deterministic, and charity-first.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="glass-panel"
              style={{
                padding: '2rem',
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '1.5rem',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${step.color}`,
                  color: step.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {step.num}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Icon style={{ width: '20px', height: '20px', color: step.color }} />
                  <h3 style={{ fontSize: '1.4rem' }}>{step.title}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Link href="/subscribe" className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
          Join & Start Playing Now
        </Link>
      </div>
    </div>
  );
}
