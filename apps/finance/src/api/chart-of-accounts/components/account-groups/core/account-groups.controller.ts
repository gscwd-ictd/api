import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AccountGroupsService } from './account-groups.service';
import { CreateAccountGroupDto, UpdateAccountGroupDto } from '../data/account-groups.dto';
import { ICrudRoutes } from '@gscwd-api/crud';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult, DeleteResult } from 'typeorm';
import { AccountGroup } from '../data/account-groups.entity';

@Controller({ version: '1', path: 'chart-of-accounts/account-groups' })
export class AccountGroupsController implements ICrudRoutes {
  constructor(private readonly accountGroupsService: AccountGroupsService) {}

  @Post()
  async create(@Body() data: CreateAccountGroupDto): Promise<AccountGroup> {
    return await this.accountGroupsService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<AccountGroup> | AccountGroup[]> {
    return await this.accountGroupsService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<AccountGroup> {
    return await this.accountGroupsService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateAccountGroupDto): Promise<UpdateResult> {
    return await this.accountGroupsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.accountGroupsService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
