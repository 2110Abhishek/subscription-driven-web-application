import { describe, expect, it } from 'vitest';
import { DrawService } from '../../domain/draws/draw.service';
import { DrawParticipant } from '../../domain/draws/draw.types';
import { calculateCharityContributionAmount } from '../../domain/charity/charity.rules';

describe('Draw Engine & Simulation', () => {
  it('should generate 5 unique numbers between 1 and 45 and evaluate matches', () => {
    const participants: DrawParticipant[] = [
      { userId: 'u1', scoresSnapshot: [10, 20, 30, 40, 45] },
      { userId: 'u2', scoresSnapshot: [1, 2, 3, 4, 5] },
    ];

    const result = DrawService.simulateDraw('draw-101', participants, 20000, 0, 'random');

    expect(result.drawNumbers.length).toBe(5);
    expect(new Set(result.drawNumbers).size).toBe(5);
    for (const num of result.drawNumbers) {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(45);
    }
  });

  it('should roll over 5-match jackpot if zero 5-match winners exist', () => {
    const participants: DrawParticipant[] = [
      { userId: 'u1', scoresSnapshot: [1, 2, 3, 4, 5] },
    ];

    const result = DrawService.simulateDraw('draw-102', participants, 10000, 2000, 'random');

    if (result.winners.fiveMatchWinners.length === 0) {
      expect(result.carriedOverJackpot).toBe(result.prizePoolAllocation.fiveMatchPool);
    }
  });
});

describe('Charity Rules', () => {
  it('should calculate charity contribution starting from minimum 10%', () => {
    const subscriptionPrice = 1500; // $15.00
    const contribution10 = calculateCharityContributionAmount(subscriptionPrice, 10);
    expect(contribution10).toBe(150);

    const contribution25 = calculateCharityContributionAmount(subscriptionPrice, 25);
    expect(contribution25).toBe(375);
  });

  it('should throw error if contribution percentage is under 10%', () => {
    expect(() => calculateCharityContributionAmount(1500, 5)).toThrowError();
  });
});
