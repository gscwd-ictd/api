import { LeaveApplication } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LeaveApplicationDatesService } from '../components/leave-application-dates/core/leave-application-dates.service';
import { LeaveApplicationService } from '../components/leave-application/core/leave-application.service';

@Injectable()
export class LeaveService {
  constructor(
    private readonly leaveApplicationService: LeaveApplicationService,

    private readonly leaveApplicationDatesService: LeaveApplicationDatesService,

    private readonly datasource: DataSource
  ) {}

  async createLeave() {
    return await this.datasource.manager.transaction(async (manager) => {
      //const leaveApplication = await this.leaveApplicationService.crud().transact<LeaveApplication>(manager).create({dto: })
      //const
    });
  }
}
