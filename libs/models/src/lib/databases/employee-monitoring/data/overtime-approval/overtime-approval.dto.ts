import { OvertimeApplication } from '@gscwd-api/models';

export class CreateOvertimeApprovalDto {
  overtimeApplicationId: OvertimeApplication;

  dateApproved: Date;

  managerId: string;

  remarks: string;
}
