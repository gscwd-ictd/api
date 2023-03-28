import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  NotFoundException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { ICrudRoutes } from '@gscwd-api/crud';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';
import { BudgetTypeService } from './budget-types.service';
import { BudgetType, CreateBudgetTypeDto, UpdateBudgetTypeDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'budget-types' })
export class BudgetTypeController implements ICrudRoutes {
  constructor(private readonly budgetTypeService: BudgetTypeService) {}

  @Post()
  async create(@Body() data: CreateBudgetTypeDto): Promise<BudgetType> {
    return await this.budgetTypeService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<BudgetType> | BudgetType[]> {
    return await this.budgetTypeService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<BudgetType> {
    return this.budgetTypeService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateBudgetTypeDto): Promise<UpdateResult> {
    return this.budgetTypeService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.budgetTypeService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
