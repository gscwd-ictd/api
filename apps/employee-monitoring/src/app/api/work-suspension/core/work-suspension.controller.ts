import { CreateWorkSuspensionDto } from '@gscwd-api/models';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkSuspensionService } from './work-suspension.service';

@Controller({ version: '1', path: 'work-suspension' })
export class WorkSuspensionController {
  constructor(private readonly workSuspensionService: WorkSuspensionService) {}
  @Get('')
  async getAllWorkSuspensions() {
    return await this.workSuspensionService.getAllWorkSuspensions();
  }

  @Post()
  async createWorkSuspension(@Body() workSuspensionDto: CreateWorkSuspensionDto) {
    return await this.workSuspensionService.createWorkSuspension(workSuspensionDto);
  }
}
