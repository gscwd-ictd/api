import { ICrudRoutes } from '@gscwd-api/crud';
import { BudgetDetail, CreateBudgetDetailDto, UpdateBudgetDetailDto } from '@gscwd-api/models';
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
import { BudgetDetailService } from './budget-details.service';

@Controller({ version: '1', path: 'budget/budget-details' })
export class BudgetDetailController implements ICrudRoutes {
  constructor(private readonly budgetDetailService: BudgetDetailService) {}

  @Post()
  async create(@Body() data: CreateBudgetDetailDto): Promise<BudgetDetail> {
    return await this.budgetDetailService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<BudgetDetail> | BudgetDetail[]> {
    return await this.budgetDetailService.crud().findAll({
      pagination: { page, limit },
      find: {
        relations: { budgetType: true },
        select: { budgetType: { id: true, name: true } },
      },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<BudgetDetail> {
    return await this.budgetDetailService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateBudgetDetailDto): Promise<UpdateResult> {
    return await this.budgetDetailService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.budgetDetailService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
