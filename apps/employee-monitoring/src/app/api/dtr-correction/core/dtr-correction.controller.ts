import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { DtrCorrectionService } from './dtr-correction.service';
import { ApproveDtrCorrectionDto, CreateDtrCorrectionDto } from '@gscwd-api/models';
import { DtrCorrectionGuard } from '../utils/guards/dtr-correction.guard';
import { User } from '../../users/utils/user.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller({ version: '1', path: 'dtr-correction' })
export class DtrCorrectionController {
  constructor(private readonly dtrCorrectionService: DtrCorrectionService) {}

  @Post()
  async addDtrCorrection(@Body() createDtrCorrectionDto: CreateDtrCorrectionDto) {
    return await this.dtrCorrectionService.addDtrCorrection(createDtrCorrectionDto);
  }

  @MessagePattern('get_all_dtr_corrections')
  async getAllDtrCorrections(@Payload() employeeId: string) {
    return await this.dtrCorrectionService.getDtrCorrections(employeeId);
  }

  @Patch()
  async approvalOfDtrCorrection(@Body() approveDtrCorrectionDto: ApproveDtrCorrectionDto) {
    return await this.dtrCorrectionService.approvalOfDtrCorrection(approveDtrCorrectionDto);
  }
}
