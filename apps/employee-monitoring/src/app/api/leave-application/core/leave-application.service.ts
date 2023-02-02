import { CrudService } from '@gscwd-api/crud';
import { CreateLeaveApplicationDatesDto, CreateLeaveApplicationDto, LeaveApplicationDates } from '@gscwd-api/models';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LeaveApplication } from 'libs/models/src/lib/databases/employee-monitoring/data/leave-application/leave-application.entity';
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
