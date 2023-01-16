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
import { CreateItemClassificationDto, UpdateItemClassificationDto } from '../data/classification.dto';
import { ItemClassification } from '../data/classification.entity';
import { ClassificationService } from './classification.service';

@Controller({ version: '1', path: 'items/info/classification' })
export class ClassificationController implements ICrudRoutes {
  constructor(private readonly service: ClassificationService) {}

  @Post()
  async create(@Body() data: CreateItemClassificationDto): Promise<ItemClassification> {
    return await this.service.crud().create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ItemClassification> | ItemClassification[]> {
    return await this.service.crud().findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ItemClassification> {
    return await this.service.crud().findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateItemClassificationDto): Promise<UpdateResult> {
    console.log('update');
    return await this.service.crud().update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.service.crud().delete({ id }, () => new BadRequestException());
  }
}
