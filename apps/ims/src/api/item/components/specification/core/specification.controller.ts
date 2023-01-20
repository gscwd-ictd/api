import { ICrudRoutes } from '@gscwd-api/crud';
import { GeneratorService } from '@gscwd-api/generator';
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateItemSpecificationDto, UpdateItemSpecificationDto } from '../data/specification.dto';
import { ItemSpecification } from '../data/specification.entity';
import { SpecificationService } from './specification.service';

@Controller({ version: '1', path: 'items/info/specifications' })
export class SpecificationController implements ICrudRoutes {
  constructor(
    // inject specification service
    private readonly specificationService: SpecificationService,

    // inject generator service
    private readonly generatorService: GeneratorService
  ) {}

  @Post()
  async create(@Body() data: CreateItemSpecificationDto): Promise<ItemSpecification> {
    return await this.specificationService.crud().create({
      dto: { ...data, code: this.generatorService.generate() as string },
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ItemSpecification> | ItemSpecification[]> {
    return await this.specificationService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ItemSpecification> {
    return await this.specificationService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateItemSpecificationDto): Promise<UpdateResult> {
    return await this.specificationService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.specificationService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
