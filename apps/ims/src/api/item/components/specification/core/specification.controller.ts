import { ICrudRoutes } from '@gscwd-api/crud';
import { GeneratorService } from '@gscwd-api/generator';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { ItemCategory } from '../../category';
import { CreateItemSpecificationDto } from '../data/specification.dto';
import { ItemSpecification } from '../data/specification.entity';
import { SpecificationService } from './specification.service';

@Controller('items/specifications')
export class SpecificationController implements ICrudRoutes {
  constructor(
    // inject specification service
    private readonly specificationService: SpecificationService,

    // inject generator service
    private readonly generatorService: GeneratorService
  ) {}

  @Post()
  async create(@Body() data: CreateItemSpecificationDto): Promise<ItemSpecification> {
    return await this.specificationService.create({ ...data, code: this.generatorService.generate() }, () => new BadRequestException());
  }

  @Get()
  async findAll(@Query('category') category: string): Promise<ItemSpecification[]> {
    if (category) return await this.specificationService.findAllSpecifications(category);
    return await this.specificationService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Query('relations') relations: string): Promise<ItemSpecification> {
    if (relations === 'true') return await this.specificationService.findSpecification(id);
    return await this.specificationService.findOneBy({ id }, () => new NotFoundException());
  }

  @Patch(':id')
  async patchCategory(@Param('id') id: string, @Body('category') category: ItemCategory) {
    return await this.specificationService.update({ id }, { category }, () => new BadRequestException());
  }

  @Patch('quantity/:id')
  async patchQuantity(@Param('id') id: string, @Body('quantity') quantity: number) {
    return await this.specificationService.update({ id }, { quantity }, () => new BadRequestException());
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
