import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller({ version: '1', path: 'stats' })
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('training/count/status')
  async countTrainingStatus() {
    return await this.statsService.countTrainingStatus();
  }
}
