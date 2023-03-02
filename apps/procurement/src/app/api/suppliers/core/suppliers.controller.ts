import { ICrudRoutes } from '@gscwd-api/crud';
import { CreateSupplierDto, Supplier, UpdateSupplierDto } from '@gscwd-api/models';
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
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SuppliersService } from './suppliers.service';

@Controller({ version: '1', path: 'suppliers' })
export class SuppliersController implements ICrudRoutes {
  constructor(private readonly purchaseTypeService: SuppliersService) {}

  @Post()
  async create(@Body() data: CreateSupplierDto): Promise<Supplier> {
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
  ): Promise<Supplier[] | Pagination<Supplier, IPaginationMeta>> {
    return await this.purchaseTypeService.crud().findAll({
      find: { order: { supplier_name: 'ASC' } },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Supplier> {
    return await this.purchaseTypeService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateSupplierDto): Promise<UpdateResult> {
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
