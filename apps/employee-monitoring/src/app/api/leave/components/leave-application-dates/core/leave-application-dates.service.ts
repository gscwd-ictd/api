import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeaveApplicationDatesDto, LeaveApplicationDates, LeaveDateCancellationDto } from '@gscwd-api/models';
import { EntityManager } from 'typeorm';
import { LeaveAddBackService } from '../../leave-add-back/core/leave-add-back.service';
import { LeaveCardLedgerCreditService } from '../../leave-card-ledger-credit/core/leave-card-ledger-credit.service';
import { EmployeesService } from '../../../../employees/core/employees.service';

@Injectable()
export class LeaveApplicationDatesService extends CrudHelper<LeaveApplicationDates> {
  constructor(
    private readonly crudService: CrudService<LeaveApplicationDates>,
    private readonly leaveAddBackService: LeaveAddBackService,
    private readonly leaveCardLedgerCreditService: LeaveCardLedgerCreditService,
    private readonly employeesService: EmployeesService
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
    const { leaveApplicationId, leaveDates, status, remarks } = leaveDateCancellationDto;

    const leaveType = (
      await this.rawQuery(
        `SELECT lb.leave_types leaveType 
            FROM leave_application la 
          INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk 
          WHERE la.leave_application_id = ?;`,
        [leaveApplicationId]
      )
    )[0].leaveType;

    if (leaveType === 'special leave benefit') {
      const updateResult = await this.rawQuery(
        `UPDATE leave_application_dates SET status = ?,remarks = ? WHERE leave_date >= ? AND leave_application_id_fk = ?`,
        [status, remarks, leaveDates[0], leaveApplicationId]
      );
    } else {
      const cancelledLeaveDates = await Promise.all(
        leaveDates.map(async (leaveDate) => {
          const leaveDatesCancelled = await this.crudService
            .transact<LeaveApplicationDates>(transactionEntityManager)
            .update({ dto: { status, remarks }, updateBy: { leaveApplicationId, leaveDate } });

          if (status === 'cancelled') {
            /*
              1. get leave benefit name by leave application id
              2. if slb dont add back, else add back
              3. if leave dates are all cancelled, the leave status should be cancelled as well 
            */
            console.log(leaveType);

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
          return leaveDate;
        })
      );
    }

    //cancellation
    return leaveDateCancellationDto;
  }

  async getForApprovalLeaveDates() {
    const forApprovals = (await this.rawQuery(`
     SELECT
        la.leave_application_id leaveApplicationId,
        DATE_FORMAT(la.date_of_filing,'%Y-%m-%d') dateOfFiling,
          la.employee_id_fk employeeId,
          lb.leave_name leaveName,
        GROUP_CONCAT(DATE_FORMAT(lad.leave_date,'%Y-%m-%d') SEPARATOR ', ') forCancellationLeaveDates,
          lad.status status,
          lad.remarks remarks
      FROM leave_application la 
        INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id
        INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
      WHERE lad.status ='for cancellation' GROUP BY la.leave_application_id, lad.status,lad.remarks; 
     `)) as {
      leaveApplicationId: string;
      dateOfFiling: string;
      employeeId: string;
      leaveName: string;
      forCancellationLeaveDates: string;
      status: string;
      remarks: string;
    }[];

    const forApprovalsWithEmployeeDetails = await Promise.all(
      forApprovals.map(async (forApproval) => {
        const { employeeId, ...restOfForApproval } = forApproval;
        const employeeDetails = await this.employeesService.getEmployeeDetails(employeeId);
        const { employeeFullName, companyId, assignment, photoUrl } = employeeDetails;
        return {
          employeeDetails: { employeeName: employeeFullName, companyId, positionTitle: assignment.positionTitle, photoUrl },
          ...restOfForApproval,
        };
      })
    );

    return forApprovalsWithEmployeeDetails;
  }
}
