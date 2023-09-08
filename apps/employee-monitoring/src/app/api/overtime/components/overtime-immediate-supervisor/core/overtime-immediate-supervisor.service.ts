import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateOvertimeImmediateSupervisorDto, OvertimeImmediateSupervisor } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class OvertimeImmediateSupervisorService extends CrudHelper<OvertimeImmediateSupervisor> {
  constructor(private readonly crudService: CrudService<OvertimeImmediateSupervisor>) {
    super(crudService);
  }

  async assignOvertimeImmediateSupervisor(createOvertimeImmediateSupervisorDto: CreateOvertimeImmediateSupervisorDto) {
    return await this.crudService.create({ dto: createOvertimeImmediateSupervisorDto, onError: () => new InternalServerErrorException() });
  }
}
