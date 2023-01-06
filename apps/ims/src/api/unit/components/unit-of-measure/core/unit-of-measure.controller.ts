import { ICrudRoutes } from '@gscwd-api/crud';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateUnitOfMeasureDto, UpdateUnitOfMeasureDto } from '../data/unit-of-measure.dto';
import { UnitOfMeasure } from '../data/unit-of-measure.entity';
import { UnitOfMeasureService } from './unit-of-measure.service';

@Controller({ version: '1', path: 'units/measurement' })
export class UnitOfMeasureController implements ICrudRoutes {
  constructor(private readonly unitOfMeasureService: UnitOfMeasureService) {}

  @Post()
  async create(@Body() data: CreateUnitOfMeasureDto): Promise<UnitOfMeasure> {
    return await this.unitOfMeasureService.create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(): Promise<UnitOfMeasure[]> {
    return await this.unitOfMeasureService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UnitOfMeasure> {
    return await this.unitOfMeasureService.findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUnitOfMeasureDto): Promise<UpdateResult> {
    return await this.unitOfMeasureService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.unitOfMeasureService.delete({ id }, () => new BadRequestException());
  }
}
