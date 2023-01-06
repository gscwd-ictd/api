import { ICrudRoutes } from '@gscwd-api/crud';
import { GeneratorService } from '@gscwd-api/generator';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateItemSpecificationDto } from '../data/specification.dto';
import { ItemSpecification } from '../data/specification.entity';
import { SpecificationService } from './specification.service';

@Controller({ version: '1', path: 'items/specifications' })
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
  async findAll(): Promise<ItemSpecification[]> {
    return await this.specificationService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ItemSpecification> {
    return await this.specificationService.findOneBy({ id }, () => new NotFoundException());
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
