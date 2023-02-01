import { Controller } from '@nestjs/common';
import { LeaveApplicationService } from './leave-application.service';

@Controller('leave-application')
export class LeaveApplicationController {
  constructor(private readonly leaveApplicationService: LeaveApplicationService) {}
}
