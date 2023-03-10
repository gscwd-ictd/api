import { ChartOfAccountsView } from '@gscwd-api/models';
import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ChartOfAccountService } from './chart-of-accounts.service';

@Controller({ version: '1', path: 'account-titles' })
export class ChartOfAccountController {
  constructor(private readonly chartOfAccountsService: ChartOfAccountService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ChartOfAccountsView> | ChartOfAccountsView[]> {
    return await this.chartOfAccountsService.findAll(page, limit);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ChartOfAccountsView> {
    return await this.chartOfAccountsService.findOneBy(id);
  }
}
