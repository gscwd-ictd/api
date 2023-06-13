import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ManagersService } from './managers.service';

@Controller({ version: '1', path: 'managers' })
export class ManagersController {
  constructor(private readonly managerservice: ManagersService) {}

  @Get(':id')
  async findAll(@Param('id') id: string) {
    return await this.managerservice.findAllManagersFromView(id);
  }
}
