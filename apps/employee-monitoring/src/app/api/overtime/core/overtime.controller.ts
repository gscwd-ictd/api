import { Controller } from '@nestjs/common';
import { OvertimeService } from './overtime.service';

@Controller('overtime')
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}
}
