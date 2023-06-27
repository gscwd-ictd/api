import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, ParseUUIDPipe, Query } from '@nestjs/common';
import { ManagersService } from './managers.service';

@Controller({ version: '1', path: 'managers' })
export class ManagersController {
  constructor(private readonly managerservice: ManagersService) {}

  // @Get(':id')
  // async findAll(@Param('id') id: string) {
  //   return await this.managerservice.findAllManagersFromView(id);
  // }

  @Get('managers/q')
  async findAllManagers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.managerservice.findAllManagers({ page, limit });
  }
}
