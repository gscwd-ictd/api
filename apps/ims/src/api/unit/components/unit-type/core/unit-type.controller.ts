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
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateUnitTypeDto, UpdateUnitTypeDto } from '../data/unit-type.dto';
import { UnitType } from '../data/unit-type.entity';
import { UnitTypeService } from './unit-type.service';

@Controller({ version: '1', path: 'units/types' })
export class UnitTypeController implements ICrudRoutes {
  constructor(private readonly service: UnitTypeService) {}

  @Post()
  async create(@Body() data: CreateUnitTypeDto): Promise<UnitType> {
    return await this.service.crud().create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<UnitType> | UnitType[]> {
    return await this.service.crud().findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UnitType> {
    return await this.service.crud().findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUnitTypeDto): Promise<UpdateResult> {
    return await this.service.crud().update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.service.crud().delete({ id }, () => new BadRequestException());
  }
}
