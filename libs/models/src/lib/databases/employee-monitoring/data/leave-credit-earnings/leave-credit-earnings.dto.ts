import { LeaveBenefits } from '@gscwd-api/models';
import { PickType } from '@nestjs/swagger';

export class CreateLeaveCreditEarningsDto {
  employeeId: string;
  leaveBenefitsId: LeaveBenefits;
  creditDate: Date;
  creditValue: number;
}

export class UpdateLeaveCreditEarningsDto extends PickType(CreateLeaveCreditEarningsDto, [
  'creditDate',
  'creditValue',
  'employeeId',
  'leaveBenefitsId',
]) {
  id: string;
}
