import { ICrudRoutes } from '@gscwd-api/crud';
import { CreateContraAccountDto, ContraAccount, UpdateContraAccountDto } from '@gscwd-api/models';
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
import { ContraAccountService } from './contra-accounts.service';

@Controller({ version: '1', path: 'contra-accounts' })
export class ContraAccountController implements ICrudRoutes {
  constructor(private readonly contraAccountService: ContraAccountService) {}

  @Post()
  async create(@Body() data: CreateContraAccountDto): Promise<ContraAccount> {
    return await this.contraAccountService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ContraAccount> | ContraAccount[]> {
    return await this.contraAccountService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ContraAccount> {
    return await this.contraAccountService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateContraAccountDto): Promise<UpdateResult> {
    return await this.contraAccountService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.contraAccountService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
