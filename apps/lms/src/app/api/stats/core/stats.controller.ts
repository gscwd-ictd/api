import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller({ version: '1', path: 'stats' })
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('training/count/status')
  async countTrainingStatus() {
    return await this.statsService.countTrainingStatus();
  }

  @Get('nominees/count/accepted')
  async countAcceptedNominees() {
    return await this.statsService.countAcceptedNominees();
  }

  @Get('count/all')
  async countAllDoneStatus() {
    return await this.statsService.countAllDoneStatus();
  }
}
