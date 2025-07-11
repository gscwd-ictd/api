import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { PassSlipApproval, UpdatePassSlipApprovalDto } from '@gscwd-api/models';
import { PassSlipApprovalStatus } from '@gscwd-api/utils';
import { Injectable } from '@nestjs/common';
import dayjs = require('dayjs');

@Injectable()
export class PassSlipApprovalService extends CrudHelper<PassSlipApproval> {
  constructor(private readonly crudService: CrudService<PassSlipApproval>) {
    super(crudService);
  }

  async updatePassSlipStatus(updatePassSlipApprovalDto: UpdatePassSlipApprovalDto) {
    const { status, passSlipId, disputeRemarks, encodedTimeIn, isDisputeApproved, hrmoDisapprovalRemarks } = updatePassSlipApprovalDto;

    let updateResult;
    if (status === PassSlipApprovalStatus.FOR_SUPERVISOR_APPROVAL || status === PassSlipApprovalStatus.DISAPPROVED_BY_HRMO) {
      if (status === PassSlipApprovalStatus.FOR_SUPERVISOR_APPROVAL)
        updateResult = await this.crudService.update({ dto: { status, hrmoApprovalDate: dayjs().toDate() }, updateBy: { passSlipId } });
      else if (status === PassSlipApprovalStatus.DISAPPROVED_BY_HRMO)
        updateResult = await this.crudService.update({
          dto: { status, hrmoApprovalDate: dayjs().toDate(), hrmoDisapprovalRemarks },
          updateBy: { passSlipId },
        });
    } else if (
      status === PassSlipApprovalStatus.APPROVED ||
      status === PassSlipApprovalStatus.APPROVED_WITHOUT_MEDICAL_CERTIFICATE ||
      status === PassSlipApprovalStatus.APPROVED_WITH_MEDICAL_CERTIFICATE ||
      status === PassSlipApprovalStatus.AWAITING_MEDICAL_CERTIFICATE ||
      status === PassSlipApprovalStatus.DISAPPROVED
    ) {
      updateResult = await this.crudService.update({
        dto: {
          status,
          supervisorApprovalDate:
            status === PassSlipApprovalStatus.APPROVED_WITHOUT_MEDICAL_CERTIFICATE ||
            status === PassSlipApprovalStatus.APPROVED_WITH_MEDICAL_CERTIFICATE
              ? null
              : dayjs().toDate(),
        },
        updateBy: { passSlipId },
      });
    } else if (status === PassSlipApprovalStatus.FOR_DISPUTE) {
      updateResult = await this.crudService.update({ dto: { status }, updateBy: { passSlipId } });
      if (updatePassSlipApprovalDto.encodedTimeOut) {
        await this.rawQuery(`UPDATE pass_slip SET encoded_time_in = ?, dispute_remarks = ?, encoded_time_out= ? WHERE pass_slip_id = ?`, [
          encodedTimeIn,
          disputeRemarks,
          updatePassSlipApprovalDto.encodedTimeOut,
          passSlipId,
        ]);
      } else
        await this.rawQuery(`UPDATE pass_slip SET encoded_time_in = ?, dispute_remarks = ? WHERE pass_slip_id = ?`, [
          encodedTimeIn,
          disputeRemarks,
          passSlipId,
        ]);
    } else if (typeof isDisputeApproved === 'boolean') {
      updateResult = await this.crudService.update({ dto: { status: PassSlipApprovalStatus.APPROVED }, updateBy: { passSlipId } });
      if (isDisputeApproved === true)
        await this.rawQuery(`UPDATE pass_slip SET is_dispute_approved=?,time_in = encoded_time_in WHERE pass_slip_id = ?`, [
          isDisputeApproved,
          passSlipId,
        ]);
      else await this.rawQuery(`UPDATE pass_slip SET is_dispute_approved=? WHERE pass_slip_id = ?`, [isDisputeApproved, passSlipId]);
    } else updateResult = await this.crudService.update({ dto: { status }, updateBy: { passSlipId } });

    if (updateResult.affected > 0) return updatePassSlipApprovalDto;
  }
}
