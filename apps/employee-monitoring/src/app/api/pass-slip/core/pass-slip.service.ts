import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { PassSlip, PassSlipApproval, PassSlipDto } from '@gscwd-api/models';

@Injectable()
export class PassSlipService extends CrudHelper<PassSlip> {
  constructor(private readonly crudService: CrudService<PassSlip>) {
    super(crudService);
  }

  async addPassSlip(passSlipDto: PassSlipDto) {
    const repo = this.getDatasource();
    const passSlip = await repo.transaction(async (transactionEntityManager) => {
      const { approval, ...rest } = passSlipDto;
      const passSlipResult = await transactionEntityManager.getRepository(PassSlip).save(rest);
      const approvalResult = await transactionEntityManager.getRepository(PassSlipApproval).save({ passSlipId: passSlipResult, ...approval });
      return { passSlipResult, approvalResult };
    });
    return passSlip;
  }
}
