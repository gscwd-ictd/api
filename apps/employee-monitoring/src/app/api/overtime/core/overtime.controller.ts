import { CreateOvertimeDto } from '@gscwd-api/models';
import { Controller, Post } from '@nestjs/common';
import { OvertimeService } from './overtime.service';

@Controller('overtime')
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @Post()
  async createOvertime(createOverTimeDto: CreateOvertimeDto) {
    return await this.overtimeService.createOvertime(createOverTimeDto);
  }
}
