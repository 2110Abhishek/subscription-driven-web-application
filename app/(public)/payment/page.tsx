'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, ShieldCheck, ArrowLeft, AlertCircle, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { SubscriptionService, PendingSubscription, ActiveSubscription } from '@/services/subscription.service';
import { PaymentService } from '@/services/payment.service';
import { paymentInputSchema } from '@/lib/validation/schemas';

export default function PaymentPage() {
  const router = useRouter();
  const [sub, setSub] = useState<PendingSubscription | null>(null);

  // Form Fields
  const [cardholderName, setCardholderName] = useState('Abhishek Choudhari');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiryDate, setExpiryDate] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [billingEmail, setBillingEmail] = useState('agchoudhari2110@gmail.com');

  // Flow State
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [failedState, setFailedState] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState<ActiveSubscription | null>(null);
  const [blockReason, setBlockReason] = useState<string | null>(null);

  useEffect(() => {
    // Check if user already has an active subscription this month
    const check = SubscriptionService.canSubscribeThisMonth();
    if (!check.allowed && check.currentSub) {
      setAlreadySubscribed(check.currentSub);
      setBlockReason(check.reason || 'You already have an active subscription for this month.');
    }

    const pending = SubscriptionService.getPendingSubscription();
    if (!pending) {
      // Default monthly fallback if visited directly
      const fallback: PendingSubscription = {
        plan: 'monthly',
        charityId: '11111111-1111-1111-1111-111111111111',
        charityName: 'Golf For Good Foundation',
        contributionPercentage: 15,
        charityAmount: '2.25',
        price: 15,
        timestamp: new Date().toISOString(),
      };
      SubscriptionService.savePendingSubscription(fallback);
      setSub(fallback);
    } else {
      setSub(pending);
    }
  }, []);

  const handleCardNumberChange = (val: string) => {
    // Auto-format card numbers with spaces every 4 digits
    const cleaned = val.replace(/\D/g, '').substring(0, 16);
    const parts = cleaned.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  const handleAutofill = (type: 'success' | 'fail') => {
    setErrorMsg(null);
    setFailedState(false);
    if (type === 'success') {
      setCardNumber('4242 4242 4242 4242');
      setCvv('123');
    } else {
      setCardNumber('4000 0000 0000 0000');
      setCvv('000');
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFailedState(false);

    // Guard: Prevent subscribing more than once in the same month
    const check = SubscriptionService.canSubscribeThisMonth();
    if (!check.allowed) {
      setErrorMsg(check.reason || 'You already have an active subscription for this month.');
      return;
    }

    // Validate form inputs using Zod schema
    const validation = paymentInputSchema.safeParse({
      cardholderName: cardholderName.trim(),
      cardNumber,
      expiryDate: expiryDate.trim(),
      cvv: cvv.trim(),
      billingEmail: billingEmail.trim(),
    });

    if (!validation.success) {
      setErrorMsg(validation.error.errors[0]?.message || 'Please check your payment details.');
      return;
    }

    if (!sub) return;

    setProcessing(true);

    try {
      const result = await PaymentService.processDemoPayment({
        cardholderName,
        cardNumber,
        expiryDate,
        cvv,
        billingEmail,
        amount: sub.price,
        plan: sub.plan,
      });

      if (!result.success || result.error) {
        setProcessing(false);
        setFailedState(true);
        setErrorMsg(result.error || 'Unable to complete demo payment.');
        return;
      }

      // Activate subscription in service and local storage
      SubscriptionService.activateSubscription({
        plan: sub.plan,
        charityId: sub.charityId,
        charityName: sub.charityName,
        contributionPercentage: sub.contributionPercentage,
        amount: sub.price,
        transactionId: result.transactionId || 'DH-DEMO-SUCCESS',
      });

      // Clear pending draft
      SubscriptionService.clearPendingSubscription();

      // Navigate to success confirmation
      router.push(`/payment/success?tx=${encodeURIComponent(result.transactionId || 'DH-DEMO-SUCCESS')}`);
    } catch (err: any) {
      setProcessing(false);
      setFailedState(true);
      setErrorMsg(err.message || 'Payment simulation encountered an error.');
    }
  };

  if (!sub) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Preparing secure demo checkout...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '650px', margin: '4rem auto', padding: '0 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/checkout"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to Review
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Lock style={{ width: '20px', height: '20px', color: 'var(--accent-gold)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Demo Checkout · Step 3 of 3
          </span>
        </div>

        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Payment Simulation</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Simulate payment processing. No real payment credentials are stored or transmitted.
        </p>

        {/* Existing Active Subscription Notice */}
        {alreadySubscribed && (
          <div
            className="glass-card"
            style={{
              padding: '1.25rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 184, 0, 0.4)',
              background: 'rgba(255, 184, 0, 0.05)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}
          >
            <AlertTriangle style={{ width: '24px', height: '24px', color: '#FFB800', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 600, color: '#FFB800', marginBottom: '0.25rem' }}>
                Active Subscription Limit
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {blockReason} Subscriptions are limited to once per month.
              </div>
              <Link href="/dashboard" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                Go to Dashboard <ArrowRight style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>
          </div>
        )}

        {/* Plan summary badge */}
        <div
          className="glass-card"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>{sub.plan === 'yearly' ? 'Yearly Hero Plan' : 'Monthly Hero Plan'}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Supporting {sub.charityName} ({sub.contributionPercentage}%)</div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            ${sub.price.toFixed(2)}
          </div>
        </div>

        {/* Demo Helper / Test Card autofill */}
        <div
          style={{
            background: 'rgba(56, 189, 248, 0.05)',
            border: '1px dashed var(--accent-cyan)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
              🧪 REVIEWER TEST CARDS (Quick Fill)
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleAutofill('success')}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            >
              <CheckCircle2 style={{ width: '14px', height: '14px', color: 'var(--accent-emerald)' }} />
              Autofill Success Card (4242...)
            </button>
            <button
              type="button"
              onClick={() => handleAutofill('fail')}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            >
              <AlertCircle style={{ width: '14px', height: '14px', color: '#EF4444' }} />
              Autofill Decline Card (...0000)
            </button>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div
            style={{
              padding: '0.85rem 1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: '#F87171',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmitPayment} style={{ display: 'grid', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Cardholder Full Name
            </label>
            <input
              type="text"
              required
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="e.g. Abhishek Choudhari"
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Card Number (Demo)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                maxLength={19}
                value={cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="input-field"
                style={{ paddingLeft: '2.5rem', fontFamily: 'monospace' }}
              />
              <CreditCard
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                  color: 'var(--text-subtle)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Expiration Date
              </label>
              <input
                type="text"
                required
                maxLength={5}
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                className="input-field"
                style={{ textAlign: 'center' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Security Code (CVV)
              </label>
              <input
                type="password"
                required
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Billing Email Address
            </label>
            <input
              type="email"
              required
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field"
            />
          </div>

          {alreadySubscribed ? (
            <button
              type="button"
              disabled
              className="btn btn-secondary"
              style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1.05rem', justifyContent: 'center', opacity: 0.6, cursor: 'not-allowed' }}
            >
              Subscription Limit: 1 Per Month
            </button>
          ) : (
            <button
              type="submit"
              disabled={processing}
              className="btn btn-gold"
              style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1.05rem', justifyContent: 'center' }}
            >
              {processing ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw className="animate-spin" style={{ width: '18px', height: '18px' }} />
                  Processing Demo Payment...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock style={{ width: '16px', height: '16px' }} />
                  Pay ${sub.price.toFixed(2)} & Activate Subscription
                </span>
              )}
            </button>
          )}
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.75rem', marginTop: '1.5rem' }}>
          🔒 End-to-end encrypted demo flow. Cards ending in 0000 trigger a simulated decline.
        </p>
      </div>
    </div>
  );
}
