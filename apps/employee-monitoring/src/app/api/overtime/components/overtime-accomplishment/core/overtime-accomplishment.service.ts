import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateOvertimeAccomplishmentDto, OvertimeAccomplishment } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class OvertimeAccomplishmentService extends CrudHelper<OvertimeAccomplishment> {
  constructor(private readonly crudService: CrudService<OvertimeAccomplishment>) {
    super(crudService);
  }

  async createOvertimeAccomplishment(createOvertimeAccomplishmentDto: CreateOvertimeAccomplishmentDto, entityManager: EntityManager) {
    return await this.crudService
      .transact<OvertimeAccomplishment>(entityManager)
      .create({ dto: createOvertimeAccomplishmentDto, onError: () => new InternalServerErrorException() });
  }
}
