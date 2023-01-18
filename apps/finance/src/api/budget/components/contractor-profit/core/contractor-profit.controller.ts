import { ICrudRoutes } from '@gscwd-api/crud';
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
import { Pagination, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateContractorProfitDto, UpdateContractorProfitDto } from '../data/contractor-profit.dto';
import { ContractorProfit } from '../data/contractor-profit.entity';
import { ContractorProfitService } from './contractor-profit.service';

@Controller({ version: '1', path: 'budget/contractor-profit' })
export class ContractorProfitController implements ICrudRoutes {
  constructor(private readonly contractorProfitService: ContractorProfitService) {}

  @Post()
  async create(@Body() data: CreateContractorProfitDto): Promise<ContractorProfit> {
    return await this.contractorProfitService.crud().create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ContractorProfit> | ContractorProfit[]> {
    return await this.contractorProfitService.crud().findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ContractorProfit> {
    return await this.contractorProfitService.crud().findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateContractorProfitDto): Promise<UpdateResult> {
    return await this.contractorProfitService.crud().update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.contractorProfitService.crud().delete({ id }, () => new BadRequestException());
  }
}
