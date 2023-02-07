import { LeaveApplicationDatesModule } from '../app/api/leave/components/leave-application-dates/core/leave-application-dates.module';
import { LeaveApplicationModule } from '../app/api/leave/components/leave-application/core/leave-application.module';
import { LeaveBenefitsModule } from '../app/api/leave/components/leave-benefits/core/leave-benefits.module';
import { PassSlipApprovalModule } from '../app/api/pass-slip/components/approval/core/pass-slip-approval.module';
import { PassSlipModule } from '../app/api/pass-slip/core/pass-slip.module';

export const appModules = [LeaveApplicationModule, LeaveBenefitsModule, LeaveApplicationDatesModule, PassSlipModule, PassSlipApprovalModule];
