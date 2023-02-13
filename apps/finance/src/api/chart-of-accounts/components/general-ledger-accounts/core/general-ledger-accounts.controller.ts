import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { GeneralLedgerAccountService } from './general-ledger-accounts.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ICrudRoutes } from '@gscwd-api/crud';
import { CreateGeneralLedgerAccountDto, GeneralLedgerAccount, UpdateGeneralLedgerAccountDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'chart-of-accounts/general-ledger-accounts' })
export class GeneralLedgerAccountController implements ICrudRoutes {
  constructor(private readonly generalLedgerAccountService: GeneralLedgerAccountService) {}

  @Post()
  async create(@Body() data: CreateGeneralLedgerAccountDto): Promise<GeneralLedgerAccount> {
    return await this.generalLedgerAccountService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<GeneralLedgerAccount> | GeneralLedgerAccount[]> {
    return await this.generalLedgerAccountService.crud().findAll({
      pagination: { page, limit },
      find: {
        relations: { subMajorAccountGroup: true, generalLedgerContraAccountType: true },
        select: { subMajorAccountGroup: { id: true, code: true, name: true }, generalLedgerContraAccountType: { id: true, code: true, name: true } },
      },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<GeneralLedgerAccount> {
    return await this.generalLedgerAccountService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateGeneralLedgerAccountDto): Promise<UpdateResult> {
    return await this.generalLedgerAccountService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.generalLedgerAccountService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
