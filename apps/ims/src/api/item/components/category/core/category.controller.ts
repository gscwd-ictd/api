import { ICrudRoutes } from '@gscwd-api/crud';
import { GeneratorService } from '@gscwd-api/generator';
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
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateItemCategoryDto, UpdateItemCategoryDto } from '../data/category.dto';
import { ItemCategory } from '../data/category.entity';
import { CategoryService } from './category.service';

@Controller({ version: '1', path: 'items/info/categories' })
export class CategoryController implements ICrudRoutes {
  constructor(
    // inject category service
    private readonly categoryService: CategoryService,

    // inject generator service
    private readonly generatorService: GeneratorService
  ) {}

  @Post()
  async create(@Body() data: CreateItemCategoryDto): Promise<ItemCategory> {
    return await this.categoryService.crud().create({ ...data, code: this.generatorService.generate() as string }, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ItemCategory> | ItemCategory[]> {
    return await this.categoryService.crud().findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ItemCategory> {
    return await this.categoryService.crud().findOneBy({ id }, () => new NotFoundException());
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateItemCategoryDto): Promise<UpdateResult> {
    return await this.categoryService.crud().update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.categoryService.crud().delete({ id }, () => new BadRequestException());
  }
}
