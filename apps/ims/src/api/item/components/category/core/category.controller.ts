import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ItemClassification } from '../../classification';
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
  async findByClassification(@Query('classification_id') classification: ItemClassification) {
    return await this.itemService.findAllBy({ classification });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.itemService.findOneBy({ id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() itemDto: UpdateItemCategoryDto) {
    return await this.itemService.update({ id }, itemDto, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.itemService.delete({ id });
  }
}
