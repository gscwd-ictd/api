import { DailyTimeRecord, LeaveBenefits } from '@gscwd-api/models';
import { PickType } from '@nestjs/swagger';
import { IsDate, IsDecimal, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateLeaveCreditEarningsDto {
  @IsOptional()
  createdAt?: Date;

  @IsUUID(4)
  employeeId: string;

  @IsOptional()
  leaveBenefitsId?: LeaveBenefits;

  @IsOptional()
  dailyTimeRecordId?: DailyTimeRecord;

  @IsDate()
  creditDate: Date;

  @IsDecimal()
  creditValue: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateLeaveCreditEarningsDto extends PickType(CreateLeaveCreditEarningsDto, [
  'creditDate',
  'creditValue',
  'employeeId',
  'leaveBenefitsId',
]) {
  @IsUUID(4)
  id: string;
}
