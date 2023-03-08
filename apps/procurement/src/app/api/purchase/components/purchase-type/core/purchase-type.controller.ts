import { ICrudRoutes } from '@gscwd-api/crud';
import { CreatePurchaseTypeDto, PurchaseType, UpdatePurchaseTypeDto } from '@gscwd-api/models';
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
import { Pagination, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { UpdateResult, DeleteResult } from 'typeorm';
import { PurchaseTypeService } from './purchase-type.service';

@Controller({ version: '1', path: 'pr-types' })
export class PurchaseTypeController implements ICrudRoutes {
  constructor(private readonly purchaseTypeService: PurchaseTypeService) {}

  @Post()
  async create(@Body() data: CreatePurchaseTypeDto): Promise<PurchaseType> {
    console.log(data);
    return await this.purchaseTypeService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<PurchaseType[] | Pagination<PurchaseType, IPaginationMeta>> {
    return await this.purchaseTypeService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<PurchaseType> {
    return await this.purchaseTypeService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdatePurchaseTypeDto): Promise<UpdateResult> {
    return await this.purchaseTypeService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.purchaseTypeService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
