export type DrawStatus = 'draft' | 'simulated' | 'published' | 'completed';
export type DrawEngineType = 'random' | 'algorithmic';

export interface DrawParticipant {
  userId: string;
  scoresSnapshot: number[]; // e.g. [39, 34, 31, 37, 28]
}

export interface DrawRecord {
  id: string;
  drawDate: string;
  status: DrawStatus;
  engineType: DrawEngineType;
  drawNumbers: number[] | null; // Array of 5 numbers between 1 and 45
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PrizePoolAllocation {
  totalPoolAmount: number; // in minor units / cents
  fiveMatchPool: number; // 40%
  fourMatchPool: number; // 35%
  threeMatchPool: number; // 25%
  rolledOverJackpot: number;
}

export interface MatchResult {
  userId: string;
  matchedCount: number; // 3, 4, or 5
  matchedNumbers: number[];
  prizeAmount: number;
}

export interface DrawSimulationResult {
  drawId: string;
  drawNumbers: number[];
  engineType: DrawEngineType;
  participantCount: number;
  prizePoolAllocation: PrizePoolAllocation;
  winners: {
    fiveMatchWinners: MatchResult[];
    fourMatchWinners: MatchResult[];
    threeMatchWinners: MatchResult[];
  };
  carriedOverJackpot: number;
}
