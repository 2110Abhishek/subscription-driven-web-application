import {
  AddScoreInput,
  ScoreRecord,
  UpdateScoreInput,
} from './score.types';
import {
  applyRollingFiveRule,
  checkDuplicateDate,
  sortScoresNewestFirst,
  validateScoreDate,
  validateScoreValue,
} from './score.rules';

export class ScoreService {
  /**
   * Process and add a new score, enforcing validation, duplicate check, and 5-score rolling eviction.
   */
  public static processNewScore(
    existingScores: ScoreRecord[],
    input: AddScoreInput,
    generatedId: string = crypto.randomUUID()
  ): {
    newScoreRecord: ScoreRecord;
    retainedScores: ScoreRecord[];
    evictedScoreId: string | null;
  } {
    validateScoreValue(input.score);
    validateScoreDate(input.scoreDate);
    checkDuplicateDate(existingScores, input.scoreDate);

    const newScoreRecord: ScoreRecord = {
      id: generatedId,
      userId: input.userId,
      score: input.score,
      scoreDate: input.scoreDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { retainedScores, evictedScoreId } = applyRollingFiveRule(
      existingScores,
      newScoreRecord
    );

    return {
      newScoreRecord,
      retainedScores,
      evictedScoreId,
    };
  }

  /**
   * Process editing an existing score.
   */
  public static processEditScore(
    existingScores: ScoreRecord[],
    input: UpdateScoreInput
  ): ScoreRecord[] {
    validateScoreValue(input.score);
    validateScoreDate(input.scoreDate);
    checkDuplicateDate(existingScores, input.scoreDate, input.id);

    const updated = existingScores.map((s) => {
      if (s.id === input.id) {
        return {
          ...s,
          score: input.score,
          scoreDate: input.scoreDate,
          updatedAt: new Date().toISOString(),
        };
      }
      return s;
    });

    return sortScoresNewestFirst(updated);
  }
}
