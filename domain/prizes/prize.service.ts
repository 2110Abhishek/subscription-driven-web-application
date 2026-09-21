import { PrizePoolAllocation } from '../draws/draw.types';

export class PrizeCalculator {
  /**
   * Calculates tier allocations given a total prize pool and carried forward jackpot.
   */
  public static calculatePoolAllocation(
    totalSubscriptionRevenuePool: number,
    rolledOverJackpot: number = 0
  ): PrizePoolAllocation {
    // 5 match = 40% + rolledOverJackpot
    const baseFiveMatch = Math.floor(totalSubscriptionRevenuePool * 0.4);
    const fiveMatchPool = baseFiveMatch + rolledOverJackpot;

    // 4 match = 35%
    const fourMatchPool = Math.floor(totalSubscriptionRevenuePool * 0.35);

    // 3 match = 25%
    const threeMatchPool = Math.floor(totalSubscriptionRevenuePool * 0.25);

    return {
      totalPoolAmount: totalSubscriptionRevenuePool + rolledOverJackpot,
      fiveMatchPool,
      fourMatchPool,
      threeMatchPool,
      rolledOverJackpot,
    };
  }

  /**
   * Distributes tier pool equally among winners in minor units.
   */
  public static distributeTierPool(
    tierPoolAmount: number,
    winnerCount: number
  ): number {
    if (winnerCount <= 0 || tierPoolAmount <= 0) {
      return 0;
    }
    return Math.floor(tierPoolAmount / winnerCount);
  }
}
