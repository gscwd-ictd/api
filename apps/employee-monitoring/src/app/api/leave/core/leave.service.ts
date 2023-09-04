import {
  LeaveApplicationDates,
  UpdateLeaveApplicationEmployeeStatus,
  UpdateLeaveApplicationHrdmStatusDto,
  UpdateLeaveApplicationHrmoStatusDto,
  UpdateLeaveApplicationSupervisorStatusDto,
} from '@gscwd-api/models';
import { LeaveApplicationStatus } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { count } from 'console';
import dayjs = require('dayjs');
import { DataSource, EntityManager } from 'typeorm';
import { EmployeesService } from '../../employees/core/employees.service';
import { LeaveAddBackService } from '../components/leave-add-back/core/leave-add-back.service';
import { LeaveApplicationService } from '../components/leave-application/core/leave-application.service';
import { LeaveCardLedgerCreditService } from '../components/leave-card-ledger-credit/core/leave-card-ledger-credit.service';
import { LeaveCardLedgerDebitService } from '../components/leave-card-ledger-debit/core/leave-card-ledger-debit.service';
import { LeaveCreditDeductionsService } from '../components/leave-credit-deductions/core/leave-credit-deductions.service';
import { LeaveCreditEarningsService } from '../components/leave-credit-earnings/core/leave-credit-earnings.service';
import { LeaveAdjustmentDto } from '../data/leave-adjustment.dto';

@Injectable()
export class LeaveService {
  constructor(
    private readonly leaveApplicationService: LeaveApplicationService,
    private readonly leaveCardLedgerDebitService: LeaveCardLedgerDebitService,
    private readonly leaveCardLedgerCreditService: LeaveCardLedgerCreditService,
    private readonly leaveCreditEarningsService: LeaveCreditEarningsService,
    private readonly leaveCreditDeductionsService: LeaveCreditDeductionsService,
    private readonly employeesService: EmployeesService,
    private readonly leaveAddBackService: LeaveAddBackService,
    private readonly dataSource: DataSource
  ) {}

  async getLeavesUnderSupervisor(supervisorId: string) {
    return await this.leaveApplicationService.getLeavesUnderSupervisor(supervisorId);
  }

  async getLeavesForHrmoApproval() {
    return await this.leaveApplicationService.getLeavesByLeaveApplicationStatus(null);
  }

  async getLeavesForHrdmApproval() {
    return await this.leaveApplicationService.getLeavesForHrdm();
  }

  async getLeaveLedger(employeeId: string, companyId: string) {
    return (await this.leaveApplicationService.crud().getRepository().query(`CALL sp_generate_leave_ledger_view(?,?);`, [employeeId, companyId]))[0];
  }

