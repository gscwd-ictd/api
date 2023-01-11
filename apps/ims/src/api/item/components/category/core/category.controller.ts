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
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateItemCategoryDto, UpdateItemCategoryDto } from '../data/category.dto';
import { ItemCategory } from '../data/category.entity';
import { CategoryService } from './category.service';

@Controller({ version: '1', path: 'items/categories' })
export class CategoryController implements ICrudRoutes {
  constructor(
    // inject category service
    private readonly categoryService: CategoryService,

    // inject generator service
    private readonly generatorService: GeneratorService
  ) {}

  @Post()
  async create(@Body() data: CreateItemCategoryDto): Promise<ItemCategory> {
    return await this.categoryService.getProvider().create({ ...data, code: this.generatorService.generate() }, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ItemCategory>> {
    return await this.categoryService.getProvider().findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ItemCategory> {
    return await this.categoryService.getProvider().findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateItemCategoryDto): Promise<UpdateResult> {
    return await this.categoryService.getProvider().update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.categoryService.getProvider().delete({ id }, () => new BadRequestException());
  }
}
