import { CreateItemCategoryDto, UpdateItemCategoryDto } from '@gscwd-api/models';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { map } from 'rxjs';
import { CategoriesService } from './categories.service';

@Controller({ version: '1', path: 'items/info/categories' })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() data: CreateItemCategoryDto) {
    return await this.categoriesService.create(data);
  }

  @Get()
  async findAll(@Query() options: IPaginationOptions) {
    return await this.categoriesService.findAll(options);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoriesService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateItemCategoryDto) {
    return await this.categoriesService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoriesService.delete(id);
  }
}
