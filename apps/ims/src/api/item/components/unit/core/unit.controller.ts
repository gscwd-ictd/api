import { ICrudRoutes } from '@gscwd-api/crud';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateMeasurementUnitDto, UpdatemeasurementUnitDto } from '../data/unit.dto';
import { MeasurementUnit } from '../data/unit.entity';
import { UnitService } from './unit.service';

@Controller({ version: '1', path: 'items/units' })
export class UnitController implements ICrudRoutes {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  async create(@Body() data: CreateMeasurementUnitDto): Promise<MeasurementUnit> {
    return await this.unitService.create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(): Promise<MeasurementUnit[]> {
    return await this.unitService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<MeasurementUnit> {
    return await this.unitService.findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdatemeasurementUnitDto): Promise<UpdateResult> {
    return await this.unitService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.unitService.delete({ id }, () => new BadRequestException());
  }
}
