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
  InternalServerErrorException,
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
    return await this.laborTypeService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<LaborType> | LaborType[]> {
    return await this.laborTypeService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<LaborType> {
    return this.laborTypeService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateLaborTypeDto): Promise<UpdateResult> {
    return this.laborTypeService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.laborTypeService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
