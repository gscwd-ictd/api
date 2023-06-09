import { ICrudRoutes } from '@gscwd-api/crud';
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { TrainingSourcesService } from './training-sources.service';
import { CreateTrainingSourceDto, TrainingSource, UpdateTrainingSourceDto } from '@gscwd-api/models';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller({ version: '1', path: 'training-sources' })
export class TrainingSourcesController implements ICrudRoutes {
  constructor(private readonly trainingSourcesService: TrainingSourcesService) {}

  @Post()
  async create(@Body() data: CreateTrainingSourceDto): Promise<TrainingSource> {
    return await this.trainingSourcesService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<TrainingSource> | TrainingSource[]> {
    return await this.trainingSourcesService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get('q')
  async findId(@Query('source') source: string): Promise<TrainingSource> {
    return await this.trainingSourcesService.crud().findOneBy({ findBy: { name: source } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TrainingSource> {
    return this.trainingSourcesService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateTrainingSourceDto): Promise<UpdateResult> {
    return this.trainingSourcesService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.trainingSourcesService.crud().delete({
      deleteBy: { id },
      softDelete: false,
      onError: () => new BadRequestException(),
    });
  }
}
