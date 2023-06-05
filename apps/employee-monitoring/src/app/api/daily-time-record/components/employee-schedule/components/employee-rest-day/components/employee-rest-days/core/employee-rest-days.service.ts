import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateEmployeeRestDaysDto, EmployeeRestDays } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class EmployeeRestDaysService extends CrudHelper<EmployeeRestDays> {
  constructor(private readonly crudService: CrudService<EmployeeRestDays>) {
    super(crudService);
  }

  async addEmployeeRestDaysTransaction(createEmployeeRestdaysDto: CreateEmployeeRestDaysDto, entityManager: EntityManager) {
    const { employeeRestDay, restDays } = createEmployeeRestdaysDto;
    const employeeRestDaysResult = await Promise.all(
      restDays.map(async (restDay) => {
        const restDayResult = await this.crudService.transact<EmployeeRestDays>(entityManager).create({
          dto: { employeeRestDayId: employeeRestDay, restDay },
          onError: () => new InternalServerErrorException(),
        });
        const { employeeRestDayId, ...rest } = restDayResult;
        return rest;
      })
    );
    const {} = employeeRestDaysResult;
    return employeeRestDaysResult;
  }
}
