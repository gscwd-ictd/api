import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateOvertimeEmployeeDto, OvertimeEmployee } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class OvertimeEmployeeService extends CrudHelper<OvertimeEmployee> {
  constructor(private readonly crudService: CrudService<OvertimeEmployee>) {
    super(crudService);
  }

  async createOvertimeEmployees(createOvertimeEmployeeDto: CreateOvertimeEmployeeDto, entityManager: EntityManager) {
    return await this.crudService.transact<OvertimeEmployee>(entityManager).create({
      dto: createOvertimeEmployeeDto,
      onError: () => new InternalServerErrorException(),
    });
  }
}
