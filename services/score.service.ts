import { ScoreService as DomainScoreService } from '@/domain/scores/score.service';
import { ScoreRecord, AddScoreInput, UpdateScoreInput } from '@/domain/scores/score.types';

export interface ProcessScoreResult {
  newScoreRecord: ScoreRecord;
  retainedScores: ScoreRecord[];
  evictedScoreId: string | null;
}

export class ScoreService {
  static processNewScore(existingScores: ScoreRecord[], input: AddScoreInput): ProcessScoreResult {
    return DomainScoreService.processNewScore(existingScores, input);
  }

  static processEditScore(existingScores: ScoreRecord[], input: UpdateScoreInput): ScoreRecord[] {
    return DomainScoreService.processEditScore(existingScores, input);
  }

  static processDeleteScore(existingScores: ScoreRecord[], scoreId: string): ScoreRecord[] {
    return existingScores.filter((s) => s.id !== scoreId);
  }
}
