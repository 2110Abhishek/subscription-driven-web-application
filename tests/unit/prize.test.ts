import { describe, expect, it } from 'vitest';
import { PrizeCalculator } from '../../domain/prizes/prize.service';

describe('Prize Pool Calculations', () => {
  it('should split prize pool into 40% 5-match, 35% 4-match, 25% 3-match', () => {
    const totalPool = 10000; // e.g. 10000 cents ($100.00)
    const allocation = PrizeCalculator.calculatePoolAllocation(totalPool, 0);

    expect(allocation.fiveMatchPool).toBe(4000);
    expect(allocation.fourMatchPool).toBe(3500);
    expect(allocation.threeMatchPool).toBe(2500);
  });

  it('should add rolled over jackpot to 5-match pool', () => {
    const totalPool = 10000;
    const rolledOver = 5000;
    const allocation = PrizeCalculator.calculatePoolAllocation(totalPool, rolledOver);

    expect(allocation.fiveMatchPool).toBe(4000 + 5000); // 9000
    expect(allocation.fourMatchPool).toBe(3500);
    expect(allocation.threeMatchPool).toBe(2500);
  });

  it('should divide tier pool equally among multiple winners', () => {
    const tierPool = 3500;
    const winnerCount = 3;
    const individual = PrizeCalculator.distributeTierPool(tierPool, winnerCount);

    expect(individual).toBe(1166); // Math.floor(3500/3)
  });
});
