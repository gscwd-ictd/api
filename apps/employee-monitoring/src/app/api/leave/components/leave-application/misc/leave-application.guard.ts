import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LeaveApplicationDatesService } from '../../leave-application-dates/core/leave-application-dates.service';
import { LeaveApplicationService } from '../core/leave-application.service';

export class LeaveApplicationGuard implements CanActivate {
  constructor(private readonly leaveApplicationDatesService: LeaveApplicationDatesService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('guard');
    return true;
  }
}
