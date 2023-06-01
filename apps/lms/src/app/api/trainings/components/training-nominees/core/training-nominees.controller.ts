import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  InternalServerErrorException,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TrainingNomineesService } from './training-nominees.service';
import { CreateTrainingNomineeDto, TrainingNominee } from '@gscwd-api/models';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller({ version: '1', path: 'training-nominees' })
export class TrainingNomineesController {
  constructor(private readonly trainingNomineesService: TrainingNomineesService) {}

  @Post()
  async create(@Body() data: CreateTrainingNomineeDto): Promise<TrainingNominee> {
    return await this.trainingNomineesService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<TrainingNominee> | TrainingNominee[]> {
    return await this.trainingNomineesService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }
}
