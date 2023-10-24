import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CreateModuleDto, UpdateModuleDto } from '../data/modules.dto';
import { ModulesService } from './modules.service';

@Controller({ version: '1', path: 'modules' })
export class ModulesController {
  constructor(private readonly moduleService: ModulesService) {}

  @Post('')
  async saveModule(@Body() createModuleDto: CreateModuleDto) {
    return await this.moduleService.saveModule(createModuleDto);
  }

  @Get()
  async getModule() {
    return await this.moduleService.getModules();
  }

  @Put()
  async updateModule(@Body() updateModuleDto: UpdateModuleDto) {
    return await this.moduleService.updateModule(updateModuleDto);
  }
}
