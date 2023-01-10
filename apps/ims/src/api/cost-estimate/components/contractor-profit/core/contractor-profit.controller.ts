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

@Controller({ version: '1', path: 'contractor-profit' })
export class ContractorProfitController implements ICrudRoutes {
  constructor(private readonly contractorprofitService: ContractorProfitService) {}

  @Post()
  async create(@Body() data: ContractorProfit) {
    return await this.contractorprofitService.create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.contractorprofitService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.contractorprofitService.findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateContractorProfitDto) {
    return this.contractorprofitService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.contractorprofitService.delete({ id }, () => new BadRequestException());
  }
}
