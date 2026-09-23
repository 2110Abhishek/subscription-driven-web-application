'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, ShieldCheck, ArrowLeft, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { SubscriptionService, PendingSubscription } from '@/services/subscription.service';
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

  useEffect(() => {
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

      // Navigate to success screen
      router.push(`/payment/success?tx=${result.transactionId}&plan=${sub.plan}`);
    } catch (err: any) {
      setProcessing(false);
      setFailedState(true);
      setErrorMsg(err.message || 'Payment simulation failed.');
    }
  };

  if (!sub) {
    return (
      <div style={{ maxWidth: '650px', margin: '4rem auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading payment gateway...</p>
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
            marginBottom: '1rem',
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to Review
        </Link>
        <div className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>
          <ShieldCheck style={{ width: '14px', height: '14px' }} /> Demo Payment Gateway
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Payment Simulation</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Safe demo checkout. No actual money or card data is charged or stored.
        </p>
      </div>

      {/* Simulated Failure State Banner */}
      {failedState && (
        <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem', color: '#EF4444' }}>
            <AlertCircle style={{ width: '18px', height: '18px' }} />
            Demo Payment Failed
          </div>
          <p style={{ fontSize: '0.85rem', color: '#FECACA', marginBottom: '1rem' }}>
            {errorMsg || 'Unable to complete demo payment transaction.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => handleAutofill('success')}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              Use Valid Test Card
            </button>
            <Link
              href="/checkout"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              Back to Checkout
            </Link>
          </div>
        </div>
      )}

      {errorMsg && !failedState && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          {errorMsg}
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        {/* Order Header Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
              {sub.plan === 'yearly' ? 'Yearly Hero Subscription' : 'Monthly Hero Subscription'}
            </div>
            <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
              Beneficiary: {sub.charityName} ({sub.contributionPercentage}%)
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            ${sub.price.toFixed(2)}
          </div>
        </div>

        {/* Demo Test Card Shortcuts */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-subtle)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Quick Demo Autofill
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleAutofill('success')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
            >
              Autofill Success Card (Ends 4242)
            </button>
            <button
              type="button"
              onClick={() => handleAutofill('fail')}
              className="btn"
              style={{
                fontSize: '0.75rem',
                padding: '0.4rem 0.8rem',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              Autofill Failure Card (Ends 0000)
            </button>
          </div>
        </div>

        {/* Realistic Payment Form */}
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
              Card Number (16 Digits)
            </label>
            <div style={{ position: 'relative' }}>
              <CreditCard style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)', width: '18px', height: '18px' }} />
              <input
                type="text"
                required
                maxLength={19}
                value={cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="input-field"
                style={{ paddingLeft: '2.75rem', letterSpacing: '1px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Expiry Date (MM/YY)
              </label>
              <input
                type="text"
                required
                maxLength={5}
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="12/28"
                className="input-field"
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
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.75rem', marginTop: '1.5rem' }}>
          🔒 End-to-end encrypted demo flow. Cards ending in 0000 trigger a simulated decline.
        </p>
      </div>
    </div>
  );
}
