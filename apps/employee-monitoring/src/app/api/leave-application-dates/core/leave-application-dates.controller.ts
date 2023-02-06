import { Controller } from '@nestjs/common';
import { LeaveApplicationDatesService } from './leave-application-dates.service';

@Controller('leave-application-dates')
export class LeaveApplicationDatesController {
  constructor(private readonly leaveApplicationDatesService: LeaveApplicationDatesService) {}
}
