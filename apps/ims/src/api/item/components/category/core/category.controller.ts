import { ICrudRoutes } from '@gscwd-api/crud';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateItemCategoryDto, UpdateItemCategoryDto } from '../data/category.dto';
import { ItemCategory } from '../data/category.entity';
import { CategoryService } from './category.service';

@Controller('item/categories')
export class CategoryController implements ICrudRoutes {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() data: CreateItemCategoryDto): Promise<ItemCategory> {
    return await this.categoryService.create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(): Promise<ItemCategory[]> {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findById(@Param() id: string): Promise<ItemCategory> {
    return await this.categoryService.findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param() id: string, @Body() data: UpdateItemCategoryDto): Promise<UpdateResult> {
    return await this.categoryService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param() id: string): Promise<DeleteResult> {
    return await this.categoryService.delete({ id }, () => new BadRequestException());
  }
}
