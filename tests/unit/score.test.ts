import { describe, expect, it } from 'vitest';
import { ScoreService } from '../../domain/scores/score.service';
import { ScoreRecord } from '../../domain/scores/score.types';
import { ScoreValidationError } from '../../domain/scores/score.rules';

describe('Score Domain Rules', () => {
  it('should accept valid score between 1 and 45', () => {
    const existing: ScoreRecord[] = [];
    const result = ScoreService.processNewScore(existing, {
      userId: 'user-1',
      score: 36,
      scoreDate: '2026-09-10',
    });
    expect(result.newScoreRecord.score).toBe(36);
    expect(result.retainedScores.length).toBe(1);
    expect(result.evictedScoreId).toBeNull();
  });

  it('should reject score less than 1 or greater than 45', () => {
    expect(() =>
      ScoreService.processNewScore([], {
        userId: 'user-1',
        score: 0,
        scoreDate: '2026-09-10',
      })
    ).toThrowError(ScoreValidationError);

    expect(() =>
      ScoreService.processNewScore([], {
        userId: 'user-1',
        score: 46,
        scoreDate: '2026-09-10',
      })
    ).toThrowError(ScoreValidationError);
  });

  it('should reject duplicate score date for the same user', () => {
    const existing: ScoreRecord[] = [
      {
        id: 's-1',
        userId: 'user-1',
        score: 32,
        scoreDate: '2026-09-10',
        createdAt: '2026-09-10T10:00:00Z',
        updatedAt: '2026-09-10T10:00:00Z',
      },
    ];

    expect(() =>
      ScoreService.processNewScore(existing, {
        userId: 'user-1',
        score: 40,
        scoreDate: '2026-09-10',
      })
    ).toThrowError(/duplicate/i);
  });

  it('should retain at most 5 scores and evict the oldest when 6th is added', () => {
    const existing: ScoreRecord[] = [
      { id: '1', userId: 'u1', score: 30, scoreDate: '2026-09-10', createdAt: '', updatedAt: '' },
      { id: '2', userId: 'u1', score: 31, scoreDate: '2026-09-08', createdAt: '', updatedAt: '' },
      { id: '3', userId: 'u1', score: 32, scoreDate: '2026-09-06', createdAt: '', updatedAt: '' },
      { id: '4', userId: 'u1', score: 33, scoreDate: '2026-09-04', createdAt: '', updatedAt: '' },
      { id: '5', userId: 'u1', score: 34, scoreDate: '2026-09-02', createdAt: '', updatedAt: '' },
    ];

    const result = ScoreService.processNewScore(existing, {
      userId: 'u1',
      score: 42,
      scoreDate: '2026-09-12',
    });

    expect(result.retainedScores.length).toBe(5);
    expect(result.retainedScores[0].scoreDate).toBe('2026-09-12'); // Newest first
    expect(result.evictedScoreId).toBe('5'); // Oldest '2026-09-02' evicted
  });
});
