import { OvertimeApplication } from '@gscwd-api/models';

export class CreateOvertimeEmployeeDto {
  overtimeApplicationId: OvertimeApplication;
  employeeId: string;
}
