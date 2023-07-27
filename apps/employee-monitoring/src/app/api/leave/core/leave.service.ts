import { UpdateLeaveApplicationStatusDto } from '@gscwd-api/models';
import { LeaveApplicationStatus } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LeaveApplicationService } from '../components/leave-application/core/leave-application.service';
import { LeaveCardLedgerDebitService } from '../components/leave-card-ledger-debit/core/leave-card-ledger-debit.service';

@Injectable()
export class LeaveService {
  constructor(
    private readonly leaveApplicationService: LeaveApplicationService,
    private readonly leaveCardLedgerDebitService: LeaveCardLedgerDebitService
  ) {}

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
    if (updateResult.affected > 0) {
      if (status === LeaveApplicationStatus.APPROVED) {
        const debitValue = await this.leaveCardLedgerDebitService.getDebitValue(id);
        console.log(debitValue);
        const leaveApplicationId = await this.leaveApplicationService.crud().findOne({ find: { where: { id } } });
        const countLeaveLedgerDebit = await this.leaveCardLedgerDebitService
          .crud()
          .findOneOrNull({ find: { where: { leaveApplicationId: { id: leaveApplicationId.id } } } });

        if (countLeaveLedgerDebit === null) {
          const leaveCardLedgerDebit = await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit({
            leaveApplicationId,
            debitValue,
          });
        }
      }
      return updateLeaveApplicationStatusDto;
    }
  }
}
