import { CanActivate, ExecutionContext } from '@nestjs/common';
import { LeaveApplicationDatesService } from '../../leave-application-dates/core/leave-application-dates.service';

export class LeaveApplicationGuard implements CanActivate {
  constructor(private readonly leaveApplicationDatesService: LeaveApplicationDatesService) {}
  async canActivate(context: ExecutionContext) {
    return true;
  }
}
