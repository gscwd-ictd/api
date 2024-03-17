import { BadRequestException, Body, Controller, Get, Logger, Param, Patch, Post } from '@nestjs/common';
import { TrainingNomineesService } from './training-nominees.service';
import { CreateTrainingBatchDto, UpdateTrainingBatchDto, UpdateTrainingNomineeStatusDto } from '@gscwd-api/models';
import { TrainingNomineeStatus } from '@gscwd-api/utils';

@Controller({ version: '1', path: 'training-nominees' })
export class TrainingNomineesController {
  constructor(private readonly trainingNomineesService: TrainingNomineesService) {}

  // create training nominee batching
  @Post('batch')
  async createTrainingNomineeBatch(@Body() data: CreateTrainingBatchDto) {
    return await this.trainingNomineesService.createTrainingNomineeBatch(data);
  }

  // update training nominee batching
  @Patch('batch')
  async updateTrainingNomineeBatch(@Body() data: UpdateTrainingBatchDto) {
    return await this.trainingNomineesService.updateTrainingNomineeBatch(data);
  }

  // find all accepted training batch nominee by training id (nominee type = nominee & preparation status = on going nomination)
  @Get(':id/batch')
  async findAllBatchByTrainingId(@Param('id') trainingId: string) {
    return await this.trainingNomineesService.findAllBatchByTrainingId(trainingId);
  }

  // test microservice in find all training by employee id
  @Get('employee/:id')
  async findAllTrainingByEmployeeId(@Param('id') employeeId: string, @Param('status') status: TrainingNomineeStatus) {
    return await this.trainingNomineesService.findAllTrainingByEmployeeId(employeeId, status);
  }

  // test microservice in update status for nominated employee by nominee id
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
