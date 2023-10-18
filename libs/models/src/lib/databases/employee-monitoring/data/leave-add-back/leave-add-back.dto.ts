import { LeaveApplicationDates } from '@gscwd-api/models';
import { IsNumber, IsString } from 'class-validator';

export class CreateLeaveAddBackDto {
  //id: string;
  leaveApplicationDatesId: LeaveApplicationDates;

  @IsString()
  reason: string;

  @IsNumber()
  creditValue: number;
}
