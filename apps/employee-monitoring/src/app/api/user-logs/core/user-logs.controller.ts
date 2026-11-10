import { CreateUserLogsDto } from '@gscwd-api/models';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserLogsService } from './user-logs.service';

@Controller({ version: '1', path: 'user-logs' })
export class UserLogsController {
  constructor(private readonly userLogsService: UserLogsService) { }

  @Post()
  async addLogs(@Body() createUserLogsDto: CreateUserLogsDto) {
    await this.userLogsService.addLogs(createUserLogsDto);
  }

  /** ?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD (default: the last 30 days) */
  @Get()
  async getLogs(@Query('date_from') dateFrom: string, @Query('date_to') dateTo: string) {
    return await this.userLogsService.getLogs(dateFrom, dateTo);
  }

  @Get('year-month/:yearmonth')
  async getLogsByYearMonth(@Param('yearmonth') yearMonth: string) {
    return await this.userLogsService.getLogsByYearMonth(yearMonth);
  }

  @Get(':id')
  async getLogById(@Param('id') id: string) {
    return await this.userLogsService.getLogById(id);
  }
}
