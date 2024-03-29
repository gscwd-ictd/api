import { OvertimeApplication } from '@gscwd-api/models';
import { IsNotEmptyObject, IsUUID } from 'class-validator';

export class CreateOvertimeEmployeeDto {
  overtimeApplicationId: OvertimeApplication;

  @IsUUID()
  employeeId: string;
}
