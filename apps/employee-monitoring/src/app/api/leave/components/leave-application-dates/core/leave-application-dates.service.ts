import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeaveApplicationDatesDto, LeaveApplicationDates, LeaveDateCancellationDto } from '@gscwd-api/models';
import { EntityManager } from 'typeorm';
import { LeaveAddBackService } from '../../leave-add-back/core/leave-add-back.service';
import { LeaveCardLedgerCreditService } from '../../leave-card-ledger-credit/core/leave-card-ledger-credit.service';
import { EmployeesService } from '../../../../employees/core/employees.service';
import { LeaveDayStatus } from '@gscwd-api/utils';
import dayjs = require('dayjs');
import { LeaveCreditEarningsService } from '../../leave-credit-earnings/core/leave-credit-earnings.service';
import { LeaveBenefitsService } from '../../leave-benefits/core/leave-benefits.service';

@Injectable()
export class LeaveApplicationDatesService extends CrudHelper<LeaveApplicationDates> {
  constructor(
    private readonly crudService: CrudService<LeaveApplicationDates>,
    private readonly leaveAddBackService: LeaveAddBackService,
    private readonly leaveCardLedgerCreditService: LeaveCardLedgerCreditService,
    private readonly leaveCreditEarningsService: LeaveCreditEarningsService,
    private readonly leaveBenefitsService: LeaveBenefitsService,
    private readonly employeesService: EmployeesService
  ) {
    super(crudService);
  }

