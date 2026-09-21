export type WinnerVerificationStatus =
  | 'unverified'
  | 'proof_submitted'
  | 'verified'
  | 'rejected';

export type PayoutStatus = 'pending' | 'paid';

export interface WinnerRecord {
  id: string;
  drawId: string;
  userId: string;
  matchTier: 3 | 4 | 5;
  prizeAmount: number; // in minor units
  status: WinnerVerificationStatus;
  payoutStatus: PayoutStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WinnerProofRecord {
  id: string;
  winnerId: string;
  userId: string;
  filePath: string;
  fileName: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}
