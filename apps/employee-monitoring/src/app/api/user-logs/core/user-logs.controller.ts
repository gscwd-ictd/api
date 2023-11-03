import { CreateUserLogsDto } from '@gscwd-api/models';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserLogsService } from './user-logs.service';

@Controller({ version: '1', path: 'user-logs' })
export class UserLogsController {
  constructor(private readonly userLogsService: UserLogsService) {}

  @Post()
  async addLogs(@Body() createUserLogsDto: CreateUserLogsDto) {
    await this.userLogsService.addLogs(createUserLogsDto);
  }

  @Get()
  async getLogs() {
    return await this.userLogsService.getLogs();
  }

  @Get(':id')
  async getLogById(@Param('id') id: string) {
    return await this.userLogsService.getLogById(id);
  }
}
