import { ICrudRoutes } from '@gscwd-api/crud';
import { TermsofPayment } from '@gscwd-api/models';
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
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';
import {
  CreateTermsofPaymentDto,
  UpdateTermsofPaymentDto,
} from '../../../../../../../../../libs/models/src/lib/databases/procurement/data/terms-of_payment/terms_of_payment.dto';
import { TermsOfPaymentService } from './terms-of_payment.service';

@Controller({ version: '1', path: 'terms-of-payment' })
export class TermsOfPaymentController implements ICrudRoutes {
  constructor(private readonly termsofpaymentService: TermsOfPaymentService) {}

  @Post()
  async create(@Body() data: CreateTermsofPaymentDto): Promise<TermsofPayment> {
    return await this.termsofpaymentService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<TermsofPayment> | TermsofPayment[]> {
    return await this.termsofpaymentService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TermsofPayment> {
    return this.termsofpaymentService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateTermsofPaymentDto): Promise<UpdateResult> {
    return this.termsofpaymentService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.termsofpaymentService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
