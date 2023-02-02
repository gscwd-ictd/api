import { CrudService } from '@gscwd-api/crud';
import { CreateLeaveApplicationDto, LeaveApplicationDates } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { LeaveApplication } from '@gscwd-api/models';
import { LeaveApplicationDatesService } from '../../leave-application-dates/core/leave-application-dates.service';

@Injectable()
export class LeaveApplicationService {
  constructor(
    private readonly crudService: CrudService<LeaveApplication>,
    private readonly leaveApplicationDatesService: LeaveApplicationDatesService
  ) {}

  async createLeaveApplication(createLeaveApplication: CreateLeaveApplicationDto) {
    const repo = this.crudService.getDatasource();

    const result = repo.transaction(async (transactionEntityManager) => {
      const { leaveApplicationDates, ...rest } = createLeaveApplication;
      const leaveApplication = await transactionEntityManager.getRepository(LeaveApplication).save(rest);
      const leaveApplicationDatesResult = await Promise.all(
        leaveApplicationDates.map(async (leaveApplicationDate) => {
          const { leaveDate } = leaveApplicationDate;
          console.log(leaveApplication.id);
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
}
