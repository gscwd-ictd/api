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
} from '@nestjs/common';
import { TrainingSourcesService } from './training-sources.service';
import { CreateTrainingSourceDto, TrainingSource, UpdateTrainingSourceDto } from '@gscwd-api/models';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller({ version: '1', path: 'training/sources' })
export class TrainingSourcesController implements ICrudRoutes {
  constructor(private readonly trainingSourcesService: TrainingSourcesService) {}

  /* insert training sources */
  @Post()
  async create(@Body() data: CreateTrainingSourceDto): Promise<TrainingSource> {
    return await this.trainingSourcesService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  /* find all training sources */
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

  /* find training source by source */
  @Get('q')
  async findIdByName(@Query('source') source: string): Promise<TrainingSource> {
    const capitalized = source.charAt(0).toUpperCase() + source.slice(1);
    return await this.trainingSourcesService.crud().findOneBy({
      findBy: { name: capitalized },
      onError: () => new NotFoundException(),
    });
  }

  /* find training source by id  */
  @Get(':id')
  async findById(@Param('id') id: string): Promise<TrainingSource> {
    return this.trainingSourcesService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  /* edit training source by id  */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateTrainingSourceDto): Promise<UpdateResult> {
    return this.trainingSourcesService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  /* remove training source by id  */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.trainingSourcesService.crud().delete({
      deleteBy: { id },
      softDelete: false,
      onError: () => new BadRequestException(),
    });
  }
}
