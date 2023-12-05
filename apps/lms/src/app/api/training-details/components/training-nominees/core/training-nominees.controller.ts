import { BadRequestException, Body, Controller, Get, Logger, Param, Patch, Post } from '@nestjs/common';
import { TrainingNomineesService } from './training-nominees.service';
import { CreateTrainingNomineeDto, UpdateTrainingNomineeStatusDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'training-nominees' })
export class TrainingNomineesController {
  constructor(private readonly trainingNomineesService: TrainingNomineesService) {}

  @Post()
  async create(@Body() data: CreateTrainingNomineeDto) {
    return await this.trainingNomineesService.create(data);
  }

  @Get(':id')
  async findAll(@Param('id') trainingId: string) {
    return await this.trainingNomineesService.findAllNomineeByTrainingId(trainingId);
  }

  @Get('employee/:id')
  async findAllTrainingByEmployeeId(@Param('id') employeeId: string) {
    return await this.trainingNomineesService.findAllTrainingByEmployeeId(employeeId);
  }

  @Patch()
  async updateTrainingNomineeStatus(@Body() data: UpdateTrainingNomineeStatusDto) {
    const { id, ...rest } = data;
    return await this.trainingNomineesService.crud().update({
      updateBy: { id },
      dto: rest,
      onError: (error) => {
        Logger.log(error);
        throw new BadRequestException();
      },
    });
  }
}