  async updateLeaveStatus(
    updateLeaveApplicationStatusDto:
      | UpdateLeaveApplicationHrmoStatusDto
      | UpdateLeaveApplicationHrdmStatusDto
      | UpdateLeaveApplicationSupervisorStatusDto
  ) {
    const { id, status, ...rest } = updateLeaveApplicationStatusDto;
    const updateResult = await this.leaveApplicationService.crud().update({
      dto: { status, ...rest },
      updateBy: { id },
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    const leaveApplicationId = await this.leaveApplicationService.crud().findOne({
      find: {
        select: {
          abroad: true,
          id: true,
          dateOfFiling: true,
          employeeId: true,
          forBarBoardReview: true,
          forMastersCompletion: true,
          forMonetization: true,
          inHospital: true,
          inPhilippines: true,
          isTerminalLeave: true,
          outPatient: true,
          requestedCommutation: true,
          splWomen: true,
          status: true,
          studyLeaveOther: true,
          supervisorId: true,
          leaveBenefitsId: {
            id: true,
            leaveName: true,
            leaveType: true,
            accumulatedCredits: true,
            canBeCarriedOver: true,
            createdAt: true,
            creditDistribution: true,
            deletedAt: true,
            isMonetizable: true,
            maximumCredits: true,
            updatedAt: true,
          },
        },
        relations: { leaveBenefitsId: true },
        where: { id },
      },
    });

    if (updateResult.affected > 0) {
      if (status === LeaveApplicationStatus.APPROVED) {
        const debitValue = await this.leaveCardLedgerDebitService.getDebitValue(id);

        const countLeaveLedgerDebit = await this.leaveCardLedgerDebitService
          .crud()
          .findOneOrNull({ find: { where: { leaveApplicationId: { id: leaveApplicationId.id } } } });

        if (countLeaveLedgerDebit === null) {
          const leaveCardLedgerDebit = await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit({
            leaveApplicationId,
            debitValue,
          });

          if (leaveApplicationId.leaveBenefitsId.leaveType === 'special leave benefit') {
            const leaveCreditEarning = await this.leaveCreditEarningsService.addLeaveCreditEarnings({
              creditDate: dayjs().toDate(),
              creditValue: debitValue,
              dailyTimeRecordId: null,
              employeeId: leaveApplicationId.employeeId,
              leaveBenefitsId: leaveApplicationId.leaveBenefitsId,
            });
            const leaveCardLedgerCredit = await this.leaveCardLedgerCreditService.crud().create({
              dto: { leaveCreditEarningId: leaveCreditEarning },
            });
          }
        }
      }
      return await this.leaveApplicationService.getLeaveApplicationDetails(id, leaveApplicationId.employeeId);
    }
  }
  async cancelLeave(updateLeaveApplicationEmployeeStatus: UpdateLeaveApplicationEmployeeStatus) {
    //
    //
    const { id, ...rest } = updateLeaveApplicationEmployeeStatus;

    const leaveApplication = await this.leaveApplicationService.crud().findOne({ find: { select: { id: true, status: true }, where: { id } } });

    const cancelLeave = await this.leaveApplicationService.crud().update({
      dto: { status: LeaveApplicationStatus.CANCELLED, cancelDate: dayjs().toDate(), ...rest },
      updateBy: { id },
      onError: () => new InternalServerErrorException(),
    });
    if (leaveApplication.status === 'approved') {
      //credit value= number of days of leave
      const leaveApplicationDates = (await this.leaveApplicationService.rawQuery(
        `SELECT leave_application_date_id id, leave_date leaveDate FROM leave_application_dates WHERE leave_date NOT IN (SELECT holiday_date FROM holidays) AND leave_application_id_fk = ?;`,
        [leaveApplication.id]
      )) as LeaveApplicationDates[];

      await Promise.all(
        leaveApplicationDates.map(async (leaveApplicationDate) => {
          const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
            const reason = 'Cancelled Leave - ' + dayjs(leaveApplicationDate.leaveDate).format('YYYY-MM-DD');

            const leaveAddBack = await this.leaveAddBackService.addLeaveAddBackTransaction(
              {
                creditValue: 1,
                leaveApplicationDatesId: leaveApplicationDate,
                reason,
              },
              entityManager
            );

            const leaveCardLedgerCredit = await this.leaveCardLedgerCreditService.addLeaveCardLedgerCreditTransaction(
              {
                leaveAddBackId: leaveAddBack,
              },
              entityManager
            );
          });
        })
      );
    }
    return updateLeaveApplicationEmployeeStatus;
  }
  async addAdjustment(leaveAdjustmentDto: LeaveAdjustmentDto) {
    //
    const { category, leaveBenefitsId, remarks, value, employeeId } = leaveAdjustmentDto;
    let adjustment;
    if (category === 'debit')
      adjustment = await this.leaveCardLedgerDebitService
        .crud()
        .create({ dto: { debitValue: value }, onError: () => new InternalServerErrorException() });
    else if (category === 'credit') {
      const leaveCreditEarningId = await this.leaveCreditEarningsService
        .crud()
        .create({ dto: { creditDate: dayjs().toDate(), creditValue: value, leaveBenefitsId, employeeId } });
      adjustment = await this.leaveCardLedgerCreditService.crud().create({
        dto: { leaveCreditEarningId },
        onError: () => new InternalServerErrorException(),
      });
    }

    return adjustment;
  }
}
