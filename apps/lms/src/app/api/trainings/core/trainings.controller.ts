import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTrainingDto, Training, UpdateTrainingDto } from '@gscwd-api/models';
import { Pagination } from 'nestjs-typeorm-paginate';
import { TrainingsService } from './trainings.service';
import { DeleteResult } from 'typeorm';

@Controller({ version: '1', path: 'trainings' })
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Post()
  async create(@Body() data: CreateTrainingDto) {
    return await this.trainingsService.addTrainings(data);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<Training> | Training[]> {
    return await this.trainingsService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Training> {
    return this.trainingsService.getTrainingsById(id);
  }

  @Patch()
  async update(@Body() data: UpdateTrainingDto) {
    return this.trainingsService.updateTrainingsDetails(data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.trainingsService.crud().delete({
      deleteBy: { id },
      softDelete: false,
      onError: () => new BadRequestException(),
    });
  }
}
