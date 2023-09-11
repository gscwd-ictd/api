import { DailyTimeRecord, LeaveBenefits } from '@gscwd-api/models';
import { PickType } from '@nestjs/swagger';

export class CreateLeaveCreditEarningsDto {
  createdAt?: Date;
  employeeId: string;
  leaveBenefitsId?: LeaveBenefits;
  dailyTimeRecordId?: DailyTimeRecord;
  creditDate: Date;
  creditValue: number;
  remarks?: string;
}

export class UpdateLeaveCreditEarningsDto extends PickType(CreateLeaveCreditEarningsDto, [
  'creditDate',
  'creditValue',
  'employeeId',
  'leaveBenefitsId',
]) {
  id: string;
}
