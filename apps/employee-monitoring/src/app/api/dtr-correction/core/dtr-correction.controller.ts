import { Body, Controller, Get, Patch, Post, Query, UseFilters, UseGuards } from '@nestjs/common';
import { DtrCorrectionService } from './dtr-correction.service';
import { ApproveDtrCorrectionDto, CreateDtrCorrectionDto } from '@gscwd-api/models';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MsExceptionFilter } from '@gscwd-api/utils';

@Controller({ version: '1', path: 'dtr-correction' })
export class DtrCorrectionController {
  constructor(private readonly dtrCorrectionService: DtrCorrectionService) {}

  @Post()
  async addDtrCorrection(@Body() createDtrCorrectionDto: CreateDtrCorrectionDto) {
    return await this.dtrCorrectionService.addDtrCorrection(createDtrCorrectionDto);
  }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern('get_all_dtr_corrections')
  async getAllDtrCorrections(@Payload() employeeId: string) {
    return await this.dtrCorrectionService.getDtrCorrections(employeeId);
  }

  /** HR: all time log correction requests (Monitoring > Time Log Corrections). */
  @Get('hr')
  async getAllDtrCorrectionsForHr(@Query('date_from') dateFrom?: string, @Query('date_to') dateTo?: string, @Query('status') status?: string) {
    return await this.dtrCorrectionService.getAllDtrCorrectionsForHr(dateFrom, dateTo, status);
  }

  @Patch()
  async approvalOfDtrCorrection(@Body() approveDtrCorrectionDto: ApproveDtrCorrectionDto) {
    return await this.dtrCorrectionService.approvalOfDtrCorrection(approveDtrCorrectionDto);
  }
}
