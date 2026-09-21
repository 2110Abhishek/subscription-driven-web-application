import { ScoreRecord } from './score.types';

export class ScoreValidationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ScoreValidationError';
  }
}

/**
 * Validates a Stableford score value (1-45).
 */
export function validateScoreValue(score: number): void {
  if (!Number.isInteger(score) || score < 1 || score > 45) {
    throw new ScoreValidationError(
      `Score must be an integer between 1 and 45. Received: ${score}`,
      'SCORE_OUT_OF_RANGE'
    );
  }
}

/**
 * Validates date string format (YYYY-MM-DD).
 */
export function validateScoreDate(dateStr: string): void {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new ScoreValidationError(
      `Score date must be in YYYY-MM-DD format. Received: ${dateStr}`,
      'INVALID_SCORE_DATE_FORMAT'
    );
  }
}

/**
 * Checks for duplicate score date for the user.
 */
export function checkDuplicateDate(
  existingScores: ScoreRecord[],
  newDate: string,
  excludeScoreId?: string
): void {
  const duplicate = existingScores.find(
    (s) => s.scoreDate === newDate && s.id !== excludeScoreId
  );
  if (duplicate) {
    throw new ScoreValidationError(
      `A score already exists for date ${newDate}. Duplicate score dates are not allowed.`,
      'SCORE_DATE_DUPLICATE'
    );
  }
}

/**
 * Sorts scores newest first by scoreDate.
 */
export function sortScoresNewestFirst(scores: ScoreRecord[]): ScoreRecord[] {
  return [...scores].sort(
    (a, b) => new Date(b.scoreDate).getTime() - new Date(a.scoreDate).getTime()
  );
}

/**
 * Computes rolling 5-score retention.
 * Takes current retained scores and incoming score.
 * Returns the updated 5 retained scores (sorted newest first) and the ID of evicted score if any.
 */
export function applyRollingFiveRule(
  currentScores: ScoreRecord[],
  newScore: ScoreRecord
): {
  retainedScores: ScoreRecord[];
  evictedScoreId: string | null;
} {
  // Combine all scores
  const all = sortScoresNewestFirst([...currentScores, newScore]);

  if (all.length <= 5) {
    return {
      retainedScores: all,
      evictedScoreId: null,
    };
  }

  // Keep top 5 newest
  const retainedScores = all.slice(0, 5);
  // The oldest score (beyond top 5) is evicted
  const evictedScoreId = all[5].id;

  return {
    retainedScores,
    evictedScoreId,
  };
}
