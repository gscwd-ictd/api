import { IsDate, IsOptional, IsUUID } from 'class-validator';
import { LeaveApplication } from '../leave-application/leave-application.entity';
import { LeaveDayStatus } from '@gscwd-api/utils';

export class CreateLeaveApplicationDatesDto {
  leaveApplicationId: LeaveApplication;

  @IsDate()
  leaveDate: Date;
}

export class LeaveDateCancellationDto {
  leaveApplicationId: LeaveApplication;
  status: LeaveDayStatus;
  leaveDates: Date[];
  remarks: string;
}
