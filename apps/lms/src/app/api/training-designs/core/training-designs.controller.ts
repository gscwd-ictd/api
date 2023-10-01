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
import { TrainingDesignsService } from './training-designs.service';
import { CreateTrainingDesignDto, TrainingDesign, UpdateTrainingDesignDto } from '@gscwd-api/models';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ICrudRoutes } from '@gscwd-api/crud';
import { UpdateResult, DeleteResult } from 'typeorm';

@Controller({ version: '1', path: 'training-designs' })
export class TrainingDesignsController implements ICrudRoutes {
  constructor(private readonly trainingDesignsService: TrainingDesignsService) {}

  @Post()
  async create(@Body() data: CreateTrainingDesignDto): Promise<TrainingDesign> {
    return await this.trainingDesignsService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit: number
  ): Promise<Pagination<TrainingDesign> | TrainingDesign[]> {
    return await this.trainingDesignsService.crud().findAll({
      find: { select: { id: true, courseTitle: true, createdAt: true, updatedAt: true } },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TrainingDesign> {
    return await this.trainingDesignsService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateTrainingDesignDto): Promise<UpdateResult> {
    return await this.trainingDesignsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.trainingDesignsService.crud().delete({
      deleteBy: { id },
      softDelete: true,
      onError: () => new BadRequestException(),
    });
  }
}
