import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TrainingDetailsTestService } from './training-details-test.service';

@Controller({ version: '1', path: 'training-details-test' })
export class TrainingDetailsTestController {
  constructor(private readonly trainingDetailsTestService: TrainingDetailsTestService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.trainingDetailsTestService.findAll(page, limit);
  }

  @Get(':id')
  async findById(@Param() id: string) {
    return await this.trainingDetailsTestService.findById(id);
  }
}
