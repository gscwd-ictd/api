import { ICrudRoutes } from '@gscwd-api/crud';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateUnitTypeDto, UpdateUnitTypeDto } from '../data/unit-type.dto';
import { UnitType } from '../data/unit-type.entity';
import { UnitTypeService } from './unit-type.service';

@Controller({ version: '1', path: 'units/type' })
export class UnitTypeController implements ICrudRoutes {
  constructor(private readonly unitTypeService: UnitTypeService) {}

  @Post()
  async create(@Body() data: CreateUnitTypeDto): Promise<UnitType> {
    return await this.unitTypeService.create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(): Promise<UnitType[]> {
    return await this.unitTypeService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UnitType> {
    return await this.unitTypeService.findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUnitTypeDto): Promise<UpdateResult> {
    return await this.unitTypeService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.unitTypeService.delete({ id }, () => new BadRequestException());
  }
}
