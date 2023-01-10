import { ICrudRoutes } from '@gscwd-api/crud';
import { GeneratorService } from '@gscwd-api/generator';
import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { Pagination, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreatePropertyCategory, UpdatePropertyCategory } from '../data/category.dto';
import { PropertyCategory } from '../data/category.entity';
import { CategoryService } from './category.service';

@Controller({ version: '1', path: 'properties/categories' })
export class CategoryController implements ICrudRoutes {
  constructor(private readonly categoryService: CategoryService, private readonly generator: GeneratorService) {}

  @Post()
  async create(@Body() data: CreatePropertyCategory): Promise<PropertyCategory> {
    return await this.categoryService.create({ ...data, code: this.generator.generate() }, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<PropertyCategory, IPaginationMeta>> {
    return await this.categoryService.findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<PropertyCategory> {
    return await this.categoryService.findOneBy({ id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdatePropertyCategory): Promise<UpdateResult> {
    return await this.categoryService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.categoryService.delete({ id }, () => new BadRequestException());
  }
}
