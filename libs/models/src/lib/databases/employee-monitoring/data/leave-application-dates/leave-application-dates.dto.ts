import { IsDate, IsOptional, IsUUID } from 'class-validator';

export class CreateLeaveApplicationDatesDto {
  leaveApplicationId: string;

  @IsDate()
  leaveDate: Date;
}


