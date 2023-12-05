import { BadRequestException, Body, Controller, Get, Logger, Param, Patch, Post } from '@nestjs/common';
import { TrainingNomineesService } from './training-nominees.service';
import { CreateTrainingNomineeDto, UpdateTrainingNomineeStatusDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'training-nominees' })
export class TrainingNomineesController {
  constructor(private readonly trainingNomineesService: TrainingNomineesService) {}

  // test microservice in insert training nominee by distribution id
  @Post()
  async create(@Body() data: CreateTrainingNomineeDto) {
    return await this.trainingNomineesService.create(data);
  }

  @Get(':id')
  async findAllNomineeByTrainingId(@Param('id') trainingId: string) {
    return await this.trainingNomineesService.findAllNomineeByTrainingId(trainingId);
  }

  // test microservice in find all training by employee id
  @Get('employee/:id')
  async findAllTrainingByEmployeeId(@Param('id') employeeId: string) {
    return await this.trainingNomineesService.findAllTrainingByEmployeeId(employeeId);
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
