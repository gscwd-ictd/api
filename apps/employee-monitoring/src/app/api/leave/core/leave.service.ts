import {
  LeaveApplicationDates,
  LeaveDateCancellationDto,
  UpdateLeaveApplicationEmployeeStatus,
  UpdateLeaveApplicationHrdmStatusDto,
  UpdateLeaveApplicationHrmoStatusDto,
  UpdateLeaveApplicationSupervisorStatusDto,
} from '@gscwd-api/models';
import { LeaveApplicationStatus } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { LeaveApplicationDatesService } from '../components/leave-application-dates/core/leave-application-dates.service';
import { LeaveBenefitsService } from '../components/leave-benefits/core/leave-benefits.service';

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
    private readonly leaveBenefitsService: LeaveBenefitsService,
    private readonly leaveApplicationDatesService: LeaveApplicationDatesService,
    private readonly dataSource: DataSource
  ) {}

  async getLeavesUnderSupervisor(supervisorId: string) {
    return await this.leaveApplicationService.getLeavesUnderSupervisor(supervisorId);
  }

  async getLeavesUnderSupervisorV2(supervisorId: string) {
    return await this.leaveApplicationService.getAllLeavesUnderSupervisor(supervisorId);
  }

  async getLeavesForHrmoApproval() {
    return await this.leaveApplicationService.getLeavesByLeaveApplicationStatus(null);
  }

  async getLeavesForHrdmApproval() {
    return await this.leaveApplicationService.getLeavesForHrdm();
  }

  async getLeavesForHrdmApprovalV2() {
    return await this.leaveApplicationService.getLeavesForHrdmV2();
  }

  async getLeaveLedger(employeeId: string, companyId: string) {
    const ledger = (
      await this.leaveApplicationService.crud().getRepository().query(`CALL sp_generate_leave_ledger_view(?,?);`, [employeeId, companyId])
    )[0];
    return ledger;
  }

  async cancelLeaveDate(leaveDateCancellationDto: LeaveDateCancellationDto) {
    const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
      return await this.leaveApplicationDatesService.cancelLeaveDateTransaction(entityManager, leaveDateCancellationDto);
    });
    return result;
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
        // if (leaveApplicationId.leaveBenefitsId.leaveName !== 'Leave Without Pay') {
        const debitValue = await this.leaveCardLedgerDebitService.getDebitValue(id);

        const { leaveName } = leaveApplicationId.leaveBenefitsId;

        const countLeaveLedgerDebit = await this.leaveCardLedgerDebitService
          .crud()
          .findOneOrNull({ find: { where: { leaveApplicationId: { id: leaveApplicationId.id } } } });

        if (countLeaveLedgerDebit === null) {
          const leaveCardLedgerDebit = await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit({
            leaveApplicationId,
            debitValue,
          });

          if (leaveName === 'Forced Leave') {
            //
            const leaveBenefitsId = await this.leaveBenefitsService.crud().findOne({ find: { where: { leaveName: 'Vacation Leave' } } });
            const leaveCreditDeductionsId = await this.leaveCreditDeductionsService.crud().create({
              dto: {
                debitValue,
                createdAt: leaveApplicationId.dateOfFiling,
                leaveBenefitsId,
                remarks: 'Deduction from Forced Leave',
                employeeId: leaveApplicationId.employeeId,
              },
            });
            const leaveCardLedgerDebit = await this.leaveCardLedgerDebitService.crud().create({ dto: { leaveCreditDeductionsId, debitValue } });
          }

          if (leaveApplicationId.leaveBenefitsId.leaveType === 'special leave benefit') {
            const leaveCreditEarning = await this.leaveCreditEarningsService.addLeaveCreditEarnings({
              creditDate: dayjs().toDate(),
              creditValue: debitValue,
              dailyTimeRecordId: null,
              employeeId: leaveApplicationId.employeeId,
              leaveBenefitsId: leaveApplicationId.leaveBenefitsId,
              remarks: leaveApplicationId.leaveBenefitsId.leaveType,
            });
            const leaveCardLedgerCredit = await this.leaveCardLedgerCreditService.crud().create({
              dto: { leaveCreditEarningId: leaveCreditEarning },
            });
          }
          //}
        }
      }
      return await this.leaveApplicationService.getLeaveApplicationDetails(id, leaveApplicationId.employeeId);
    }
  }
  async cancelLeave(updateLeaveApplicationEmployeeStatus: UpdateLeaveApplicationEmployeeStatus) {
    //
    //
    /*

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
      console.log(shouldCancelWhole);
      if (shouldCancelWhole === '1') {
        await this.rawQuery(`UPDATE leave_application SET status='cancelled' WHERE leave_application_id=?`, [_leaveApplicationId]);
      }
    */
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
    if (category === 'debit') {
      const leaveCreditDeductionsId = await this.leaveCreditDeductionsService.crud().create({
        dto: {
          debitValue: value,
          remarks,
          leaveBenefitsId,
          employeeId,
        },
      });
      adjustment = await this.leaveCardLedgerDebitService.crud().create({
        dto: {
          leaveCreditDeductionsId,
          debitValue: value,
        },
        onError: () => new InternalServerErrorException(),
      });

      if (leaveBenefitsId.toString() === '1c6bc9b6-af14-468d-88ad-5dfc01869608') {
        const leaveCreditDeductionsId = await this.leaveCreditDeductionsService.crud().create({
          dto: {
            debitValue: value,
            remarks: 'Deduction from Forced Leave adjustment',
            leaveBenefitsId: { id: '8ea199f1-73b8-4279-a5c8-9952a51a4b8c' },
            employeeId,
          },
        });
        adjustment = await this.leaveCardLedgerDebitService.crud().create({
          dto: {
            leaveCreditDeductionsId,
            debitValue: value,
          },
          onError: () => new InternalServerErrorException(),
        });
      }
    } else if (category === 'credit') {
      const leaveCreditEarningId = await this.leaveCreditEarningsService
        .crud()
        .create({ dto: { creditDate: dayjs().toDate(), creditValue: value, leaveBenefitsId, employeeId, remarks } });
      adjustment = await this.leaveCardLedgerCreditService.crud().create({
        dto: { leaveCreditEarningId },
        onError: () => new InternalServerErrorException(),
      });
    }
    return adjustment;
  }

  async getForHrdmApprovalCount() {
    return parseInt(
      (await this.leaveApplicationService.rawQuery(`SELECT count(*) forHrdmCount FROM leave_application WHERE status = 'for hrdm approval';`))[0]
        .forHrdmCount
    );
  }
}
