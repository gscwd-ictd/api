import {
  UpdateLeaveApplicationHrdmStatusDto,
  UpdateLeaveApplicationHrmoStatusDto,
  UpdateLeaveApplicationSupervisorStatusDto,
} from '@gscwd-api/models';
import { LeaveApplicationStatus } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { count } from 'console';
import dayjs = require('dayjs');
import { LeaveApplicationService } from '../components/leave-application/core/leave-application.service';
import { LeaveCardLedgerCreditService } from '../components/leave-card-ledger-credit/core/leave-card-ledger-credit.service';
import { LeaveCardLedgerDebitService } from '../components/leave-card-ledger-debit/core/leave-card-ledger-debit.service';
import { LeaveCreditEarningsService } from '../components/leave-credit-earnings/core/leave-credit-earnings.service';

@Injectable()
export class LeaveService {
  constructor(
    private readonly leaveApplicationService: LeaveApplicationService,
    private readonly leaveCardLedgerDebitService: LeaveCardLedgerDebitService,
    private readonly leaveCardLedgerCreditService: LeaveCardLedgerCreditService,
    private readonly leaveCreditEarningsService: LeaveCreditEarningsService
  ) {}

  async getLeavesUnderSupervisor(supervisorId: string) {
    return await this.leaveApplicationService.getLeavesUnderSupervisor(supervisorId);
  }

  async getLeavesForHrmoApproval() {
    return await this.leaveApplicationService.getLeavesByLeaveApplicationStatus(null);
  }

  async getLeavesForHrdmApproval() {
    return await this.leaveApplicationService.getLeavesForHrmd();
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

        console.log(leaveApplicationId);

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
}
