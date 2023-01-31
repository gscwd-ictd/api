import { LeaveApplicationStatus } from '@gscwd-api/utils';
import { LeaveBenefits } from '../leave-benefits/leave-benefits.entity';

export class LeaveApplicationDto {
  id: string;
  leaveBenefits: LeaveBenefits;
  dateOfFiling: Date;
  inPhilippines: string;
  abroad: string;
  inHospital: string;
  outHospital: string;
  splWomen: string;
  mastersCompletion: boolean;
  barBoardReview: boolean;
  studyLeaveOther: string;
  monetization: boolean;
  terminalLeave: boolean;
  commutation: boolean;
  status: LeaveApplicationStatus;
}
