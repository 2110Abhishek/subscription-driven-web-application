import { WinnerRecord } from './winner.types';

export class WinnerService {
  /**
   * Transition winner status upon proof upload.
   */
  public static submitProof(winner: WinnerRecord): WinnerRecord {
    if (winner.status === 'verified') {
      throw new Error('Winner is already verified.');
    }
    return {
      ...winner,
      status: 'proof_submitted',
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Admin approves proof submission.
   */
  public static approveVerification(winner: WinnerRecord): WinnerRecord {
    if (winner.status !== 'proof_submitted') {
      throw new Error('Winner proof must be submitted before approval.');
    }
    return {
      ...winner,
      status: 'verified',
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Admin rejects proof submission.
   */
  public static rejectVerification(winner: WinnerRecord): WinnerRecord {
    return {
      ...winner,
      status: 'rejected',
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Complete payout transition (must be verified first).
   */
  public static completePayout(winner: WinnerRecord): WinnerRecord {
    if (winner.status !== 'verified') {
      throw new Error('Winner must be verified by admin before payout completion.');
    }
    return {
      ...winner,
      payoutStatus: 'paid',
      updatedAt: new Date().toISOString(),
    };
  }
}
