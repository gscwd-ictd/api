import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeaveApplicationDatesDto, LeaveApplicationDates, LeaveDateCancellationDto } from '@gscwd-api/models';
import { EntityManager } from 'typeorm';
import { LeaveAddBackService } from '../../leave-add-back/core/leave-add-back.service';
import { LeaveCardLedgerCreditService } from '../../leave-card-ledger-credit/core/leave-card-ledger-credit.service';

@Injectable()
export class LeaveApplicationDatesService extends CrudHelper<LeaveApplicationDates> {
  constructor(
    private readonly crudService: CrudService<LeaveApplicationDates>,
    private readonly leaveAddBackService: LeaveAddBackService,
    private readonly leaveCardLedgerCreditService: LeaveCardLedgerCreditService
  ) {
    super(crudService);
  }

  async createApplicationDatesTransaction(transactionEntityManager: EntityManager, createLeaveApplicationDatesDto: CreateLeaveApplicationDatesDto) {
    return await this.crudService.transact<LeaveApplicationDates>(transactionEntityManager).create({
      dto: createLeaveApplicationDatesDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
  }

  async cancelLeaveDateTransaction(transactionEntityManager: EntityManager, leaveDateCancellationDto: LeaveDateCancellationDto) {
    const { leaveApplicationId, leaveDates, status } = leaveDateCancellationDto;

    const _leaveApplicationId = leaveApplicationId as unknown;

    const cancelledLeaveDates = await Promise.all(
      leaveDates.map(async (leaveDate) => {
        const leaveDatesCancelled = await this.crudService
          .transact<LeaveApplicationDates>(transactionEntityManager)
          .update({ dto: { status }, updateBy: { leaveApplicationId, leaveDate } });

        if (status === 'cancelled') {
          /*
            1. get leave benefit name by leave application id
            2. if slb dont add back, else add back
            3. if leave dates are all cancelled, the leave status should be cancelled as well 
          */
          const leaveType = (
            await this.rawQuery(
              `
            SELECT lb.leave_types leaveType 
              FROM leave_application la 
            INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk 
            WHERE la.leave_application_id = ?;
          `,
              [leaveApplicationId]
            )
          )[0].leaveType;
          console.log(leaveType);

          if (leaveType !== 'special leave benefit') {
            //add back;
            const leaveApplicationDatesId = await this.getRepository().findOne({
              select: {
                id: true,
                createdAt: true,
                deletedAt: true,
                leaveApplicationId: { id: true },
                leaveDate: true,
                status: true,
                updatedAt: true,
              },
              where: { leaveApplicationId: { id: leaveApplicationId.id }, leaveDate },
              relations: { leaveApplicationId: true },
            });

            //const leaveApplicationDatesId = await this.raw
            console.log(leaveApplicationDatesId);

            const leaveAddBackId = await this.leaveAddBackService.addLeaveAddBackTransaction(
              {
                creditValue: 1,
                leaveApplicationDatesId,
                reason: 'Cancelled Leave Date',
              },
              transactionEntityManager
            );

            await this.leaveCardLedgerCreditService.addLeaveCardLedgerCreditTransaction(
              {
                leaveAddBackId,
              },
              transactionEntityManager
            );
          }
        }
        return leaveDate;
      })
    );
    //cancellation
    return leaveDateCancellationDto;
  }
}
