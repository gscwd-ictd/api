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
    return await this.specificationService
      .getProvider()
      .create({ ...data, code: this.generatorService.generate() as string }, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ItemSpecification>> {
    return await this.specificationService.getProvider().findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ItemSpecification> {
    return await this.specificationService.getProvider().findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: unknown): Promise<UpdateResult> {
    return await this.specificationService.getProvider().update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.specificationService.getProvider().delete({ id }, () => new BadRequestException());
  }
}
