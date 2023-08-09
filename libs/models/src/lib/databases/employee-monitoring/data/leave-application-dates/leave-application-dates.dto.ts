import { IsDate, IsOptional, IsUUID } from 'class-validator';
import { LeaveApplication } from '../leave-application/leave-application.entity';

export class CreateLeaveApplicationDatesDto {
  leaveApplicationId: LeaveApplication;

  @IsDate()
  leaveDate: Date;
}
