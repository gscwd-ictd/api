import { ICrudRoutes } from '@gscwd-api/crud';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { ItemCategory } from '../../category';
import { CreateItemSpecificationDto } from '../data/specification.dto';
import { ItemSpecification } from '../data/specification.entity';
import { SpecificationService } from './specification.service';

@Controller('items/specifications')
export class SpecificationController implements ICrudRoutes {
  constructor(private readonly specificationService: SpecificationService) {}

  @Post()
  async create(@Body() data: CreateItemSpecificationDto): Promise<ItemSpecification> {
    return await this.specificationService.create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(): Promise<ItemSpecification[]> {
    return await this.specificationService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ItemSpecification> {
    return await this.specificationService.findOneBy({ id }, () => new NotFoundException());
  }

  @Patch(':id')
  async patchCategory(@Param('id') id: string, @Body('category') category: ItemCategory) {
    return await this.specificationService.update({ id }, { category }, () => new BadRequestException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: unknown): Promise<UpdateResult> {
    return await this.specificationService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.specificationService.delete({ id }, () => new BadRequestException());
  }
}
