import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveAddBackDto, LeaveAddBack, LeaveApplicationDates } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import dayjs = require('dayjs');
import { EntityManager } from 'typeorm';
import { WorkSuspensionService } from '../../../../work-suspension/core/work-suspension.service';
import { LeaveCardLedgerCreditService } from '../../leave-card-ledger-credit/core/leave-card-ledger-credit.service';

@Injectable()
export class LeaveAddBackService extends CrudHelper<LeaveAddBack> {
  constructor(
    private readonly crudService: CrudService<LeaveAddBack>,
    private readonly workSuspensionService: WorkSuspensionService,
    private readonly leaveCardLedgerCreditService: LeaveCardLedgerCreditService
  ) {
    super(crudService);
  }

  async addLeaveAddBack(createLeaveAddBackDto: CreateLeaveAddBackDto) {
    const leaveAddBack = await this.crudService.create({ dto: createLeaveAddBackDto, onError: () => new InternalServerErrorException() });
    return leaveAddBack;
  }

  async addLeaveAddBackTransaction(createLeaveAddBackDto: CreateLeaveAddBackDto, entityManager: EntityManager) {
    const leaveAddBack = await this.crudService.transact<LeaveAddBack>(entityManager).create({
      dto: createLeaveAddBackDto,
      onError: () => new InternalServerErrorException(),
    });
    return leaveAddBack;
  }

  @Cron('0 59 23 * * 1-5')
  async addBackLeaveOnWorkSuspension() {
    const dayNow = dayjs();

    const suspensionHrs = await this.workSuspensionService.getWorkSuspensionBySuspensionDate(dayNow.toDate());
    console.log(suspensionHrs);

    if (suspensionHrs >= 4) {
      const creditValue = 0.5;
      const leaveApplicationDates = (await this.rawQuery(
        `
          SELECT lad.leave_application_date_id leaveApplicationDatesId 
          FROM leave_application_dates lad
            INNER JOIN leave_application la ON la.leave_application_id = lad.leave_application_id_fk
            INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk 
          WHERE lad.leave_date = ? 
          AND la.status <> 'cancelled'
          AND lad.status <> 'cancelled'
          AND lad.status <> 'for cancellation'
          AND lb.leave_types <> 'special leave benefit' 
          AND lb.leave_name <> 'Leave Without Pay';
      `,
        [dayNow.toDate()]
      )) as { leaveApplicationDatesId: LeaveApplicationDates }[];
      console.log(leaveApplicationDates);
      if (leaveApplicationDates.length !== 0) {
        const result = await Promise.all(
          leaveApplicationDates.map(async (_leaveApplicationDatesId) => {
            const leaveApplicationDatesId = _leaveApplicationDatesId.leaveApplicationDatesId;
            const addBack = await this.crudService.create({
              dto: {
                leaveApplicationDatesId,
                creditValue,
                reason: 'Add Back | Work Suspension',
              },
            });

            const leaveCardLedgerCredit = await this.leaveCardLedgerCreditService.crud().create({
              dto: { leaveAddBackId: addBack },
            });

            return { ...addBack, leaveCardLedgerCredit };
          })
        );

        console.log('--------- Executed Work Suspension CRON JOB -------------');
        console.log(result);
      } else console.log('--------- Work Suspension CRON JOB not executed because there are no Leave Application on this day-------------');
    } else console.log('--------- Work Suspension CRON JOB not executed because there are no Work Suspension on this day-------------');
  }
}
