import { LeaveApplicationDates } from '@gscwd-api/models';

export class LeaveAddBackDto {
  id: string;
  leaveApplicationDatesId: LeaveApplicationDates;
  reason: string;
  creditValue: number;
}
