import { ICrudRoutes } from '@gscwd-api/crud';
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateUnitOfMeasureDto, UpdateUnitOfMeasureDto } from '../data/unit-of-measure.dto';
import { UnitOfMeasure } from '../data/unit-of-measure.entity';
import { UnitOfMeasureService } from './unit-of-measure.service';

@Controller({ version: '1', path: 'units/measurement' })
export class UnitOfMeasureController implements ICrudRoutes {
  constructor(private readonly service: UnitOfMeasureService) {}

  @Post()
  async create(@Body() data: CreateUnitOfMeasureDto): Promise<UnitOfMeasure> {
    return await this.service.crud().create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<UnitOfMeasure> | UnitOfMeasure[]> {
    return await this.service.crud().findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UnitOfMeasure> {
    return await this.service.crud().findOneBy({ id }, () => new NotFoundException());
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUnitOfMeasureDto): Promise<UpdateResult> {
    return await this.service.crud().update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.service.crud().delete({ id }, () => new BadRequestException());
  }
}
