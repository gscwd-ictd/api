import { ICrudRoutes } from '@gscwd-api/crud';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateItemCategoryDto, PatchItemCategoryDto, UpdateItemCategoryDto } from '../data/category.dto';
import { ItemCategory } from '../data/category.entity';
import { CategoryService } from './category.service';

@Controller('items/categories')
export class CategoryController implements ICrudRoutes {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() data: CreateItemCategoryDto): Promise<ItemCategory> {
    return await this.categoryService.create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(@Query('classification') classification: string): Promise<ItemCategory[]> {
    if (classification) return await this.categoryService.findAllCategoriesByClassification(classification);
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Query('relations') relations: string): Promise<ItemCategory> {
    if (relations === 'true') return await this.categoryService.findCategory(id);
    return await this.categoryService.findOneBy({ id }, () => new NotFoundException());
  }

  @Patch(':id')
  async patchClassificationOrUnit(@Param('id') id: string, @Body() data: PatchItemCategoryDto) {
    return await this.categoryService.update({ id }, data, () => new BadRequestException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateItemCategoryDto): Promise<UpdateResult> {
    return await this.categoryService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.categoryService.delete({ id }, () => new BadRequestException());
  }
}
