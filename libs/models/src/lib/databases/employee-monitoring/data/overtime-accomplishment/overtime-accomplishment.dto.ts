import { OvertimeStatus } from '@gscwd-api/utils';
import { OvertimeEmployee } from '../overtime-employee';

export class CreateOvertimeAccomplishmentDto {
  overtimeEmployeeId: OvertimeEmployee;

  ivmsTimeIn: number;

  ivmsTimeOut: number;

  encodedTimeIn: number;

  encodedTimeOut: number;

  accomplishments: string;

  followEstimatedHrs: boolean;

  status: OvertimeStatus;
}
