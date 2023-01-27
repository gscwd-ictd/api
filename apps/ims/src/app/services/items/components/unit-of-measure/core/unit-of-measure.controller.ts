import { CreateUnitOfMeasureDto, UpdateUnitOfMeasureDto } from '@gscwd-api/app-entities';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { UnitOfMeasureService } from './unit-of-measure.service';

@Controller({ version: '1', path: 'units/measurement' })
export class UnitOfMeasureController {
  constructor(private readonly unitOfMeasureService: UnitOfMeasureService) {}

  @Post()
  async create(@Body() data: CreateUnitOfMeasureDto) {
    return await this.unitOfMeasureService.create(data);
  }

  @Get()
  async findAll(@Query() options: IPaginationOptions) {
    return await this.unitOfMeasureService.findAll(options);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.unitOfMeasureService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateUnitOfMeasureDto) {
    return await this.unitOfMeasureService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.unitOfMeasureService.delete(id);
  }
}
