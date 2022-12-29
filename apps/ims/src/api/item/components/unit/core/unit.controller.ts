import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CreateMeasurementUnitDto, UpdatemeasurementUnitDto } from '../data/unit.dto';
import { UnitService } from './unit.service';

@Controller('item/units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  async create(@Body() unitDto: CreateMeasurementUnitDto) {
    return await this.unitService.create(unitDto, () => new BadRequestException());
  }

  @Get()
  async findAll() {
    return await this.unitService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') unitId: string) {
    return await this.unitService.findOneBy({ unitId }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') unitId: string, @Body() unitDto: UpdatemeasurementUnitDto) {
    return await this.unitService.update({ unitId }, unitDto, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') unitId: string) {
    return await this.unitService.delete({ unitId }, () => new BadRequestException());
  }
}
