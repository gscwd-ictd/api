import { LeaveApplicationDates } from '@gscwd-api/models';

export class CreateLeaveAddBackDto {
  id: string;
  leaveApplicationDatesId: LeaveApplicationDates;
  reason: string;
  creditValue: number;
}
