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
} from '@nestjs/common';
import { ValueAddedTaxService } from './value-added-tax.service';
import { CreateValueAddedTaxDto, UpdateValueAddedTaxDto } from '../data/value-added-tax.dto';
import { ICrudRoutes } from '@gscwd-api/crud';
import { ValueAddedTax } from '../data/value-added-tax.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller({ version: '1', path: 'budget/value-added-taxes' })
export class ValueAddedTaxController implements ICrudRoutes {
  constructor(private readonly valueAddedTaxService: ValueAddedTaxService) {}

  @Post()
  async create(@Body() data: CreateValueAddedTaxDto): Promise<ValueAddedTax> {
    return await this.valueAddedTaxService.getProvider().create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ValueAddedTax>> {
    return await this.valueAddedTaxService.getProvider().findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ValueAddedTax> {
    return await this.valueAddedTaxService.getProvider().findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateValueAddedTaxDto): Promise<UpdateResult> {
    return await this.valueAddedTaxService.getProvider().update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.valueAddedTaxService.getProvider().delete({ id }, () => new BadRequestException());
  }
}
