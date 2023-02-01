import { LeaveApplication } from '../leave-application/leave-application.entity';

export class CreateLeaveApplicationDatesDto {
  leaveApplicationId: LeaveApplication;
  leaveDate: Date;
}
