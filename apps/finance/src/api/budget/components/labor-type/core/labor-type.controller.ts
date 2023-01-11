import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  NotFoundException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { LaborTypeService } from './labor-type.service';
import { CreateLaborTypeDto, UpdateLaborTypeDto } from '../data/labor-type.dto';
import { ICrudRoutes } from '@gscwd-api/crud';
import { LaborType } from '../data/labor-type.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller({ version: '1', path: 'labor-types' })
export class LaborTypeController implements ICrudRoutes {
  constructor(private readonly laborTypeService: LaborTypeService) {}

  @Post()
  async create(@Body() data: CreateLaborTypeDto): Promise<LaborType> {
    return await this.laborTypeService.getProvider().create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<LaborType>> {
    return await this.laborTypeService.getProvider().findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<LaborType> {
    return this.laborTypeService.getProvider().findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateLaborTypeDto): Promise<UpdateResult> {
    return this.laborTypeService.getProvider().update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.laborTypeService.getProvider().delete({ id }, () => new BadRequestException());
  }
}
