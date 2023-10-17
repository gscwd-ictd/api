import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { PassSlip, PassSlipApproval, UpdatePassSlipApprovalDto } from '@gscwd-api/models';
import { PassSlipApprovalStatus } from '@gscwd-api/utils';
import { Injectable } from '@nestjs/common';
import dayjs = require('dayjs');
import { stat } from 'fs';

@Injectable()
export class PassSlipApprovalService extends CrudHelper<PassSlipApproval> {
  constructor(private readonly crudService: CrudService<PassSlipApproval>) {
    super(crudService);
  }

  async getPassSlipsForApproval(supervisorId: string) {
    return await this.crudService.findAll({});
  }

  async updatePassSlipStatus(updatePassSlipApprovalDto: UpdatePassSlipApprovalDto) {
    const { status, passSlipId, disputeRemarks, encodedTimeIn } = updatePassSlipApprovalDto;

    let updateResult;
    if (status === PassSlipApprovalStatus.APPROVED || status === PassSlipApprovalStatus.DISAPPROVED_BY_HRMO)
      updateResult = await this.crudService.update({ dto: { status, hrmoApprovalDate: dayjs().toDate() }, updateBy: { passSlipId } });
    else if (status === PassSlipApprovalStatus.FOR_HRMO_APPROVAL || status === PassSlipApprovalStatus.DISAPPROVED)
      updateResult = await this.crudService.update({ dto: { status, supervisorApprovalDate: dayjs().toDate() }, updateBy: { passSlipId } });
    else if (status === PassSlipApprovalStatus.FOR_DISPUTE) {
      updateResult = await this.crudService.update({ dto: { status }, updateBy: { passSlipId } });
      await this.rawQuery(`UPDATE pass_slip SET encoded_time_in = ?, dispute_remarks = ? WHERE pass_slip_id = ?`, [
        encodedTimeIn,
        disputeRemarks,
        passSlipId,
      ]);
    }

    if (updateResult.affected > 0) return updatePassSlipApprovalDto;
  }
}
