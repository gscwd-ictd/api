import { MonetizationType } from '@gscwd-api/utils';
import { LeaveApplication } from '../leave-application';

export class CreateLeaveMonetizationDto {
  monetizationType: MonetizationType;
  convertedVl: number;
  convertedSl: number;
  //leaveApplicationId: LeaveApplication;
  monetizedAmount: number;
}
