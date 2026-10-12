import { CreateWorkSuspensionDto, UpdateWorkSuspensionDto, WorkSuspensionType } from '@gscwd-api/models';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { WorkSuspensionService } from './work-suspension.service';

// the global ValidationPipe is disabled in main.ts, so validate here; whitelist drops extra fields (e.g. app: 'ems')
const validation = new ValidationPipe({ transform: true, whitelist: true });

@Controller({ version: '1', path: 'work-suspension' })
export class WorkSuspensionController {
  constructor(private readonly workSuspensionService: WorkSuspensionService) {}

  /** ?from=YYYY-MM-DD&to=YYYY-MM-DD&includeArchived=false (default: last 6 months, archived included) */
  @Get('')
  async getAllWorkSuspensions(@Query('from') from?: string, @Query('to') to?: string, @Query('includeArchived') includeArchived?: string) {
    return await this.workSuspensionService.getAllWorkSuspensions({
      from,
      to,
      includeArchived: includeArchived === undefined ? undefined : includeArchived !== 'false',
    });
  }

  /** ?suspensionType=WHOLE_DAY|TIME_OF_DAY&suspensionStartTime=HH:mm */
  @Get('preview')
  async previewWorkSuspension(@Query('suspensionType') suspensionType: WorkSuspensionType, @Query('suspensionStartTime') suspensionStartTime?: string) {
    return await this.workSuspensionService.previewWorkSuspension(suspensionType, suspensionStartTime);
  }

  @Post()
  async createWorkSuspension(@Body(validation) workSuspensionDto: CreateWorkSuspensionDto) {
    return await this.workSuspensionService.createWorkSuspension(workSuspensionDto);
  }

  @Patch(':work_suspension_id')
  async updateWorkSuspension(
    @Param('work_suspension_id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true, skipMissingProperties: true })) updateDto: UpdateWorkSuspensionDto
  ) {
    return await this.workSuspensionService.updateWorkSuspension(id, updateDto);
  }

  @Delete(':work_suspension_id')
  async deleteWorkSuspension(@Param('work_suspension_id', ParseUUIDPipe) id: string) {
    return await this.workSuspensionService.deleteWorkSuspension(id);
  }
}
