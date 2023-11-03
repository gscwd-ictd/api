import { Body, Controller, Post } from '@nestjs/common';
import { TrainingNomineesService } from './training-nominees.service';
import { CreateTrainingNomineeDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'training-nominees' })
export class TrainingNomineesController {
  constructor(private readonly trainingNomineesService: TrainingNomineesService) {}

  @Post()
  async create(@Body() data: CreateTrainingNomineeDto) {
    return await this.trainingNomineesService.create(data);
  }
}
