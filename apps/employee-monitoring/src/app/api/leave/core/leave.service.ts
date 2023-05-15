import { LeaveApplication, UpdateLeaveApplicationStatusDto } from '@gscwd-api/models';
import { LeaveApplicationStatus } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LeaveApplicationDatesService } from '../components/leave-application-dates/core/leave-application-dates.service';
import { LeaveApplicationService } from '../components/leave-application/core/leave-application.service';

@Injectable()
export class LeaveService {
  constructor(private readonly leaveApplicationService: LeaveApplicationService) {}

  async getLeavesUnderSupervisor(supervisorId: string) {
    return await this.leaveApplicationService.getLeavesUnderSupervisor(supervisorId);
  }
  async getLeavesForHrApproval() {
    return await this.leaveApplicationService.getLeavesByLeaveApplicationStatus(LeaveApplicationStatus.ONGOING);
  }

  async updateLeaveStatus(updateLeaveApplicationStatusDto: UpdateLeaveApplicationStatusDto) {
    const { id, status } = updateLeaveApplicationStatusDto;
    const updateResult = await this.leaveApplicationService.crud().update({
      dto: { status },
      updateBy: { id },
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    if (updateResult.affected > 0) return updateLeaveApplicationStatusDto;
  }
}
