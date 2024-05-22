import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { StatsService } from './stats.service';
import { FindLspRankInterceptor } from '../misc/interceptors';

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

  @Get('count/participants')
  async countAllParticipants() {
    return await this.statsService.countAllParticipants();
  }

  @UseInterceptors(FindLspRankInterceptor)
  @Get('lsp/rating')
  async findAllLspRating(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.statsService.findAllLspAverageRating(page, limit);
  }
}
