import { LeaveApplicationDatesModule } from '../app/api/leave/components/leave-application-dates/core/leave-application-dates.module';
import { LeaveApplicationModule } from '../app/api/leave/components/leave-application/core/leave-application.module';
import { LeaveBenefitsModule } from '../app/api/leave/components/leave-benefits/core/leave-benefits.module';

export const appModules = [LeaveApplicationModule, LeaveBenefitsModule, LeaveApplicationDatesModule];
