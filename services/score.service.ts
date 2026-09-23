import { ScoreService as DomainScoreService } from '@/domain/scores/score.service';
import { ScoreRecord, AddScoreInput, UpdateScoreInput } from '@/domain/scores/score.types';

export interface ProcessScoreResult {
  newScoreRecord: ScoreRecord;
  retainedScores: ScoreRecord[];
  evictedScoreId: string | null;
}

const DEFAULT_SCORES: ScoreRecord[] = [
  { id: 'sc-1', userId: 'user-demo', score: 38, scoreDate: '2026-09-18', createdAt: '2026-09-18T10:00:00Z', updatedAt: '2026-09-18T10:00:00Z' },
  { id: 'sc-2', userId: 'user-demo', score: 35, scoreDate: '2026-09-12', createdAt: '2026-09-12T10:00:00Z', updatedAt: '2026-09-12T10:00:00Z' },
  { id: 'sc-3', userId: 'user-demo', score: 42, scoreDate: '2026-09-05', createdAt: '2026-09-05T10:00:00Z', updatedAt: '2026-09-05T10:00:00Z' },
  { id: 'sc-4', userId: 'user-demo', score: 36, scoreDate: '2026-08-28', createdAt: '2026-08-28T10:00:00Z', updatedAt: '2026-08-28T10:00:00Z' },
  { id: 'sc-5', userId: 'user-demo', score: 39, scoreDate: '2026-08-20', createdAt: '2026-08-20T10:00:00Z', updatedAt: '2026-08-20T10:00:00Z' },
];

export class ScoreService {
  private static STORAGE_KEY_PREFIX = 'digital_heroes_scores_';

  private static getStorageKey(email: string = 'default'): string {
    return `${this.STORAGE_KEY_PREFIX}${email.toLowerCase().trim()}`;
  }

  /**
   * Get scores for user with local persistence and seed fallback
   */
  static getScores(email: string = 'default'): ScoreRecord[] {
    if (typeof window === 'undefined') return DEFAULT_SCORES;
    try {
      const stored = localStorage.getItem(this.getStorageKey(email));
      if (stored) {
        return JSON.parse(stored);
      }
      // If user specific not found, check generic
      const generic = localStorage.getItem('digital_heroes_scores');
      if (generic) {
        return JSON.parse(generic);
      }
      // Seed initial default scores
      localStorage.setItem(this.getStorageKey(email), JSON.stringify(DEFAULT_SCORES));
      return DEFAULT_SCORES;
    } catch {
      return DEFAULT_SCORES;
    }
  }

  /**
   * Save scores locally
   */
  static saveScores(scores: ScoreRecord[], email: string = 'default'): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.getStorageKey(email), JSON.stringify(scores));
      localStorage.setItem('digital_heroes_scores', JSON.stringify(scores));
    } catch (e) {
      console.error('Failed to save scores to localStorage:', e);
    }
  }

  /**
   * Add a new score with domain validation and 5-score rolling eviction
   */
  static addScore(
    email: string = 'default',
    score: number,
    scoreDate: string
  ): {
    success: boolean;
    newScore: ScoreRecord;
    retainedScores: ScoreRecord[];
    evictionNotice: string | null;
  } {
    const existing = this.getScores(email);
    const result = DomainScoreService.processNewScore(existing, {
      userId: email,
      score,
      scoreDate,
    });

    this.saveScores(result.retainedScores, email);

    let evictionNotice: string | null = null;
    if (result.evictedScoreId) {
      const evicted = existing.find((s) => s.id === result.evictedScoreId);
      evictionNotice = `Rolling 5 rule enforced: Oldest score from ${evicted?.scoreDate || 'previous round'} (${evicted?.score}) was automatically replaced.`;
    }

    return {
      success: true,
      newScore: result.newScoreRecord,
      retainedScores: result.retainedScores,
      evictionNotice,
    };
  }

  /**
   * Edit an existing score
   */
  static editScore(
    email: string = 'default',
    scoreId: string,
    score: number,
    scoreDate: string
  ): {
    success: boolean;
    retainedScores: ScoreRecord[];
  } {
    const existing = this.getScores(email);
    const updated = DomainScoreService.processEditScore(existing, {
      id: scoreId,
      userId: email,
      score,
      scoreDate,
    });

    this.saveScores(updated, email);
    return {
      success: true,
      retainedScores: updated,
    };
  }

  /**
   * Delete an existing score
   */
  static deleteScore(
    email: string = 'default',
    scoreId: string
  ): {
    success: boolean;
    retainedScores: ScoreRecord[];
  } {
    const existing = this.getScores(email);
    const filtered = existing.filter((s) => s.id !== scoreId);
    this.saveScores(filtered, email);
    return {
      success: true,
      retainedScores: filtered,
    };
  }
}
