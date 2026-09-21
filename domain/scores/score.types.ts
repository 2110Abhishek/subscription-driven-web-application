export interface ScoreRecord {
  id: string;
  userId: string;
  score: number;
  scoreDate: string; // ISO format YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

export interface AddScoreInput {
  userId: string;
  score: number;
  scoreDate: string; // YYYY-MM-DD
}

export interface UpdateScoreInput {
  id: string;
  userId: string;
  score: number;
  scoreDate: string;
}
