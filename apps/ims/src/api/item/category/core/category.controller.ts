import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateItemCategoryDto, UpdateItemCategoryDto } from '../data/category.dto';
import { CategoryService } from './category.service';

@Controller('item/categories')
export class CategoryController {
  constructor(private readonly itemService: CategoryService) {}

  @Post()
  async create(@Body() itemDto: CreateItemCategoryDto) {
    return await this.itemService.create(itemDto, () => new BadRequestException());
  }

  @Get()
  async findAll() {
    return await this.itemService.findAll();
  }

  @Get('q')
  async findByClassification(@Query('classification_id') classificationId: string) {
    return await this.itemService.findAllBy({ classificationId });
  }

  @Get(':id')
  async findById(@Param('id') categoryId: string) {
    return await this.itemService.findOneBy({ categoryId });
  }

  @Put(':id')
  async update(@Param('id') categoryId: string, @Body() itemDto: UpdateItemCategoryDto) {
    return await this.itemService.update({ categoryId }, itemDto, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') categoryId: string) {
    return await this.itemService.delete({ categoryId });
  }
}
