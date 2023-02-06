import { LeaveBenefits } from 'libs/models/src/lib/databases/employee-monitoring/data/leave-benefits/leave-benefits.entity';
import { LeaveApplication } from '../../../../libs/models/src/lib/databases/employee-monitoring/data/leave-application/leave-application.entity';
import { LeaveApplicationDates } from '../../../../libs/models/src/lib/databases/employee-monitoring/data/leave-application-dates/leave-application-dates.entity';

export const typeOrmEntities = [LeaveApplication, LeaveBenefits, LeaveApplicationDates];
