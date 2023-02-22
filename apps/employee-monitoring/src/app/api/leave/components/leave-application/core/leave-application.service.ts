import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveApplicationDto, LeaveApplicationDates } from '@gscwd-api/models';
import { HttpException, Injectable } from '@nestjs/common';
import { LeaveApplication } from '@gscwd-api/models';
import { LeaveApplicationType } from '@gscwd-api/utils';

@Injectable()
export class LeaveApplicationService extends CrudHelper<LeaveApplication> {
  constructor(private readonly crudService: CrudService<LeaveApplication>) {
    super(crudService);
  }

  async createLeaveApplication(createLeaveApplication: CreateLeaveApplicationDto) {
    const repo = this.crudService.getDatasource();

    const result = repo.transaction(async (transactionEntityManager) => {
      const { leaveApplicationDates, ...rest } = createLeaveApplication;
      const leaveApplication = await transactionEntityManager.getRepository(LeaveApplication).save(rest);
      const leaveApplicationDatesResult = await Promise.all(
        leaveApplicationDates.map(async (leaveApplicationDate) => {
          const { leaveDate } = leaveApplicationDate;
          return await transactionEntityManager.getRepository(LeaveApplicationDates).save({
            leaveDate,
            leaveApplicationId: leaveApplication.id,
          });
        })
      );
      return {
        leaveApplication,
        leaveApplicationDates: leaveApplicationDatesResult,
      };
    });
    return result;
  }

  async getLeaveApplicationByEmployeeId(employeeId: string) {
    try {
      return await this.rawQuery<string, LeaveApplicationType[]>(
        `SELECT
            la.leave_application_id id,
            lb.leave_name leaveName,
            DATE_FORMAT(la.date_of_filing, '%Y-%m-%d') dateOfFiling,
            GROUP_CONCAT(DATE_FORMAT(lad.leave_date, '%Y-%m-%d') SEPARATOR ', ') leaveDates,
            la.status \`status\` 
            FROM leave_application la 
              INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
              INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id 
          WHERE la.employee_id_fk = ? 
          GROUP BY leave_application_id ORDER BY la.date_of_filing DESC;`,
        [employeeId]
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
