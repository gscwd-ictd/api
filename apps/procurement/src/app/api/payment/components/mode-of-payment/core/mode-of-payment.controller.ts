import { ICrudRoutes } from '@gscwd-api/crud';
import { CreateModeOfPaymentDto, ModeofPayment, UpdateModeOfPaymentDto } from '@gscwd-api/models';
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
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';

import { ModeOfPaymentService } from './mode-of-payment.service';

@Controller({ version: '1', path: 'mode-of-payment' })
export class ModeOfPaymentController implements ICrudRoutes {
  constructor(private readonly modeofpaymentService: ModeOfPaymentService) {}

  @Post()
  async create(@Body() data: CreateModeOfPaymentDto): Promise<ModeofPayment> {
    return await this.modeofpaymentService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<ModeofPayment[] | Pagination<ModeofPayment, IPaginationMeta>> {
    return await this.modeofpaymentService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ModeofPayment> {
    return this.modeofpaymentService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateModeOfPaymentDto): Promise<UpdateResult> {
    return this.modeofpaymentService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.modeofpaymentService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
