import { DrawParticipant, MatchResult } from './draw.types';

/**
 * Random Draw Engine using cryptographically secure random number generator.
 */
export class RandomDrawEngine {
  public static generateDrawNumbers(): number[] {
    const selected = new Set<number>();
    while (selected.size < 5) {
      const randomBuffer = new Uint32Array(1);
      crypto.getRandomValues(randomBuffer);
      const number = (randomBuffer[0] % 45) + 1; // 1 to 45
      selected.add(number);
    }
    return Array.from(selected).sort((a, b) => a - b);
  }
}

/**
 * Algorithmic Draw Engine based on score frequency weighting.
 */
export class AlgorithmicDrawEngine {
  public static generateDrawNumbers(participants: DrawParticipant[]): number[] {
    if (participants.length === 0) {
      return RandomDrawEngine.generateDrawNumbers();
    }

    // Count frequency of each score 1-45 in participant snapshots
    const frequency = new Map<number, number>();
    for (let i = 1; i <= 45; i++) {
      frequency.set(i, 1); // smooth with min weight 1
    }

    for (const p of participants) {
      for (const score of p.scoresSnapshot) {
        if (score >= 1 && score <= 45) {
          frequency.set(score, (frequency.get(score) || 0) + 1);
        }
      }
    }

    const selected = new Set<number>();
    const pool = Array.from(frequency.entries()); // [number, weight]

    while (selected.size < 5 && pool.length > 0) {
      const totalWeight = pool.reduce((acc, [, weight]) => acc + weight, 0);
      const randomBuffer = new Uint32Array(1);
      crypto.getRandomValues(randomBuffer);
      let randomVal = (randomBuffer[0] / 4294967296) * totalWeight;

      for (let i = 0; i < pool.length; i++) {
        const [num, weight] = pool[i];
        if (randomVal < weight) {
          selected.add(num);
          pool.splice(i, 1); // remove selected
          break;
        }
        randomVal -= weight;
      }
    }

    // Fill up if needed
    while (selected.size < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      selected.add(num);
    }

    return Array.from(selected).sort((a, b) => a - b);
  }
}

/**
 * Match Evaluator
 */
export class MatchEvaluator {
  public static evaluateParticipant(
    participant: DrawParticipant,
    drawNumbers: number[]
  ): { matchedCount: number; matchedNumbers: number[] } {
    const drawSet = new Set(drawNumbers);
    const matchedNumbers = participant.scoresSnapshot.filter((num) =>
      drawSet.has(num)
    );

    return {
      matchedCount: matchedNumbers.length,
      matchedNumbers,
    };
  }
}
