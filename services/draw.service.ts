import { DrawService as DomainDrawService } from '@/domain/draws/draw.service';
import { DrawEngineType, DrawParticipant, DrawSimulationResult } from '@/domain/draws/draw.types';

export class DrawService {
  static simulateDraw(
    drawId: string,
    participants: DrawParticipant[],
    revenuePool: number,
    jackpotRollover: number,
    engineType: DrawEngineType = 'random'
  ): DrawSimulationResult {
    return DomainDrawService.simulateDraw(drawId, participants, revenuePool, jackpotRollover, engineType);
  }
}
