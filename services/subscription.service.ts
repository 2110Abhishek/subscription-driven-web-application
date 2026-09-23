export interface PendingSubscription {
  plan: 'monthly' | 'yearly';
  charityId: string;
  charityName: string;
  contributionPercentage: number;
  charityAmount: string;
  price: number;
  timestamp: string;
}

export interface ActiveSubscription {
  plan: 'monthly' | 'yearly';
  status: 'active' | 'incomplete' | 'lapsed';
  charityId: string;
  charityName: string;
  contributionPercentage: number;
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  demoTransactionId?: string;
  activatedAt?: string;
  renewalDate: string;
}

const PENDING_SUB_KEY = 'digital_heroes_pending_subscription';
const ACTIVE_SUB_KEY = 'digital_heroes_active_subscription';

export class SubscriptionService {
  /**
   * Save configured subscription choices during plan selection
   */
  static savePendingSubscription(sub: Omit<PendingSubscription, 'timestamp'>): void {
    if (typeof window === 'undefined') return;
    const data: PendingSubscription = {
      ...sub,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(PENDING_SUB_KEY, JSON.stringify(data));
  }

  /**
   * Retrieve pending subscription choices
   */
  static getPendingSubscription(): PendingSubscription | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(PENDING_SUB_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  /**
   * Clear pending subscription once checkout is complete or canceled
   */
  static clearPendingSubscription(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PENDING_SUB_KEY);
  }

  /**
   * Activate subscription upon successful demo payment
   */
  static activateSubscription(params: {
    plan: 'monthly' | 'yearly';
    charityId: string;
    charityName: string;
    contributionPercentage: number;
    amount: number;
    transactionId: string;
  }): ActiveSubscription {
    const now = new Date();
    const renewalDays = params.plan === 'yearly' ? 365 : 30;
    const renewalDate = new Date(now.getTime() + renewalDays * 86400000)
      .toISOString()
      .split('T')[0];

    const activeSub: ActiveSubscription = {
      plan: params.plan,
      status: 'active',
      charityId: params.charityId,
      charityName: params.charityName,
      contributionPercentage: params.contributionPercentage,
      amount: params.amount,
      paymentStatus: 'paid',
      demoTransactionId: params.transactionId,
      activatedAt: now.toISOString(),
      renewalDate,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_SUB_KEY, JSON.stringify(activeSub));
      // Mark current user as subscribed in auth state if user exists
      try {
        const userJson = localStorage.getItem('digital_heroes_user');
        if (userJson) {
          const userObj = JSON.parse(userJson);
          userObj.isSubscribed = true;
          userObj.role = 'subscriber';
          localStorage.setItem('digital_heroes_user', JSON.stringify(userObj));
        }
      } catch (e) {
        console.error('Error updating user subscription flag:', e);
      }
    }

    return activeSub;
  }

  /**
   * Get current active subscription details
   */
  static getCurrentSubscription(): ActiveSubscription | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(ACTIVE_SUB_KEY);
      if (item) {
        return JSON.parse(item);
      }
    } catch (e) {
      console.error('Error reading active subscription:', e);
    }
    return null;
  }
}
