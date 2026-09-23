import { SubscriptionService } from './subscription.service';

export interface DemoPaymentInput {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingEmail: string;
  amount: number;
  plan: 'monthly' | 'yearly';
}

export interface DemoPaymentResult {
  success: boolean;
  transactionId?: string;
  amount?: number;
  plan?: 'monthly' | 'yearly';
  timestamp?: string;
  error?: string;
}

export class PaymentService {
  /**
   * Process a simulated frontend demo payment.
   * Does NOT send or store sensitive credit card credentials.
   */
  static async processDemoPayment(input: DemoPaymentInput): Promise<DemoPaymentResult> {
    // Guard: Prevent subscribing more than once in the same month
    const check = SubscriptionService.canSubscribeThisMonth();
    if (!check.allowed) {
      return {
        success: false,
        error: check.reason || 'You already have an active subscription for this month. Subscriptions are limited to once per month.',
      };
    }

    // Simulate network processing latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const cleanCard = input.cardNumber.replace(/[\s-]/g, '');

    // Intentional failure trigger for demo testing:
    // If card ends with '0000' or is '0000000000000000'
    if (cleanCard.endsWith('0000') || cleanCard === '0000000000000000') {
      return {
        success: false,
        error: 'Demo payment declined: Card ending in 0000 was rejected by simulation test rules.',
      };
    }

    // Generate realistic demo reference ID (e.g. DH-DEMO-8F4A29)
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const transactionId = `DH-DEMO-${randomHex}`;

    return {
      success: true,
      transactionId,
      amount: input.amount,
      plan: input.plan,
      timestamp: new Date().toISOString(),
    };
  }
}
