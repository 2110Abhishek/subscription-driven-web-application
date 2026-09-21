import {
  DrawEngineType,
  DrawParticipant,
  DrawSimulationResult,
  MatchResult,
} from './draw.types';
import {
  AlgorithmicDrawEngine,
  MatchEvaluator,
  RandomDrawEngine,
} from './draw.engine';
import { PrizeCalculator } from '../prizes/prize.service';

export class DrawService {
  /**
   * Simulates a monthly draw without mutating permanent winner or payout records.
   */
  public static simulateDraw(
    drawId: string,
    participants: DrawParticipant[],
    subscriptionRevenuePool: number,
    carriedOverJackpot: number = 0,
    engineType: DrawEngineType = 'random'
  ): DrawSimulationResult {
    // 1. Generate 5 draw numbers
    const drawNumbers =
      engineType === 'algorithmic'
        ? AlgorithmicDrawEngine.generateDrawNumbers(participants)
        : RandomDrawEngine.generateDrawNumbers();

    // 2. Calculate prize pool breakdown
    const prizePoolAllocation = PrizeCalculator.calculatePoolAllocation(
      subscriptionRevenuePool,
      carriedOverJackpot
    );

    // 3. Evaluate matches for each participant
    const fiveMatchParticipants: { participant: DrawParticipant; matchedNumbers: number[] }[] = [];
    const fourMatchParticipants: { participant: DrawParticipant; matchedNumbers: number[] }[] = [];
    const threeMatchParticipants: { participant: DrawParticipant; matchedNumbers: number[] }[] = [];

    for (const p of participants) {
      const { matchedCount, matchedNumbers } = MatchEvaluator.evaluateParticipant(
        p,
        drawNumbers
      );
      if (matchedCount === 5) {
        fiveMatchParticipants.push({ participant: p, matchedNumbers });
      } else if (matchedCount === 4) {
        fourMatchParticipants.push({ participant: p, matchedNumbers });
      } else if (matchedCount === 3) {
        threeMatchParticipants.push({ participant: p, matchedNumbers });
      }
    }

    // 4. Distribute prizes per tier
    const fiveIndividualPrize = PrizeCalculator.distributeTierPool(
      prizePoolAllocation.fiveMatchPool,
      fiveMatchParticipants.length
    );

    const fourIndividualPrize = PrizeCalculator.distributeTierPool(
      prizePoolAllocation.fourMatchPool,
      fourMatchParticipants.length
    );

    const threeIndividualPrize = PrizeCalculator.distributeTierPool(
      prizePoolAllocation.threeMatchPool,
      threeMatchParticipants.length
    );

    const fiveMatchWinners: MatchResult[] = fiveMatchParticipants.map((item) => ({
      userId: item.participant.userId,
      matchedCount: 5,
      matchedNumbers: item.matchedNumbers,
      prizeAmount: fiveIndividualPrize,
    }));

    const fourMatchWinners: MatchResult[] = fourMatchParticipants.map((item) => ({
      userId: item.participant.userId,
      matchedCount: 4,
      matchedNumbers: item.matchedNumbers,
      prizeAmount: fourIndividualPrize,
    }));

    const threeMatchWinners: MatchResult[] = threeMatchParticipants.map((item) => ({
      userId: item.participant.userId,
      matchedCount: 3,
      matchedNumbers: item.matchedNumbers,
      prizeAmount: threeIndividualPrize,
    }));

    // 5. Calculate jackpot rollover if 0 5-match winners
    const nextCarriedOverJackpot =
      fiveMatchWinners.length === 0
        ? prizePoolAllocation.fiveMatchPool
        : 0;

    return {
      drawId,
      drawNumbers,
      engineType,
      participantCount: participants.length,
      prizePoolAllocation,
      winners: {
        fiveMatchWinners,
        fourMatchWinners,
        threeMatchWinners,
      },
      carriedOverJackpot: nextCarriedOverJackpot,
    };
  }
}
