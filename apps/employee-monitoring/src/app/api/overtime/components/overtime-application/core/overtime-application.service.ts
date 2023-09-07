import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateOvertimeApplicationDto, OvertimeApplication } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class OvertimeApplicationService extends CrudHelper<OvertimeApplication> {
  constructor(private readonly crudService: CrudService<OvertimeApplication>, private readonly dataSource: DataSource) {
    super(crudService);
  }
  async createOvertimeApplication(createOvertimeApplicationDto: CreateOvertimeApplicationDto, entityManager: EntityManager) {
    return await this.crudService.transact<OvertimeApplication>(entityManager).create({
      dto: createOvertimeApplicationDto,
      onError: () => new InternalServerErrorException(),
    });
  }
}
