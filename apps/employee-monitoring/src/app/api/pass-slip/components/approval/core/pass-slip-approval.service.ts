import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { PassSlipApproval, UpdatePassSlipApprovalDto } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PassSlipApprovalService extends CrudHelper<PassSlipApproval> {
  constructor(private readonly crudService: CrudService<PassSlipApproval>) {
    super(crudService);
  }

  async getPassSlipsForApproval(supervisorId: string) {
    return await this.crudService.findAll({});
  }

  async updatePassSlipStatus(updatePassSlipApprovalDto: UpdatePassSlipApprovalDto) {
    const { status, passSlipId } = updatePassSlipApprovalDto;
    const updateResult = await this.crudService.update({ dto: { status }, updateBy: { passSlipId } });
    if (updateResult.affected > 0) return updatePassSlipApprovalDto;
  }
}
