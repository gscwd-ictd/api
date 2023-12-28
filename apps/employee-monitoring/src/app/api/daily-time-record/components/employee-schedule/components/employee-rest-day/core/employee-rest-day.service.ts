import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateEmployeeRestDayDto, EmployeeRestDay } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import dayjs = require('dayjs');
//import { EmployeeRestDay } from 'libs/models/src/lib/databases/employee-monitoring/data/employee-rest-day/employee-rest-day.entity';
import { EntityManager } from 'typeorm';
import { EmployeeRestDaysService } from '../components/employee-rest-days/core/employee-rest-days.service';

@Injectable()
export class EmployeeRestDayService extends CrudHelper<EmployeeRestDay> {
  constructor(private readonly crudService: CrudService<EmployeeRestDay>, private readonly employeeRestDaysService: EmployeeRestDaysService) {
    super(crudService);
  }

  async addEmployeeRestDayTransaction(employeeRestDayDto: CreateEmployeeRestDayDto, entityManager: EntityManager) {
    const { restDays, ...employeeRestDay } = employeeRestDayDto;

    const employeeRestDayResult = await this.crudService.transact<EmployeeRestDay>(entityManager).create({
      dto: employeeRestDay,
      onError: (error) => {
        console.log(error);
        throw new InternalServerErrorException();
      },
    });

    const employeeRestDaysResult = await this.employeeRestDaysService.addEmployeeRestDaysTransaction(
      {
        employeeRestDay: { ...employeeRestDayResult, createdAt: null, updatedAt: null, deletedAt: null },
        restDays,
      },
      entityManager
    );
    return employeeRestDaysResult;
  }
}
