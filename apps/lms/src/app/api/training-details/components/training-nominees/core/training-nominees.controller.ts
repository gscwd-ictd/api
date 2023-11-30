import { Body, Controller, Get, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { TrainingNomineesService } from './training-nominees.service';
import { CreateTrainingNomineeDto } from '@gscwd-api/models';
import { NomineeType, TrainingPreparationStatus } from '@gscwd-api/utils';

@Controller({ version: '1', path: 'training-nominees' })
export class TrainingNomineesController {
  constructor(private readonly trainingNomineesService: TrainingNomineesService) {}

  @Post()
  async create(@Body() data: CreateTrainingNomineeDto) {
    return await this.trainingNomineesService.create(data);
  }

  @Get(':id')
  async findAll(@Param('id') trainingId: string) {
    return await this.trainingNomineesService.crud().findAll({
      find: {
        select: {
          id: true,
          trainingDistribution: {
            id: true,
            supervisorId: true,
          },
          employeeId: true,
          status: true,
          nomineeType: true,
          remarks: true,
        },
        where: [
          {
            nomineeType: NomineeType.NOMINEE,
            trainingDistribution: { trainingDetails: { id: trainingId, trainingPreparationStatus: TrainingPreparationStatus.ON_GOING_NOMINATION } },
          },
        ],
      },
      onError: () => new InternalServerErrorException(),
    });
  }
}
