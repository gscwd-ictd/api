import { Body, Controller, Get, Post } from '@nestjs/common';
import { DtrCorrectionService } from './dtr-correction.service';
import { CreateDtrCorrectionDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'dtr-correction' })
export class DtrCorrectionController {
  constructor(private readonly dtrCorrectionService: DtrCorrectionService) {}

  @Post()
  async addDtrCorrection(@Body() createDtrCorrectionDto: CreateDtrCorrectionDto) {
    return await this.dtrCorrectionService.addDtrCorrection(createDtrCorrectionDto);
  }

  @Get()
  async getAllDtrCorrections() {
    return await this.dtrCorrectionService.getDtrCorrections();
  }
}
