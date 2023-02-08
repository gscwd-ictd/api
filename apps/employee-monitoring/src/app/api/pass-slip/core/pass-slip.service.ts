import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassSlip, PassSlipApproval, PassSlipDto } from '@gscwd-api/models';
import { PassSlipApprovalService } from '../components/approval/core/pass-slip-approval.service';
import { MicroserviceClient } from '@gscwd-api/microservices';

@Injectable()
export class PassSlipService extends CrudHelper<PassSlip> {
  constructor(
    private readonly crudService: CrudService<PassSlip>,
    private readonly passSlipApprovalService: PassSlipApprovalService,
    private readonly client: MicroserviceClient
  ) {
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

  async getPassSlips(employeeId: string) {
    const passSlips = <PassSlipApproval[]>(
      await this.passSlipApprovalService.crud().findAll({ find: { relations: { passSlipId: true }, select: { supervisorId: true, status: true } } })
    );

    const passSlipsReturn = await Promise.all(
      passSlips.map(async (passSlip) => {
        const { passSlipId, ...restOfPassSlip } = passSlip;

        console.log(passSlip.passSlipId.employeeId);
        const names = <object>await this.client.call({
          action: 'send',
          payload: { employeeId: passSlip.passSlipId.employeeId, supervisorId: passSlip.supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        });

        return { ...passSlipId, ...names, ...restOfPassSlip };
      })
    );

    return passSlipsReturn;
  }
}