  async createApplicationDatesTransaction(transactionEntityManager: EntityManager, createLeaveApplicationDatesDto: CreateLeaveApplicationDatesDto) {
    try {
      return await this.crudService.transact<LeaveApplicationDates>(transactionEntityManager).create({
        dto: createLeaveApplicationDatesDto,
        // onError: ({ error }) => {
        //   //console.log(error);
        //   throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
        // },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async cancelLeaveDateTransaction(transactionEntityManager: EntityManager, leaveDateCancellationDto: LeaveDateCancellationDto) {
    const { leaveApplicationId, leaveDates, status, remarks } = leaveDateCancellationDto;
    const _leaveApplicationId = leaveApplicationId.toString();
    const leaveType = (
      await this.rawQuery(
        `SELECT lb.leave_types leaveType 
            FROM leave_application la 
          INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk 
          WHERE la.leave_application_id = ?;`,
        [leaveApplicationId]
      )
    )[0].leaveType;

    const leaveName = (
      await this.rawQuery(
        `SELECT lb.leave_name leaveName 
            FROM leave_application la 
          INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk 
          WHERE la.leave_application_id = ?;`,
        [leaveApplicationId]
      )
    )[0].leaveName;

    if (leaveType === 'special leave benefit') {
      const updateResult = await this.rawQuery(
        `UPDATE leave_application_dates SET status = ?,remarks = ? WHERE leave_date >= ? AND leave_application_id_fk = ?`,
        [status, remarks, leaveDates[0], leaveApplicationId]
      );
    } else {
      const cancelledLeaveDates = await Promise.all(
        leaveDates.map(async (leaveDate) => {
          if (status === 'cancelled') {
            /*
              1. get leave benefit name by leave application id
              2. if slb dont add back, else add back
              3. if leave dates are all cancelled, the leave status should be cancelled as well 
            */

            const leaveDatesCancelled = await this.crudService
              .transact<LeaveApplicationDates>(transactionEntityManager)
              .update({ dto: { status, remarks, cancelDate: dayjs().toDate() }, updateBy: { leaveApplicationId, leaveDate } });

            //add back;
            const leaveApplicationDatesId = (await this.getRepository().findOne({
              select: {
                id: true,
                createdAt: true,
                deletedAt: true,
                leaveApplicationId: { id: true, employeeId: true },
                leaveDate: true,
                status: true,
                cancelDate: true,
                forCancellationDate: true,
                remarks: true,
                updatedAt: true,
              },
              where: { leaveApplicationId: { id: _leaveApplicationId }, leaveDate },
              relations: { leaveApplicationId: true },
            })) as LeaveApplicationDates;

            const leaveAddBackId = await this.leaveAddBackService.addLeaveAddBackTransaction(
              {
                creditValue: leaveName !== 'Leave Without Pay' ? 1 : 0,
                leaveApplicationDatesId,
                reason: 'Cancelled Leave Date',
              },
              transactionEntityManager
            );

            const leaveCardLedgerItem = await this.leaveCardLedgerCreditService.addLeaveCardLedgerCreditTransaction(
              {
                leaveAddBackId,
              },
              transactionEntityManager
            );

            if (leaveName === 'Forced Leave') {
              const vl = await this.leaveBenefitsService.crud().findOne({ find: { where: { leaveName: 'Vacation Leave' } } });
              const leaveCreditEarningId = await this.leaveCreditEarningsService.crud().create({
                dto: {
                  creditValue: 1,
                  leaveBenefitsId: vl,
                  creditDate: dayjs().toDate(),
                  employeeId: leaveApplicationDatesId.leaveApplicationId.employeeId,
                  remarks: 'Add Back due to Leave Cancellation',
                },
              });
              const leaveCardLedgerItem = await this.leaveCardLedgerCreditService.addLeaveCardLedgerCreditTransaction(
                {
                  leaveCreditEarningId,
                },
                transactionEntityManager
              );
            }
          } else if (status === 'for cancellation') {
            const leaveDatesCancelled = await this.crudService
              .transact<LeaveApplicationDates>(transactionEntityManager)
              .update({ dto: { status, remarks, forCancellationDate: dayjs().toDate() }, updateBy: { leaveApplicationId, leaveDate } });
          }

          return leaveDate;
        })
      );
      const shouldCancelWhole = (
        await this.rawQuery(
          `
      SELECT IF(countCancelled = countTotal, true, false) shouldCancelWhole FROM (SELECT 
        (SELECT count(leave_application_date_id) FROM leave_application_dates WHERE leave_application_id_fk = ? AND status='cancelled') countCancelled, 
          (SELECT count(leave_application_date_id) FROM leave_application_dates WHERE leave_application_id_fk = ?) countTotal) leaveApplicationDates;
      `,
          [_leaveApplicationId, _leaveApplicationId]
        )
      )[0].shouldCancelWhole;
      if (shouldCancelWhole === '1') {
        await this.rawQuery(`UPDATE leave_application SET status='cancelled' WHERE leave_application_id=?`, [_leaveApplicationId]);
      }
    }
    return leaveDateCancellationDto;
  }

  async getLeaveCancelledAndForCancellation(leaveApplicationId: string) {
    return (await this.rawQuery(
      `
    SELECT
       DATE_FORMAT(lad.leave_date,'%Y-%m-%d') leaveDate
     FROM leave_application la 
       INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id
       INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
     WHERE la.leave_application_id=?  AND (lad.status ='for cancellation' OR lad.status='cancelled'); 
    `,
      [leaveApplicationId]
    )) as {
      leaveDate: string;
    }[];
  }

  async getForApprovalLeaveDates() {
    const leaveApplications = await this.getAllLeaveApplicationIdsFromLeaveDates();
    const leaveApplicationDateDetails = await Promise.all(
      leaveApplications.map(async (leaveApplication) => {
        const { dateOfFiling, leaveApplicationId } = leaveApplication;
        const leaveDates = (await this.getLeaveDatesByLeaveApplicationIdAndStatus(leaveApplicationId, null)).map((ld) => ld.leaveDate);
        const forCancellationLeaveDates = (await this.getLeaveCancelledAndForCancellation(leaveApplicationId)).map((ld) => ld.leaveDate);
        const statusAndRemarks = await this.getLeaveDateStatusAndRemarksByLeaveApplicationId(leaveApplicationId);
        const { remarks, status } = statusAndRemarks;
        const leaveDatesDetails = await this.getLeaveDatesDetailsByLeaveApplicationId(leaveApplicationId);
        const { employeeId, ...restOfLeaveDatesDetails } = leaveDatesDetails;
        const employeeDetails = await this.employeesService.getEmployeeDetails(employeeId);
        const { employeeFullName, companyId, assignment, photoUrl } = employeeDetails;
        return {
          employeeDetails: { employeeName: employeeFullName, positionTitle: assignment.positionTitle, companyId, photoUrl },
          ...restOfLeaveDatesDetails,
          dateOfFiling,
          leaveDates,
          forCancellationLeaveDates,
          remarks,
          status,
        };
      })
    );
    return leaveApplicationDateDetails;
  }

  async getAllLeaveApplicationIdsFromLeaveDates() {
    return (await this.rawQuery(
      `SELECT DISTINCT leave_application_id leaveApplicationId,DATE_FORMAT(date_of_filing,'%Y-%m-%d %H:%i:%s') dateOfFiling 
       FROM leave_application la 
       INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id 
       WHERE (la.status = 'approved' OR la.status= 'cancelled') AND (lad.status='cancelled' OR lad.status = 'for cancellation') ORDER BY DATE_FORMAT(date_of_filing,'%Y-%m-%d %H:%i:%s') DESC;`
    )) as { leaveApplicationId: string; dateOfFiling: Date }[];
  }

  async getLeaveDateStatusAndRemarksByLeaveApplicationId(leaveApplicationId: string) {
    return (
      await this.rawQuery(
        `SELECT
      DISTINCT remarks, status FROM leave_application_dates WHERE leave_application_id_fk=? AND status <> 'approved'
    `,
        [leaveApplicationId]
      )
    )[0] as { remarks: string; status: string };
  }

  async getLeaveDatesDetailsByLeaveApplicationId(leaveApplicationId: string) {
    return (
      await this.rawQuery(
        `
     SELECT
        la.leave_application_id leaveApplicationId,
        DATE_FORMAT(la.date_of_filing,'%Y-%m-%d %H:%i:%s') dateOfFiling,
        la.employee_id_fk employeeId,
        lb.leave_name leaveName,
        la.status status
      FROM leave_application la 
        INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
      WHERE la.leave_application_id = ? 
     `,
        [leaveApplicationId]
      )
    )[0] as {
      leaveApplicationId: string;
      dateOfFiling: string;
      employeeId: string;
      leaveName: string;
      leaveDate: string;
      status: string;
    };
  }

  async getLeaveDatesByLeaveApplicationIdAndStatus(leaveApplicationId: string, status: LeaveDayStatus | null) {
    if (status === null)
      return (await this.rawQuery(
        `
        SELECT
          DATE_FORMAT(lad.leave_date,'%Y-%m-%d') leaveDate
        FROM leave_application la 
          INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id
          INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
        WHERE la.leave_application_id=?; 
        `,
        [leaveApplicationId]
      )) as {
        leaveDate: string;
      }[];

    return (await this.rawQuery(
      `
      SELECT
         DATE_FORMAT(lad.leave_date,'%Y-%m-%d') leaveDate
       FROM leave_application la 
         INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id
         INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
       WHERE la.leave_application_id=?  AND lad.status =?; 
      `,
      [leaveApplicationId, status]
    )) as {
      leaveDate: string;
    }[];
  }
}
