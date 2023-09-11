import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateOvertimeApprovalDto, OvertimeApproval } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class OvertimeApprovalService extends CrudHelper<OvertimeApproval> {
  constructor(private readonly crudService: CrudService<OvertimeApproval>) {
    super(crudService);
  }

  async createOvertimeApproval(createOvertimeApprovalDto: CreateOvertimeApprovalDto, entityManager: EntityManager) {
    return await this.crudService.transact<OvertimeApproval>(entityManager).create({
      dto: createOvertimeApprovalDto,
      onError: () => new InternalServerErrorException(),
    });
  }
}
