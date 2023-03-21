import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Put,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ValueAddedTaxService } from './value-added-tax.service';
import { ICrudRoutes } from '@gscwd-api/crud';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateValueAddedTaxDto, UpdateValueAddedTaxDto, ValueAddedTax } from '@gscwd-api/models';

@Controller({ version: '1', path: 'budget/value-added-taxes' })
export class ValueAddedTaxController implements ICrudRoutes {
  constructor(private readonly valueAddedTaxService: ValueAddedTaxService) {}

  @Post()
  async create(@Body() data: CreateValueAddedTaxDto): Promise<ValueAddedTax> {
    return await this.valueAddedTaxService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ValueAddedTax> | ValueAddedTax[]> {
    return await this.valueAddedTaxService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ValueAddedTax> {
    return await this.valueAddedTaxService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateValueAddedTaxDto): Promise<UpdateResult> {
    return await this.valueAddedTaxService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.valueAddedTaxService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
