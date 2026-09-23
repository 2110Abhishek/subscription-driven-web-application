import { WinnerService as DomainWinnerService } from '@/domain/winners/winner.service';
import { WinnerRecord, WinnerVerificationStatus, PayoutStatus, WinnerProofRecord } from '@/domain/winners/winner.types';

export class WinnerService {
  static submitProof(winner: WinnerRecord): WinnerRecord {
    return DomainWinnerService.submitProof(winner);
  }

  static approveVerification(winner: WinnerRecord): WinnerRecord {
    return DomainWinnerService.approveVerification(winner);
  }

  static rejectVerification(winner: WinnerRecord): WinnerRecord {
    return DomainWinnerService.rejectVerification(winner);
  }

  static completePayout(winner: WinnerRecord): WinnerRecord {
    return DomainWinnerService.completePayout(winner);
  }
}
