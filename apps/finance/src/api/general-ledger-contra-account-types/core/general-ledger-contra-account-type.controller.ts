import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  BadRequestException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateGeneralLedgerContraAccountTypeDto, UpdateGeneralLedgerContraAccountTypeDto } from '../data/general-ledger-contra-account-types.dto';
import { GeneralLedgerContraAccountType } from '../data/general-ledger-contra-account-types.entity';
import { GeneralLedgerContraAccountTypeService } from './general-ledger-contra-account-type.service';

@Controller({ version: '1', path: 'general-ledger-contra-account-types' })
export class GeneralLedgerContraAccountTypeController {
  constructor(private readonly generalLedgerContraAccountTypeService: GeneralLedgerContraAccountTypeService) {}

  @Post()
  async create(@Body() data: CreateGeneralLedgerContraAccountTypeDto): Promise<GeneralLedgerContraAccountType> {
    return await this.generalLedgerContraAccountTypeService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<GeneralLedgerContraAccountType> | GeneralLedgerContraAccountType[]> {
    return await this.generalLedgerContraAccountTypeService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<GeneralLedgerContraAccountType> {
    return await this.generalLedgerContraAccountTypeService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateGeneralLedgerContraAccountTypeDto): Promise<UpdateResult> {
    return await this.generalLedgerContraAccountTypeService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.generalLedgerContraAccountTypeService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
